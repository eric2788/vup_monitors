const assert = require('assert')
const { default: axios } = require('axios')

const api = axios.create({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'
    }
})

describe('B站API測試', () => {
    it('測試用戶ID是否存在', async () => {
        const res = await api.get('https://api.bilibili.com/x/space/acc/info?mid=1&jsonp=jsonp')
        assert.equal(res.status, 200)
        assert.equal(res.data.code, 0)
    })
    it('測試用戶ID是否存在(錯誤)', async () => {
        const res = await api.get('https://api.bilibili.com/x/space/acc/info?mid=999999999&jsonp=jsonp')
        assert.equal(res.status, 200)
        assert.equal(res.data.code, -404)
    })
    it('測試B站反爬蟲', async () => {
        const res = await axios.get('https://api.bilibili.com/x/space/acc/info?mid=1&jsonp=jsonp')
        console.log(res.data)
        assert.equal(res.status, 200)
        assert.equal(res.data.code, -401)
        assert.notEqual(res.data?.data?.ga_data, undefined)
    })
    it('測試房間ID是否存在', async () => {
        const res = await api.get('https://api.live.bilibili.com/room/v1/Room/room_init?id=1')
        assert.equal(res.status, 200)
        assert.equal(res.data.code, 0)
    })
})