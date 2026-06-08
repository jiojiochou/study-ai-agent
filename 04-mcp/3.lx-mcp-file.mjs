import { HumanMessage, ToolMessage } from '@langchain/core/messages'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import { ChatOpenAI } from '@langchain/openai'
import chalk from 'chalk'
import 'dotenv/config'

const model = new ChatOpenAI({
    model: process.env.OPEN_MODEL_NAME,
    apiKey: process.env.OPEN_MODEL_API_KEY,
    temperature: 0,
    configuration: {
        baseURL: process.env.OPEN_MODEL_API_URL
    }
})

// 接入第三方mcp 使用 MultiServerMcpClient
const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        'foo': { // 名字随便
            command: 'npx',
            args: [
                '-y',
                '@modelcontextprotocol/server-filesystem',
                ...process.env.AUTH_PATH.split(',') || ''
            ]
        }
    }
})


const tools = await mcpClient.getTools()
const modelWithTools = model.bindTools(tools)


async function runTask(query = '', maxIteration = 30) {
    const messages = [
        new HumanMessage(query)
    ]

    while (maxIteration--) {
        console.log(chalk.bgGreen(`⏳ 正在等待 AI 思考...`));

        const response = await modelWithTools.invoke(messages)
        messages.push(response)

        if (!response.tool_calls || response.tool_calls.length === 0) {
            console.log(chalk.bgGreen(`\n✨ AI 最终回复：\n`))
            console.log(response.content)
            return response.content
        }

        console.log(chalk.bgBlue(`🔍 检测到 ${response.tool_calls.length} 个工具调用`))
        console.log(chalk.bgBlue(`🔍 工具调用: ${response.tool_calls.map(t => t.name).join(', ')}`));

        for (const toolCall of response.tool_calls) {
            const tool = tools.find(t => t.name === toolCall.name)

            if (tool) {
                const toolResult = await tool.invoke(toolCall.args)

                messages.push(
                    new ToolMessage({
                        content: 'text' in toolResult ? toolResult.text : toolResult,
                        tool_call_id: toolCall.id
                    })
                )
            }

        }
    }

    return messages[messages.length - 1].content;
}


await runTask('在 /Users/chencu/Documents/ai 文件夹下创建一份test-server-filesystem-mcp.md文件，内容为"test server-filesystem mcp!!!"')

await mcpClient.close();