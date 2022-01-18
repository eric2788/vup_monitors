const { default: axios } = require('axios')

const VERSION = '0.1.7'

const updaterApi = axios.create({
    baseURL: 'https://api.github.com/repos/eric2788/vup_monitors',
    timeout: 5000
})

console.log(`目前版本 v${VERSION}`)

async function checkUpdate(){
    try {
        console.log(`正在检查更新...`)
        const res = await getLatestVersion()
        if (res.prerelease) return
        const v = res.tag_name
        if (v <= VERSION) return
        console.log(`有可用的更新版本: ${v}`)
        console.log(`请自行到 https://github.com/eric2788/vup_monitors/releases 下载`)
    }catch(err){
        console.warn(`检查更新时出现错误: ${err}`)
    }
}

async function getLatestVersion(){
    const res = await updaterApi.get('/releases/latest')
    return res.data
}

module.exports = {
    checkUpdate,
    getLatestVersion,
    VERSION
}