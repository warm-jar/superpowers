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

- `sonic` — low-reasoning, for strictly mechanical updates or data collection
- `task` (default) — general-purpose worker with full capabilities
- `reviewer` — code review specialist
- `plan` — software architect for complex multi-file decisions

For Superpowers subagent-driven development, dispatch implementer and reviewer subagents via `task` with the appropriate `agent` type. Config-level `task.agentModelOverrides` can statically bind a specific model to an agent type; per-call model overrides are available via the eval `agent(prompt, { model })` helper but force LSP off and have no IRC revival.

## Task lists

OMP ships a native `todo` tool for progress tracking. Use it directly for Superpowers task tracking. Treat older Superpowers references to `TodoWrite` as the `todo` tool.

## Skills

OMP has native skill discovery but does not expose Claude Code's `Skill` tool. When a Superpowers instruction says to invoke a skill, read the relevant `SKILL.md` with `read` — either via the `skill://<name>` URI or the file path. A human can also invoke `/skill:name` explicitly.
