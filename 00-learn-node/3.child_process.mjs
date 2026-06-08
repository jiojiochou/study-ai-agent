import { spawn } from 'child_process'

// 假设命令行命令
const commad = 'ls -la'

// 获取当前工作目录
const cwd = process.cwd()


// 
const [cmd, ...args] = commad.split(' ')

const child = spawn(cmd, {
    cwd,
    stdio: 'inherit', // 实时输出到控制台
    shell: true
})


let errorMsg = ''

child.on('error', (error) => {
    errorMsg = error.message;
});


child.on('close', (code) => {
    if (code === 0) {
        process.exit(0);
    } else {
        if (errorMsg) {
            console.error(`错误: ${errorMsg}`);
        }
        process.exit(code || 1);
    }
})