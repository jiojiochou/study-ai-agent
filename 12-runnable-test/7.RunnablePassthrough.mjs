import 'dotenv/config';
import { RunnablePassthrough, RunnableLambda, RunnableSequence, RunnableMap } from "@langchain/core/runnables";

// 1
// const chain = RunnableSequence.from([
//     RunnableLambda.from((input) => ({ concept: input })),
//     RunnableMap.from({
//         original: new RunnablePassthrough(),
//         processed: RunnableLambda.from((obj) => ({
//             concept: input,
//             upper: obj.concept.toUpperCase(),
//             length: obj.concept.length,
//         }))
//     })
// ]);

// 2 函数->RunableLambda 对象RunableMap
const chain = RunnableSequence.from([
    (input) => ({ concept: input }),
    {
        original: new RunnablePassthrough(),
        processed: (obj) => ({
            concept: input,
            upper: obj.concept.toUpperCase(),
            length: obj.concept.length,
        }),
    }
]);

const input = "jack要吃饭";
const result = await chain.invoke(input);
console.log(result);


/**
 * {
 *     concept: input,
 *     original: {concept: input}
 *     processed: {
 *          concept: input,
 *          upper: obj.concept.toUpperCase(),
 *          length: obj.concept.length,
 *     }
 * }
 */
const chain1 = RunnableSequence.from([
    (input) => ({ concept: input }),
    RunnablePassthrough.assign({
        original: new RunnablePassthrough(),
        processed: (obj) => ({
            concept: input,
            upper: obj.concept.toUpperCase(),
            length: obj.concept.length,
        })
    })
]);
const input1 = "jack要吃饭";
const result1 = await chain1.invoke(input1);
console.log(result1);