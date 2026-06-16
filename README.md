# unicis-mcp-server

MCP server for the [Unicis GRC Platform](https://unicis.tech), exposing task management, compliance controls, and API key tools to AI clients like Claude.

## Tools

### Tasks
| Tool | Description |
|------|-------------|
| `unicis_list_tasks` | List all tasks, with optional status/priority filters |
| `unicis_get_task` | Get full details of a single task |
| `unicis_create_task` | Create a new task |
| `unicis_update_task` | Update task fields (title, status, priority, due date) |
| `unicis_delete_task` | Permanently delete a task |
| `unicis_update_task_controls` | Add/remove/replace compliance controls on a task |

### Compliance (CSC)
| Tool | Description |
|------|-------------|
| `unicis_get_csc_statuses` | Get control statuses for a framework (ISO 27001, MVSP, NIS2, etc.) |
| `unicis_update_csc_status` | Update a single control's status |

### API Keys
| Tool | Description |
|------|-------------|
| `unicis_list_api_keys` | List API keys for a team |
| `unicis_create_api_key` | Create a new API key |

## Setup

### Prerequisites
- Node.js 18+
- A Unicis Platform API key (Settings → API Keys)

### Install & Build

```bash
npm install
npm run build
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_BASE_URL` | ✅ | Your Unicis instance, e.g. `https://platform.unicis.tech` |
| `API_BEARER_TOKEN` | ✅ | API key from team Settings |
| `TRANSPORT` | optional | `stdio` (default) or `http` |
| `PORT` | optional | HTTP port (default: `3000`) |

---

## Mode 1: Claude Desktop (stdio — local)

Update your `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Restart Claude Desktop — you should see all `unicis_*` tools available.

---

## Mode 2: claude.ai Web (HTTP — remote)

Run the server in HTTP mode, ideally hosted on your YunoHost or a VPS:

```bash
TRANSPORT=http API_BEARER_TOKEN=your-key API_BASE_URL=https://platform.unicis.tech npm start
```

Then add to your Claude Desktop config (this makes it available in claude.ai web via mcp-remote):

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

> **Tip**: Host at `mcp.unicis.tech` via nginx reverse proxy on your YunoHost server for a clean URL.

---

## Development

```bash
# Build
npm run build

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```
