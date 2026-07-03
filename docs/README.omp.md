# Superpowers for OMP (Oh My Pi)

Complete guide for using Superpowers with [OMP](https://github.com/can1357/oh-my-pi) (`@oh-my-pi/pi-coding-agent`).

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

Restart OMP. The plugin installs through OMP's plugin manager and registers
all skills.

Verify by asking: "Tell me about your superpowers"

OMP uses its own plugin install. If you also use Claude Code, Codex, Pi, or
another harness, install Superpowers separately for each one.

## Usage

### Finding Skills

OMP discovers skills automatically from the plugin's `skills/` directory. To
list available skills, ask the model or check `/status`.

### Loading a Skill

OMP has native skill discovery but no Claude Code `Skill` tool. Load a skill
by reading its `SKILL.md` with `read`:

```
read skill://brainstorming
```

Or invoke a skill explicitly:

```
/skill:brainstorming
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

## How It Works

The plugin's `omp.extensions` entry point (`.omp/extensions/superpowers-bootstrap.ts`)
is an in-process extension (Shape B) that does one thing: inject the
`using-superpowers` bootstrap at session start and again after compaction.

OMP's `omp-plugins` discovery provider automatically scans the package's
`skills/` directory — no `resources_discover` handler or manual skill
registration is needed.

### Tool Mapping

Skills speak in actions rather than naming any one runtime's tools. On OMP
these resolve to:

- "Create a todo" / "mark complete in todo list" → `todo`
- `Subagent (general-purpose):` template → `task` tool with `agent: "task"` (or `"sonic"` for mechanical work, `"reviewer"` for code review, `"plan"` for architecture)
- "Invoke a skill" → `read` the `skill://<name>` URI or `SKILL.md` file
- "Read a file" → `read`
- "Create a file" → `write`
- "Edit a file" → `edit`
- "Run a shell command" → `bash`
- "Search file contents" / "find files by name" → `grep`, `glob`
- "Fetch a URL" / "web search" → `web_search`

See `skills/using-superpowers/references/omp-tools.md` for the full mapping.

## Troubleshooting

### Plugin not loading

1. Check that the extension loads: `omp plugin doctor`
2. Verify the `extensions` entry in your OMP settings
3. Make sure you're running a recent version of OMP

### Skills not found

1. Use `read skill://using-superpowers` to confirm skill discovery works
2. Check that the plugin is loading (see above)
3. Each skill needs a `SKILL.md` file with valid YAML frontmatter

### Bootstrap not appearing

1. Restart OMP after installing the plugin
2. The bootstrap injects as a user-role message at session start and after compaction

## Getting Help

- Report issues: https://github.com/obra/superpowers/issues
- Main documentation: https://github.com/obra/superpowers
