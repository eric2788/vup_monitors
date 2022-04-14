const { Level } = require('level')
const { default: axios } = require("axios")
const db = new Level('./caches', { valueEncoding: 'json' })

// read
async function getUser(uid) {
    try {
        return await db.get(`user:${uid}`)
    } catch (err) {
        if (err.code === 'LEVEL_NOT_FOUND') {
            return undefined
        }
        throw err
    }
}

async function getRoom(room_id) {
    try {
        return await db.get(`room:${room_id}`)
    } catch (err) {
        if (err.code === 'LEVEL_NOT_FOUND') {
            return undefined
        }
        throw err
    }
}

// write

async function putUser(uid, user) {
    await db.put(`user:${uid}`, user)
}

async function putRoom(room_id, room) {
    await db.put(`room:${room_id}`, room)
}


// update

async function updateRoom(room) {
    const res = await axios.get(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${room}`)
    if (res.status !== 200) {
        console.error(`房間資訊更新失敗: ${res.statusText}`)
        return
    }
    const data = res.data?.data
    if (res.data.code == 0) {
        await putRoom(room, data)
        await putRoom(res?.data?.room_id, data)
        console.log(`房間資訊更新成功: ${room}`)
    }else{
        console.error(`房間資訊更新失敗: ${res.data.message}`)
    }
}

async function updateUser(uid) {
    const res = await axios.get(`https://api.bilibili.com/x/space/acc/info?mid=${uid}&jsonp=jsonp`)
    if (res.status !== 200) {
        console.error(`用戶資訊更新失敗: ${res.statusText}`)
        return
    }
    const data = res.data?.data
    if (res.data.code == 0) {
        await putUser(uid, data)
        console.log(`用戶資訊更新成功: ${data.name}`)
    }else{
        console.error(`用戶資訊更新失敗: ${res.data.message}`)
    }
}

module.exports = {
    getUser,
    getRoom,
    putUser,
    putRoom,
    db,
    updateUser,
    updateRoom
}