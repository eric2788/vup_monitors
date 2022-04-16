const { CommandExecutor } = require('./el/types')

// commands
const blive = require('./commands/blive')
const highlights = require('./commands/highlights')
const focus = require('./commands/focus')
const checkUpdate = require('./commands/check_update')

// ws handles
const danmu_msg = require('./ws_handles/dammu_msg')
const room_enter = require('./ws_handles/room_enter')
const superchat_msg = require('./ws_handles/superchat_msg')
const live_broadcast = require('./ws_handles/live_broadcast')
const live_end = require('./ws_handles/live_end')
const entry_effect = require('./ws_handles/entry_effect')

class Help extends CommandExecutor {

  async execute({ send, data }, args) {

      await send(`可用指令: ${Object.keys(module.exports.commands).map(s => `!${s}`)}`)

  }
}


module.exports = {
  commands: {
    'B站直播': blive,
    '高亮': highlights,
    '注视': focus,
    'help': Help,
    '检查更新': checkUpdate 
  },
  ws_handles: {
    'DANMU_MSG': danmu_msg,
    'LIVE': live_broadcast,
    'PREPARING': live_end,
    'SUPER_CHAT_MESSAGE': superchat_msg,
    'INTERACT_WORD': room_enter,
    'ENTRY_EFFECT': entry_effect
  }
}
