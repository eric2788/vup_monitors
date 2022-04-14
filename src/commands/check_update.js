const { CommandExecutor } = require("../el/types");
const { getLatestVersion, VERSION } = require('../el/updater')

class CheckUpdate extends CommandExecutor {

    async execute({ send, data }, args){
        try {
            await send(`正在检查更新...`)
            const res = await getLatestVersion()
            const v = res.tag_name
            if (v <= VERSION) {
                await send(`当前已是最新版本。`)
                return
            }
            const msg = [
                `有可用的新版本: ${v} (${res.prerelease ? '测试版本' : '正式版本'})`,
                `请自行到 https://github.com/eric2788/vup_monitors/releases 下载`
            ]
            await send(msg)
        }catch(err){
            await send(`检查更新时出现错误: ${err}`)
        }
    }
}

module.exports = CheckUpdate