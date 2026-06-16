<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.unicis.tech/img/logo_unicis_white-1.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://www.unicis.tech/img/unicis-platform-logo-horizonatal.svg">
  <img alt="Unicis Platform" src="https://www.unicis.tech/img/unicis-platform-logo-horizonatal.svg">
</picture>

# Unicis MCP Server

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/UnicisTech)
[![Static Badge](https://img.shields.io/badge/LinkedIn-Unicis%20Tech-blue?logo=LinkedIn)](https://www.linkedin.com/company/unicis-tech-oü/)
[![Discord](https://img.shields.io/discord/1110270854824214589)](https://discord.com/invite/8TwyeD97HD)

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that connects AI assistants — Claude, Cursor, VS Code Copilot, and any other MCP-compatible client — directly to the [Unicis Platform](https://unicis.tech) GRC. Manage tasks, privacy records, cybersecurity controls, risk registers, and file attachments through natural language.

---

## ✨ Available Tools

### Tasks

Tasks are the core unit of work in Unicis. Each task can carry compliance data (cybersecurity controls, RoPA, TIA, PIA, Risk) as embedded properties.

| Tool | Description |
|------|-------------|
| `unicis_list_tasks` | List all tasks for a team with optional status/priority filters |
| `unicis_get_task` | Get full details of a single task including attachments and linked module data |
| `unicis_create_task` | Create a new task with title, status, priority, due date, description, and optional compliance controls |
| `unicis_update_task` | Update task fields: title, status, priority, due date, description |
| `unicis_delete_task` | Permanently delete a task |
| `unicis_update_task_controls` | Add, remove, or replace the compliance controls linked to a task |
| `unicis_add_comment` | Post a comment on a task |
| `unicis_list_attachments` | List all file attachments on a task |
| `unicis_add_attachment` | Upload a file attachment to a task by local file path |
| `unicis_remove_attachment` | Remove a file attachment from a task by attachment ID |

**Task status values:** `todo` · `inprogress` · `done`  
**Task priority values:** `low` · `medium` · `high`

---

### Privacy — Record of Processing Activities (RoPA)

The RoPA module implements Article 30 GDPR record-keeping. Each task can carry one RoPA record stored as a 6-step procedure.

| Tool | Description |
|------|-------------|
| `unicis_get_ropa` | Get the RoPA record linked to a task |
| `unicis_set_ropa` | Create or update a RoPA record on a task |
| `unicis_delete_ropa` | Remove the RoPA record from a task |

**RoPA 6-step structure:**

| Step | Contents |
|------|----------|
| `[0]` Stakeholders | `reviewDate`, `controller`, `dpo` |
| `[1]` Purpose & Categories | `purpose`, `category[]`, `datasubject[]`, `retentionperiod`, `specialcategory[]`, `commentsretention` |
| `[2]` Recipients | `recipientType`, `recipientdetails` |
| `[3]` Transfer | `datatransfer`, `recipient`, `country`, `guarantee[]` |
| `[4]` TOMs | `toms[]` — valid values: `traceabilitymeasures`, `softwareprotectionmeasures`, `databackup`, `dataencryption`, `useraccesscontrol`, `controlofprocessors`, `mvsp`, `securitycert`, `othermeasures` |
| `[5]` DPIA Screening | boolean flags: `involveProfiling`, `useAutomated`, `involveSurveillance`, `processedSpecialCategories`, `isBigData`, `dataSetsCombined`, `multipleControllers`, `imbalanceInRelationship`, `innovativeTechnologyUsed`, `transferredOutside`, `rightsRestricted`, `piaNeeded` |

---

### Privacy — Transfer Impact Assessment (TIA)

The TIA module assesses data transfer risk under GDPR Chapter V (third-country transfers). Each task can carry one TIA record.

| Tool | Description |
|------|-------------|
| `unicis_get_tia` | Get the TIA record linked to a task |
| `unicis_set_tia` | Create or update a TIA record on a task |
| `unicis_delete_tia` | Remove the TIA record from a task |

**Key TIA fields include:** transfer scenario, data exporter/importer details, country of import, encryption in transit, transfer mechanism, lawful access risk, surveillance laws, self-reporting obligations, and an overall transfer risk conclusion.

---

### Privacy — Privacy Impact Assessment (PIA / DPIA)

The PIA module implements a structured DPIA under GDPR Article 35, using a 5-step Probability × Impact quantitative framework.

| Tool | Description |
|------|-------------|
| `unicis_get_pia` | Get the PIA record linked to a task |
| `unicis_set_pia` | Create or update a PIA record on a task |
| `unicis_delete_pia` | Remove the PIA record from a task |

**PIA 5-step structure:**

| Step | Contents |
|------|----------|
| `step0` | Data processing necessity: `isDataProcessingNecessary` (`necessary`/`unnecessary`), `isProportionalToPurpose` (`proportional`/`not_proportional`), free-text assessments |
| `step1` | Confidentiality & Integrity: `confidentialityRiskProbability` × `confidentialityRiskSecurity` + free-text assessment |
| `step2` | Availability: `availabilityRiskProbability` × `availabilityRiskSecurity` + free-text assessment |
| `step3` | Transparency: `transparencyRiskProbability` × `transparencyRiskSecurity` + free-text assessment |
| `step4` | Corrective measures (optional): `guarantees`, `securityMeasures`, `securityCompliance`, `dealingWithResidualRisk`, `supervisoryAuthorityInvolvement` |

**Probability scale:** `rare` · `unlikely` · `possible` · `probable` · `severe`  
**Impact scale:** `insignificant` · `minor` · `moderate` · `major` · `extreme`  
**Residual risk options:** `acceptable` · `acceptable_with_conditions` · `not_acceptable`

---

### Cybersecurity Controls (CSC)

The CSC module maps tasks to controls across major security frameworks. Statuses follow a 0–6 maturity scale.

| Tool | Description |
|------|-------------|
| `unicis_get_csc_statuses` | Get all control statuses for a team by framework |
| `unicis_update_csc_status` | Update a single control's maturity status |

**Supported frameworks:**

| Framework ID | Full Name |
|---|---|
| `iso-2022` | ISO/IEC 27001:2022 |
| `iso-2013` | ISO/IEC 27001:2013 |
| `mvsp` | MVSP |
| `nistcsfv2` | NIST CSF v2 |
| `eunis2` | EU NIS2 |
| `gdpr` | GDPR |
| `cisv81` | CIS CSC v8.1 |
| `soc2v2` | SOC2 v2 |
| `c5_2020` | C5 2020 |
| `owasp_asvs_v5` | OWASP ASVS v5 |
| `pcidss_v401` | PCI DSS v4.0.1 |
| `iso42001` | ISO/IEC 42001:2023 |

**CSC status values (maturity scale):**

| Value | Maturity Level |
|---|---|
| `unknown` | 0 — Unknown |
| `not-applicable` | — Not Applicable |
| `not-performed` | 1 — Not Performed |
| `performed-informally` | 2 — Performed Informally |
| `planned` | 3 — Planned |
| `well-defined` | 4 — Well Defined |
| `quantitatively-controlled` | 5 — Quantitatively Controlled |
| `continuously-improving` | 6 — Continuously Improving |

---

### Risk Management

The Risk Management module maintains an asset-level risk register. Each task can hold one risk record with raw and treated probability × impact scores.

| Tool | Description |
|------|-------------|
| `unicis_get_risk` | Get the risk record linked to a task |
| `unicis_set_risk` | Create or update a risk entry on a task |
| `unicis_delete_risk` | Remove the risk record from a task |
| `unicis_list_risks` | List all tasks with risk records across a team, sorted by descending raw risk score |

**Risk record fields include:** risk name, asset owner, raw probability (1–5), raw impact (1–5), risk treatment plan, treatment cost, treatment status, treated probability, treated impact.

---

### API Keys

| Tool | Description |
|------|-------------|
| `unicis_list_api_keys` | List all API keys for a team (names and IDs — tokens are never returned after creation) |
| `unicis_create_api_key` | Create a new named API key — the token is returned **once only**, store it immediately |

---

## ⚠️ Not Yet Supported

The following Unicis Platform module is **not yet accessible via MCP**:

| Module | Status |
|--------|--------|
| **IAP — Interactive Awareness Training** | Not yet supported. The awareness program module (course assignments, completion tracking, quiz results, learner reports) does not currently have MCP tool coverage. Planned for a future release. |

---

## 🚀 Setup

### Prerequisites

- Node.js 18+
- A Unicis Platform API key — generate one at **Team Settings → API Keys**

### Install & Build

```bash
npm install
npm run build
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_BASE_URL` | ✅ | Your Unicis instance URL, e.g. `https://platform.unicis.tech` |
| `API_BEARER_TOKEN` | ✅ | API key from Team Settings |
| `TRANSPORT` | optional | `stdio` (default) or `http` |
| `PORT` | optional | HTTP port when using `http` transport (default: `3000`) |

---

## 🖥️ Mode 1: Claude Desktop — stdio (local)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "unicis": {
      "command": "node",
      "args": ["/absolute/path/to/unicis-mcp-server/dist/index.js"],
      "env": {
        "API_BEARER_TOKEN": "your-api-key",
        "API_BASE_URL": "https://platform.unicis.tech"
      }
    }
  }
}
```

Restart Claude Desktop — all `unicis_*` tools will appear automatically.

---

## 🌐 Mode 2: Remote HTTP server (claude.ai web / Cursor / VS Code)

Run the server in HTTP mode on a VPS or your own host:

```bash
TRANSPORT=http \
API_BEARER_TOKEN=your-api-key \
API_BASE_URL=https://platform.unicis.tech \
npm start
```

Then point your MCP client at the server. For Claude Desktop connecting to a remote endpoint via `mcp-remote`:

```json
{
  "mcpServers": {
    "unicis": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.unicis.tech/mcp",
        "--header",
        "Authorization: Bearer your-api-key"
      ]
    }
  }
}
```

> **Tip:** Host behind an nginx reverse proxy at `mcp.unicis.tech` for a clean public URL.

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Inspect tools interactively with the MCP Inspector
API_BEARER_TOKEN=your-key API_BASE_URL=https://platform.unicis.tech \
  npx @modelcontextprotocol/inspector node dist/index.js
```

