"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const express_1 = __importDefault(require("express"));
const tasks_js_1 = require("./tools/tasks.js");
const compliance_js_1 = require("./tools/compliance.js");
const privacy_js_1 = require("./tools/privacy.js");
const risk_js_1 = require("./tools/risk.js");
// ── Server Setup ─────────────────────────────────────────────────────────────
const server = new mcp_js_1.McpServer({
    name: "unicis-mcp-server",
    version: "1.0.0",
});
// Register all tool groups
(0, tasks_js_1.registerTaskTools)(server);
(0, compliance_js_1.registerComplianceTools)(server);
(0, compliance_js_1.registerApiKeyTools)(server);
(0, privacy_js_1.registerPrivacyTools)(server);
(0, risk_js_1.registerRiskTools)(server);
// ── HTTP Transport (for claude.ai web / remote access) ───────────────────────
async function runHTTP() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Health check
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", server: "unicis-mcp-server", version: "1.0.0" });
    });
    // MCP endpoint — stateless, one transport per request
    app.post("/mcp", async (req, res) => {
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    const port = parseInt(process.env.PORT || "3000", 10);
    app.listen(port, () => {
        console.error(`Unicis MCP server running on http://localhost:${port}/mcp`);
    });
}
// ── stdio Transport (for Claude Desktop local config) ────────────────────────
async function runStdio() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Unicis MCP server running via stdio");
}
// ── Entry Point ──────────────────────────────────────────────────────────────
const transport = process.env.TRANSPORT || "stdio";
if (transport === "http") {
    runHTTP().catch((err) => {
        console.error("Server error:", err);
        process.exit(1);
    });
}
else {
    runStdio().catch((err) => {
        console.error("Server error:", err);
        process.exit(1);
    });
}
