import path from 'path'

// 1. join: 拼接路径
console.log('join: ', path.join('/src', 'ikun.txt')) // /src/ikun.txt
console.log('join: ', path.join('/user', 'document', 'name.txt')) // /user/document/name.txt

// 2. resolve: 解析绝对路径
console.log('resolve: ', path.resolve('src', 'all-tools.mjs')) // /Users/chencu/Documents/ai/src/all-tools.mjs

// 3. 获取文件名
console.log('basename: ', path.basename('ai/ikun/666.txt')) // 666.txt
console.log('basename: ', path.basename('ai/ikun/666.txt', '.txt')) // 666


// 4. 获取目录名
console.log('dirname: ', path.dirname('/user/docs/name.txt')) // /user/docs
console.log('dirname: ', path.dirname('/user/111/222/333/444/ikun.txt')) // /user/111/222/333/444

// 5. 获取拓展名
console.log('extname: ', path.extname('/user/docs/tupian.jpg')) // .jpg
console.log('extname: ', path.extname('/user/docs/tel.xlsx')) // .xlsx