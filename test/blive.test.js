
const messager = require('../src/el/api/message-source');
const assert = require('assert')
const { default: axios } = require('axios')
const FormData = require('form-data')
const { websocket } = require('../src/el/data-storer').settings

const toListen = [
    22853788,
    22920508,
    21320551,
    1321846,
    21402309,
    8725120,
]


const api = axios.create({
    baseURL: `http${websocket['use-tls'] ? 's' : ''}://${websocket.host}/subscribe`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'vup_monitors'
    }
})

async function testListen() {
    await messager.connect();
    for (const room of toListen) {
        await messager.listen(room);
    }
    assert(toListen.every(room => messager.listening().has(room)), '未成功订阅所有房间');
    const res = await api.get()
    assert(toListen.every(room => (res.data ?? []).includes(room)), 'biligo-live-ws 服务器返回的房间列表不包含所有订阅的房间');
}

async function testUnListen() {
    await messager.connect();
    const room = toListen[0];
    await messager.listen(room);
    assert(await messager.unlisten(room), '未成功取消监听');
    assert(!messager.listening().has(room), '监听列表仍然有被取消的房间');
    const res = await api.get()
    assert(!(res.data ?? []).includes(room), 'biligo-live-ws 服务器返回的房间列表仍然包含被取消的房间');
}

// 獲取真實房間號
async function testRequestWithoutCors() {
    const api = axios.create({
        baseURL: 'https://blive-jp.ericlamm.xyz/subscribe',
        timeout: 5000
    })
    const form = new FormData()
    form.append('subscribes', 255)
    const res = await api.put('/add', form, { headers: form.getHeaders() })
    assert.equal(48743, res.data[0])
}




describe('B站直播测试', () => {
    it('订阅房间', testListen)
    it('取消订阅房间', testUnListen)
    it('获取真实房间号', testRequestWithoutCors)
})