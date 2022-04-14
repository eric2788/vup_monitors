const assert = require('assert')
const leveldb = require('../src/el/leveldb')
const utils = require('../src/el/utils')

describe('leveldb 資料庫讀寫測試', () => {

    it('讀取資料', async () => {
        try {
            const user = await leveldb.db.get('test-unknown')
            console.log(user)
        }catch(err){
            assert(err.code === 'LEVEL_NOT_FOUND', `錯誤捕捉失敗`)
        }
    })


    it('寫入資料', async () => {
        await leveldb.db.put('test', {
            number: 1234,
            message: 'hello-world'
        })

        const test = await leveldb.db.get('test')
        assert(test.number === 1234, '資料寫入失敗')
        assert(test.message === 'hello-world', '資料寫入失敗')
    })

    it('離線存取', async () => {
        try {
            const test = await leveldb.db.get('offline')
            console.log(`data: ${test}`)
        }catch(err){
            assert(err.code === 'LEVEL_NOT_FOUND', `錯誤捕捉失敗`)
        }
        await leveldb.db.put('offline', 1234)
    })

    it('讀取房間', async () => {
        const res = await utils.toRealRoom(545)
        console.log(res)
        await utils.sleep(1000)
        const res2 = await leveldb.getRoom(545)
        console.log(res2)
        assert(res === res2.room_id, '離線讀取房間失敗')
    })

    it('讀取用戶', async () => {
        const res = await utils.validUser(15641218)
        console.log(res)
        await utils.sleep(1000)
        const res2 = await leveldb.getUser(15641218)
        console.log(res2)
        assert(res === res2.name, '離線讀取用戶失敗')
    })

    it('更新資料', async () => {
        await leveldb.updateRoom(545)
        await leveldb.updateUser(15641218)
    })
})