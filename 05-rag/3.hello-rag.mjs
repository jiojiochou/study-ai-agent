import 'dotenv/config'
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import chalk from 'chalk';

const model = new ChatOpenAI({
    model: process.env.model_name,
    apiKey: process.env.model_key,
    temperature: 0,
    configuration: {
        baseURL: process.env.model_url
    }
})


const embeddings = new OpenAIEmbeddings({
    model: process.env.embeddings_model_name,
    apiKey: process.env.embeddings_model_key,
    temperature: 0,
    configuration: {
        baseURL: process.env.embeddings_model_url
    }
})


const documents = [
    new Document({
        pageContent: '杰克是一个活泼开朗的小男孩，他有一双明亮的大眼睛，总是带着灿烂的笑容。杰克最喜欢的事情就是和朋友们一起玩耍，他特别擅长踢足球，每次在球场上奔跑时，就像一道阳光一样充满活力。',
        metadata: {
            chapter: 1,
            character: "杰克",
            type: "角色介绍",
            mood: "活泼"
        },
    }),
    new Document({
        pageContent: `约翰是杰克最好的朋友，他是一个安静而聪明的男孩。约翰喜欢读书和画画，他的画总是充满了想象力。虽然性格不同，但约翰和杰克从幼儿园就认识了，他们一起度过了无数个快乐的时光。`,
        metadata: {
            chapter: 2,
            character: "约翰",
            type: "角色介绍",
            mood: "温馨"
        },
    }),
    new Document({
        pageContent: `有一天，学校要举办一场足球比赛，杰克非常兴奋，他邀请约翰一起参加。但是约翰从来没有踢过足球，他担心自己会拖累杰克。杰克看出了约翰的担忧，他拍着约翰的肩膀说："没关系，我们一起练习，我相信你一定能行的！"`,
        metadata: {
            chapter: 3,
            character: "杰克和约翰",
            type: "友情情节",
            mood: "鼓励",
        },
    }),
    new Document({
        pageContent: `接下来的日子里，杰克每天放学后都会教约翰踢足球。杰克耐心地教约翰如何控球、传球和射门，而约翰虽然一开始总是踢不好，但他从不放弃。约翰也用自己的方式回报杰克，他画了一幅画送给杰克，画上是两个小男孩在球场上一起踢球的场景。`,
        metadata: {
            chapter: 4,
            character: "杰克和约翰",
            type: "友情情节",
            mood: "互助",
        },
    }),
    new Document({
        pageContent: `比赛那天终于到了，杰克和约翰一起站在球场上。虽然约翰的技术还不够熟练，但他非常努力，而且他用自己的观察力帮助杰克找到了对手的弱点。在关键时刻，约翰传出了一个漂亮的球，杰克接球后射门得分！他们赢得了比赛，更重要的是，他们的友谊变得更加深厚了。`,
        metadata: {
            chapter: 5,
            character: "杰克和约翰",
            type: "高潮转折",
            mood: "激动",
        },
    }),
    new Document({
        pageContent: `从那以后，杰克和约翰成为了学校里最要好的朋友。杰克教约翰运动，约翰教杰克画画，他们互相学习，共同成长。每当有人问起他们的友谊，他们总是笑着说："真正的朋友就是互相帮助，一起变得更好的人！"`,
        metadata: {
            chapter: 6,
            character: "杰克和约翰",
            type: "结局",
            mood: "欢乐",
        },
    }),
    new Document({
        pageContent: `多年后，杰克成为了一名职业足球运动员，而约翰成为了一名优秀的插画师。虽然他们走上了不同的道路，但他们的友谊从未改变。约翰为杰克设计了球衣上的图案，杰克在每场比赛后都会给约翰打电话分享喜悦。他们证明了，真正的友情可以跨越时间和距离，永远闪闪发光。`,
        metadata: {
            chapter: 7,
            character: "杰克和约翰",
            type: "尾声",
            mood: "温馨",
        },
    }),
]


// 常见内存版本的向量数据库，把documents和embeddibgs绑定
const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
)



const retriever = vectorStore.asRetriever({ k: 3 })

const questions = [
    '杰克和约翰什么时候成为朋友的？'
]

for (const question of questions) {
    console.log("=".repeat(80))
    console.log(`问题：${question}`)
    console.log("=".repeat(80))


    // 将问题向量化
    const retrievedDocs = await retriever.invoke(question)
    const scoredResults = await vectorStore.similaritySearchWithScore(question, 3)


    // console.log('retrievedDocs', retrievedDocs) // [Document{}, ...]
    // console.log('scoredResults', scoredResults) // [[Document{}, score], ...]


    console.log("\n【检索到的文档及相似度评分】")
    retrievedDocs.forEach((doc, i) => {
        const scoredResult = scoredResults.find(([scoredDoc]) => {
            return scoredDoc.pageContent === doc.pageContent
        })


        const score = scoredResult ? scoredResult[1] : null

        const similarity = score !== null ? (1 - score).toFixed(4) : "N/A"
        console.log(`\n[文档 ${i + 1}] 相似度：${similarity}`)
        console.log(`内容：${doc.pageContent}`)
        console.log(`元数据: 章节=${doc.metadata.chapter}, 角色=${doc.metadata.character}, 类型=${doc.metadata.type}, 心情=${doc.metadata.mood}`)
    })


    const context = retrievedDocs
        .map((doc, i) => `[片段${i + 1}]\n${doc.pageContent}`)
        .join("\n\n━━━━━\n\n")


    const prompt = `
你是一个讲友情故事的老师。基于以下故事片段回答问题，用温暖生动的语言。如果故事中没有提到，就说"这个故事里还没有提到这个细节"。
故事片段:
${context}

问题：${question}

老师的回答：`


    console.log(chalk.bgRed("=".repeat(80)))
    console.log(prompt)
    console.log(chalk.bgRed("=".repeat(80)))


    console.log("\n【AI 回答】")
    const response = await model.invoke(prompt)
    console.log(response.content)
    console.log("\n")
}