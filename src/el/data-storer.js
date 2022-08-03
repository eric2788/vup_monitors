const { existsSync, mkdirSync, writeFileSync, readFileSync , promises: fs } = require('fs')


const PATH = './data/storage.json'

const caches = {
    data: {},
    cached: false
}


const DEFAULT_CONFIG = {
    "bot": {
        "http": "http://127.0.0.1:5700",
        "ws": "ws://127.0.0.1:6700"
    },
    "redis": {
        "host": "127.0.0.1",
        "port": 6379,
        "database": 0
    },
    "websocket": {
        "host": "blive.ericlamm.xyz",
        "use-tls": true
    },
    "source": "websocket",
    "owners": [],
    "accept_gadmin_command": false,
    "enable_live_broadcast": false,
    "show_cover": true,
    "show_gift_danmu": false,
    "show_image_danmu": false,
    "auto_check_update": true,
    "show_detail_list": true,
    "debug_mode": false
}


const DEFAULT_VALUES = {
    blive: {
        highlight: {
            '123': []
        },
        highlight_private: {
            '123': []
        },
        focus_users: {
            '123': []
        }
    }
}

// 新增 data 文件夹
if (!existsSync('./data')){
    mkdirSync('./data')
}

const SETTING_PATH = './data/settings.json'

if (!existsSync(SETTING_PATH)) {
    console.log("找不到 data/settings.json 档案")
    const config = JSON.stringify(DEFAULT_CONFIG, undefined, 4)
    writeFileSync(SETTING_PATH, config)
    console.log("已新增默认的 data/settings.json 设定档。")

}

const settings = { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync(SETTING_PATH, 'utf8')) }

const write_transactions = []

const actions = {
    settings,
    // this.update(data => { ... })
    update: async (update) => {
        const data = await actions.read()
        update(data)
        actions.save(data)
    },

    save: (data) => {
        try {
            writeFileSync(PATH, JSON.stringify(data))
            actions.clearCache()
            console.log(`离线数据储存已更新。`)
        }catch(err){
            console.warn(`执行离线储存时发生错误: ${err?.message ?? err}`)
            console.warn(err)
        }
    },

    saveQueue: (data) => {
       write_transactions.push(data)
    },
    read: async () => {
        if (caches.cached){
            return caches.data
        }
        let data = {}
        if (existsSync(PATH)){
            data = JSON.parse(await fs.readFile(PATH))
        }
        caches.data = { ...DEFAULT_VALUES, ...data }
        return caches.data
    },

    clearCache(){
        caches.cached = false
    }
}


module.exports = actions


function isEmpty(o){
    return Object.keys(o).length == 0
}

setInterval(() => {
    const data = write_transactions.shift()
    if (!data) return
    actions.save(data)
}, 500)