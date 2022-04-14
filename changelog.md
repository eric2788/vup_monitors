 .zip 內有 window 和 linux 的點擊運行程序
如欲無需 node 環境，可以下載 zip 直接打開程序運行

### 更新

- 可设定是否过滤抽奖和红包弹幕
- 新增表情包发送
- 更详细的 logging, 並设有档案记录 /logs/
- 新增每天自动检查 (只在黑窗回报)
- 新增顯示列表時順帶顯示用戶名稱(列表內的需要重新添加才能生效) (開播時刷新)

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
}
```



