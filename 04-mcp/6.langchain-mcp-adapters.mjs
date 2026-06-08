import 'dotenv/config'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import { ChatOpenAI } from '@langChain/openai'
import chalk from 'chalk'
import { HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages'
import path from 'node:path'

const model = new ChatOpenAI({
    modelName: process.env.model_name,
    apiKey: process.env.model_key,
    configuration: {
        baseURL: process.env.model_url,
    },
})


const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        'foo': {
            command: 'node',
            args: [
                path.join(import.meta.dirname, '5.my-mcp-server.mjs')
            ]
        }
    }
})

const tools = await mcpClient.getTools()
const modelWithTools = model.bindTools(tools)


const res = await mcpClient.listResources()
let resourceContent = ''
for (const [serverName, resources] of Object.entries(res)) {
    for (const resource of resources) {
        const content = await mcpClient.readResource(serverName, resource.uri)
        resourceContent += content[0].text
    }
}


async function runAgentWithTools(query, maxIterations = 30) {
    const messages = [
        new SystemMessage(resourceContent),
        new HumanMessage(query)
    ];

    for (let i = 0; i < maxIterations; i++) {
        console.log(chalk.bgGreen(`⏳ 正在等待 AI 思考...`));
        const response = await modelWithTools.invoke(messages);
        messages.push(response);

        // 检查是否有工具调用
        if (!response.tool_calls || response.tool_calls.length === 0) {
            console.log(`\n✨ AI 最终回复:\n${response.content}\n`);
            return response.content;
        }

        console.log(chalk.bgBlue(`🔍 检测到 ${response.tool_calls.length} 个工具调用`));
        console.log(chalk.bgBlue(`🔍 工具调用: ${response.tool_calls.map(t => t.name).join(', ')}`));
        // 执行工具调用
        for (const toolCall of response.tool_calls) {
            const foundTool = tools.find(t => t.name === toolCall.name);
            if (foundTool) {
                const toolResult = await foundTool.invoke(toolCall.args);
                messages.push(new ToolMessage({
                    content: toolResult,
                    tool_call_id: toolCall.id,
                }));
            }
        }
    }

    return messages[messages.length - 1].content;
}

await runAgentWithTools("MCP Server 的使用指南是什么")


await mcpClient.close()