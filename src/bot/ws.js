const WebSocket = require('ws')
const config = require('../config')
const { bot } = require('../el/data-storer').settings
const { sleep } = require('../el/utils')


async function connect(){
  const ws = new WebSocket(bot.ws)

  return new Promise((res, rej) => {
    ws.on('error', err => {
      console.warn(`连接 go-cqhttp 时出现错误: ${err?.message ?? err}`)
      rej(err)
    })

    ws.on('open', () => {
      console.log(`go-cqhttp 连接成功。`)
      res(ws)
    })
  })
}

let ws = undefined
let callback = (data) => {}

async function startWS(){
  try {
    ws = await connect()
    ws.on('close', err => {
      console.warn(`go-cqhttp WebSocket 意外关闭，重连中...`)
      startWS()
    })
    ws.on('error', err => {
      console.warn(`连接 go-cqhttp 时出现错误: ${err?.message ?? err}，重连中`)
      startWS()
    })
    ws.on('message', data => {
      try {
        callback(JSON.parse(data))
      } catch (e) {
        console.error(e)
      }
    })
    return ws
  }catch(err){
    console.warn('五秒后重连...')
    await sleep(5000)
    await startWS()
  }
}

function setListener(listener){
  callback = listener
}

module.exports = {
  startWS,
  send(action, params) {
    if (!ws) {
      console.warn(`WS 尚未连接，已略过。`)
      return
    }
    ws.send(JSON.stringify({ action, params }))
  },
  setListener
}
