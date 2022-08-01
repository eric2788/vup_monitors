const { CommandExecutor } = require("../el/types");
const messager = require('../el/api/message-source')
const { toRealRoom: validRoom } = require('../el/utils')
const settings = require('../el/data-storer').settings

class BLiveListen extends CommandExecutor {


    async execute({ send, data }, args) {
        if (!args[0]) {
            await send('缺少参数: <房间号码>')
            return
        }
        const room = Number.parseInt(args[0])
        if (isNaN(room)) {
            await send(`${args[0]} 不是一个有效的房间号`)
            return
        }

        const realRoom = await validRoom(room)
        if (realRoom == -1) {
            await send(`找不到房间 ${room}`)
            return
        }

        const result = await messager.listen(realRoom)
        const msg = result ? `已成功启动监听房间(${realRoom})` : `该房间已启动监听(${realRoom})`
        await send(msg)
    }

}


class BLiveTerminate extends CommandExecutor {

    async execute({ send, data }, args) {
        if (!args[0]) {
            await send('缺少参数: <房间号码>')
            return
        }
        const room = Number.parseInt(args[0])
        if (isNaN(room)) {
            await send(`${args[0]} 不是一个有效的房间号`)
            return
        }
        const result = await messager.unlisten(room)
        const msg = result ? `已成功中止监听房间(${room})` : `该房间没有被监听(${room})`
        await send(msg)
    }
}


const roomMap = new Map()

class BLiveListening extends CommandExecutor {

    async execute({ send, data }, args) {
        const set = messager.listening()

        const displays = []

        if (settings.show_detail_list){
            await send(`正在刷取监听房间资讯，可能需要几分钟...`)
        }

        for (const room of set) {
            if (settings.show_detail_list){
                try {
                    let res;
                    if (roomMap.has(room)) {
                        res = roomMap.get(room)
                    }else{
                        res = await messager.getRoomUserName(room)
                        roomMap.set(room, res)
                    }
                    displays.push(`${room}(${res?.name})`)
                }catch(err){
                    console.warn(`獲取房間資訊錯誤: ${err}`)
                    displays.push(`${room}`)
                }
            }else{
                displays.push(`${room}`)
            }
        }

        await send(`正在监听的房间: ${displays}`)
    }
}


module.exports = {
    '监控': BLiveListen,
    'add': BLiveListen,
    '中止': BLiveTerminate,
    'del': BLiveTerminate,
    '监听中': BLiveListening,
    'list': BLiveListening
}