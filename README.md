# 地盤結構巡查 iPad PWA (Site Inspection v2.0 — HD Appendix X)

專為 iPad 離線現場巡查設計的漸進式網頁應用程式（PWA），內置房屋署屋邨管理處 **SUMMARY REPORT OF STRUCTURAL INSPECTION (Appendix X)** 評級表。所有巡查紀錄與相片均儲存在本機 IndexedDB，不會上傳至任何伺服器。

## v2.0 升級重點
- **內置 HD Appendix X 結構巡查表**：涵蓋 DMO、Estate、Inspected Structure、Handover Date、1.1–4.3 共 14 項（1–5 / N.A. 觸控評級）、5.1 Remarks 及 SE / SSE 簽署欄。
- **評級 4–5 自動警示**：任何項目選取 4 (Poor) 或 5 (Severe) 時，自動標記「需 SSE 關注」並提示於 Remarks 詳述。
- **一鍵列印 Appendix X 摘要報告**：於紀錄內直接生成正式排版報告，支援 iPad 列印或儲存為 PDF。
- **GPS 預熱與地圖手動補位**：開新紀錄自動背景預熱 GPS，並支援直接於地圖點選坐標補錄。
- **相片獨立備註與單條／日期篩選匯出**：支援單條紀錄匯出或按日期區間打包 ZIP（含 Excel、CSV、JSON 備份及相片），並支援匯入 `backup.json` 還原。
- **Network-First Service Worker**：部署至 GitHub Pages 後，有網時自動拉取最新版本，無網時完整離線使用。

## 部署到 GitHub Pages（3 步）
1. 建立新的 GitHub Repository，將本資料夾內**所有檔案與子資料夾**直接上傳至 Repo 根目錄（確保 `index.html`、`.nojekyll`、`sw.js` 在最外層）。
2. 前往 Repo 的 **Settings → Pages → Build and deployment → Source: Deploy from a branch**，選擇 `main` 及 `/ (root)` 並儲存。
3. 等待約 1 分鐘取得 HTTPS 網址後，使用 iPad **Safari** 開啟並點選「分享 → 加入主畫面」即可離線使用。
