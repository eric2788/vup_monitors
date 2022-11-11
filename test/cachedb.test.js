const assert = require('assert')
const cachedb = require('../src/el/cachedb')
const utils = require('../src/el/utils')


before(async () => await cachedb.initDB())
describe('cachedb 資料庫讀寫測試', () => {

    it('讀取資料', async () => {
        const user = await cachedb.getDB().get('test-unknown')
        console.log(user)
    })


    it('寫入資料', async () => {
        await cachedb.getDB().set('test', {
            number: 1234,
            message: 'hello-world'
        })

        const test = await cachedb.getDB().get('test')
        assert(test.number === 1234, '資料寫入失敗')
        assert(test.message === 'hello-world', '資料寫入失敗')
    })

    it('離線存取', async () => {
        const test = await cachedb.getDB().get('offline')
        console.log(`data: ${test}`)
        await cachedb.getDB().set('offline', 1234)
    })

    it('讀取房間', async () => {
        const res = await utils.toRealRoom(545)
        console.log(res)
        await utils.sleep(1000)
        const res2 = await cachedb.getRoom(545)
        console.log(res2)
        assert(res.room === res2.room_id, '離線讀取房間失敗')
    })

    it('讀取用戶', async () => {
        const res = await utils.validUser(15641218)
        console.log(res)
        await utils.sleep(1000)
        const res2 = await cachedb.getUser(15641218)
        console.log(res2)
        assert(res.name === res2.name, '離線讀取用戶失敗')
    })

    it('更新資料', async () => {
        await cachedb.updateRoom(545)
        await cachedb.updateUser(15641218)
    })
})