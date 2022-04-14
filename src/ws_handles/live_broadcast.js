const storer = require('../el/data-storer')
const settings = storer.settings
const { sendMessage, sendMessagePrivate, filterAndBroadcast } = require("../el/utils")
const level = require('../el/cachedb')

module.exports = async ({ws, http}, data) => {

    // 開播時更新
    await level.updateRoom(data.live_info.room_id)
    await level.updateUser(data.live_info.uid)
    
    if (!settings.enable_live_broadcast) return // 沒啟用廣播
    // 不带live_time的是推流出现的标志，忽略
    if (!data.content.live_time) return

    const { name, uid, cover, title, room_id } = data.live_info

    const blive = (await storer.read())?.blive
    const { highlight, highlight_private, focus_users } = blive ?? { highlight: {}, highlight_private: {}, focus_users: {} }

    let group_ids = Object.keys(highlight ?? {})
    if (focus_users) {
        group_ids = group_ids.filter((group_id) => {
            const users = focus_users[group_id]
            // 没有注视用户，则全部广播，
            if (!users || users.length == 0) return true
            // 否則檢查開播用戶是否注視用戶
            return users.includes(uid)
        })
    }

    const group_highlight = {}

    group_ids.forEach((group_id) => group_highlight[group_id] = highlight[group_id])

    const messages = [
        `${name} 开播了：`,
        `标题: ${title}`,
        `直播间: https://live.bilibili.com/${room_id}`
    ]

    if (settings.show_cover && cover){
        messages.push(`[CQ:image,file=${cover}]`)
    }

    // 广播到群
    const sends = filterAndBroadcast(group_highlight, uid, sendMessage, ws, messages)
    if (sends.length > 0) {
        Promise.all(sends)
            .then(sent => console.log(`开播通知已发送给 ${sent.length} 个QQ群组。`))
            .catch(err => {
                console.warn(`發送广播通知时出现错误: ${err?.message}`)
                console.warn(err)
            })
    }
    // =========

    // ==== 广播到 私聊 ====
    const private_sends = filterAndBroadcast(highlight_private, uid, sendMessagePrivate, ws, messages)
    if (private_sends.length > 0) {
        Promise.all(private_sends)
            .then(sent => console.log(`开播通知已发送给 ${sent.length} 个QQ号。`))
            .catch(err => {
                console.warn(`發送广播通知时出现错误: ${err?.message}`)
                console.warn(err)
            })
    }

}