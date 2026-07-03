# Installing Superpowers for OMP (Oh My Pi)

## Prerequisites

- [OMP](https://github.com/can1357/oh-my-pi) installed (`@oh-my-pi/pi-coding-agent`)

## Installation

Install Superpowers as an OMP plugin from this repository:

```bash
omp plugin install git+https://github.com/obra/superpowers.git
```

Or add it to your OMP settings (`~/.omp/agent/settings.json` or project-level
`.omp/settings.json`) under the `extensions` array:

```json
{
  "extensions": ["git+https://github.com/obra/superpowers.git"]
}
```

Restart OMP. The plugin's `omp.extensions` entry point loads the Superpowers
bootstrap extension, which injects the `using-superpowers` skill at session
start and again after compaction. OMP's `omp-plugins` discovery provider
automatically scans the package's `skills/` directory, so all Superpowers
skills are available with no manual copying.

Verify by asking: "Tell me about your superpowers"

OMP uses its own plugin install. If you also use Claude Code, Codex, Pi, or
another harness, install Superpowers separately for each one.

## Usage

OMP has native skill discovery but no Claude Code `Skill` tool. Load a skill
by reading its `SKILL.md` with `read` (via a `skill://<name>` URI or the file
path), or invoke `/skill:name` explicitly.

```
read skill://brainstorming
```

## Updating

OMP installs Superpowers through a git-backed package spec. If updates do not
appear after a restart, clear OMP's package cache or reinstall the plugin:

```bash
omp plugin install git+https://github.com/obra/superpowers.git
```

To pin a specific version:

```bash
omp plugin install git+https://github.com/obra/superpowers.git#v6.1.1
```

## Troubleshooting

### Plugin not loading

1. Check that the extension loads: `omp plugin doctor`
2. Verify the `extensions` entry in your OMP settings
3. Make sure you're running a recent version of OMP

### Skills not found

1. Use `read skill://using-superpowers` to confirm skill discovery works
2. Check that the plugin is loading (see above)
3. Each skill needs a `SKILL.md` file with valid YAML frontmatter

### Tool mapping

Skills speak in actions ("create a todo", "dispatch a subagent", "read a file").
On OMP these resolve to:

- "Create a todo" / "mark complete in todo list" → `todo`
- `Subagent (general-purpose):` template → `task` tool with `agent: "task"` (or `"sonic"` for mechanical work, `"reviewer"` for code review)
- "Invoke a skill" → `read` the `skill://<name>` URI or `SKILL.md` file
- "Read a file" → `read`
- "Create a file" → `write`
- "Edit a file" → `edit`
- "Run a shell command" → `bash`
- "Search file contents" / "find files by name" → `grep`, `glob`
- "Fetch a URL" / "web search" → `web_search`

See `skills/using-superpowers/references/omp-tools.md` for the full mapping.

## Getting Help

- Report issues: https://github.com/obra/superpowers/issues
- Full documentation: https://github.com/obra/superpowers
