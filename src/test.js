const { invoke } = require('./el/command-manager')
const readline = require("readline");
const { default: axios } = require('axios')
const { commands } = require('./config')
const FormData = require('form-data')
const messager = require('./el/api/message-source');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const group_id = 123456 // 测试

function input(str = '') {
    return new Promise((resolve, reject) => {
        rl.question(str, (input) => resolve(input) );
    });
}

async function testCommands(){
    // eslint-disable-next-line no-constant-condition
    while (true){
        const msg = await input('Enter command: ')
        if (msg === '!exit'){
            break
        }
        if (msg[0] !== '!'){
            console.log('指令必须以 ! 开头')
            continue
        }
        const command = msg.substring(1).split(' ')
        const [cmd, ...args] = command

        try {
            await invoke({
                send: (msg) => console.log(`发送讯息: ${msg}`),
                data: { group_id },
                commands
            }, cmd, args)
        }catch(err){
            console.error(err)
        }
    }
}

async function testCommand(){
    await messager.connect()
    await testCommands()
}

// 獲取真實房間號
async function testRequestWithoutCors(){
    const api = axios.create({
        baseURL: 'https://blive-jp.ericlamm.xyz/subscribe',
        timeout: 5000
    })

    const form = new FormData()
    form.append('subscribes', 255)
    const res = await api.put('/add', form, { headers: form.getHeaders() })
    console.log(res.data[0])
}

//testCommand().catch(console.error)
testRequestWithoutCors().catch(console.error)