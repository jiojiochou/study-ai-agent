import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import path from 'node:path'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file_system";

const model = new ChatOpenAI({
    model: process.env.model_name,
    apiKey: process.env.model_key,
    temperature: 0,
    configuration: {
        baseURL: process.env.model_api
    }
})
async function fileHistoryDemo() {
    // 制定存储文件
    const filePath = path.join(process.cwd(), 'chat_history.json')
    const sessionId = 'user_session_001'


    const systemMessage = new SystemMessage("你是一个友好的做菜助手，喜欢分享美食和烹饪技巧。")

    const history = new FileSystemChatMessageHistory({
        filePath,
        sessionId
    })


    console.log("[第一轮对话]")
    const userMessage1 = new HumanMessage(
        "红烧肉怎么做"
    )
    await history.addMessage(userMessage1)
    const messages1 = [systemMessage, ...(await history.getMessages())]
    const response1 = await model.invoke(messages1)
    await history.addMessage(response1)
    console.log(`用户: ${userMessage1.content}`)
    console.log(`助手: ${response1.content}`)
    console.log(`✓ 对话已保存到文件: ${filePath}\n`)


    console.log("[第二轮对话]")
    const userMessage2 = new HumanMessage(
        "好吃吗？"
    )
    await history.addMessage(userMessage2)
    const messages2 = [systemMessage, ...(await history.getMessages())]
    const response2 = await model.invoke(messages2)
    await history.addMessage(response2)

    console.log(`用户: ${userMessage2.content}`)
    console.log(`助手: ${response2.content}`)
    console.log(`✓ 对话已更新到文件\n`)
}


fileHistoryDemo().catch(console.error)