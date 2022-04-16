const assert = require('assert')
const highlights = require('../src/commands/highlights')
const focus = require('../src/commands/focus')
const storer = require('../src/el/data-storer')

const group_id = 1145141919810;

const cmdExecute = {
    send: (msg) => console.log(`发送讯息: ${msg}`),
    data: { group_id, message_type: 'group' },
}

const highLightUsers = [
    1576121,
    1202504814,
    623441612,
    1043321643,
    406805563,
    1869304,
]

async function testAddHighlight() {
    for (const user of highLightUsers) {
        await (new highlights['新增']()).execute(cmdExecute, [user])
    }
    const data = await storer.read()
    assert(highLightUsers.every(user => (data.blive.highlight[group_id] ?? []).includes(user)), '未成功添加高亮');
}

async function testRemoveHighlight(){
    const user = highLightUsers[0]
    await (new highlights['新增']()).execute(cmdExecute, [user])
    await (new highlights['移除']()).execute(cmdExecute, [user])
    const data = await storer.read()
    assert(!(data.blive.highlight[group_id] ?? []).includes(user), '未成功移除高亮');
}

async function testShowHighlight(){
    await (new highlights['列表']()).execute(cmdExecute)
}


const focus_users = [
    1576121,
    1202504814,
]

async function testAddFocus() {
    for (const user of focus_users) {
        await (new focus['新增']()).execute(cmdExecute, [user])
    }
    const data = await storer.read()
    assert(focus_users.every(user => (data.blive.focus_users[group_id] ?? []).includes(user)), '未成功添加注视用户');
}

async function testRemoveFocus(){
    const user = focus_users[0]
    await (new focus['新增']()).execute(cmdExecute, [user])
    await (new focus['移除']()).execute(cmdExecute, [user])
    const data = await storer.read()
    assert(!(data.blive.focus_users[group_id] ?? []).includes(user), '未成功移除注视用户');
}

async function testShowFocus(){
    await (new focus['列表']()).execute(cmdExecute)
}

describe('高亮用户修改测试', () => {
    it('新增高亮用户', testAddHighlight)
    it('移除高亮用户', testRemoveHighlight)
    it('显示高亮用户列表', testShowHighlight)
    it('新增注视用户', testAddFocus)
    it('移除注视用户', testRemoveFocus)
    it('显示注视用户列表', testShowFocus)
})