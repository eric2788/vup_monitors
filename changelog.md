 .zip 內有 window 和 linux 的點擊運行程序
如欲無需 node 環境，可以下載 zip 直接打開程序運行

### 更新

- 修復高亮列表顯示 Object object 而不是用戶名稱
- 新增設定是否顯示詳細列表
- 新增注视用户详细列表名单
- 新增大航海用户捕捉
- 新增 debug 模式設定

### settings.json 模版参考

若果旧版本没有，请自行手动添加新设定属性

```json
{
    "bot": {
        "http": "http://127.0.0.1:5700",
        "ws": "ws://127.0.0.1:6700"
    },
    "redis": {
        "host": "127.0.0.1",
        "port": 6379,
        "database": 0
    },
    "websocket": {
        "host": "blive.ericlamm.xyz",
        "use-tls": true
    },
    "source": "websocket",
    "owners": [],
    "enable_live_broadcast": false,
    "show_cover": true,
    "show_gift_danmu": false,
    "auto_check_update": true,
    "show_detail_list": true,
    "debug_mode": false
}
```



