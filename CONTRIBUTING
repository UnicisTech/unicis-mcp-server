# Contributing to Unicis MCP Server

Contributions make the open-source community a fantastic place to learn, inspire, and create. Any contributions you make are greatly appreciated.

The development branch is `main`. All pull requests should be made against `main`.

## Bug Reports

Please try to create bug reports that are:

- **Reproducible.** Include steps to reproduce the problem.
- **Specific.** Include as much detail as possible: which tool, which platform version, what API response was returned.
- **Unique.** Do not duplicate existing open issues.
- **Scoped to a Single Bug.** One bug per report.

## Adding or Fixing Tools

Each MCP tool in this server maps directly to one or more Unicis Platform REST API endpoints. Before opening a PR:

1. **Verify the API contract** — check the platform's OpenAPI spec at `https://platform.unicis.tech/api-docs` (or your self-hosted instance at `/api-docs`) to confirm the exact request body shape and response structure.
2. **Use typed Zod schemas** — every tool's `inputSchema` must use `z.object({ ... }).strict()` with descriptive `.describe()` on each field. Use `z.enum()` for fields with a fixed set of valid values.
3. **Unwrap API responses** — the Unicis Platform wraps all responses as `{ data: <payload>, error: null }`. The `apiGet / apiPost / apiPut / apiDelete` helpers in `src/services/api.ts` already unwrap `data` for you — do not double-unwrap.
4. **`structuredContent` type** — must be `Record<string, unknown>`. Arrays and plain objects must be wrapped: `{ items: [...] }` or `{ data: { ... } }`.

## Code Style

- Follow the existing TypeScript style in `src/`.
- No `any` types — use proper interfaces or generics.
- No inline comments explaining what the code does; only add a comment when the _why_ is non-obvious (e.g. a platform API quirk or a workaround for a specific behaviour).

## Development Workflow

### 1. Fork & clone

```bash
git clone https://github.com/<your_github_username>/unicis-mcp-server.git
cd unicis-mcp-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build

```bash
npm run build
```

### 4. Test with MCP Inspector

```bash
API_BEARER_TOKEN=your-key API_BASE_URL=https://platform.unicis.tech \
  npx @modelcontextprotocol/inspector node dist/index.js
```

### 5. Submit a PR

- Keep PRs focused — one feature or fix per PR.
- Describe _what_ you changed and _why_ in the PR description.
- Reference the relevant GitHub issue if one exists.

## Adding a New Tool

1. Identify the platform endpoint in the API docs.
2. Add your tool to the appropriate file in `src/tools/` (or create a new one for a new domain).
3. Register it in `src/index.ts` via the relevant `register*Tools(server)` call.
4. Update the tool table in `README.md`.
5. Build and verify with the MCP Inspector before opening a PR.

## Community

- [Discord](https://discord.com/invite/8TwyeD97HD) — ask questions, discuss ideas
- [GitHub Issues](https://github.com/UnicisTech/unicis-mcp-server/issues) — bugs and feature requests

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.
