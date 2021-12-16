 .zip 內有 window 和 linux 的點擊運行程序
如欲無需 node 環境，可以下載 zip 直接打開程序運行

### 更新

- 新增 go-cqhttp 自動重連機制。(之前因為沒有重連機制，在 go-cqhttp 重啟之後整個 vup_monitors 程序會失效直到重新啟動。)

- 縮小 Docker Image 佔用空間 (500MB -> 154MB)

