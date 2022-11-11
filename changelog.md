 .zip 內有 window 和 linux 的點擊運行程序
如欲無需 node 環境，可以下載 zip 直接打開程序運行

### 更新

- 修复高亮及注视用户因为B站API反爬虫而无法添加(显示找不到用户)
- 新增設定是否接受群管使用指令
- 新增設定是否显示表情包弹幕
- 现在高亮弹幕提示会过滤同传弹幕
- 新增支持不同ID以支援多个实例

### settings.json 模版参考

若果旧版本没有，请自行手动添加新设定属性

```json
{
    // go-cqhttp 相关
    "bot": {
        "http": "http://127.0.0.1:5700",
        "ws": "ws://127.0.0.1:6700"
    },
    // redis 作为数据源，如果你是用 websocket, 可无视
    "redis": {
        "host": "127.0.0.1",
        "port": 6379,
        "database": 0
    },
    // websocket 数据源
    // 使用 blive.ericlamm.xyz 可贡献统计数据
    "websocket": {
        "id": "vup_monitors", // 支持不同ID以支援多个实例
        "host": "blive.ericlamm.xyz",
        "use-tls": true
    },
    "source": "websocket", // 数据源选择 websocket, redis
    "owners": [], // 管理员 QQ 号，列表内的 qq 号可绕过房管限制
    "accept_gadmin_command": true, // 是否接受群管使用指令
    "enable_live_broadcast": false, // 启用开播通知
    "show_cover": true, // 开播通知时是否显示封面
    "show_gift_danmu": false, // 是否显示礼物弹幕
    "show_image_danmu": true, // 是否显示表情包弹幕
    "auto_check_update": true, // 是否自动每天检查更新
    "show_detail_list": true, // 显示高亮/直播/注视列表时是否顺带显示用户名称(需要更多时间刷取)
    "debug_mode": false // 是否啟用 debug 模式
}
```



