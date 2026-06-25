// 将棋の駒キャラ（A-Frame プリミティブのみで構築）
// 各ビルダーは「ローカル +Y が上・足元が y=0」の entity 内 HTML 文字列を返す。
// AR アプリ・ギャラリーの両方から利用する。
(function () {
  // --- 共通パーツ ---
  function eyes(y, z, r) {
    r = r || 0.035;
    return `
      <a-sphere color="#1b1b1b" radius="${r}" position="-0.09 ${y} ${z}"></a-sphere>
      <a-sphere color="#1b1b1b" radius="${r}" position="0.09 ${y} ${z}"></a-sphere>`;
  }
  function ring() {
    return `<a-ring color="#000" opacity="0.16" radius-inner="0.12" radius-outer="0.36" rotation="-90 0 0" position="0 0.004 0"></a-ring>`;
  }
  // 成駒用：足元の回転オーラ＋頭上に浮かぶ金色の光球
  function aura() {
    return `
      <a-ring color="#ffd700" opacity="0.5" radius-inner="0.34" radius-outer="0.44" rotation="-90 0 0" position="0 0.02 0"
        animation__a="property: rotation; from: -90 0 0; to: -90 360 0; dur: 4000; loop: true; easing: linear"></a-ring>
      <a-sphere color="#fff2a8" radius="0.055" position="0 1.30 0"
        animation__g="property: position; from: 0 1.24 0; to: 0 1.38 0; dir: alternate; dur: 900; loop: true; easing: easeInOutSine"></a-sphere>`;
  }
  // 武将系（銀・金）の共通ビルダー
  function general(bodyColor, helmetColor, crown) {
    const helmet = crown
      ? `<a-cylinder color="${helmetColor}" radius="0.2" height="0.1" position="0 0.95 0"></a-cylinder>
         <a-cone color="${helmetColor}" radius-bottom="0.045" radius-top="0" height="0.14" position="0 1.05 0"></a-cone>
         <a-cone color="${helmetColor}" radius-bottom="0.045" radius-top="0" height="0.12" position="-0.12 1.00 0"></a-cone>
         <a-cone color="${helmetColor}" radius-bottom="0.045" radius-top="0" height="0.12" position="0.12 1.00 0"></a-cone>`
      : `<a-cone color="${helmetColor}" radius-bottom="0.22" radius-top="0.04" height="0.2" position="0 0.93 0"></a-cone>`;
    return `
      <a-box color="${bodyColor}" depth="0.42" height="0.55" width="0.6" position="0 0.32 0"></a-box>
      <a-sphere color="#ffe0b0" radius="0.17" position="0 0.78 0"></a-sphere>
      ${eyes(0.79, 0.15, 0.03)}
      ${helmet}
      <a-box color="#dfe6ee" depth="0.03" height="0.6" width="0.08" position="0.34 0.55 0"></a-box>
      <a-box color="#6b4a2b" depth="0.06" height="0.12" width="0.15" position="0.34 0.24 0"></a-box>
      ${ring()}`;
  }

  // --- 駒ごとのビルダー ---
  const B = {};

  // 歩兵：赤い胴体＋黄のとんがり頭＋槍
  B.fu = () => `
    <a-box color="#d23b3b" depth="0.4" height="0.5" width="0.55" position="0 0.3 0"></a-box>
    <a-cone color="#ffd24a" radius-bottom="0.26" radius-top="0" height="0.38" position="0 0.74 0"></a-cone>
    ${eyes(0.58, 0.22)}
    <a-cylinder color="#9a6b3f" radius="0.022" height="1.0" position="0.36 0.55 0"></a-cylinder>
    <a-cone color="#cfd3da" radius-bottom="0.055" radius-top="0" height="0.16" position="0.36 1.08 0"></a-cone>
    ${ring()}`;

  // 香車：細長い体＋前方に長い槍（前進あるのみ）
  B.kyo = () => `
    <a-cylinder color="#c0794a" radius="0.2" height="0.66" position="0 0.4 0"></a-cylinder>
    <a-sphere color="#ffe0b0" radius="0.18" position="0 0.85 0"></a-sphere>
    ${eyes(0.87, 0.16, 0.03)}
    <a-cylinder color="#7a5230" radius="0.025" height="1.25" rotation="90 0 0" position="0.12 0.6 0.45"></a-cylinder>
    <a-cone color="#e6e6e6" radius-bottom="0.06" radius-top="0" height="0.2" rotation="-90 0 0" position="0.12 0.6 1.12"></a-cone>
    ${ring()}`;

  // 桂馬：馬の頭を持つ緑の騎士（跳ねる）
  B.kei = () => `
    <a-box color="#3fa45f" depth="0.4" height="0.45" width="0.5" position="0 0.28 0"></a-box>
    <a-box color="#2e7d46" depth="0.18" height="0.34" width="0.22" position="0 0.7 0.06" rotation="18 0 0"></a-box>
    <a-box color="#2e7d46" depth="0.16" height="0.12" width="0.2" position="0 0.9 0.2"></a-box>
    <a-cone color="#2e7d46" radius-bottom="0.045" radius-top="0" height="0.14" position="-0.07 0.97 -0.02"></a-cone>
    <a-cone color="#2e7d46" radius-bottom="0.045" radius-top="0" height="0.14" position="0.07 0.97 -0.02"></a-cone>
    ${eyes(0.74, 0.2, 0.028)}
    ${ring()}`;

  // 銀将：銀の鎧＋剣
  B.gin = () => general('#b8c0c8', '#9aa3ad', false);
  // 金将：金の鎧＋王冠風兜＋剣
  B.kin = () => general('#e8b53a', '#ffd700', true);

  // 角行：紫のローブの魔導士＋光る杖
  B.kaku = () => `
    <a-cylinder color="#7a3fb0" radius="0.3" height="0.66" position="0 0.36 0"></a-cylinder>
    <a-sphere color="#ffe0b0" radius="0.2" position="0 0.82 0"></a-sphere>
    ${eyes(0.84, 0.18, 0.03)}
    <a-cylinder color="#5a3b1f" radius="0.02" height="1.1" position="0.36 0.55 0"></a-cylinder>
    <a-sphere color="#7fe6ff" radius="0.08" position="0.36 1.15 0"
      animation__p="property: scale; from: 0.8 0.8 0.8; to: 1.2 1.2 1.2; dir: alternate; dur: 800; loop: true; easing: easeInOutSine"></a-sphere>
    ${ring()}`;

  // 飛車：青い装甲＋翼（飛翔）
  B.hi = () => `
    <a-box color="#3f6fd0" depth="0.42" height="0.5" width="0.6" position="0 0.3 0"></a-box>
    <a-sphere color="#ffe0b0" radius="0.18" position="0 0.74 0"></a-sphere>
    ${eyes(0.75, 0.15, 0.03)}
    <a-cone color="#2f50a0" radius-bottom="0.2" radius-top="0.03" height="0.18" position="0 0.9 0"></a-cone>
    <a-box color="#2f50a0" depth="0.04" height="0.28" width="0.5" position="-0.42 0.5 -0.08" rotation="0 0 35"></a-box>
    <a-box color="#2f50a0" depth="0.04" height="0.28" width="0.5" position="0.42 0.5 -0.08" rotation="0 0 -35"></a-box>
    ${ring()}`;

  // 王将：玉座＋王冠の王
  B.ou = () => `
    <a-box color="#7a1414" depth="0.18" height="0.95" width="0.72" position="0 0.52 -0.26"></a-box>
    <a-box color="#d4af37" depth="0.45" height="0.55" width="0.62" position="0 0.32 0"></a-box>
    <a-sphere color="#ffe0b0" radius="0.2" position="0 0.8 0"></a-sphere>
    ${eyes(0.82, 0.18, 0.035)}
    <a-cylinder color="#ffd700" radius="0.22" height="0.12" position="0 0.99 0"></a-cylinder>
    <a-cone color="#ffd700" radius-bottom="0.05" radius-top="0" height="0.16" position="0 1.1 0"></a-cone>
    <a-cone color="#ffd700" radius-bottom="0.05" radius-top="0" height="0.13" position="-0.14 1.05 0"></a-cone>
    <a-cone color="#ffd700" radius-bottom="0.05" radius-top="0" height="0.13" position="0.14 1.05 0"></a-cone>
    ${ring()}`;

  // 成駒：元デザイン＋金色オーラ。馬・龍は固有パーツも追加。
  B.to = () => B.fu() + aura();
  B.nkyo = () => B.kyo() + aura();
  B.nkei = () => B.kei() + aura();
  B.ngin = () => B.gin() + aura();
  // 龍馬：角行＋角（つの）
  B.uma = () => B.kaku() +
    `<a-cone color="#ffd700" radius-bottom="0.05" radius-top="0" height="0.18" position="-0.12 1.0 0" rotation="0 0 25"></a-cone>
     <a-cone color="#ffd700" radius-bottom="0.05" radius-top="0" height="0.18" position="0.12 1.0 0" rotation="0 0 -25"></a-cone>` +
    aura();
  // 龍王：飛車＋大きな竜の翼＋頭頂の角
  B.ryu = () => B.hi() +
    `<a-box color="#1f9bb0" depth="0.04" height="0.34" width="0.6" position="-0.52 0.66 -0.12" rotation="0 0 42"></a-box>
     <a-box color="#1f9bb0" depth="0.04" height="0.34" width="0.6" position="0.52 0.66 -0.12" rotation="0 0 -42"></a-box>
     <a-cone color="#ffd700" radius-bottom="0.06" radius-top="0" height="0.2" position="0 1.05 0"></a-cone>` +
    aura();

  // --- レジストリ（表示順：基本8種→成6種）---
  const PIECES = [
    { key: 'fu',   kanji: '歩',   name: '歩兵',  romaji: 'Fu / Pawn' },
    { key: 'kyo',  kanji: '香',   name: '香車',  romaji: 'Kyō / Lance' },
    { key: 'kei',  kanji: '桂',   name: '桂馬',  romaji: 'Kei / Knight' },
    { key: 'gin',  kanji: '銀',   name: '銀将',  romaji: 'Gin / Silver' },
    { key: 'kin',  kanji: '金',   name: '金将',  romaji: 'Kin / Gold' },
    { key: 'kaku', kanji: '角',   name: '角行',  romaji: 'Kaku / Bishop' },
    { key: 'hi',   kanji: '飛',   name: '飛車',  romaji: 'Hi / Rook' },
    { key: 'ou',   kanji: '王',   name: '王将',  romaji: 'Ō / King' },
    { key: 'to',   kanji: 'と',   name: 'と金',  romaji: 'To (+Pawn)',   promoted: true },
    { key: 'nkyo', kanji: '成香', name: '成香',  romaji: '+Lance',       promoted: true },
    { key: 'nkei', kanji: '成桂', name: '成桂',  romaji: '+Knight',      promoted: true },
    { key: 'ngin', kanji: '成銀', name: '成銀',  romaji: '+Silver',      promoted: true },
    { key: 'uma',  kanji: '馬',   name: '龍馬',  romaji: 'Uma (+Bishop)', promoted: true },
    { key: 'ryu',  kanji: '龍',   name: '龍王',  romaji: 'Ryū (+Rook)',  promoted: true },
  ];
  PIECES.forEach(p => { p.build = B[p.key]; });

  // 上下に揺れるアイドル演出付きで駒 entity の HTML を返す（AR/ギャラリー共用）
  function pieceEntityHTML(key, opts) {
    opts = opts || {};
    const scale = opts.scale != null ? opts.scale : 1;
    const inner = (B[key] || B.fu)();
    const bob = opts.bob === false ? '' :
      `animation__bob="property: position; from: 0 0 0; to: 0 0.08 0; dir: alternate; dur: ${opts.bobDur || 1100}; loop: true; easing: easeInOutSine"`;
    return `<a-entity scale="${scale} ${scale} ${scale}" ${bob}>${inner}</a-entity>`;
  }

  window.SHOGI_PIECES = PIECES;
  window.SHOGI_BUILD = B;
  window.shogiPieceEntityHTML = pieceEntityHTML;
})();
