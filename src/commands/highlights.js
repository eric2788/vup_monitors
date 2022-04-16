const { CommandExecutor } = require('../el/types');
const storer = require('../el/data-storer')
const { validUser } = require('../el/utils')
const level = require('../el/cachedb')

const KEY_GROUP = 'highlight'
const KEY_PRIVATE = 'highlight_private'

class AddUser extends CommandExecutor {

    async execute({ send, data }, args) {

        const is_group = data.message_type === 'group'

        const parameters = is_group ? '<用户id>' : '<用户id> [群id]'

        if (!args[0]) {
            await send(`缺少参数: ${parameters}`)
            return
        }
        const uid = Number.parseInt(args[0])
        if (isNaN(uid)) {
            await send(`${uid} 不是一个有效的用户id`)
            return
        }

        const username = await validUser(uid)
        if (!username) {
            await send(`找不到用户 ${uid}`)
            return
        }

        if (!is_group && args[1]) { // 不是群聊發送，但是有輸入 [群 id]
            data.group_id = Number.parseInt(args[1])
        }

        const group_id = data.group_id
        const json = await storer.read()
        const blive = json['blive']

        // variables
        let id = group_id
        let key = KEY_GROUP
        let inside = `用户 ${username}(${uid}) 已在群 ${group_id} 的高亮名单内。`
        let added = `用户 ${username}(${uid}) 已新增到群 ${group_id} 的高亮名单。`

        if (!group_id) {  // in private
            id = data.sender.user_id
            key = KEY_PRIVATE
            inside = `用户  ${username}(${uid}) 已在你的高亮名单内。`
            added = `用户  ${username}(${uid}) 已新增到你的高亮名单。`
        }

        if (!blive[key]) {
            blive[key] = {}
        }

        const highlight = blive[key]

        if (!highlight[id]) {
            highlight[id] = []
        }

        if (highlight[id].includes(uid)) {
            await send(inside)
            return
        }

        highlight[id].push(uid)
        storer.save(json)
        await send(added)
    }
}


class RemoveUser extends CommandExecutor {

    async execute({ send, data }, args) {

        const is_group = data.message_type === 'group'

        const parameters = is_group ? '<用户id>' : '<用户id> [群id]'

        if (!args[0]) {
            await send(`缺少参数: ${parameters}`)
            return
        }

        const uid = Number.parseInt(args[0])
        if (isNaN(uid)) {
            await send(`${uid} 不是一个有效的用户id`)
            return
        }

        if (!is_group && args[1]) { // 不是群聊發送，但是有輸入 [群 id]
            data.group_id = Number.parseInt(args[1])
        }

        const group_id = data.group_id
        const json = await storer.read()
        const blive = json['blive']

        // variables
        let id = group_id
        let key = KEY_GROUP
        let non_exist = `用户 ${uid} 并不在群 ${group_id} 的高亮名单内。`
        let removed = `用户 ${uid} 已从群 ${group_id} 的高亮名单中移除。`

        if (!group_id) { // in private
            id = data.sender.user_id
            key = KEY_PRIVATE
            non_exist = `用户 ${uid} 并不在你的高亮名单内。`
            removed = `用户 ${uid} 已从你的高亮名单中移除。`
        }

        if (!blive[key]) {
            blive[key] = {}
        }

        const highlight = blive[key]

        if (!highlight[id]) {
            await send(non_exist)
            return
        }

        const list = highlight[id]

        const index = list.indexOf(uid)

        if (index == -1) {
            await send(non_exist)
            return
        }

        list.splice(index, 1)

        if (list.length == 0) {
            delete highlight[id]
        }

        storer.save(json)
        await send(removed)

    }
}


class HighLighting extends CommandExecutor {

    async execute({ send, data }, args) {

        const is_group = data.message_type === 'group'

        if (!is_group && args[0]) {
            data.group_id = Number.parseInt(args[0])
        }

        const json = await storer.read()
        const blive = json['blive']
        const group_id = data.group_id

        // variables
        let id = group_id
        let key = KEY_GROUP
        let lst_str = `群 ${group_id} 的高亮用戶列表: `

        if (!group_id) {
            id = data.sender.user_id
            key = KEY_PRIVATE
            lst_str = `你的高亮用戶列表: `
        }

        if (!blive[key]) {
            blive[key] = {}
        }
        const highlight = blive[key]
        const users = highlight[id] ?? []


        if (storer.settings.show_detail_list){
            await send(`正在刷取用户资讯，可能需要几分钟...`)
        }

        const displays = []

        for (const uid of users) {
            if (storer.settings.show_detail_list){
                try {
                    const user = await level.getUser(uid)
                    if (user) {
                        displays.push(`${user.name}(${uid})`)
                    } else {
                        console.warn(`缓存找不到用户 ${uid}, 你可能需要重新手动添加才能生效`)
                        displays.push(`${uid}`)
                    }
                } catch (err) {
                    console.warn(`獲取用戶資訊錯誤: ${err}`)
                    displays.push(`${uid}`)
                }
            }else{
                displays.push(`${uid}`)
            }
        }
        await send(`${lst_str} ${displays}`)
    }
}

module.exports = {
    '新增': AddUser,
    '移除': RemoveUser,
    '列表': HighLighting
}