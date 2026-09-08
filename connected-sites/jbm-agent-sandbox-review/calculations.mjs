// A fixed reference prefix plus the visible output from each previous step.
// Rates are applied per request, including that request's full context band.
export function estimateCost({turns,contextK,outputK},model){
 const N=Number(turns),C=Number(contextK)*1000,O=Number(outputK)*1000
 if(!Number.isInteger(N)||N<1||![C,O].every(v=>Number.isFinite(v)&&v>=0))return{valid:false,reason:'Choose a whole number of steps and non-negative text amounts.'}
 const maxInputTokens=C+(N-1)*O
 if(model.maxOutputTokens&&O>model.maxOutputTokens)return{valid:false,reason:'This answer size exceeds the model’s published output limit. Reduce the answer size.'}
 if(maxInputTokens+O>model.contextTokens)return{valid:false,reason:'This scenario exceeds the model’s context limit—the amount it can handle at once. Reduce the background text, number of steps, or answer size.'}
 let inputTokens=0,outputTokens=0,cacheReadTokens=0,cacheWriteTokens=0,uncached=0,cached=0,longSteps=0
 for(let j=0;j<N;j++){
  const prompt=C+j*O,band=model.longContext
  const long=band&&(band.comparison==='>='?prompt>=band.thresholdTokens:prompt>band.thresholdTokens)
  const multiplier=key=>long?(band[key+'Multiplier']||1):1
  const inputRate=model.input*multiplier('input'),outputRate=model.output*multiplier('output'),readRate=model.cacheRead*multiplier('cacheRead'),writeRate=model.cacheWrite*multiplier('cacheWrite')
  const previous=j===0?0:C+(j-1)*O
  const read=previous>=(model.minimumCacheTokens||0)?previous:0
  const fresh=prompt-read
  uncached+=(prompt*inputRate+O*outputRate)/1e6
  cached+=(fresh*writeRate+read*readRate+O*outputRate)/1e6
  inputTokens+=prompt;outputTokens+=O;cacheReadTokens+=read;cacheWriteTokens+=fresh;if(long)longSteps++
 }
 return{valid:true,inputTokens,outputTokens,cacheReadTokens,cacheWriteTokens,maxInputTokens,uncached,cached,longSteps}
}
