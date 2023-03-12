# Vup Monitors

基于 go-cqhttp 和 nodejs 的 Vups 直播间监控机器人，支持多群使用和私人广播

![showcase](/assets/dd_showcase.png)

#### 目前支持监控的DD行为

- 进入直播间
- 发送SC
- 发送弹幕
- 开播通知(需要在设定中启用)
- 上舰
- 送礼

## 前置

- [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/) (QQ机器人)
- [biligo-live-ws](https://github.com/eric2788/biligo-live-ws) (B站直播间 WS 监控)(可选)

## 启动

### go-cqhttp

- 在 https://github.com/Mrs4s/go-cqhttp/releases 下载对应平台的可执行文件

- 运行 `go-cqhttp`, 根据提示填写 QQ 号和密码等信息, 参考文档 https://docs.go-cqhttp.org/guide/quick_start.html

- 启用正向 Websocket (这点很重要，不然之后无法连接到 go-cqhttp)

### biligo-live-ws

#### 使用自架

- 在 https://github.com/eric2788/biligo-live-ws/releases 下载对应平台的可执行文件

- 运行程序

#### 不使用自架

- 到 https://github.com/eric2788/biligo-live-ws 查看公共API地址


### 本项目 (Vup_monitors)

- 到 `releases` 下载对应平台的可执行文件

- 运行程序后关闭

- 到 `data/settings.json` 填入设定，包括
    - 设定数据源 `source` 为 `websocket`
    - websocket 中 填入你自架的 biligo-live-ws 或使用 公共API地址 (如果使用公共API，则需要 `use-tls: true`)
    - 在管理员 `owners` 的设定中添加你的 QQ 号
    - 填入你在 go-cqhttp 中启用正向 Websocket 的端口 (如非6700)

- 再运行程序

- 开始通过指令设定监控和高亮


#### 除了 biligo-live-ws 以外的运行方式

- [blive-redis-server](https://github.com/eric2788/blive-redis-server) + [redis](https://www.redis.com.cn/redis-installation.html) 服务器 (比较麻烦)

    运行 blive-redis-server 和 redis，然后在 `data/settings.json` 设定数据源为 `redis` 即可 

## 指令

`<>` 为必填参数， `[]` 为选填参数

**真正填入参数时不需要加引号**


### v0.1.13 追加频道广播

指令输入与先前相同，但将会检测群id格式:
(有-则为频道，无-则为群聊)

频道号格式如下
``频道号-子频道号``

注意： 你无法在频道使用指令，请在私聊连带群id(根据频道号格式)输入指令

### !B站直播

B站直播WS讯息监控指令

- `!B站直播 监控 <房间号>` - 监听房间
- `!B站直播 中止 <房间号>` - 中止监听房间
- `!B站直播 监听中` - 获取正在监听中的房间号列表

### !高亮名单

控制高亮名单用户，以进行广播

```log
- 如果在群使用指令，则会添加/删除到该群所属的高亮用户名单
- 如果在私聊使用且附上`[群id]`，则会添加/删除该群id所属的高亮用户名单
- 如果在私聊使用而不附上`[群id]`，则会添加/删除属于你自己的高亮用户名单
```

- `!高亮 新增 <用户id> [群id]` - 新增用户到高亮名单
- `!高亮 移除 <用户id> [群id]` - 删除用户到高亮名单
- `!高亮 列表 [群id]` - 显示高亮用户名单列表

**高亮名单会分开群/频道号和QQ号，只有在私聊才会接受 `[群id]` 作为参数以私下设置群高亮名单，如不填则为属于该QQ号的高亮名单**

### !注视名单

通过设置群注视名单，可以在广播时限制仅限在注视用户的直播间内/注视用户本人的所有DD行为。

```log
- 由于注视用户不支持私聊，因此在私聊使用此指令时必须添加群id
- 如果在群添加注视用户，则无需填入群id，并以该群作为添加/删除对象
```

- `!注视 新增 <用户id> <群id(如私聊)>` - 新增该群注视用户
- `!注视 移除 <用户id> <群id(如私聊)>` - 移除该群注视用户
- `!注视 列表 <用户id> <群id(如私聊)>` - 查看该群所属注视用户名单

添加注视用户后，广播规则将如下

| 高亮用户 | 直播间 | 广播 |
| ------- | ----- | ----- |
| 在注视名单内 | 不在注视名单内 | ✔ |
| 不在注视名单内 | 不在注视名单内 | ✖ |
| 不在注视名单内 | 在注视名单内 | ✔ |
| 在注视名单内 | 在注视名单内 | ✔ |

如果没有注视用户，则默认广播所有高亮用户在监控中的直播间的DD行为。

### !检查更新

检查是否有新版本 (每次启动也会检查一次)

## 设定

设定可到 `data/settings.json` 中查看，参考如下:

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
        "id": "vup_monitors", // 辨识ID，详见下面“多实例使用”部分
        "host": "blive.ericlamm.xyz",
        "use-tls": true
    },
    "source": "websocket", // 数据源选择 websocket, redis
    "owners": [], // 管理员QQ号，列表内的QQ号可绕过房管限制
    "identifier": "", // 多实例识别符，详见下面“多实例使用”部分
    "accept_gadmin_command": true, // 是否接受群管使用指令
    "enable_live_broadcast": false, // 启用开播通知
    "show_cover": true, // 开播通知时是否显示封面
    "show_gift_danmu": false, // 是否显示礼物弹幕
    "show_image_danmu": true, // 是否显示表情包弹幕
    "auto_check_update": true, // 是否自动每天检查更新
    "show_detail_list": true, // 显示高亮/直播/注视列表时是否顺带显示用户名称(需要更多时间刷取)
    "debug_mode": false, // 是否启用 debug 模式
    "disabled_commands": [ // 禁用的广播
        // "DANMU_MSG", // 弹幕消息
        // "SEND_GIFT", // 赠送礼物
        // "USER_TOAST_MSG", // 上舰
        // "SUPER_CHAT_MESSAGE", // 发送SC
        // "ENTRY_EFFECT", // 大航海用户进入直播间
        // "INTERACT_WORD", // 进入直播间
        // "LIVE", // 开播
    ], 
}
```

### 多实例使用

分为两种场景：多实例共用同一个biligo-live-ws实例，以及多实例共用同一个go-cqhttp

#### 共用同一个biligo-live-ws
根据 [biligo-live-ws的说明](https://github.com/eric2788/biligo-live-ws#使用方式) ，同一IP下的实例需要配置不同的辨识ID以避免混淆

因此如果要在同一IP下部署多个实例同时使用同一个biligo-live-ws作为数据源，则应在设置中为每个实例指定不同的辨识ID（不指定时默认为vup_monitors）

#### 共用同一个go-cqhttp
多个实例共用同一个go-cqhttp时，因为前端的QQ号码是同一个，因此会同时响应命令，造成使用上的困难

此时应在设置中为每个实例指定不同的多实例识别符，配置后bot将只响应以``#[多实例识别符]``结尾的命令，以此达到准确控制特定实例的效果

此时命令形式将变为形如`!B站直播 监听中 #abc`的格式，具体逻辑如下

| 多实例识别符 | 命令 | 响应 |
| ------- | ----- | ----- |
| 未配置 | 不带# | ✔ |
| 未配置 | 带有# | ✖ |
| 配置为abc | 不带# | ✖ |
| 配置为abc | 以#abc结束 | ✔ |
| 配置为abc | 以#xyz结束 | ✖ |


## 统计数据

使用了 ``https://blive.ericlamm.xyz`` 作为 公共API地址 的机器人都可以贡献统计数据。

统计数据网站: [ddstats.ericlamm.xyz](https://ddstats.ericlamm.xyz)

## 其他部署方式

### Docker

详见 Dockerfile 或 查看 [`docker.io/eric1008818/vup_monitors`](https://hub.docker.com/r/eric1008818/vup-monitors)

## 鸣谢

[go-cqhttp/node](https://github.com/go-cqhttp/node)
