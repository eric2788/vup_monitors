const utils = require('../src/el/utils')
const cachedb = require('../src/el/cachedb')
const assert = require('assert')

async function testRealRoom(){
    const res = await utils.toRealRoom(255)
    assert.equal(48743, res.room)
    assert.equal(res.pass, true)
}

async function testGetUser(){
    const res = await utils.validUser(387636363)
    assert.equal('雫るる_Official', res.name)
    assert.equal(res.pass, true)
}

async function testGetUserWrongly(){
    const res = await utils.validUser(387636363000)
    assert.equal(res.pass, false)
}

before(async () => await cachedb.initDB())
describe('Utils 測試', () => {
    it('獲取真實房間號', testRealRoom)
    it('獲取用戶名', testGetUser)
    it('獲取用戶名(錯誤)', testGetUserWrongly)
})