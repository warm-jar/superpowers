import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const EXTREMELY_IMPORTANT_MARKER = "<EXTREMELY_IMPORTANT>";
const BOOTSTRAP_MARKER = "superpowers:using-superpowers bootstrap for omp";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(extensionDir, "../..");
const skillsDir = resolve(packageRoot, "skills");
const bootstrapSkillPath = resolve(skillsDir, "using-superpowers", "SKILL.md");

let cachedBootstrap: string | null | undefined;

export default function superpowersOmpBootstrap(pi: ExtensionAPI) {
	let injectBootstrap = true;

	pi.on("session_start", async () => {
		injectBootstrap = true;
	});

	pi.on("session_compact", async () => {
		injectBootstrap = true;
	});

	pi.on("agent_end", async () => {
		injectBootstrap = false;
	});

	pi.on("context", async (event) => {
		if (!injectBootstrap) return;

		const messages = Array.isArray(event.messages) ? event.messages : [];
		if (messages.some(messageContainsBootstrap)) return;

		const bootstrap = getBootstrapContent();
		if (!bootstrap) return;

		const bootstrapMessage = {
			role: "user" as const,
			content: [{ type: "text" as const, text: bootstrap }],
			timestamp: Date.now(),
		};

		const insertAt = firstNonCompactionSummaryIndex(messages);
		return {
			messages: [
				...messages.slice(0, insertAt),
				bootstrapMessage,
				...messages.slice(insertAt),
			],
		};
	});
}

function getBootstrapContent(): string | null {
	if (cachedBootstrap !== undefined) return cachedBootstrap;

	try {
		const skillContent = readFileSync(bootstrapSkillPath, "utf8");
		const body = stripFrontmatter(skillContent);
		cachedBootstrap = `${EXTREMELY_IMPORTANT_MARKER}
${BOOTSTRAP_MARKER}

You have superpowers.

The using-superpowers skill content is included below and is already loaded for this OMP session. Follow it now. Do not try to load using-superpowers again.

${body}

${ompToolMapping()}
</EXTREMELY_IMPORTANT>`;
		return cachedBootstrap;
	} catch {
		cachedBootstrap = null;
		return null;
	}
}

function stripFrontmatter(content: string): string {
	const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
	return (match ? match[1] : content).trim();
}

function ompToolMapping(): string {
	return `## OMP tool mapping

OMP has native skills but does not expose Claude Code's \`Skill\` tool. When a Superpowers instruction says to invoke a skill, use OMP's native skill system instead: load the relevant \`SKILL.md\` with \`read\` (via a \`skill://<name>\` URI or the file path) when the skill applies, or let a human invoke \`/skill:name\` explicitly.

OMP's built-in coding tools include \`read\`, \`write\`, \`edit\`, \`bash\`, \`grep\`, \`glob\`, \`lsp\`, \`eval\`, \`debug\`, \`web_search\`, and \`ask\`. Use those for the corresponding actions: read a file, create or edit files, run shell commands, search file contents, find files by name, run code, debug a process, fetch a URL or search the web, and ask the user a clarifying question.

OMP provides native \`task\` and \`todo\` tools. Use \`task\` for Superpowers subagent workflows with the default/general \`task\` agent; configure that agent's model in OMP's \`/model\` Task/Subtask role rather than adding a Superpowers-specific tier mapping. Use \`todo\` for task tracking. Treat older Superpowers references to \`Task\`/subagents and \`TodoWrite\`/task lists as the matching OMP \`task\` and \`todo\` tools.`;
}

function messageContainsBootstrap(message: unknown): boolean {
	const content = readProperty(message, "content");
	if (typeof content === "string") return content.includes(BOOTSTRAP_MARKER);
	if (!Array.isArray(content)) return false;

	return content.some((part) => {
		if (!isRecord(part)) return false;
		if (part.type !== "text") return false;
		return typeof part.text === "string" && part.text.includes(BOOTSTRAP_MARKER);
	});
}

function firstNonCompactionSummaryIndex(messages: unknown[]): number {
	let index = 0;
	while (readProperty(messages[index], "role") === "compactionSummary") {
		index += 1;
	}
	return index;
}

function readProperty(value: unknown, key: string): unknown {
	if (!isRecord(value)) return undefined;
	return value[key];
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
