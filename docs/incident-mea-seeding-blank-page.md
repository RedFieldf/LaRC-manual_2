# 障害調査レポート: MEA予約ページ・播種管理が開かない（真っ白）

- **調査日**: 2026-06-22
- **対象ページ**: `reservation_app.html`（MEA予約） / `seeding_app.html`（播種量管理）
- **症状**: `index.html` のボタンから遷移すると画面が真っ白。手順マニュアル本体は正常。
- **アクセス経路**: `https://redfieldf.github.io/LaRC-manual_2/`（GitHub Pages）

---

## 結論（根本原因）

`@babel/standalone` を **バージョン未固定** で読み込んでおり、CDN が自動的に **Babel 8（8.0.2）** を返すようになったことが原因。

両アプリは JSX をブラウザ実行時に Babel で変換しているが、**Babel 8 で JSX のデフォルト runtime が `classic` → `automatic` に変更**された。その結果、変換後コードに `import` 文が含まれるようになり、通常の `<script>`（非module）として注入される際に実行時エラーとなって React がマウントできず、画面が真っ白になる。

### 該当コード

```html
<!-- reservation_app.html:19 / seeding_app.html:19 -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

このURLは現在 `@babel/standalone@8.0.2` にリダイレクトされる（実測確認済み）。アプリ作成時（2025年3月）は Babel 7 系だった。

### Babel 7 と 8 の変換結果の差（実測）

| バージョン | 生成コード | `import` |
|---|---|---|
| Babel 7.26.4 | `React.createElement(...)` | なし ✅ |
| Babel 8.0.2 | `import { jsx as _jsx } from "react/jsx-runtime"; _jsx(...)` | **あり** ❌ |

`<script type="text/babel">` の変換結果は通常の `<script>`（`type="module"` ではない）として DOM に注入されるため、Babel 8 が出力する `import` 文が実行時に失敗する。

### 再現したエラー（Playwright でライブページを描画）

```
#root length: 0 | empty: true
[PAGEERROR] Failed to execute 'appendChild' on 'Node':
            Cannot use import statement outside a module
```

→ React が一度もマウントされず `#root` が空のまま＝真っ白。`index.html`（手順マニュアル本体）は Babel/React を使わないため影響を受けず、「この2ページだけ開かない」という症状と完全に一致する。

---

## 切り分け結果（正常を確認した項目）

| 確認項目 | 結果 |
|---|---|
| `reservation_app.html` / `seeding_app.html` の存在 | ✅ あり（2025-03以降コード未変更） |
| GitHub Pages 配信（HTTPステータス） | ✅ 200（404ではない） |
| ライブ版とローカル版の差分 | ✅ 完全一致 |
| CDN依存（React / Tailwind / Firebase） | ✅ 全て200 |
| Firebase 匿名認証（`redfieldf.github.io` から） | ✅ 成功 |
| Firestore 読み取り（同上） | ✅ 予約データ取得OK（最新 2025-12-02） |
| **Babel（`@babel/standalone` 未固定）** | ❌ **Babel 8 自動更新が原因** |

補足: Firestore 上の予約データが 2025-12-02 で止まっており、`@babel/standalone` 8.x のリリース時期と整合する。

---

## 修正方針（推奨: Babel 7 にバージョン固定）

両ファイルの該当行（各19行目）を以下に変更する。

### Before
```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

### After
```html
<script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"></script>
```

- 対象: `reservation_app.html` / `seeding_app.html`
- 効果: `classic` runtime（`React.createElement`）に戻り、`import` を出力しなくなる。
- リスク: 最小（1行 × 2ファイル）。既存アーキテクチャを維持。
- 検証: 修正後に Playwright で両ページを再描画し、`#root` が描画され `pageerror` が出ないことを確認する。

### 補足: 他のCDNもバージョン固定を推奨
今回と同種の「CDN自動更新による突然の破損」を防ぐため、未固定のCDN（`https://cdn.tailwindcss.com` など）もバージョン固定するのが望ましい。

### 中長期的な改善（任意）
ブラウザ実行時 Babel 変換は本番非推奨（Babel/Tailwind 自身も警告を出力）。将来的には JSX を事前ビルドして静的配信する構成への移行を検討するとよい。
