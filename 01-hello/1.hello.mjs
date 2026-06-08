import { ChatOpenAI } from '@langchain/openai'
import 'dotenv/config'

const model = new ChatOpenAI({
    modelName: process.env.OPEN_MODEL_NAME,
    apiKey: process.env.OPEN_MODEL_API_KEY,
    configuration: {
        baseURL: process.env.OPEN_MODEL_API_URL
    },
    temperature: 0
})

let response = await model.invoke('介绍一下自己')
console.log(response.content)