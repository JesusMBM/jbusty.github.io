import test from 'node:test'
import assert from 'node:assert/strict'
import { estimateCost } from '../assets/calculations.mjs'
const model={input:2,cacheRead:.5,cacheWrite:2,output:6,contextTokens:500000,minimumCacheTokens:0,longContext:{thresholdTokens:200000,comparison:'>=',inputMultiplier:2,cacheReadMultiplier:2,cacheWriteMultiplier:2,outputMultiplier:2}}
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`)
test('Eight steps count every repeated input and never call the first input a cache hit',()=>{const r=estimateCost({turns:8,contextK:24,outputK:2},model);assert.equal(r.inputTokens,248000);assert.equal(r.outputTokens,16000);assert.equal(r.cacheReadTokens,210000);assert.equal(r.cacheWriteTokens,38000);near(r.uncached,.592);near(r.cached,.277)})
test('Cache-writing can cost more for a one-step task',()=>{const r=estimateCost({turns:1,contextK:24,outputK:2},{...model,cacheWrite:2.5});assert.equal(r.cacheReadTokens,0);near(r.uncached,.06);near(r.cached,.072)})
test('A later request crosses the price boundary even when starting context does not',()=>{const r=estimateCost({turns:2,contextK:198,outputK:2},model);assert.equal(r.longSteps,1);near(r.uncached,1.232);near(r.cached,.638)})
test('Strict and inclusive context-band boundaries remain different',()=>{const a=estimateCost({turns:1,contextK:200,outputK:2},model);const b=estimateCost({turns:1,contextK:200,outputK:2},{...model,longContext:{...model.longContext,comparison:'>'}});assert.equal(a.longSteps,1);assert.equal(b.longSteps,0)})
test('Impossible context sizes produce an explanation instead of a price',()=>{const r=estimateCost({turns:24,contextK:260,outputK:12},model);assert.equal(r.valid,false);assert.match(r.reason,/context limit/)})
