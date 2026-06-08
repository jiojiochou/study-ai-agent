import { MultiServerMCPClient } from '@langchain/mcp-adapters'

const mcpServer = new MultiServerMCPClient({
    mcpServers: {
        "filesystem": {
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                ...(process.env.ALLOWED_PATHS.split(',') || '')
            ]
        }
    }
})