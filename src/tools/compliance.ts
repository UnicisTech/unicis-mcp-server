import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, apiPost, apiPut, ApiKey } from "../services/api.js";

interface CscControlStatus {
  [key: string]: unknown;
  controlId: string;
  status: string;
  note?: string;
}

export function registerComplianceTools(server: McpServer): void {

  // ── Get CSC Statuses by Framework ─────────────────────────────────────────
  server.registerTool(
    "unicis_get_csc_statuses",
    {
      title: "Get CSC Control Statuses",
      description: `Get compliance control statuses for a team by framework.

Args:
  - slug (string): Team slug
  - framework (string): Framework identifier — e.g. "iso-2022", "mvsp", "nist", "nis2", "gdpr", "cis", "c5", "soc2"

Returns: List of controls with their current status and notes.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        framework: z.string().describe("Framework ID, e.g. 'iso-2022', 'mvsp', 'nist', 'nis2'"),
      }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, framework }) => {
      const statuses = await apiGet<CscControlStatus[]>(`/api/teams/${slug}/csc/${framework}`);
      if (!statuses.length) {
        return { content: [{ type: "text", text: `No control statuses found for framework: ${framework}` }] };
      }
      const lines = statuses.map(s =>
        `- **${s.controlId}**: ${s.status}${s.note ? ` — ${s.note}` : ""}`
      );
      return {
        content: [{ type: "text", text: `## ${framework} Controls (${statuses.length})\n\n${lines.join("\n")}` }],
        structuredContent: { framework, total: statuses.length, statuses },
      };
    }
  );

  // ── Update CSC Control Status ─────────────────────────────────────────────
  server.registerTool(
    "unicis_update_csc_status",
    {
      title: "Update CSC Control Status",
      description: `Update the status of a single compliance control for a team.

Args:
  - slug (string): Team slug
  - controlId (string): Control ID (e.g. "iso-2022-a-5-17")
  - status (string): New status value
  - note (string, optional): Optional note explaining the status

Returns: Updated control status.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        controlId: z.string().describe("Control ID, e.g. 'iso-2022-a-5-17'"),
        status: z.string().describe("New status value"),
        note: z.string().optional().describe("Optional explanatory note"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, controlId, status, note }) => {
      const result = await apiPut<CscControlStatus>(`/api/teams/${slug}/csc`, { controlId, status, note });
      return {
        content: [{ type: "text", text: `✅ Control **${controlId}** updated to **${result.status}**${note ? `\nNote: ${note}` : ""}` }],
        structuredContent: result,
      };
    }
  );
}

export function registerApiKeyTools(server: McpServer): void {

  // ── List API Keys ─────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_list_api_keys",
    {
      title: "List API Keys",
      description: `List all API keys for a Unicis team.

Args:
  - slug (string): Team slug

Returns: Array of API key metadata (id, name, createdAt). Token values are never returned.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
      }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug }) => {
      const keys = await apiGet<ApiKey[]>(`/api/teams/${slug}/api-keys`);
      if (!keys.length) {
        return { content: [{ type: "text", text: "No API keys found for this team." }] };
      }
      const lines = keys.map(k => `- **${k.name}** (id: ${k.id}) — created ${new Date(k.createdAt).toLocaleDateString()}`);
      return {
        content: [{ type: "text", text: `## API Keys (${keys.length})\n\n${lines.join("\n")}` }],
      };
    }
  );

  // ── Create API Key ────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_create_api_key",
    {
      title: "Create API Key",
      description: `Create a new API key for a Unicis team. The token is only returned once — store it immediately.

Args:
  - slug (string): Team slug
  - name (string): A descriptive name for the key (e.g. "Claude MCP integration")

Returns: New API key object including the token value (shown once only).`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        name: z.string().min(1).max(100).describe("Descriptive name for the key"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async ({ slug, name }) => {
      const key = await apiPost<ApiKey & { token: string }>(`/api/teams/${slug}/api-keys`, { name });
      return {
        content: [{
          type: "text",
          text: `✅ API key created: **${key.name}**\n\n⚠️ Save this token now — it won't be shown again:\n\`${(key as { token?: string }).token ?? "token-not-returned"}\``
        }],
        structuredContent: key,
      };
    }
  );
}
