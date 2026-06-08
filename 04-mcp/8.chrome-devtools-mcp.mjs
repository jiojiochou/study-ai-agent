import { MultiServerMCPClient } from '@langchain/mcp-adapters'

const mcpServer = new MultiServerMCPClient({
    mcpServers: {
        "chrome-devtools": {
            "command": "npx",
            "args": [
                "-y",
                "chrome-devtools-mcp@latest"
            ]
        }
    }
})