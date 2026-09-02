# Approach / statement

Between the hero and Work, section #approach labeled 01 / Approach tells visitors that an agent is a loop of tools, context, and permissions — not a model. Proof is dump-dom text; hash navigation also works because the section has id="approach".

## Sub-features

- `approach-index` is the section-index line "01 / Approach".
- `approach-id` is section#approach.statement (id exists; not a primary-nav item).
- `approach-copy` is "An agent is not a model" plus "Miss those details and the loop goes off the rails."

## How to get to it (user POV)

- Load https://jesusmbm.github.io/jbusty.github.io/ and scroll past the hero, before Work.
- There is no primary-nav item. Optional: load #approach directly.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true.
- Quote any hash passed to --url (unquoted # is a shell comment).

- **Snapshot the statement.** A visitor scrolls past the hero. Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/approach.html`. JSON ok is true; ids includes approach. The HTML contains id="approach", class="statement", "01 / Approach", "An agent is not a model", and "Miss those details and the loop goes off the rails". The sibling .extract.txt lists those strings under SECTION INDEX and STATEMENT.
- **Optional hash proof.** Run `node control-jbusty.mjs goto --url '#approach'`. JSON found is true, id is approach.
- **Proof.** Dump-dom contains the statement. A home screenshot is the hero and is not this feature.
- **No outbound.** This section has no links. Do not click live.

## Gotchas

- Older skill revisions claimed Approach had no id. Live App.jsx now sets id="approach"; snapshot remains the primary proof.
- Motion starts .statement-copy at opacity 0 until it is in view. Headless dump-dom still contains the text; a screenshot may not show it.
- compactExtract headings/links alone miss this block; use the HTML or the SECTION INDEX / STATEMENT extract lines.
