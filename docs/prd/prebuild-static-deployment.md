# PRD: 予約・播種アプリの事前ビルド静的配信化（CDN自動更新による障害の恒久対応）

- **ステータス**: 実装済み・レビュー中（PR #9）
- **作成日**: 2026-06-22
- **関連**: 障害調査レポート `docs/incident-mea-seeding-blank-page.md` / 暫定対応 PR #7 / レポート訂正 PR #8 / 恒久対応 PR #9

---

## 1. 背景 / 課題

LaRC マニュアルサイトの「MEA予約」「播種量管理」ページは、JSX を**ブラウザ実行時に Babel で変換**し、React・Tailwind・Firebase を**実行時に外部CDNから読み込む**構成だった。`@babel/standalone` をバージョン未固定（`latest`）で読み込んでいたため、**2026-06-16 の Babel 8.0.0 公開**でCDNが自動的に8系を配信し始め、JSXのデフォルトruntime変更により `import` 文を含むコードが生成され、実行時エラーで**両ページが白画面化**した。

暫定対応（PR #7）で Babel を `@7.26.4` にピン留めして復旧したが、`cdn.tailwindcss.com` など**バージョン未固定のCDNが残存**しており、同種の「外部依存の勝手な更新による破損」が再発しうる。**根本原因は実行時の外部依存**にあるため、恒久対応が必要。

## 2. 目的（Goals）

- 実行時の外部CDN依存と実行時Babel変換を**排除**し、CDN自動更新起因の障害を**根絶**する。
- 依存をビルド時にバンドルして同梱し、**再現可能・バージョン固定**のデプロイにする。
- `main` への push で**自動ビルド・自動デプロイ**されるパイプラインを整備する。

## 3. 非目的（Non-Goals）

- 機能追加・UI変更・Firebaseスキーマ変更（**アプリの挙動は現状維持**）。
- 認証方式やデータモデルの変更。
- マニュアル本体（バニラJS）の再実装。

## 4. 要件

### 機能要件
- **FR-1**: 3ページ（マニュアル本体／MEA予約／播種量管理）が従来どおり表示・動作する。
- **FR-2**: 予約・播種アプリで、Firebase 匿名認証・データの表示・登録・削除が従来どおり動作する。
- **FR-3**: 既存のページURL・ファイル名（`reservation_app.html` / `seeding_app.html`）を**変更しない**（リンク・ブックマーク・APIキーのリファラ制限を維持）。

### 非機能要件
- **NFR-1**: 実行時に外部CDNへ依存しない（依存はビルド成果物に同梱）。
- **NFR-2**: 依存はバージョン固定（`package-lock.json`）で再現可能ビルド。
- **NFR-3**: `main` への push で自動デプロイ（手動ビルド・手動アップロード不要）。
- **NFR-4**: GitHub Pages のサブパス配信（`/LaRC-manual_2/`）で正しくアセット解決される。

## 5. 解決方針

**Vite マルチページ + GitHub Actions による事前ビルド静的配信**へ移行。

- React/Firebase/Tailwind を npm 依存化し、`<script type="text/babel">` を `src/{reservation,seeding}/main.jsx` へ移植。コンポーネントのロジックは現状維持し、元の `window.*` 連携はバンドル内シムで再現（移行リスク最小化）。
- 各 `*_app.html` は CDN/Babel/モジュールscriptを除去し、`<script type="module">` の entry に簡素化。
- Tailwind は実行時CDN → ビルド時（PostCSS）へ。
- マニュアル本体（`manual_data.js` / `script.js` / `style.css`）は `public/` へ移し挙動維持。
- `.github/workflows/deploy.yml` で push→`npm ci`→`npm run build`→Pages デプロイ。

詳細な実装計画は承認済みプラン（Vite マルチページ化）に準拠。

## 6. 成功基準

- ビルド成果物（`dist/`）に外部CDNへの実行時参照が**存在しない**。
- 3ページが本番（`https://redfieldf.github.io/LaRC-manual_2/`）で正常表示・動作する。
- DevTools コンソールに実行時Babel/CDNの警告・エラーが出ない。
- `main` push で Actions が成功し自動公開される。

## 7. リスクと緩和

| リスク | 緩和策 |
|---|---|
| サブパス `base` 設定漏れでアセット404 | `vite.config.js` に `base:'/LaRC-manual_2/'` を設定済み・ビルド成果物で確認済み |
| Pages 配信方式の切替忘れ | マージ後に Source を「GitHub Actions」へ変更する手順を PR/README に明記 |
| ローカルで認証不可（リファラ制限） | UIマウントまでローカル確認、認証・データは本番で確認（必要時 `localhost` を一時許可） |
| 貢献フローの変化（直編集では反映されない） | README に開発・デプロイ手順を追記 |

## 8. ロールアウト

1. PR #9 をマージ。
2. **Settings → Pages → Source を「GitHub Actions」に変更**（一度だけ・必須）。
3. Actions の成功を確認し、本番で FR-1〜FR-3 を検証。
4. 問題があれば旧 legacy 配信（ブランチ/ルート）へ即時切り戻し可能。

## 9. 検証

- ローカル: `npm ci && npm run build && npm run preview`、Playwright で3ページの描画と `import statement` エラー消失を確認（実施済み）。
- 本番: マージ・Source切替後に認証・予約データ表示・登録/削除を確認（マージ後）。
