import 'dotenv/config'
import { ChatOpenAI } from "@langchain/openai";
import { executeCommandTool, listDirectoryTool, readFileTool, writeFileTool } from './all-tools.mjs';

const model = new ChatOpenAI({
    modelName: process.env.OPEN_MODEL_NAME,
    apiKey: process.env.OPEN_MODEL_API_KEY,
    temperature: 0,
    configuration: {
        baseURL: process.env.OPEN_MODEL_API_URL
    }
})

const tools = [
    readFileTool,
    writeFileTool,
    executeCommandTool,
    listDirectoryTool
]

const modelWithTools = model.bindTools(tools)