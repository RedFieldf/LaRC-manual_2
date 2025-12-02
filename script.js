/* --- ページ表示機能 --- */
function showPage(pageId) {
    // すべてのページを非表示
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // ターゲットがHTML内に存在するか確認
    let targetPage = document.getElementById(pageId);

    // 存在しない場合（詳細ページ）は、manual_data.js から動的に生成する
    if (!targetPage && typeof manuals !== 'undefined' && manuals[pageId]) {
        generatePage(pageId);
        targetPage = document.getElementById(pageId);
    }

    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        console.error("ページが見つかりません: " + pageId);
    }
}

/* --- HTML自動生成機能 (Renderer) --- */
function generatePage(pageId) {
    const data = manuals[pageId];
    if (!data) return;

    // 既に生成済みなら中身をクリアして再生成（あるいは生成スキップも可）
    let pageDiv = document.getElementById(pageId);
    if (!pageDiv) {
        pageDiv = document.createElement('div');
        pageDiv.id = pageId;
        pageDiv.className = 'page';
        document.querySelector('.container').appendChild(pageDiv);
    }
    pageDiv.innerHTML = ''; // リセット

    // 戻るボタンの決定（簡易的なロジック）
    let backTarget = 'p-home';
    if(pageId.includes('order')) backTarget = 'p-order';
    if(pageId.includes('mea')) backTarget = 'p-exp-seeding';
    // 必要に応じて分岐を増やす、またはデータ内にbackIdを持たせると完璧です

    // コンテンツ構築
    let html = `
        <button class="back-btn" onclick="showPage('${backTarget}')"><i class="fa-solid fa-arrow-left"></i> 戻る</button>
        <div class="section-card">
            <div class="recipe-title">${data.title}</div>
    `;

    // データの中身をループしてHTML化
    data.content.forEach(item => {
        if (item.type === 'note') {
            html += `
                <div class="note-box">
                    <span class="note-title">${item.title}</span>
                    ${item.text}
                </div>`;
        } else if (item.type === 'warning') {
            html += `
                <div class="warning-box">
                    <span class="warning-title">${item.title}</span>
                    ${item.text}
                </div>`;
        } else if (item.type === 'sub-title') {
            html += `<div class="recipe-subtitle">${item.text}</div>`;
        } else if (item.type === 'text') {
            html += `<div class="step-sub" style="margin-bottom:15px;">${item.text}</div>`;
        } else if (item.type === 'code') {
            html += `<div class="template-box">${item.text}</div>`;
        } else if (item.type === 'link') {
            html += `
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${item.url}" target="_blank" class="btn-go"><i class="fa-solid ${item.icon}"></i> ${item.text}</a>
                </div>`;
        } else if (item.type === 'step') {
            html += `<ol class="step-list">`;
            item.list.forEach(step => {
                html += `<li><span class="step-txt">${step.title}</span>`;
                if (step.sub) html += `<div class="step-sub">${step.sub}</div>`;
                // Stepの中にNoteがある場合
                if (step.innerNote) {
                     html += `
                        <div class="note-box">
                            <span class="note-title">${step.innerNote.title}</span>
                            ${step.innerNote.text}
                        </div>`;
                }
                html += `</li>`;
            });
            html += `</ol>`;
        }
    });

    html += `</div>`; // section-card end
    pageDiv.innerHTML = html;
}

/* --- ガイドモーダル機能 --- */
const guideData = {
    'laser-plus': {
        title: 'レーザー有 MEA予約',
        text: '【予約時のルール】<br>・実験予定が決まり次第、早めに記入してください。<br>・変更がある場合は速やかに修正してください。<br>・開始10分後になっても予約者が現れなかった場合、その場にいる人が使ってOKです。',
        url: 'https://docs.google.com/spreadsheets/d/1Iyykb4FtFrtAHlmcRj6RP0GcYoREeRO3rP8sFW_IRXU/edit?gid=1932456055#gid=1932456055'
    },
    'laser-minus': {
        title: 'レーザー無 MEA予約',
        text: '【予約時のルール】<br>・実験予定が決まり次第、早めに記入してください。<br>・変更がある場合は速やかに修正してください。<br>・開始10分後になっても予約者が現れなかった場合、その場にいる人が使ってOKです。',
        url: 'https://docs.google.com/spreadsheets/d/1Iyykb4FtFrtAHlmcRj6RP0GcYoREeRO3rP8sFW_IRXU/edit?gid=202336514#gid=202336514'
    },
    'reagent-duty': {
        title: '試薬調製担当',
        text: '【当番の方へ】<br>・在庫切れがないか確認してください。<br>・調製後はラベルに試薬名・日付・作成者を記入してください。<br>・足りない試薬があれば発注してください。',
        url: 'https://docs.google.com/spreadsheets/d/1Iyykb4FtFrtAHlmcRj6RP0GcYoREeRO3rP8sFW_IRXU/edit?gid=1085389326#gid=1085389326'
    }
};

function openGuide(key) {
    const data = guideData[key];
    if (data) {
        document.getElementById('modal-title').innerText = data.title;
        document.getElementById('modal-text').innerHTML = data.text;
        document.getElementById('modal-link').href = data.url;
        document.getElementById('guide-modal').classList.add('active');
    }
}
function closeGuide() { document.getElementById('guide-modal').classList.remove('active'); }