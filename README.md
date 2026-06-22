# LaRC マニュアル

研究室マニュアル＋MEA予約／播種量管理アプリの静的サイト。
GitHub Actions でビルドし、GitHub Pages（`https://redfieldf.github.io/LaRC-manual_2/`）へ自動デプロイされます。

## 構成

| パス | 内容 |
|---|---|
| `index.html` + `public/{manual_data.js,script.js,style.css}` | 手順マニュアル本体（バニラJS） |
| `reservation_app.html` + `src/reservation/main.jsx` | MEA予約アプリ（React + Firebase） |
| `seeding_app.html` + `src/seeding/main.jsx` | 播種量管理アプリ（React + Firebase） |
| `src/index.css` | Tailwind エントリ |

React / Firebase / Tailwind はビルド時にバンドルされ、**実行時に外部CDNへ依存しません**（CDN自動更新による破損を防止）。

## 開発

```bash
npm install      # 初回のみ
npm run dev      # 開発サーバ（http://localhost:5173/LaRC-manual_2/）
npm run build    # 本番ビルド → dist/
npm run preview  # ビルド結果をローカル確認
```

> Firebase の API キーはリファラ制限により `redfieldf.github.io` のみ許可。
> ローカル開発では認証が通らないため、認証・データ取得は本番で確認してください
> （必要なら Google Cloud のAPIキー許可リストに `localhost` を一時追加）。

## デプロイ

`main` への push で `.github/workflows/deploy.yml` が自動実行され、`dist/` が Pages へ公開されます。
**HTML を直接編集して push しても、ビルドを通さないと反映されません。**