### Project structure

```
src/
├── index.ts              # Server entry point — registers all tools, sets up transports
├── services/
│   └── api.ts            # Typed API client (apiGet / apiPost / apiPut / apiDelete)
└── tools/
    ├── tasks.ts           # Task CRUD, comments, attachments, controls
    ├── compliance.ts      # CSC statuses, API key management
    ├── privacy.ts         # RoPA, TIA, PIA tools
    └── risk.ts            # Risk management tools
```

---

## 📖 Additional Resources

- [Unicis Platform documentation](https://www.unicis.tech/docs/platform/introduction)
- [Unicis Platform REST API (Swagger UI)](https://platform.unicis.tech/api-docs)
- [MCP specification](https://modelcontextprotocol.io/)
- [Model Context Protocol SDK (TypeScript)](https://github.com/modelcontextprotocol/typescript-sdk)

---

## ✨ Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Bug reports should be **reproducible**, **specific**, and **scoped to a single issue**.
- New tools must include typed Zod input schemas and match the Unicis Platform REST API exactly.
- Open a GitHub issue first for any significant new feature.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.

---

## 🤝 Community

- [Discord](https://discord.com/invite/8TwyeD97HD) — live discussion with the open-source community and Unicis team
- [X / Twitter](https://twitter.com/UnicisTech) · [LinkedIn](https://www.linkedin.com/company/unicis-tech-oü/) · [Mastodon](https://mastodon.xyz/@unicis_tech)
- [GitHub Issues](https://github.com/UnicisTech/unicis-mcp-server/issues) — bug reports, feature requests

---

## 🛡️ License

[Apache 2.0 License](LICENSE)
