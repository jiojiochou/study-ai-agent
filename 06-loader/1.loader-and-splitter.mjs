import 'dotenv/config'
import "cheerio";
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';


const cheerioLoader = new CheerioWebBaseLoader(
    "https://juejin.cn/post/7233327509919547452",
    {
        selector: '.main-area p'
    }
)


const document = await cheerioLoader.load()

const textplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
    separators: ["。", "！", "？"]
})

const splitDocuments = await textplitter.splitDocuments(document)

console.log(splitDocuments)
