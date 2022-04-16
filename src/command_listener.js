const { invoke } = require('./el/command-manager')
const { owners } = require('./el/data-storer').settings
const { commands } = require('./config')

module.exports = async({data, ws, http}) => {
    if (!data.message) return
    if (data.message[0] !== '!') return // 指令用 ! 开头

    const is_group = data.message_type === 'group'

    const isAdmin = is_group ? data.sender.role === 'admin' : false
    const insideOwners = owners && owners.includes(data.sender.user_id)

    if (!isAdmin && !insideOwners){
        // maybe say something for no permission
        console.log(`用户 ${data.sender.nickname} 没有权限去执行指令，已略过`)
        return // no permission
    }

    const msg = data.message.substring(1).trim()
    const command = msg.split(' ')
    const [cmd, ...args] = command

    const actions = { data, commands }

    if (is_group) {
        actions.send = async (msg) => await context_send(ws, data, msg)
    }else{
        actions.send = async (msg) => await context_send_private(ws, data, msg)
    }

    try {
        console.debug(`正在处理 ${is_group ? '群' : '私聊'} 指令: ${cmd}, 参数: ${args}`)
        await invoke(actions, cmd, args)
    }catch(err){
        console.warn('执行指令时出现错误: '+err)
    }
}

async function context_send(context, data, msg) {
    await context.send('send_group_msg', { // i can await a non async function
        group_id: data.group_id,
        message: [
          {
            type: 'reply',
            data: {
              id: data.message_id
            }
          },
          {
              type: 'text',
              data: { text: msg }
          }
        ]
    })
}


async function context_send_private(context, data, msg) {
    await context.send('send_private_msg', { // i can await a non async function
        user_id: data.sender.user_id,
        message: [
          {
            type: 'reply',
            data: {
              id: data.message_id
            }
          },
          {
              type: 'text',
              data: { text: msg }
          }
        ]
    })
}