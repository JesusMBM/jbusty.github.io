# Approach / statement

Between the hero and Work, a statement block labeled 01 / Approach tells visitors that an agent is a loop of tools, context, and permissions — not a model. It has no section id; proof is dump-dom text, not hash navigation.

## Sub-features

- `approach-index` is the section-index line "01 / Approach".
- `approach-copy` is "An agent is not a model" plus "paying close attention".

## How to get to it (user POV)

- Load https://jesusmbm.github.io/jbusty.github.io/ and scroll past the hero, before Work.
- There is no primary-nav item and no hash. Do not invent a #approach goto.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true.
- Quote any hash passed to --url (unquoted # is a shell comment).

- **Snapshot the statement.** A visitor scrolls past the hero. Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/approach.html`. JSON ok is true. The HTML contains class="statement", "01 / Approach", "An agent is not a model", and "paying close attention". The sibling .extract.txt lists those strings under SECTION INDEX and STATEMENT.
- **Proof.** Dump-dom contains the statement. A home screenshot is the hero and is not this feature. Do not goto a made-up hash.
- **No outbound.** This section has no links. Do not click live.

## Gotchas

- The statement section has no id. `goto --url '#approach'` fails (id not found). That is expected; use snapshot.
- Motion starts .statement-copy at opacity 0 until it is in view. Headless dump-dom still contains the text; a screenshot may not show it.
- compactExtract headings/links alone miss this block; use the HTML or the SECTION INDEX / STATEMENT extract lines.
