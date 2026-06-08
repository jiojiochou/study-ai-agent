import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import 'cheerio'


const cheerioLoader = new CheerioWebBaseLoader(
    "https://juejin.cn/post/7233327509919547452",
    {
        selector: '.main p'
    }
)

const documents = await cheerioLoader.load()

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["。", "！", "？"]
})

const splitDocuments = await textSplitter.splitDocuments(documents)
console.log("splitDocuments: ", splitDocuments)