const { default: axios } = require("axios")
const level = require('./cachedb')

// added user-agent for anti crawler
axios.defaults.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'


const commonHandler = {
    '0': {
        pass: true
    },
    '-401': {
        msg: (id) => 'B站反爬虫机制触发, 已掠过检查直接添加。',
        pass: true,
    },
    '-412': {
        msg: (id) => `请求过于频繁, 已掠过检查直接添加。`,
        pass: true,
    },
}

const roomHandler = {
    '-404': {
        msg: (id) => `房间${id}不存在`,
        pass: false,
    }
}

const userHandler = {
    '-404': {
        msg: (id) => `用户${id}不存在`,
        pass: false,
    }
}



module.exports = {
    sleep: async (ms) => new Promise((res,) => setTimeout(res, ms)),

    sendMessage: async (ctx, group_id, message) => {
        await ctx.send('send_group_msg', {
            group_id,
            message: message instanceof Array ? message.join('\n') : message
        })
    },

    sendMessagePrivate: async (ctx, user_id, message) => {
        await ctx.send('send_private_msg', {
            user_id,
            message: message instanceof Array ? message.join('\n') : message
        })
    },

    toRealRoom: async (room) => {
        let res = await level.getRoom(room)
        if (res !== undefined) {
            return {
                pass: true,
                room: res?.room_id
            }
        }
        res = await axios.get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${room}`)
        if (res.status !== 200) throw new Error(res.statusText)
        const data = res.data?.data
        if (res.data.code == 0) {
            // put both real id room and short id room
            await level.putRoom(room, data)
            await level.putRoom(res?.data?.room_id, data)
            return {
                pass: true,
                room: data?.room_id
            }
        }
        const handler = Object.assign({}, commonHandler, roomHandler)
        return handler[`${res.data.code}`] ?? { msg: (id) => `API 请求错误: ${res.data.message}`, pass: false }
    },

    validUser: async (uid) => {
        let res = await level.getUser(uid)
        if (res !== undefined) {
            return {
                pass: true,
                name: res?.name
            }
        }
        res = await axios.get(`https://api.bilibili.com/x/space/acc/info?mid=${uid}&jsonp=jsonp`)
        if (res.status !== 200) throw new Error(res.statusText)
        const data = res.data?.data
        if (res.data.code == 0){
            await level.putUser(uid, data)
            return {
                pass: true,
                name: data?.name
            }
        }
        const handler = Object.assign({}, commonHandler, userHandler)
        return handler[`${res.data.code}`] ?? { msg: (id) => `API 请求错误: ${res.data.message}`, pass: false }
    },
    filterAndBroadcast: (highlight, uid, send, ctx, messages) => {
        if (!highlight) {
            console.warn('高亮列表为空，将返回 []')
            return []
        }
        return Object.entries(highlight)
            .filter(([id, users]) => users.includes(uid))
            .map(([id, users]) => id)
            .map(id => send(ctx, id, messages))
    }
}