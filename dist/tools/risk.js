"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRiskTools = registerRiskTools;
const zod_1 = require("zod");
const api_js_1 = require("../services/api.js");
function registerRiskTools(server) {
    // ── Get Risk ──────────────────────────────────────────────────────────────
    server.registerTool("unicis_get_risk", {
        title: "Get Risk Assessment for Task",
        description: `Get the Risk Management (RM) data linked to a task.

Risk data is stored as a 2-step array inside task properties:
  [0] Risk info: { Risk, AssetOwner, Impact, RawProbability (0–100), RawImpact (0–100) }
  [1] Treatment: { RiskTreatment, TreatmentCost, TreatmentStatus (0–100),
                   TreatedProbability (0–100), TreatedImpact (0–100) }

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: Risk assessment data or indication it is not set.`,
        inputSchema: zod_1.z.object({
            slug: zod_1.z.string().describe("Team slug"),
            taskNumber: zod_1.z.number().int().positive().describe("Task number"),
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ slug, taskNumber }) => {
        const task = await (0, api_js_1.apiGet)(`/api/teams/${slug}/tasks/${taskNumber}`);
        const risk = task.properties?.rm_risk;
        if (!risk?.length) {
            return { content: [{ type: "text", text: `No risk assessment linked to task #${taskNumber}.` }] };
        }
        const info = risk[0] || {};
        const treatment = risk[1] || {};
        const lines = [
            `## Risk Assessment for task #${taskNumber}`,
            `**Risk:** ${info.Risk ?? "—"} | **Asset Owner:** ${info.AssetOwner ?? "—"}`,
            `**Impact:** ${info.Impact ?? "—"}`,
            `**Raw Probability:** ${info.RawProbability ?? "—"} | **Raw Impact:** ${info.RawImpact ?? "—"}`,
            ``,
            `### Treatment`,
            `**Strategy:** ${treatment.RiskTreatment ?? "—"} | **Cost:** ${treatment.TreatmentCost ?? "—"}`,
            `**Status:** ${treatment.TreatmentStatus ?? "—"}%`,
            `**Treated Probability:** ${treatment.TreatedProbability ?? "—"} | **Treated Impact:** ${treatment.TreatedImpact ?? "—"}`,
        ].join("\n");
        return {
            content: [{ type: "text", text: lines }],
            structuredContent: { items: risk },
        };
    });
    // ── Set Risk ──────────────────────────────────────────────────────────────
    server.registerTool("unicis_set_risk", {
        title: "Set Risk Assessment for Task",
        description: `Create or update the Risk Management assessment on a task.

The risk is stored as a 2-element array:
  [0] { Risk: string, AssetOwner: string, Impact: string,
        RawProbability: number (0-100), RawImpact: number (0-100) }
  [1] { RiskTreatment: string, TreatmentCost: string, TreatmentStatus: number (0-100),
        TreatedProbability: number (0-100), TreatedImpact: number (0-100) }

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number
  - risk (object): Risk info — Risk, AssetOwner, Impact, RawProbability, RawImpact
  - treatment (object): Treatment info — RiskTreatment, TreatmentCost, TreatmentStatus, TreatedProbability, TreatedImpact

Returns: Confirmation.`,
        inputSchema: zod_1.z.object({
            slug: zod_1.z.string().describe("Team slug"),
            taskNumber: zod_1.z.number().int().positive().describe("Task number"),
            risk: zod_1.z.object({
                Risk: zod_1.z.string().describe("Risk description"),
                AssetOwner: zod_1.z.string().describe("Asset owner (person responsible)"),
                Impact: zod_1.z.string().describe("Impact description"),
                RawProbability: zod_1.z.number().min(0).max(100).describe("Raw probability score 0-100"),
                RawImpact: zod_1.z.number().min(0).max(100).describe("Raw impact score 0-100"),
            }).describe("Risk identification data"),
            treatment: zod_1.z.object({
                RiskTreatment: zod_1.z.string().describe("Treatment strategy (e.g. mitigate, accept, transfer)"),
                TreatmentCost: zod_1.z.string().describe("Estimated treatment cost"),
                TreatmentStatus: zod_1.z.number().min(0).max(100).describe("Treatment completion percentage 0-100"),
                TreatedProbability: zod_1.z.number().min(0).max(100).describe("Residual probability after treatment 0-100"),
                TreatedImpact: zod_1.z.number().min(0).max(100).describe("Residual impact after treatment 0-100"),
            }).describe("Risk treatment data"),
        }).strict(),
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ slug, taskNumber, risk, treatment }) => {
        const task = await (0, api_js_1.apiGet)(`/api/teams/${slug}/tasks/${taskNumber}`);
        const prevRisk = task.properties?.rm_risk ?? [];
        const nextRisk = [risk, treatment];
        await (0, api_js_1.apiPost)(`/api/teams/${slug}/tasks/${taskNumber}/rm`, { prevRisk, nextRisk });
        return {
            content: [{ type: "text", text: `✅ Risk assessment saved on task #${taskNumber}.\nRaw score: ${risk.RawProbability * risk.RawImpact / 100} | Residual score: ${treatment.TreatedProbability * treatment.TreatedImpact / 100}` }],
        };
    });
    // ── Delete Risk ───────────────────────────────────────────────────────────
    server.registerTool("unicis_delete_risk", {
        title: "Delete Risk Assessment from Task",
        description: `Remove the Risk Management assessment from a task.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: Confirmation.`,
        inputSchema: zod_1.z.object({
            slug: zod_1.z.string().describe("Team slug"),
            taskNumber: zod_1.z.number().int().positive().describe("Task number"),
        }).strict(),
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    }, async ({ slug, taskNumber }) => {
        await (0, api_js_1.apiDelete)(`/api/teams/${slug}/tasks/${taskNumber}/rm`);
        return {
            content: [{ type: "text", text: `✅ Risk assessment removed from task #${taskNumber}.` }],
        };
    });
    // ── List Tasks with Risk ──────────────────────────────────────────────────
    server.registerTool("unicis_list_risks", {
        title: "List All Risk Assessments",
        description: `List all tasks that have a risk assessment, with their risk scores.

Args:
  - slug (string): Team slug
  - minRawScore (number, optional): Only return risks with RawProbability * RawImpact / 100 >= this value

Returns: Tasks with risk data, sorted by descending raw score.`,
        inputSchema: zod_1.z.object({
            slug: zod_1.z.string().describe("Team slug"),
            minRawScore: zod_1.z.number().min(0).max(100).optional().describe("Minimum risk score filter"),
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async ({ slug, minRawScore }) => {
        const tasks = await (0, api_js_1.apiGet)(`/api/teams/${slug}/tasks`);
        const withRisk = tasks
            .filter(t => Array.isArray(t.properties?.rm_risk) && t.properties.rm_risk.length > 0)
            .map(t => {
            const risk = t.properties.rm_risk[0] || {};
            const rawScore = ((risk.RawProbability ?? 0) * (risk.RawImpact ?? 0)) / 100;
            return { task: t, risk, rawScore };
        })
            .filter(r => minRawScore === undefined || r.rawScore >= minRawScore)
            .sort((a, b) => b.rawScore - a.rawScore);
        if (!withRisk.length) {
            return { content: [{ type: "text", text: "No risk assessments found." }] };
        }
        const lines = withRisk.map(r => `**#${r.task.taskNumber} — ${r.task.title}**\n` +
            `  Risk: ${r.risk.Risk ?? "—"} | Owner: ${r.risk.AssetOwner ?? "—"}\n` +
            `  Raw score: ${r.rawScore.toFixed(0)} (P:${r.risk.RawProbability ?? "?"}% × I:${r.risk.RawImpact ?? "?"}%)`);
        return {
            content: [{ type: "text", text: `## Risk Register (${withRisk.length} items)\n\n${lines.join("\n\n")}` }],
            structuredContent: { items: withRisk.map(r => ({ taskNumber: r.task.taskNumber, title: r.task.title, risk: r.risk, rawScore: r.rawScore })) },
        };
    });
}
