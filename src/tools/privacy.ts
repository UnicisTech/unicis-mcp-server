import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, apiPost, apiDelete, Task } from "../services/api.js";

// RoPA fields match lib/rpa/index.ts field definitions

export function registerPrivacyTools(server: McpServer): void {

  // ── Get RoPA ──────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_get_ropa",
    {
      title: "Get RoPA for Task",
      description: `Get the Record of Processing Activities (RoPA) data linked to a task.

RoPA data is stored as structured steps inside the task properties.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: RoPA procedure data (multi-step object) or indication it is not set.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
      }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber }) => {
      const task = await apiGet<Task>(`/api/teams/${slug}/tasks/${taskNumber}`);
      const rpa = task.properties?.rpa_procedure;
      if (!rpa) {
        return { content: [{ type: "text", text: `No RoPA data linked to task #${taskNumber}.` }] };
      }
      return {
        content: [{ type: "text", text: `## RoPA for task #${taskNumber}\n\n\`\`\`json\n${JSON.stringify(rpa, null, 2)}\n\`\`\`` }],
        structuredContent: { data: rpa } as Record<string, unknown>,
      };
    }
  );

  // ── Set RoPA ──────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_set_ropa",
    {
      title: "Set RoPA for Task",
      description: `Create or update the Record of Processing Activities (RoPA) on a task.

The RoPA is stored as a 6-step array in task properties:
  [0] Stakeholders: { reviewDate, controller, dpo }
  [1] Purpose & Categories: { purpose, category[], datasubject[], retentionperiod, specialcategory[], commentsretention }
  [2] Recipients: { recipientType, recipientdetails }
  [3] Transfer: { datatransfer, recipient, country, guarantee[] }
  [4] TOMs: { toms[] }  — valid values: traceabilitymeasures, softwareprotectionmeasures, databackup,
           dataencryption, useraccesscontrol, controlofprocessors, mvsp, securitycert, othermeasures
  [5] DPIA screening: { involveProfiling, useAutomated, involveSurveillance, processedSpecialCategories,
           isBigData, dataSetsCombined, multipleControllers, imbalanceInRelationship,
           innovativeTechnologyUsed, transferredOutside, rightsRestricted, piaNeeded }

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number
  - procedure (object[]): The 6-step RoPA array described above

Returns: Confirmation.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
        procedure: z.array(z.record(z.unknown())).min(1).describe("6-step RoPA procedure array"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber, procedure }) => {
      const task = await apiGet<Task>(`/api/teams/${slug}/tasks/${taskNumber}`);
      const prevProcedure = task.properties?.rpa_procedure ?? [];
      await apiPost(
        `/api/teams/${slug}/tasks/${taskNumber}/rpa`,
        { prevProcedure, nextProcedure: procedure }
      );
      return {
        content: [{ type: "text", text: `✅ RoPA saved on task #${taskNumber}.` }],
      };
    }
  );

  // ── Delete RoPA ───────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_delete_ropa",
    {
      title: "Delete RoPA from Task",
      description: `Remove the RoPA record linked to a task.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: Confirmation.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber }) => {
      await apiDelete(`/api/teams/${slug}/tasks/${taskNumber}/rpa`);
      return {
        content: [{ type: "text", text: `✅ RoPA removed from task #${taskNumber}.` }],
      };
    }
  );

  // ── Get TIA ───────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_get_tia",
    {
      title: "Get TIA for Task",
      description: `Get the Transfer Impact Assessment (TIA) data linked to a task.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: TIA procedure data or indication it is not set.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
      }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber }) => {
      const task = await apiGet<Task>(`/api/teams/${slug}/tasks/${taskNumber}`);
      const tia = task.properties?.tia_procedure;
      if (!tia) {
        return { content: [{ type: "text", text: `No TIA data linked to task #${taskNumber}.` }] };
      }
      return {
        content: [{ type: "text", text: `## TIA for task #${taskNumber}\n\n\`\`\`json\n${JSON.stringify(tia, null, 2)}\n\`\`\`` }],
        structuredContent: { data: tia } as Record<string, unknown>,
      };
    }
  );

  // ── Set TIA ───────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_set_tia",
    {
      title: "Set TIA for Task",
      description: `Create or update the Transfer Impact Assessment (TIA) on a task.

The TIA is stored as a multi-step array in task properties. Key fields include:
  [0] Transfer info: { DataExporter, CountryDataExporter, DataImporter, CountryDataImporter,
       TransferScenario, DataAtIssue, HowDataTransfer, StartDateAssessment, AssessmentYears, LawImporterCountry }
  [1] Risk indicators: { EncryptionInTransit, TransferMechanism, LawfulAccess,
       MassSurveillanceTelecommunications, SelfReportingObligations, ... }
  [2+] Further steps

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number
  - procedure (object[]): TIA procedure steps

Returns: Confirmation.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
        procedure: z.array(z.record(z.unknown())).min(1).describe("TIA procedure steps array"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber, procedure }) => {
      const task = await apiGet<Task>(`/api/teams/${slug}/tasks/${taskNumber}`);
      const prevProcedure = task.properties?.tia_procedure ?? [];
      await apiPost(
        `/api/teams/${slug}/tasks/${taskNumber}/tia`,
        { prevProcedure, nextProcedure: procedure }
      );
      return {
        content: [{ type: "text", text: `✅ TIA saved on task #${taskNumber}.` }],
      };
    }
  );

  // ── Delete TIA ────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_delete_tia",
    {
      title: "Delete TIA from Task",
      description: `Remove the TIA record linked to a task.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: Confirmation.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber }) => {
      await apiDelete(`/api/teams/${slug}/tasks/${taskNumber}/tia`);
      return {
        content: [{ type: "text", text: `✅ TIA removed from task #${taskNumber}.` }],
      };
    }
  );

  // ── Get PIA ───────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_get_pia",
    {
      title: "Get PIA for Task",
      description: `Get the Privacy Impact Assessment (PIA/DPIA) data linked to a task.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: PIA procedure data or indication it is not set.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
      }).strict(),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber }) => {
      const task = await apiGet<Task>(`/api/teams/${slug}/tasks/${taskNumber}`);
      const pia = task.properties?.pia_procedure;
      if (!pia) {
        return { content: [{ type: "text", text: `No PIA data linked to task #${taskNumber}.` }] };
      }
      return {
        content: [{ type: "text", text: `## PIA for task #${taskNumber}\n\n\`\`\`json\n${JSON.stringify(pia, null, 2)}\n\`\`\`` }],
        structuredContent: { data: pia } as Record<string, unknown>,
      };
    }
  );

  // ── Set PIA ───────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_set_pia",
    {
      title: "Set PIA for Task",
      description: `Create or update the Privacy Impact Assessment (PIA/DPIA) on a task.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number
  - prevRisk (object[], optional): Current PIA data (for audit diff; pass [] for new)
  - nextRisk (object[]): New PIA data to save

Returns: Confirmation.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
        prevRisk: z.array(z.record(z.unknown())).optional().describe("Current PIA data (for diff tracking)"),
        nextRisk: z.array(z.record(z.unknown())).min(1).describe("New PIA data to save"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber, prevRisk, nextRisk }) => {
      await apiPost(
        `/api/teams/${slug}/tasks/${taskNumber}/pia`,
        { prevRisk: prevRisk ?? [], nextRisk }
      );
      return {
        content: [{ type: "text", text: `✅ PIA saved on task #${taskNumber}.` }],
      };
    }
  );

  // ── Delete PIA ────────────────────────────────────────────────────────────
  server.registerTool(
    "unicis_delete_pia",
    {
      title: "Delete PIA from Task",
      description: `Remove the PIA record linked to a task.

Args:
  - slug (string): Team slug
  - taskNumber (number): Task number

Returns: Confirmation.`,
      inputSchema: z.object({
        slug: z.string().describe("Team slug"),
        taskNumber: z.number().int().positive().describe("Task number"),
      }).strict(),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ slug, taskNumber }) => {
      await apiDelete(`/api/teams/${slug}/tasks/${taskNumber}/pia`);
      return {
        content: [{ type: "text", text: `✅ PIA removed from task #${taskNumber}.` }],
      };
    }
  );
}
