# OMP Tool Mapping

Skills speak in actions ("dispatch a subagent", "create a todo", "read a file"). On OMP (Oh My Pi) these resolve to the tools below.

| Action skills request | OMP equivalent |
| --- | --- |
| Dispatch a subagent (`Subagent (general-purpose):` template) | `task` tool — the `agent` field selects the subagent type and model tier: `sonic` (fast/small), `task` (default), `reviewer` or `plan` (slow/most capable) |
| Task tracking ("create a todo", "mark complete") | `todo` tool |
| Read a file | `read` |
| Create / overwrite a file | `write` |
| Surgical edit to an existing file | `edit` |
| Run a shell command | `bash` |
| Search file contents | `grep` |
| Find files by name / glob | `glob` |
| Code intelligence (definition, references, rename) | `lsp` |
| Run code in a persistent kernel | `eval` |
| Debug a running process | `debug` |
| Fetch a URL / web search | `web_search` (and `read` can fetch URLs) |
| Ask the user a clarifying question | `ask` |
| Invoke a skill | OMP's native skill system — `read` the `skill://<name>` URI or the `SKILL.md` file directly |

## Subagents

OMP's `task` tool dispatches background subagents. The `agent` field selects both the subagent type and the model tier it runs on:

- `sonic` — low-reasoning, bound to `pi/smol`; for strictly mechanical updates or data collection
- `task` (default) — general-purpose worker, bound to `pi/task`; full capabilities
- `reviewer` — code review specialist, bound to `pi/slow`
- `plan` — software architect for complex multi-file decisions, bound to `pi/slow`

### Subagent-Driven Development: mapping SDD model tiers to OMP agents

The SDD skill's Model Selection section tells the controller to pick a cheap, standard, or most-capable model per dispatch and to **always specify the model explicitly**. On OMP, translate those tiers to `agent` types — the `agent` field is how you select the model tier, and omitting it silently defaults to `pi/task`:

| SDD Model Selection | OMP `agent` value | Bound model | When to use |
|---|---|---|---|
| cheap / fast model | `sonic` | `pi/smol` | Mechanical implementation: 1-2 files with a complete spec, transcription plus testing, single-file fixes |
| standard model | `task` | `pi/task` | Integration and judgment: multi-file coordination, pattern matching, debugging, implementers working from prose |
| most capable model | `reviewer` or `plan` | `pi/slow` | Architecture and design, final whole-branch review, subtle concurrency changes |

The SDD dispatch templates (`Subagent (general-purpose):` with `model: [MODEL]`) become `task` calls where `agent` carries the tier. Do **not** omit `agent` — an omitted `agent` defaults to `task` (`pi/task`), which silently defeats SDD's Model Selection just as an omitted `model` would on any harness.

`/model`'s Task/Subtask role setting changes what `pi/task` resolves to, so `agent: "task"` will use that configured model. It does not change `agent: "sonic"` (`pi/smol`) or `agent: "reviewer"`/`agent: "plan"` (`pi/slow`). For all `task` tool calls of one agent type, config-level `task.agentModelOverrides` has the highest priority and can statically bind that agent name (for example `task` or `sonic`) to a specific model. The `task` tool itself has no per-call `model` parameter; per-call model overrides are only available through the eval `agent(prompt, { model })` helper, which forces LSP off and has no IRC revival.

## Task lists

OMP ships a native `todo` tool for progress tracking. Use it directly for Superpowers task tracking. Treat older Superpowers references to `TodoWrite` as the `todo` tool.

## Skills

OMP has native skill discovery but does not expose Claude Code's `Skill` tool. When a Superpowers instruction says to invoke a skill, read the relevant `SKILL.md` with `read` — either via the `skill://<name>` URI or the file path. A human can also invoke `/skill:name` explicitly.
