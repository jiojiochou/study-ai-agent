import 'dotenv/config'
import 'cheerio'
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'

const cheerioLoader = new CheerioWebBaseLoader(
    "https://juejin.cn/post/7233327509919547452",
    {
        selector: '.main p'
    }
)

const document = await cheerioLoader.load()
console.log(document)