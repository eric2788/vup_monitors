const { default: axios } = require('axios')
const semver = require('semver');

const VERSION = '0.1.13'

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
        if (!semver.gt(v, VERSION)){
            console.log(`当前已是最新版本。`)
            return
        }
        console.warn(`有可用的更新版本: ${v}`)
        console.warn(`请自行到 https://github.com/eric2788/vup_monitors/releases 下载`)
    }catch(err){
        console.error(`检查更新时出现错误: ${err}`)
    }
}

async function getLatestVersion(){
    const res = await updaterApi.get('/releases/latest')
    return res.data
}

let checkUpdateInterval = -1;

function autoCheckUpdate(){
    if (checkUpdateInterval !== -1) return
    checkUpdateInterval = setInterval(checkUpdate, 1000 * 60 * 60 * 24)
}

module.exports = {
    checkUpdate,
    getLatestVersion,
    autoCheckUpdate,
    VERSION
}