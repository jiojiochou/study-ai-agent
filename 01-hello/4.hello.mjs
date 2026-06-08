import "dotenv/config"
import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
    model: process.env.model_name,
    apiKey: process.env.model_key,
    temperature: 0,
    configuration: {
        baseURL: process.env.model_url
    }
})


const response = await model.invoke('介绍一下自己！！！')
console.log("AI回复：")
console.log(response.content)