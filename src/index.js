const initLogger = require('./el/logger')
initLogger()

const { ws, http } = require('./bot')
const db = require('./el/cachedb')

const onCommand = require('./command_listener')
const messager = require('./el/api/message-source')
const updater = require('./el/updater')

async function executeCommands(data) {
  try {
    await onCommand({ data, ws, http })
  } catch (err) {
    console.warn(`执行指令时出现错误: ${err?.message}`)
    console.debug(err.stack)
  }
}

const { owners, accept_gadmin_command, auto_check_update } = require('./el/data-storer').settings
console.log(`已设置管理员QQ号: ${owners}。`)
if (accept_gadmin_command) {
  console.log(`群管和管理员都可使用指令。`)
} else {
  console.log(`仅管理员可使用指令。`)
}

// 同时启动 Redis 和 WS 监控
console.log('正在启动 vup monitors...')
Promise.all([ws.startWS(), messager.connect(), db.initDB(), updater.checkUpdate()])
  .then(() => {
    ws.setListener(data => {
      if (process.env.NODE_ENV === 'development') {
        console.log(data)
      }
      executeCommands(data)
    })

    if (auto_check_update){
      updater.autoCheckUpdate()
    }

  })
  .catch(err => {
    console.error('启动程序时错误: ')
    console.error(err.stack)
  })