import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatOpenAI } from '@langchain/openai'
import 'dotenv/config'


// const model = new ChatOpenAI({
//     model: process.env.model_name,
//     apiKey: process.env.model_key,
//     // temperature: 0,
//     configuration: {
//         baseURL: process.env.model_api
//     }
// })

console.log('system', new SystemMessage('你是一个代码助手，精通各种编程语言。'))
console.log('human', new HumanMessage('介绍一下自己。'))

// const response = await model.invoke([new HumanMessage('介绍一下你自己')])
// console.log(response.content)