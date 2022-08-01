const { CommandExecutor } = require('./el/types')

// commands
const blive = require('./commands/blive')
const highlights = require('./commands/highlights')
const focus = require('./commands/focus')
const checkUpdate = require('./commands/check_update')

// ws handles
const danmaku_msg = require('./ws_handles/danmaku_msg')
const room_enter = require('./ws_handles/room_enter')
const superchat_msg = require('./ws_handles/superchat_msg')
const entry_effect = require('./ws_handles/entry_effect')
const live_broadcast = require('./ws_handles/live_broadcast')
const live_end = require('./ws_handles/live_end')

class Help extends CommandExecutor {

  async execute({ send, data }, args) {

      await send(`可用指令: ${Object.keys(module.exports.commands).map(s => `!${s}`)}`)

  }
}


module.exports = {
  commands: {
    'B站直播': blive,
    'room': blive,
    '高亮': highlights,
    'user': highlights,
    '注视': focus,
    'focus': focus,
    'help': Help,
    '检查更新': checkUpdate 
  },
  ws_handles: {
    'DANMAKU_MSG': danmaku_msg,
    'SUPER_CHAT_MESSAGE': superchat_msg,
    'INTERACT_WORD': room_enter,
    'ENTRY_EFFECT': entry_effect,
    'LIVE': live_broadcast,
    'PREPARING': live_end
  }
}
