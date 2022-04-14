const { default: axios } = require("axios")
const level = require('./cachedb')

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
            return res?.room_id
        }
        res = await axios.get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${room}`)
        if (res.status !== 200) throw new Error(res.statusText)
        const data = res.data?.data
        if (res.data.code == 0) {
            // put both real id room and short id room
            await level.putRoom(room, data)
            await level.putRoom(res?.data?.room_id, data)
        }
        return data?.room_id ?? -1
    },

    validUser: async (uid) => {
        let res = await level.getUser(uid)
        if (res !== undefined) {
            return res?.name
        }
        res = await axios.get(`https://api.bilibili.com/x/space/acc/info?mid=${uid}&jsonp=jsonp`)
        if (res.status !== 200) throw new Error(res.statusText)
        const data = res.data?.data
        if (res.data.code == 0){
            await level.putUser(uid, data)
        }
        return data?.name
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