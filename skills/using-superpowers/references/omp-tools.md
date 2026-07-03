# OMP Tool Mapping

Skills speak in actions ("dispatch a subagent", "create a todo", "read a file"). On OMP (Oh My Pi) these resolve to the tools below.

| Action skills request | OMP equivalent |
| --- | --- |
| Dispatch a subagent (`Subagent (general-purpose):` template) | `task` tool — use the default/general `task` agent; its model is configured through OMP's `/model` Task/Subtask role |
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

OMP's `task` tool dispatches background subagents. For Superpowers, use the default/general `task` agent and configure its model in OMP (`/model` → Task/Subtask). This keeps model routing in the harness instead of adding a Superpowers-specific tier mapping.

If a project needs a hard config-level override, `task.agentModelOverrides.task` can bind the `task` agent to a model for all dispatches. The `task` tool itself has no per-call `model` parameter.

## Task lists

OMP ships a native `todo` tool for progress tracking. Use it directly for Superpowers task tracking. Treat older Superpowers references to `TodoWrite` as the `todo` tool.

## Skills

OMP has native skill discovery but does not expose Claude Code's `Skill` tool. When a Superpowers instruction says to invoke a skill, read the relevant `SKILL.md` with `read` — either via the `skill://<name>` URI or the file path. A human can also invoke `/skill:name` explicitly.
