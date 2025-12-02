/* * 細胞班マニュアル コンテンツデータ
 * * 【書き方のルール】
 * type: 'note'      -> 黄色のポイント枠
 * type: 'warning'   -> 赤色の警告枠
 * type: 'sub-title' -> 緑色の小見出し
 * type: 'step'      -> 番号付きの手順リスト
 * type: 'text'      -> 普通の文章（HTMLタグ使用可能）
 * type: 'code'      -> コピー用のグレー枠
 * type: 'link'      -> ボタン形式のリンク
 */

const manuals = {
    // =================================================================
    // A. 試薬・物品管理
    // =================================================================

    // --- 溶液や備品の発注方法 ---
    "p-order-method": {
        title: "溶液や備品の発注方法",
        content: [
            {
                type: 'note',
                title: '連絡先',
                text: '金子研グループLINEにて、下記の形式で連絡してください。<br>誰でも気軽に連絡してOKです！'
            },
            { type: 'sub-title', text: 'メッセージのテンプレート' },
            {
                type: 'code',
                text: `@秋山 浩一朗\n【見積もり依頼】\n・スタンダードチップ -1000μl　バルク(1000本入), 111Q, QSP製, 2袋`
            },
            {
                type: 'text',
                text: '上記をコピーして、商品名や発注数を書き換えて送信してください。<br><strong>ポイント：<br>・見積依頼担当をメンション<br>・【見積もり依頼】<br>・発注を希望するものの情報</strong>'
            }
        ]
    },

    // --- 卵の受取・孵卵器投入 ---
    "p-egg-receipt": {
        title: "卵の受取・孵卵器投入",
        content: [
            {
                type: 'note',
                title: '実施日時',
                text: '毎週月曜日 11:00 ごろ<br>翌週使用分の卵を投入します。'
            },
            {
                type: 'step',
                list: [
                    { title: "学務課へ受取に行く", sub: "入口はケヤキ門側の外から入る。<br>学務課が閉室している日は、9時過ぎごろに配達員さんから直接受け取ります。" },
                    { title: "開封・検品", sub: "破損がないか、1個 1個 確認。" },
                    { title: "卵に書き込み", sub: "破損のない卵について、番号と投入日を記入。" },
                    { title: "記録", sub: "印刷された紙の「孵卵器管理シート」に書かれた項目に沿って記録。<br>シートが切れた場合は印刷しましょう。" }
                ]
            },
            {
                type: 'link',
                url: 'https://drive.google.com/file/d/1zkmnv6RSpbHlguUltFS8ippLsHmUvNft/view?usp=sharing',
                icon: 'fa-file-pdf',
                text: '孵卵器管理シート'
            }
        ]
    },

    // --- DMEM ＋ P/S ＋ FBS ---
    "p-dmem-fbs": {
        title: "DMEM ＋ P/S ＋ FBS",
        content: [
            {
                type: 'step',
                list: [
                    { title: "冷凍庫から分注済の「P/S」と「FBS」を取り出す", sub: "" },
                    { title: "解凍する", sub: "プラカップに水道水を入れ、取り出した2つの溶液をつけておく。" },
                    { 
                        title: "P/S（抗生物質）を 5 ml 加える", 
                        sub: "DMEMの瓶を開け、P/Sを入れる。<br>入れたら瓶のフタを閉め、<strong>転倒攪拌</strong>する。",
                        innerNote: { title: "なぜP/Sが先？", text: "DMEMは養分の塊。<br>FBSを入れる前に抗生物質(P/S)を先に入れることで、万が一のバクテリア混入リスクを下げる。" }
                    },
                    { title: "FBS を加える", sub: "粘性があるので、ピペッティングをして全量をしっかり入れる。<br>再度<strong>転倒攪拌</strong>する。" },
                    { title: "ラベルを貼って終了", sub: "" }
                ]
            }
        ]
    },

    // --- DMEM ＋ P/S ---
    "p-dmem-ps": {
        title: "DMEM ＋ P/S",
        content: [
            {
                type: 'step',
                list: [
                    { title: "冷凍庫から分注済の「P/S」を取り出す", sub: "※この培地ではFBSは使用しません。" },
                    { title: "解凍する", sub: "" },
                    { title: "P/S（抗生物質）を 5 ml 加える", sub: "" },
                    { title: "ラベルを貼って終了", sub: "" }
                ]
            }
        ]
    },

    // --- PBS (-) の作製 ---
    "p-pbs": {
        title: "PBS (-) の作製",
        content: [
            { type: 'sub-title', text: '① 10x PBS (-) 原液の作製 (500 ml)' },
            {
                type: 'text',
                text: `以下の試薬を混ぜて10倍濃縮液を作ります。<br>
                    <table style="width:100%; font-size:0.9rem; border-collapse: collapse; margin-top:10px; background:#f9f9f9;">
                        <tr style="background:#eee; border-bottom:2px solid #ddd;">
                            <th style="padding:8px; text-align:left;">試薬名</th>
                            <th style="padding:8px; text-align:right;">使用量 (500 ml 分)</th>
                        </tr>
                        <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">NaCl</td><td style="padding:8px; text-align:right; font-weight:bold;">40 g</td></tr>
                        <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">KCl</td><td style="padding:8px; text-align:right; font-weight:bold;">1 g</td></tr>
                        <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Na₂HPO₄・12H₂O</td><td style="padding:8px; text-align:right; font-weight:bold;">17.9 g</td></tr>
                        <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">KH₂PO₄</td><td style="padding:8px; text-align:right; font-weight:bold;">1.36 g</td></tr>
                    </table>`
            },
            {
                type: 'step',
                list: [
                    { title: "MilliQの準備", sub: "MilliQ 400 ml をメスシリンダーで測り取り、ビーカーに移す。" },
                    { title: "試薬の溶解", sub: "スターラーで撹拌しながら、試薬を順次加えて完全に溶かす。" },
                    { title: "メスアップ (500 ml)", sub: "メスシリンダーに戻し、MilliQを加えて全量を 500 ml に合わせる。" },
                    { title: "滅菌・保存", sub: "オートクレーブ (121 ℃、20 min)。<br> <span style=\"color:#e67e22; font-weight:bold;\">常温保存</span>。" }
                ]
            },
            { type: 'sub-title', text: '② 1x PBS (-) 使用液の作製 (500 ml)' },
            {
                type: 'step',
                list: [
                    { title: "10x PBS (-) を 50 ml 用意する", sub: "" },
                    { title: "MilliQで 500 ml にメスアップ", sub: "" },
                    { title: "滅菌", sub: "オートクレーブ (121 ℃、20 min)。" },
                    { title: "冷蔵保存", sub: "<span style=\"color:#2980b9; font-weight:bold;\">冷蔵庫 (4 ℃)</span>で保存。" }
                ]
            }
        ]
    },

    // --- FBS 非働化 ---
    "p-fbs-inactivation": {
        title: "FBS 非働化 (Heat Inactivation)",
        content: [
            { type: 'note', title: '目的', text: '血清中の補体を不活性化するため。' },
            { type: 'sub-title', text: '準備' },
            {
                type: 'step',
                list: [
                    { title: "FBSを解凍する（3日前）", sub: "冷蔵庫で<strong>3日間以上</strong>かけて溶かす。" },
                    { title: "コントロール用ボトルの準備", sub: "乾燥棚下にある、培地が入っていた空ボトルを1本とる。<br>FBSと同じ分だけ水道水を入れる。<br>冷蔵庫で<strong>1日以上</strong>かけて冷やす。" }
                ]
            },
            { type: 'sub-title', text: '非働化処理 当日' },
            {
                type: 'step',
                list: [
                    { title: "ウォーターバスを 56 ℃ に設定", sub: "" },
                    { title: "ボトルを温める", sub: "温度計を挿したコントロール用ボトルと、FBSボトルを同じタイミングでウォーターバスに入れる。<br>温度計が56℃になるまで、<strong>5分おきに転倒攪拌しながら、</strong>温め続ける。" },
                    { title: "非働化処理 (56 ℃, 30 min)", sub: "56℃になったら、そこから 30 min 間、同様の処理を続ける。"},
                    { title: "冷却とろ過", sub: "氷水で常温になるまで冷却し、<strong>滅菌フィルター</strong>に通す。" },
                    { title: "分注・保存", sub: "50 ml ずつ分注し、冷凍庫で保存する。" }
                ]
            }
        ]
    },

    // --- コラゲナーゼ ---
    "p-collagenase": {
        title: "コラゲナーゼ (Collagenase)",
        content: [
            { type: 'warning', title: '<i class="fa-solid fa-skull-crossbones"></i> 危険！吸入厳禁', text: '粉末を吸い込むと危険です。' },
            {
                type: 'step',
                list: [
                    { title: "準備：MilliQを冷やす", sub: "" },
                    { title: "粉を溶かす", sub: "冷えた MilliQ 1 ml を加え、壁面を伝わらせて溶かす。" },
                    { title: "溶解（3時間〜一晩）", sub: "" },
                    { title: "分注", sub: "PCRチューブに 100 µl ずつ分注。" }
                ]
            }
        ]
    },

    // --- アガロース ---
    "p-agarose": {
        title: "アガロース (Agarose)",
        content: [
            {
                type: 'step',
                list: [
                    { title: "混合 (3 % 溶液)", sub: "30 ml 瓶に、MilliQ 10 ml と アガロース粉 0.3 g を入れる。" },
                    { title: "レンジで加熱", sub: "<strong>※フタを開けたまま！</strong> 吹きこぼれ注意。" },
                    { title: "分注", sub: "PCRチューブに 100 µl ずつ分注。" }
                ]
            }
        ]
    },

    // --- PEI / ホウ酸 Buffer ---
    "p-pei": {
        title: "PEI / ホウ酸 Buffer 調製",
        content: [
            { type: 'sub-title', text: '① 25 mM ホウ酸 Buffer (500 ml)' },
            {
                type: 'step',
                list: [
                    { title: "溶解", sub: "MilliQ 450 ml に四ホウ酸ナトリウム 4.763 g を溶かす。" },
                    { title: "pH調整 (pH 8.4)", sub: "1 M HClで調整。" },
                    { title: "メスアップ・滅菌", sub: "" }
                ]
            },
            { type: 'sub-title', text: '② 1 % PEI ストック溶液' },
            {
                type: 'step',
                list: [
                    { title: "混合", sub: "PEI原液 1 ml ＋ ホウ酸Buffer 49 ml。" }
                ]
            },
            { type: 'sub-title', text: '③ 0.1 % PEI 溶液（使用時）' },
            {
                type: 'step',
                list: [
                    { title: "希釈・コーティング", sub: "1 % ストックを10倍希釈。" }
                ]
            }
        ]
    },

    // --- P/S または トリプシン分注 ---
    "p-ps-trypsin": {
        title: "P/S および トリプシン分注",
        content: [
            {
                type: 'step',
                list: [
                    { title: "分注", sub: "15 ml チューブに 10 ml ずつ分注。（計10本）" },
                    { title: "保存", sub: "冷凍保存。" }
                ]
            }
        ]
    },

    // =================================================================
    // B. 実験フロー - MEA準備
    // =================================================================

    // --- 新MEA開封 ---
    "p-new-mea": {
        title: "新MEA dishの開封",
        content: [
            {
                type: 'step',
                list: [
                    { title: "MEA dishの受取", sub: "金子先生から新しいMEA dishを受け取る。<strong><br>予算の都合上、勝手にとるのは厳禁です。</strong>" },
                    { title: "破損具合の確認", sub: "顕微鏡で基板上の状態を確認する。<strong><br>この時点で不良品だった場合は無償で交換できます。</strong>" },
                    { title: "Lot番号の記録", sub: "実験ノートにLot番号を控える。" },
                    { title: "火炎滅菌（任意）", sub: "電極板を 2,3 sec ほど炙る。<br>※ピンセットで四つ角を強く掴んで行う。" },
                    { 
                        title: "脱気処理（任意）", 
                        sub: "滅菌水 2 ml を入れ、デシケーターで 10 min 脱気する。",
                        innerNote: { title: "目的", text: "白金黒の下から空気を除き、破損を防ぐため。<br>（空気が残っていると、膨張して電極が飛んでしまうことがある。）" }
                    }
                ]
            },
            {
                type: 'link',
                url: 'https://drive.google.com/file/d/1Ivo2BJoCOAg5oIY6iyhrn8QJ1K7gdSHw/view?usp=sharing',
                icon: 'fa-file-pdf',
                text: 'MED Probe Manual'
            }
        ]
    },

    // --- 1. アガロースコート ---
    "p-amc-coating": {
        title: "1. アガロースコート",
        content: [
            {
                type: 'step',
                list: [
                    { title: "準備", sub: "1. ヒートブロックに電子温度計をセットして、電源をつける。<br>2. Dish中央に青丸マーカーをつける。" },
                    { title: "アガロース溶解", sub: "ヒートブロックの温度が 65 ℃ を超えたら、3 % LMPアガロースを入れて溶かす。<br>※アガロースの融点は60 ℃くらいだが、<strong>80 ℃を超えるまで</strong>は待機することを推奨。" },
                    { title: "Dishの湿潤", sub: "Dishに 1 ml のMilliQを入れ、なるべく全て吸い取る。<br>※表面を少し濡らすことで、アガロースを広がりやすくする。" },
                    { title: "スピンコーター設定", sub: "1. ポンプおよび装置のスイッチをONにする。<br>2. <strong>プログラム No. 3</strong> に設定する。<br>(500 rpm / 5 s → 3000 rpm / 20 s)" },
                    { title: "塗布 (ここは素早く！)", sub: "1. Dishをセットし、VACUUM MODEで固定する。<br>2. 溶けて透明になったアガロース 100 µl をDish中心に入れ、蓋をしてSTART。<br>※Dishの端までアガロースが広がっていればOK。" },
                    { title: "乾燥", sub: "クリーンベンチ内で蓋を開け、<strong>1 時間以上</strong>乾燥させる。<br>※乾燥不十分だと細胞が潜り込む原因になる。" }
                ]
            }
        ]
    },

    // --- 2. レーザー加工 ---
    "p-amc-laser": {
        title: "2. レーザー加工",
        content: [
            {
                type: 'warning',
                title: '安全上の注意',
                text: '<ul><li>レンズは覗かない（モニターを見る）。</li><li><strong>泡厳禁：</strong>泡にレーザーを照射すると、任意の位置だけ溶かすことができません。また、電極上の泡に打つと、電極が壊れます。必ず泡が発生したら、ピペッティングで除去すること。</li></ul>'
            },
            { type: 'sub-title', text: '事前準備' },
            {
                type: 'step',
                list: [
                    { title: "セッティング", sub: "Dishに PBS 1 ml を入れ、ステージに固定する。<br>電源をONにする（IC capture または モニター・Laser Driver・顕微鏡・XY Stage）。<br>対物レンズの倍率は、<strong>10× (黄)</strong>に設定する。" },
                    { title: "焦点調整", sub: "右側のダイヤルを回し、電極に焦点を合わせる。<br>ただし、電極上のアガロースを溶かす場合は、目盛りを <strong>+150 µm</strong> に設定してから。<br>（1周 100 µm → 1.5周回す）<br>※電極破壊防止のため焦点をずらす。RasPi使用時は自動調整されるが確認推奨。" }
                ]
            },
            { type: 'sub-title', text: 'A. 手動の場合' },
            {
                type: 'step',
                list: [
                    { title: "レーザーパワーの設定", sub: "Selectボタンで「A → W」に変更。<br>目的のワット数に設定。" },
                    { title: "照射", sub: "Missionボタンで照射モードへ。<br>ボタンを押して対象箇所に照射する。" },
                    { title: "終了", sub: "Emission OFF、出力を 0.00 W にしてから Laser Driver の電源をOFFにする。" }
                ]
            },
            { type: 'sub-title', text: 'B. Raspberry Pi の場合' },
            {
                type: 'step',
                list: [
                    { title: "接続・起動", sub: "XY Stage Controller：Modeを「RS-232C」にする。<br>Laser Driverと2本のUSBを接続。<br>白コードはスイッチ、黒コードはPCへ繋げる。<br>電源アダプターを挿し、緑・赤ライト点灯で起動を確認（約 30 s かかります）。" },
                    { title: "IC capture設定", sub: "- 画像サイズ：Y800 (600×480)<br>- ROI　　　：幅40 / 高さ40<br>- 位置　　　：X1 296 / Y1 216 / X2 344 / Y2 264<br>※ 位置は目安です。毎度変化するので、細胞播種に影響のないDish外側でレーザーを照射し、その照射地点が中心にくるように座標を設定することを推奨します。" },
                    { title: "Tera Term 起動", sub: "- ホスト名　：raspberrypi.local または 10.110.135.160<br>- ユーザー　：pi<br>- パスワード：raspberry" },
                    { title: "コマンド実行", sub: "- <code>cd (ファイル名)</code>　：移動<br>- <code>cd ../</code>　：一層上のフォルダに移動<br>- <code>amc_plt (ファイル名) -c</code> : 経路データ選択<br>- 四隅（upper left等）を画面枠に合わせてEnterで開始。<br>- 緊急時の対応　：<code>Ctrl + C</code>で停止" },
                    { title: "シャットダウン", sub: "<code>sudo shutdown -h now</code><br>Laser Driver出力 0.00 W にしてOFF。<br>Dishは滅菌水 1 ml 入れて保存。" }
                ]
            }
        ]
    },

    // --- プラズマ処理 ---
    "p-plasma": {
        title: "プラズマ処理",
        content: [
            { type: 'note', title: '目的', text: '<ul><li><strong>親水化：</strong>表面にO2ラジカルを照射し、親水性にする（コーティング剤をはじかなくする）。</li><li><strong>洗浄：</strong>有機汚染物を除去する。</li></ul>' },
            {
                type: 'step',
                list: [
                    { title: "電源ON", sub: "ポンプと装置のスイッチをつける。" },
                    { title: "サンプルセット・真空引き", sub: "1. サンプルを中に入れる。<br>2. VACUUM VALVEをOpen（赤）、PURGE VALVEをClose（青）にして真空引きを開始。<br>3. PRESSURE GAUGEが100近くまで下がるのを確認。" },
                    { title: "プラズマ照射", sub: "1. GASをONにして、Flow meterが 100 程度になることを確認。<br>2. PLASMAをON。<br>3. <strong>20 sec</strong>（任意）照射。" },
                    { title: "終了・取り出し", sub: "1. PLASMA→GASの順にOFF。<br>2. VACUUMをCloseにし、PURGEを<strong>ゆっくり</strong>Openにして気圧を戻す。<br>3. サンプルを取り出し、ポンプと装置の電源を切る。" }
                ]
            }
        ]
    },

    // --- コラーゲン調製・播種 ---
    "p-collagen": {
        title: "コラーゲン調製・播種",
        content: [
            { type: 'note', title: '原理', text: 'コラーゲンは酸性（pH 3）の希塩酸で希釈して使用し、細胞が接着できるようにする。' },
            {
                type: 'step',
                list: [
                    { title: "希釈 (1 : 9)", sub: "<strong>コラーゲン：希塩酸 ＝ 1：9</strong>を、エッペンチューブ内で混合する。<br>※混ざりやすくするため、量が多い希塩酸を後から入れる。" },
                    { title: "播種・インキュベート", sub: "Dish中央に真上から滴下し、<strong>30 min 以上</strong>インキュベート。<br><strong>目安滴下量：<br>515 = 10 µl<br>545 = 20 µl</strong>" },
                    { title: "乾燥", sub: "希塩酸が揮発して乾いていることを確認。<br>播種する場合は PBS (-) 1 ml を加えて播種準備。<br>播種しない場合は 滅菌水 1 ml を加えて保存。" }
                ]
            }
        ]
    },

    // =================================================================
    // B. 実験フロー - 心筋細胞の単離
    // =================================================================

    // --- 解剖・単離の準備 ---
    "p-isolation-prep": {
        title: "解剖・単離の準備",
        content: [
            { type: 'sub-title', text: '① 機器の設定' },
            {
                type: 'text',
                text: `<ul class="menu-list">
                        <li><strong>▶ ソニケーター：</strong><br>白バケツを用いてDWを水位線まで入れ、酵素（ZYMIT）を少量入れる。<br>ZYMITは手につかないように注意しながら、蓋を一度強く押し込んでから回して開けること。</li>
                        <li><strong>▶ ウォーターバス：</strong><br>透明バケツを用いて水道水を、人差し指の第一関節くらいまで入れる。<br>スターラー台と温度計をセットし、37 ℃ に設定して予熱する。</li>
                       </ul>`
            },
            { type: 'sub-title', text: '② クリーンベンチ内の準備' },
            {
                type: 'text',
                text: `<ul class="menu-list">
                        <li><strong>▶ 準備するもの：</strong><br>・解剖機器（7種）<br>・キムタオル（2枚重ねて3区画作る）<br>・スターラー入り滅菌瓶<br>・簡易ゴミ箱<br>・15 ml チューブ 2本<br>・シャーレ</li>
                       </ul>
                       <div class="step-sub">※シャーレは以下の通り、準備する。<br><strong>・3枚：</strong>FBSありDMEMを 0 ml, 5 ml, 10 ml 入れる。<br><strong>・他 ：</strong>シャーレ基板上に、使用する卵の数だけ番号を振っておく。</div>`
            },
            { type: 'sub-title', text: '③ 溶液の準備' },
            {
                type: 'text',
                text: `<ul class="menu-list">
                        <li><strong>▶ 冷蔵：</strong><br>・FBSありDMEM<br>・FBSなしDMEM<br>・PBS (-)</li>
                        <li><strong>▶ 冷凍：</strong><br>・コラゲナーゼ</li>
                       </ul>
                       <div class="step-sub">※コラゲナーゼの解凍方法：<br>解剖準備中にクリーンベンチ内で解凍しておく。<br>解凍できたら、チビタンを一瞬回して壁面の液体を落とし、PBS (-) 10 ml 内に 100 µl を希釈する。</div>`
            },
            { type: 'sub-title', text: '④ 卵の準備' },
            { type: 'text', text: '<div class="step-sub">使用直前に孵卵器から取り出し、アルコールを吹きかけて菌を除去しておく。<br>※孵卵器から出すと心筋の動きが弱まるため、解剖直前に取り出すこと。</div>' }
        ]
    },

    // --- 解剖・単離手順 ---
    "p-isolation-work": {
        title: "解剖・単離手順",
        content: [
            {
                type: 'warning',
                title: '解剖時の注意',
                text: '心臓を切る際はハサミの刃を入れすぎない。<br>また、作業に時間をかけすぎないように。<br>いずれも拍動が弱まる原因になります。'
            },
            {
                type: 'step',
                list: [
                    { title: "心臓の摘出", sub: "<strong>・左：</strong><br>解剖機器を用いて、卵から胚を取り出し、胚から心臓を摘出。<br>摘出した心臓は、中央のシャーレに入った培地の中に入れる。<br><strong>・中央：</strong><br>心臓周辺についている組織を除去し、心臓内部に入った血液を抜く。<br><strong>・右：</strong><br>心臓を2, 3個の塊に切り刻む。<br>ただし、刃を入れすぎないよう注意すること。" },
                    { title: "組織の洗浄", sub: "1. 10 ml オートピペッターで、心臓組織の入った培地を 15 ml チューブに移す。<br><br>2. 心臓組織が自然に沈殿するのを待ち、十分に沈殿したのを確認したら、上清をアスピレーターで吸い取る。<br><br>3. PBS (-) 10 ml を加え、再度組織片が自然に沈殿を待ってから上清を吸う。<br><br>4. PBS (-) 5 ml を加え、再度組織片が自然に沈殿するのを待つ。<br>※ここでは、上清を除去しない。<br>" },
                    { title: "コラゲナーゼ処理 (1回目)", sub: "<strong>目的：心臓周辺の冠動脈の除去。</strong><br><br> 1. PBS (-) 5 ml はなるべく吸わないよう注意しながら、組織片のみを滅菌瓶に移す。<br><br>※ただし、乾いているとオートピペッターで吸えないので、ほんの少しだけ先端にPBS (-)を入れてから、組織片を吸うようにするのがコツ。<br><br>2. オートピペッターは付け替えずにそのまま使って、希釈したコラゲナーゼ 10 ml 全量を滅菌瓶に入れる。<br><br>3. ウォーターバス内で <strong>37 ℃, 10 min</strong> 撹拌する。<br><br>※スターラーは細胞懸濁液が泡立たない程度のスピードで回転させる。<br>" },
                    { title: "コラゲナーゼ処理 (2回目)", sub: "<strong>目的：組織内部への酵素浸透。</strong><br><br> 1. 5 ml オートピペッターで上清（不要な組織片）を除く。<br><br>2. 新しいコラゲナーゼ 10 ml を加え、2回だけピペッティングして軽く組織を崩してから、<strong>37 ℃, 20 min</strong> 撹拌する。<br><br>※このときはオートピペッターを使っても、直接入れるでも良い。" },
                    { title: "遠心分離", sub: "1. 50 ml チューブにセルストレーナーをセットし、攪拌後の細胞懸濁液を通す。<br><br>2. FBSなしDMEMを加えて総量 35 ml の細胞懸濁液にする。<br><br>3. <strong>1000 rpm, 5 min</strong> で遠心。" },
                    { 
                        title: "線維芽細胞の除去", 
                        sub: "1. 上清をアスピレーターで吸い取る。<br><br>2. 沈殿（ペレット）をFBSありDMEMで懸濁し、コルベン（フラスコ）に入れる。<br><br>※FBSありDMEMは、5 ml × コルベン枚数分だけ追加。<br><br>3. 位相差顕微鏡にセットして、十分に細胞数があることを確認（吹雪のような状態だったらOK）。<br><br>4. <strong>37 ℃ で 20 min</strong> インキュベート。",
                        innerNote: { title: "CO2インキュベーターの役割", text: "庫内を CO2 5 % に保つことで培地中の炭酸イオン濃度を維持し、pHを一定に保つ。<br><br><strong>コルベン処理の効果</strong><br>接着能の高い線維芽細胞だけがコルベン底面に張り付き、接着能の低い心筋細胞は浮遊したまま残る。<br><br>ただし、長時間インキュベートしすぎると、良質な心筋細胞まで貼りついてしまうので注意。<br>" }
                    },
                    { title: "心筋細胞の回収", sub: "1. 顕微鏡をのぞき、線維芽細胞の仮足が伸び始めていることを確認。<br><br>※ここの張り付き具合が十分か否かは、経験数の多い学生に判断してもらうこと。<br><br>2. 50 ml チューブにFBSなしDMEMを、総量 35 ml になるように入れる。<br><br><strong>例）</strong><br>コルベン2枚の場合、コルベン内の細胞懸濁液が 10 ml になるはずなので、FBSなしDMEM 25 ml をチューブに入れる。<br><br>3. 浮遊している心筋細胞を含んだ細胞懸濁液をコルベンから回収する。<br><br>4. チューブに移したFBSなしDMEMで、コルベン表面をウォッシュして、細胞を全て回収。<br><br>※ウォッシュは10回以上、念入りに行うこと。<br><br>5. 再度、<strong>1000 rpm, 5 min</strong> で遠心。" },
                    { title: "カウント", sub: "1. ペレットが十分にあることを確認したのち、上清のみアスピレーターで除去。<br><br>2. FBSありDMEM 100 µl をチューブに入れる。<br><br><strong>※チェックポイント：</strong><br>細胞数に応じて 100 µl 以上入れる場合もあるため、経験数の多い学生に確認をとること。<br><br>3. 作製した細胞懸濁液から 10 µl だけ、エッペンチューブに移す。<br><br>4. エッペンチューブにFBSありDMEMを 90 µl 入れて、10倍希釈する。<br><br><strong>※チェックポイント：</strong><br>ここも細胞数に応じて希釈倍率が変化するため、経験数の多い学生に確認をとること。<br><br>5. 新たな別のエッペンチューブに、先ほど希釈した懸濁液 10 µl を移す。<br><br>6. そこにトリパンブルー 10 µl を入れ、2倍希釈する。<br><br>トリパンブルーで染色した細胞懸濁液を 10 µl だけとって、血球計算盤にいれ、細胞数をカウントする。<br><br><strong>※細胞数の計算方法：</strong><br>血球計算盤上の4区画の平均細胞数 × 希釈倍率（例：20倍） × 10^4（個）<br><br>7. 目的の濃度（例: 1×10^7 cells/ml）になるよう細胞懸濁液を調製し、Dishに播種する。<br><br><strong>※チェックポイント：</strong><br>ここも慣れるまでは、経験数の多い学生に確認をとること。" },
                    { title: "播種", sub: "※単離中に、Dishにコラーゲンを播種し、30 min 以上インキュベートしておく。<br><br>※インキュベーター内で揮発しきらなかった場合は、クリーンベンチ内にて風をあてて完全に揮発させる。<br><br>1. PBS (-) 1 ml をDish内に添加し、すぐアスピレーターで除去する。<br><br>3. DMEM 1 ml を入れ、Dish中心に向けて、細胞懸濁液を播種する。<br><br><strong>※(参考) 播種量：</strong><br>515 10 µl <br>545 20 µl" }
                ]
            }
        ]
    },

    // =================================================================
    // B. 実験フロー - 培養・計測
    // =================================================================

    // --- MEA計測 ---
    "p-mea-measurement": {
        title: "MEA計測",
        content: [
            { type: 'sub-title', text: '手順' },
            {
                type: 'step',
                list: [
                    { title: "セット", sub: "機械上にDishをセットし、蓋を被せる。" },
                    { title: "放電 (10 s)", sub: "10 s 流す。<br>※使い始めだけ、静電気を逃がす目的で行う。" },
                    { title: "拍動の安定化 (10 min 以上)", sub: "10 min 以上、Dishをセットした状態で流す。<br>※CO2や温度を慣らして、細胞の拍動状態を安定させる。データ保存は不要。" },
                    { title: "計測・保存 (2 min)", sub: "2 min 保存する。<br>ここの条件は実験条件によって異なりますが、初心者は 2 min 保存しておけば、先行研究と比較できる十分な解析用データを得られるので、まずこの計測条件でいきましょう。" }
                ]
            },
            { type: 'sub-title', text: 'Cell-Bioの使い方' },
            {
                type: 'text',
                text: `<ul class="menu-list" style="font-size: 0.95rem;">
                        <li><strong>[ 512 ]：</strong>メモリ保存（時間制限あり）</li>
                        <li><strong>なし：</strong>HDD保存（時間制限なし）</li>
                       </ul>
                       <div class="step-sub" style="margin-top: 10px;"><strong>スクリーンショット：</strong><br>Print Screen → ペイントに貼り付け → JPEG保存 → マイドキュメント</div>
                       <div class="step-sub" style="margin-top: 10px;"><strong>データ保存：</strong><br>ファイル → データ保存。<br><span style="color: #c0392b;">※必ずファイル名の末尾に「.0001」をつけること。</span></div>`
            },
            {
                type: 'link',
                url: 'https://drive.google.com/file/d/17oEeEUqbo0cl9b7PBW_tBf3ImjVtjK86/view?usp=sharing',
                icon: 'fa-file-pdf',
                text: '設定マニュアル (PDF)'
            }
        ]
    },

    // =================================================================
    // B. 実験フロー - 片付け
    // =================================================================

    // --- トリプシン処理 ---
    "p-trypsin-mea": {
        title: "トリプシン処理",
        content: [
            { type: 'note', title: '重要', text: 'PBS (-)およびトリプシンでの処理をサボると、カドヘリン（細胞接着因子）が除去できず、細胞が綺麗に剥がれません。' },
            {
                type: 'step',
                list: [
                    { title: "PBS Wash（2回）", sub: "培地をアスピレーターで除去し、PBS (-) 1 ml を入れて、再度アスピレーターで除去。<br>これを <strong>2回</strong> 繰り返す。" },
                    { title: "トリプシン処理", sub: "プラカップに入れた水道水で解凍したトリプシン 500 µl を加え、<strong>10 min 以上</strong>インキュベーター内に放置する。" },
                    { title: "湯煎・乾燥", sub: "細胞が剥がれていることを確認し、アスピレーターでトリプシン溶液を除去する。<br>お湯（DWで作製）でDishを洗う。<br>時間がある場合はクリーンベンチ内で乾燥、時間がない場合はアスピレーターで水滴を完全に吸い取り、引き出し又は冷蔵庫内で保存する。" }
                ]
            }
        ]
    },

    // --- 機器・器具の洗浄 ---
    "p-cleanup-tools": {
        title: "機器・器具の洗浄",
        content: [
            { type: 'sub-title', text: '① 孵卵器 (残数が0個になったら対応する)' },
            { type: 'text', text: '<div class="step-sub">グレーのトレー、下のスポンジ、仕切り3枚を取り出し、コンタミノンで洗う。</div>' },
            { type: 'sub-title', text: '② 解剖機器' },
            { type: 'text', text: '<div class="step-sub">1. コンタミノンで洗い、DWで流す。<br>2. ソニケーターに入れ、STARTボタンを押す（ただし、ハサミは全開にして入れること）。<br>3. 30 min 後、DWで流して乾燥させる。</div>' },
            { type: 'sub-title', text: '③ ソニケーター' },
            { type: 'text', text: '<div class="step-sub">透明バケツを使って洗浄液を捨て、MilliQで壁面を2回洗う。<br>最後はキムタオルで拭く。<br>蓋は洗う必要がないが、中にある すのこ はDWで洗い流した後、乾かす。</div>' },
            { type: 'sub-title', text: '④ ウォーターバス' },
            { type: 'text', text: '<div class="step-sub">電源を切り、コンセントを抜き、水をすべて捨てる。<br>スターラー台は乾燥棚に置いて乾かす。</div>' }
        ]
    },

    // =================================================================
    // D. 機器・安全
    // =================================================================

    // --- ガスバーナー ---
    "p-gas-burner": {
        title: "ガスバーナー",
        content: [
            {
                type: 'step',
                list: [
                    { title: "元栓を開ける", sub: "" },
                    { title: "右の小さいバルブを開ける", sub: "" },
                    { title: "着火", sub: "バーナー先端をつけ、火花で着火する。" },
                    { title: "左のバルブを開ける", sub: "これで火が安定します。" },
                    { title: "使用（ペダル）", sub: "ペダルを踏んでいる間だけ火が強くなります。" }
                ]
            }
        ]
    },

    // --- オートクレーブ ---
    "p-autoclave": {
        title: "オートクレーブ",
        content: [
            {
                type: 'note',
                title: '目的',
                text: '高温高圧下で滅菌処理を行います。<ul><li><strong>廣野折り：</strong>袋を折る際、蒸気が入りやすいように隙間を作る折り方（ツルツルを合わせ、四辺を少しずつ折って厚みを出す）。</li><li><strong>オートクレーブテープ：</strong>滅菌されると黒い線が出るテープ。</li></ul>'
            },
            { type: 'sub-title', text: '基本手順' },
            {
                type: 'step',
                list: [
                    { title: "水量・水入れ", sub: "右下の水量がHigh-Low間にあるか確認（多ければ捨てる）。<br>釜の底の中心がギリギリ浸かる程度に水道水を入れる。" },
                    { title: "セット・蓋閉め", sub: "物を入れ、蓋を人差し指で軽く時計回りに回し、止まったら両手で <strong>90 °</strong> 増し締めする。" },
                    { title: "設定・開始", sub: "主電源ON → 蓋・排水(EXHAUST: close)・水量を確認。<br>STARTボタンを押す（121 ℃, 20 min）。" },
                    { title: "終了確認", sub: "温度 60 ℃、圧力 0 を確認して取り出す。<br>※アラームが鳴るが問題ありません。" }
                ]
            },
            { type: 'sub-title', text: '対象別の注意点' },
            {
                type: 'text',
                text: `<ul class="menu-list">
                        <li><strong>滅菌水 (瓶)：</strong><br>MilliQを補充し、口にアルミホイルを被せ、蓋を<strong>少し緩めて</strong>行う。</li>
                        <li><strong>スターラー入り滅菌瓶：</strong><br>洗浄・乾燥後、スターラーを入れてアルミを被せ、蓋を<strong>少し緩めて</strong>行う。</li>
                        <li><strong>チップ (クリーンベンチ内)：</strong><br>専用の袋に入れる。チップケースの下に穴がある場合は、水が入らないよう<strong>金網を逆さにして</strong>その上に置く。</li>
                        <li><strong>エッペンチューブ (クリーンベンチ内)：</strong><br>新しいチューブをビーカーに入れ、アルミを被せて行う。</li>
                       </ul>`
            }
        ]
    },

    // =================================================================
    // E. 運営・その他
    // =================================================================

    // --- 生命機能学基礎実験Ⅱ 準備 ---
    "p-basic-exp-prep": {
        title: "生命機能学基礎実験Ⅱ 準備 (6/23)",
        content: [
            { type: 'text', text: '<div class="step-sub" style="text-align:right; margin-bottom:15px;">250610 赤田萌々</div>' },
            { type: 'sub-title', text: '当日の流れ' },
            {
                type: 'text',
                text: '<div class="step-sub"><ul><li><strong>形式：</strong>前後半で分かれ「全体説明 (Zoom) → 実習/演習 (16時交代)」</li><li><strong>配置：</strong>各班2テーブル、各テーブル顕微鏡3台設置。<br>（顕微鏡1台につきシャーレ1枚配布 ＝ 各班6枚使用）</li><li><strong>人数：</strong>A-H班、各12名</li></ul></div>'
            },
            { type: 'sub-title', text: '当日必要なもの' },
            { type: 'warning', title: '在庫確認 (2週間前)', text: 'DMEMやTrypsinなどは、<strong>2週間前</strong>に在庫が足りるか確認すること！！<br>普段の実験 ＋ 2本は余分に発注しておくこと。' },
            {
                type: 'text',
                text: `<ul class="menu-list" style="font-size:0.95rem;">
                        <li>✅ <strong>60 mm Tissue culture dish（Fib培養）</strong><br>50 枚（各班6枚×8班＋予備2）</li>
                        <li>✅ <strong>60 mm Tissue culture dish（Fibなし）</strong><br>50 枚（各班6枚×8班＋予備2）</li>
                        <li>✅ <strong>DMEM + 10% FBS + 1% P/S</strong><br>30 mL × 17 本（各班1本＋予備1）</li>
                        <li>✅ <strong>PBS (-)</strong><br>30 mL × 17 本（各班1本＋予備1）</li>
                        <li>✅ <strong>Trypsin EDTA</strong><br>(Trypsin : PBS = 1 : 1 で希釈済)<br>1.2 mL × 26 本（各班3本＋予備2）</li>
                        <li>✅ <strong>トリパンブルー</strong><br>100 µL × 17 本（16本＋予備1）</li>
                        <li>✅ <strong>C-Chip（血球計算盤）</strong><br>50 枚（48枚＋予備2）</li>
                        <li>✅ <strong>手袋</strong><br>学生人数分（※要先生相談）</li>
                       </ul>`
            },
            { type: 'sub-title', text: '使用したFib (卵数:各26個)' },
            { type: 'text', text: '<ul style="list-style:none; padding-left:10px;"><li><strong>3週間前 (06/03)：</strong>予備①</li><li><strong>2週間前 (06/10)：</strong>本命</li><li><strong>1週間前 (06/17)：</strong>予備②</li></ul>' },
            { type: 'sub-title', text: '継代培養 1回目 (開始3日後)' },
            { type: 'text', text: '<div class="step-sub" style="margin-bottom:10px;"><strong>概要：</strong>コルベン 1 枚 → 3 枚</div>' },
            {
                type: 'step',
                list: [
                    { title: "洗浄", sub: "培地を捨て、PBS (-) 3 mL でWash。これを2, 3回繰り返す。" },
                    { title: "剥離", sub: "トリプシン・EDTA (混和済) 3 ml を加える。<br>顕微鏡で8割程度剥がれるまで確認。<br><span style=\"color:#c0392b;\">※やりすぎ注意！接着力が弱まります。</span>" },
                    { title: "反応停止・回収", sub: "DMEMを勢いよく加え、全量 15 mL にする。<br>50 mL チューブに移し、<strong>1000 rpm, 5 min</strong> で遠心。" },
                    { title: "播種", sub: "上清除去後、DMEM 10 mL で懸濁（ピペッティングで均一化）。<br>新しいコルベン3枚に、<strong>4 mL ずつ</strong>加える。" }
                ]
            },
            { type: 'note', title: '', text: '※3日後だと100%コンフルエントだったので、2日後でも良いかも。適宜確認すること。' },
            { type: 'sub-title', text: '継代培養 2回目 (開始10日後)' },
            { type: 'text', text: '<div class="step-sub"><strong>概要：</strong>コルベン 1 枚 → 3 枚（手順は1回目と同上）</div>' },
            { type: 'sub-title', text: '継代培養 3回目 (開始17日後)' },
            { type: 'text', text: '<div class="step-sub" style="margin-bottom:10px;"><strong>概要：</strong>コルベン 1 枚 → 60 mm Dish 3-4 枚</div>' },
            {
                type: 'step',
                list: [
                    { title: "洗浄・剥離", sub: "PBS Wash × 2,3回 → トリプシン 3 ml。<br>8割剥がれたら DMEM で全量 10 mL にして止める。" },
                    { title: "回収・遠心", sub: "同じ解剖日のものを50 mL チューブにまとめる（計 30 mL）。<br>5 mL メスアップしてバランスを取り、<strong>1000 rpm, 5 min</strong> で遠心。" },
                    { title: "懸濁", sub: "上清除去後、DMEM 2 mL でペレットを崩す。<br>さらに DMEM 10 mL (or 14 mL) を加え均一にする。" },
                    { title: "播種 (4 mL/dish)", sub: "質の良いFibは4枚、イマイチなFibは3枚に分ける。<br><strong>各 4 mL ずつ</strong>播種する。" }
                ]
            },
            { type: 'note', title: '', text: '播種30分後は貼りつきが悪くても、3日後（月曜）にはコンフルエントになります。' },
            { type: 'sub-title', text: '当日準備 (開始24日後)' },
            {
                type: 'step',
                list: [
                    { title: "培地交換", sub: "DMEM全量を除去し、<strong>FBSなしDMEM 2 mL</strong> を加える。" },
                    { title: "選別・配布", sub: "位相差顕微鏡で確認。<br>・100%コンフルエント → 「100%」と書いて配布。<br>・状態が良くないもの → 「予備」として配布しない。" }
                ]
            }
        ]
    }

};

