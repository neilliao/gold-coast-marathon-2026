# Gold Coast Marathon 2026

Neil 2026 澳洲黃金海岸馬拉松旅行的公開紀錄網站。純靜態 HTML / CSS / JS，無框架、無 build step，可直接放 GitHub Pages。

## 用途

1. 出發前與旅行中：手機友善的行程查詢工具。
2. 旅行中與回來後：個人旅行、跑步與馬拉松紀錄。

## 結構

```
gold-coast-marathon-2026/
├── index.html        首頁（主視覺、快速入口、重點、天氣搶先看）
├── itinerary.html    每日行程時間軸
├── intel.html        行前情報（航班 / 飯店 / 景點 / 購物 / 天氣）
├── race.html         馬拉松（賽前準備 + 賽後回顧）
├── journal.html      旅行日誌
├── gallery.html      照片牆
├── checklist.html    出發清單
├── budget.html       財務（只放分類總額）
└── assets/
    ├── data.js       ★ 所有內容的單一資料來源（編輯這裡）
    ├── styles.css    視覺系統與響應式版面
    ├── app.js        渲染、天氣 API、互動
    └── photos/       旅行照片
```

## 怎麼維護（只動 `assets/data.js`）

- **改行程 / 飯店 / 情報**：直接編輯 `data.js` 對應物件。
- **寫日誌**：填 `journal` 裡每天的 `title / mood / body / oneThing`。
- **補成績**：填 `race.result` 的 `finishTime / placing / reflection`。
- **放照片**：照片丟進 `assets/photos/`，到 `gallery` 對應分類補 `photos: [{ file, alt }]`。
- **記財務**：只填 `budget.categories` 的分類 `amount`（總額），不要放逐筆明細。

不需要任何安裝或編譯，存檔重新整理瀏覽器即可。

## 公開安全原則

公開頁**只放低敏資訊**。以下一律不放：

- 領隊完整電話、房號
- 護照 / 簽證 / 身分證 / 帳戶 / 信用卡 / 發票
- 每筆消費明細
- PDF 內任何可能涉及個資或私人備忘的內容

有用但不適合公開的，用 `PRIVATE_NOTE` 提示「詳細聯絡資訊請看私人備忘或原始 PDF」。

## 天氣

`app.js` 使用 [Open-Meteo](https://open-meteo.com/) 免金鑰 API 即時查詢；超出可查日期顯示「待更新」。API 取不到時，會用 `data.js` 裡的研究快照墊底。

## 本機預覽

直接用瀏覽器開 `index.html` 即可。若要模擬伺服器環境：

```bash
cd projects/gold-coast-marathon-2026
python3 -m http.server 8080
# 開 http://localhost:8080
```

## 部署到 GitHub Pages

1. 把這個資料夾做成（或推進）一個 GitHub repo。
2. Settings → Pages → Source 選 `main` 分支根目錄。
3. 等幾分鐘，網址就會生效。`.nojekyll` 已內含，避免 Jekyll 處理。
