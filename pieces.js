// 将棋の駒キャラ（A-Frame プリミティブのみ・外部3Dモデル不使用）
// サムライ／ファンタジー風に作り込み：鎧・肩当て・兜の前立て・光るバイザー・武器・マント・翼・宝石。
// 各ビルダーは「ローカル +Y が上・足元 y=0・正面 +Z」の entity 内 HTML を返す。
(function () {
  // ---------- マテリアル ----------
  function M(color, o) {
    o = o || {};
    let s = 'color: ' + color;
    if (o.metal != null) s += '; metalness: ' + o.metal;
    if (o.rough != null) s += '; roughness: ' + o.rough;
    if (o.emissive) s += '; emissive: ' + o.emissive + '; emissiveIntensity: ' + (o.ei != null ? o.ei : 1);
    if (o.opacity != null) s += '; opacity: ' + o.opacity + '; transparent: true';
    if (o.side) s += '; side: ' + o.side;
    return 'material="' + s + '"';
  }
  const glow = (c, i) => M(c, { emissive: c, ei: i != null ? i : 1, metal: 0, rough: 0.35 });

  function ring() {
    return `<a-ring color="#000" opacity="0.18" radius-inner="0.12" radius-outer="0.36" rotation="-90 0 0" position="0 0.004 0" material="transparent: true; opacity: 0.18; side: double"></a-ring>`;
  }
  // 成駒の炎オーラ：回転する金リング＋立ち上る粒子
  function aura() {
    return `
      <a-torus ${M('#ffcf4a', { emissive: '#ffcf4a', ei: 1.1, metal: 0, rough: 0.4 })} radius="0.4" radius-tubular="0.022" rotation="-90 0 0" position="0 0.03 0"
        animation__a="property: rotation; from: -90 0 0; to: -90 360 0; dur: 5000; loop: true; easing: linear"></a-torus>
      <a-ring color="#ffcf4a" radius-inner="0.1" radius-outer="0.42" rotation="-90 0 0" position="0 0.012 0" material="transparent: true; opacity: 0.16; side: double"></a-ring>
      <a-octahedron ${glow('#fff0a8', 1.3)} radius="0.04" position="0.3 0.2 0"
        animation__p="property: position; from: 0.3 0.08 0; to: 0.3 1.25 0; dur: 2200; loop: true; easing: linear"></a-octahedron>
      <a-octahedron ${glow('#fff0a8', 1.3)} radius="0.034" position="-0.28 0.2 0.1"
        animation__p="property: position; from: -0.28 0.04 0.1; to: -0.28 1.3 0.1; dur: 2600; loop: true; easing: linear"></a-octahedron>
      <a-octahedron ${glow('#fff0a8', 1.3)} radius="0.03" position="0.05 0.2 -0.26"
        animation__p="property: position; from: 0.05 0.1 -0.26; to: 0.05 1.2 -0.26; dur: 2000; loop: true; easing: linear"></a-octahedron>`;
  }

  // ---------- 兜の前立て ----------
  function crest(type, trim, gem, T) {
    if (type === 'kuwagata') return `
      <a-cone ${T(trim)} radius-bottom="0.035" radius-top="0" height="0.36" position="-0.12 1.34 0.02" rotation="0 0 32"></a-cone>
      <a-cone ${T(trim)} radius-bottom="0.035" radius-top="0" height="0.36" position="0.12 1.34 0.02" rotation="0 0 -32"></a-cone>
      <a-octahedron ${glow(gem, 1.1)} radius="0.05" position="0 1.26 0.1"></a-octahedron>`;
    if (type === 'crescent') return `
      <a-torus ${T(trim)} radius="0.13" radius-tubular="0.022" arc="200" rotation="0 0 -10" position="0 1.36 0.04"></a-torus>
      <a-octahedron ${glow(gem, 1.1)} radius="0.055" position="0 1.28 0.1"></a-octahedron>`;
    if (type === 'horns') return `
      <a-cone ${T(trim)} radius-bottom="0.05" radius-top="0" height="0.3" position="-0.16 1.3 0" rotation="0 0 55"></a-cone>
      <a-cone ${T(trim)} radius-bottom="0.05" radius-top="0" height="0.3" position="0.16 1.3 0" rotation="0 0 -55"></a-cone>`;
    if (type === 'dragon') return `
      <a-cone ${T(trim)} radius-bottom="0.04" radius-top="0" height="0.34" position="-0.13 1.32 -0.05" rotation="-25 0 28"></a-cone>
      <a-cone ${T(trim)} radius-bottom="0.04" radius-top="0" height="0.34" position="0.13 1.32 -0.05" rotation="-25 0 -28"></a-cone>
      <a-octahedron ${glow(gem, 1.3)} radius="0.06" position="0 1.3 0.1"></a-octahedron>`;
    // simple
    return `<a-cone ${T(trim)} radius-bottom="0.05" radius-top="0" height="0.16" position="0 1.32 0.02"></a-cone>`;
  }

  // ---------- 武器 ----------
  function weapon(type, A, T, trim, edge) {
    if (type === 'yari') return `
      <a-cylinder ${A('#6b4a2b')} radius="0.022" height="1.15" position="0.42 0.62 0.02"></a-cylinder>
      <a-cone ${T('#dfe6ee')} radius-bottom="0.05" radius-top="0" height="0.2" position="0.42 1.28 0.02"></a-cone>
      <a-cone ${glow(edge, 0.5)} radius-bottom="0.052" radius-top="0" height="0.21" position="0.42 1.28 0.02"></a-cone>`;
    if (type === 'naginata') return `
      <a-cylinder ${A('#5a3b1f')} radius="0.022" height="1.1" position="0.44 0.58 0"></a-cylinder>
      <a-cone ${T('#e6edf5')} radius-bottom="0.07" radius-top="0" height="0.34" position="0.5 1.2 0" rotation="0 0 -28"></a-cone>
      <a-cone ${glow(edge, 0.5)} radius-bottom="0.072" radius-top="0" height="0.35" position="0.5 1.2 0" rotation="0 0 -28"></a-cone>`;
    if (type === 'longyari') return `
      <a-cylinder ${A('#6b4a2b')} radius="0.024" height="1.5" position="0.34 0.82 0.02"></a-cylinder>
      <a-torus ${T(trim)} radius="0.05" radius-tubular="0.012" rotation="90 0 0" position="0.34 0.98 0.02"></a-torus>
      <a-cone ${T('#e6edf5')} radius-bottom="0.05" radius-top="0" height="0.26" position="0.34 1.66 0.02"></a-cone>
      <a-cone ${glow(edge, 0.5)} radius-bottom="0.052" radius-top="0" height="0.27" position="0.34 1.66 0.02"></a-cone>`;
    if (type === 'katana') return `
      <a-box ${T('#e8eef6')} width="0.045" height="0.7" depth="0.02" position="0.36 0.7 0.04"></a-box>
      <a-box ${glow(edge, 0.45)} width="0.05" height="0.72" depth="0.008" position="0.39 0.7 0.04"></a-box>
      <a-torus ${T(trim)} radius="0.06" radius-tubular="0.014" rotation="90 0 0" position="0.36 0.34 0.04"></a-torus>
      <a-cylinder ${A('#3a2a18')} radius="0.018" height="0.16" position="0.36 0.25 0.04"></a-cylinder>`;
    return '';
  }

  // ---------- 翼 ----------
  function wing(side, color) {
    const x = 0.34 * side, zr = -34 * side;
    return `
      <a-box ${M(color, { rough: 0.5, metal: 0.2, side: 'double' })} width="0.5" height="0.3" depth="0.025"
        position="${x} 0.82 -0.16" rotation="6 ${-18 * side} ${zr}"></a-box>
      <a-box ${M(color, { rough: 0.5, metal: 0.2, side: 'double' })} width="0.4" height="0.24" depth="0.02"
        position="${x * 1.5} 0.6 -0.18" rotation="6 ${-18 * side} ${zr - 22 * side}"></a-box>
      <a-cone ${M(color, { rough: 0.4, metal: 0.3 })} radius-bottom="0.03" radius-top="0" height="0.22"
        position="${x * 1.9} 0.96 -0.16" rotation="0 0 ${-60 * side}"></a-cone>`;
  }

  // ---------- 武者（汎用ビルダー）----------
  function warrior(o) {
    o = o || {};
    const armor = o.armor || '#9aa3ad';
    const trim = o.trim || '#e8b53a';
    const skin = o.skin || '#ffdcb0';
    const metal = o.metal != null ? o.metal : 0.55;
    const rough = o.rough != null ? o.rough : 0.4;
    const eye = o.eye || '#8fe9ff';
    const gem = o.gem || eye;
    const A = (c) => M(c, { metal, rough });
    const T = (c) => M(c, { metal: Math.min(0.95, metal + 0.25), rough: Math.max(0.12, rough - 0.18) });

    let s = o.promoted ? aura() : ring();
    // 脚
    s += `<a-cylinder ${A('#33373e')} radius="0.1" height="0.24" position="-0.13 0.12 0.02"></a-cylinder>
          <a-cylinder ${A('#33373e')} radius="0.1" height="0.24" position="0.13 0.12 0.02"></a-cylinder>`;
    // 草摺（装甲スカート）＋裾トリム
    s += `<a-cone ${A(armor)} radius-bottom="0.34" radius-top="0.23" height="0.42" position="0 0.41 0"></a-cone>`;
    s += `<a-cylinder ${T(trim)} radius="0.345" height="0.045" position="0 0.22 0"></a-cylinder>`;
    // 胴（胸当て）＋ベルト＋胸の宝石
    s += `<a-box ${A(armor)} width="0.46" height="0.4" depth="0.32" position="0 0.8 0"></a-box>`;
    s += `<a-box ${T(trim)} width="0.48" height="0.06" depth="0.34" position="0 0.61 0"></a-box>`;
    s += `<a-octahedron ${glow(gem, 1.1)} radius="0.07" position="0 0.84 0.18"></a-octahedron>`;
    // 腕
    s += `<a-cylinder ${A(armor)} radius="0.06" height="0.36" position="-0.3 0.75 0.02"></a-cylinder>
          <a-cylinder ${A(armor)} radius="0.06" height="0.36" position="0.3 0.75 0.02"></a-cylinder>`;
    // 肩当て＋スパイク
    s += `<a-sphere ${A(armor)} radius="0.14" position="-0.3 0.97 0" scale="1 0.72 1"></a-sphere>
          <a-sphere ${A(armor)} radius="0.14" position="0.3 0.97 0" scale="1 0.72 1"></a-sphere>`;
    s += `<a-cone ${T(trim)} radius-bottom="0.05" radius-top="0" height="0.13" position="-0.34 1.06 0" rotation="0 0 28"></a-cone>
          <a-cone ${T(trim)} radius-bottom="0.05" radius-top="0" height="0.13" position="0.34 1.06 0" rotation="0 0 -28"></a-cone>`;
    // 首・頭・光るバイザー
    s += `<a-cylinder ${M(skin, { rough: 0.7 })} radius="0.06" height="0.08" position="0 1.02 0"></a-cylinder>`;
    s += `<a-sphere ${M(skin, { rough: 0.65 })} radius="0.15" position="0 1.14 0"></a-sphere>`;
    s += `<a-box ${glow(eye, 1.5)} width="0.2" height="0.035" depth="0.02" position="0 1.14 0.13"></a-box>`;
    // 兜
    s += `<a-sphere ${T(armor)} radius="0.17" position="0 1.2 0" scale="1 0.82 1"></a-sphere>`;
    s += `<a-cone ${A(armor)} radius-bottom="0.21" radius-top="0.16" height="0.09" position="0 1.07 -0.03"></a-cone>`;
    s += crest(o.helmet, trim, gem, T);
    // 武器・マント・翼
    s += weapon(o.weapon, A, T, trim, eye);
    if (o.cape) s += `<a-plane ${M(o.cape, { rough: 0.75, side: 'double' })} width="0.5" height="0.66" position="0 0.66 -0.2" rotation="12 0 0"></a-plane>`;
    if (o.wings) s += wing(-1, o.wings) + wing(1, o.wings);
    if (o.wheels) {
      const wheel = (x) => `
        <a-torus ${M('#16161c', { metal: 0.4, rough: 0.5 })} radius="0.27" radius-tubular="0.05" position="${x} 0.27 0" rotation="0 90 0"></a-torus>
        <a-torus ${T(trim)} radius="0.28" radius-tubular="0.018" position="${x} 0.27 0" rotation="0 90 0"></a-torus>
        <a-cylinder ${T(trim)} radius="0.045" height="0.07" rotation="0 0 90" position="${x} 0.27 0"></a-cylinder>
        <a-box ${T(trim)} width="0.015" height="0.5" depth="0.015" position="${x} 0.27 0" rotation="90 0 0"></a-box>
        <a-box ${T(trim)} width="0.015" height="0.5" depth="0.015" position="${x} 0.27 0" rotation="90 90 0"></a-box>`;
      s += wheel(-0.42) + wheel(0.42);
    }
    return s;
  }

  // ---------- 騎馬武者（桂馬）----------
  function horseRider(o) {
    o = o || {};
    const horse = o.horse || '#6b4a2e';
    const armor = o.armor || '#2f9e57';
    const trim = o.trim || '#bdeccb';
    const eye = o.eye || '#a6ffc6';
    const HM = (c) => M(c, { metal: 0.05, rough: 0.75 });
    const A = (c) => M(c, { metal: 0.5, rough: 0.4 });
    const T = (c) => M(c, { metal: 0.7, rough: 0.22 });
    let s = o.promoted ? aura() : ring();
    // --- 馬 ---
    const leg = (x, z) => `<a-cylinder ${HM(horse)} radius="0.05" height="0.36" position="${x} 0.18 ${z}"></a-cylinder>
      <a-cylinder ${M('#241810', { rough: 0.8 })} radius="0.053" height="0.07" position="${x} 0.035 ${z}"></a-cylinder>`;
    s += leg(-0.13, 0.21) + leg(0.13, 0.21) + leg(-0.13, -0.19) + leg(0.13, -0.19);
    s += `<a-cylinder ${HM(horse)} radius="0.15" height="0.6" rotation="90 0 0" position="0 0.5 0.02"></a-cylinder>`;       // 胴
    s += `<a-sphere ${HM(horse)} radius="0.15" position="0 0.5 0.32" scale="1 1 0.8"></a-sphere>`;                          // 胸
    s += `<a-cone ${HM('#4a3420')} radius-bottom="0.05" radius-top="0" height="0.32" position="0 0.5 -0.34" rotation="-55 0 0"></a-cone>`; // 尾
    s += `<a-box ${HM(horse)} width="0.16" height="0.36" depth="0.16" position="0 0.7 0.34" rotation="32 0 0"></a-box>`;    // 首
    s += `<a-box ${HM('#3a2616')} width="0.05" height="0.2" depth="0.34" position="0 0.78 0.26" rotation="32 0 0"></a-box>`; // たてがみ
    s += `<a-box ${HM(horse)} width="0.13" height="0.16" depth="0.27" position="0 0.9 0.46" rotation="14 0 0"></a-box>`;    // 頭
    s += `<a-box ${HM('#5a3e24')} width="0.11" height="0.1" depth="0.12" position="0 0.86 0.6"></a-box>`;                   // 鼻先
    s += `<a-cone ${HM(horse)} radius-bottom="0.03" radius-top="0" height="0.1" position="-0.05 1.0 0.4"></a-cone>
          <a-cone ${HM(horse)} radius-bottom="0.03" radius-top="0" height="0.1" position="0.05 1.0 0.4"></a-cone>`;          // 耳
    s += `<a-box ${glow(eye, 1.2)} width="0.02" height="0.02" depth="0.02" position="0 0.9 0.62"></a-box>`;                 // 目
    s += `<a-box ${T(trim)} width="0.32" height="0.07" depth="0.3" position="0 0.66 0.02"></a-box>`;                       // 鞍
    // --- 騎手（座位の武者）---
    s += `<a-cylinder ${A(armor)} radius="0.05" height="0.22" position="-0.15 0.6 0.08" rotation="22 0 0"></a-cylinder>
          <a-cylinder ${A(armor)} radius="0.05" height="0.22" position="0.15 0.6 0.08" rotation="22 0 0"></a-cylinder>`;     // 脚
    s += `<a-box ${A(armor)} width="0.27" height="0.28" depth="0.22" position="0 0.86 0"></a-box>`;                        // 胴
    s += `<a-octahedron ${glow(o.gem || eye, 1.1)} radius="0.05" position="0 0.88 0.12"></a-octahedron>`;                  // 胸宝石
    s += `<a-sphere ${A(armor)} radius="0.1" position="-0.17 0.99 0" scale="1 0.7 1"></a-sphere>
          <a-sphere ${A(armor)} radius="0.1" position="0.17 0.99 0" scale="1 0.7 1"></a-sphere>`;                           // 肩
    s += `<a-sphere ${M('#ffd0a0', { rough: 0.65 })} radius="0.11" position="0 1.1 0"></a-sphere>`;                        // 頭
    s += `<a-box ${glow(eye, 1.5)} width="0.14" height="0.028" depth="0.02" position="0 1.1 0.09"></a-box>`;               // バイザー
    s += `<a-sphere ${T(armor)} radius="0.12" position="0 1.16 0" scale="1 0.8 1"></a-sphere>`;                            // 兜
    s += `<a-cone ${T(trim)} radius-bottom="0.03" radius-top="0" height="0.2" position="-0.08 1.28 0" rotation="0 0 42"></a-cone>
          <a-cone ${T(trim)} radius-bottom="0.03" radius-top="0" height="0.2" position="0.08 1.28 0" rotation="0 0 -42"></a-cone>`; // 角（馬の前立て）
    // 槍（斜めに構える）
    s += `<a-cylinder ${M('#6b4a2b', { rough: 0.5 })} radius="0.02" height="1.15" position="0.26 1.0 0.18" rotation="22 0 -10"></a-cylinder>`;
    s += `<a-cone ${T('#dfe6ee')} radius-bottom="0.045" radius-top="0" height="0.2" position="0.36 1.5 0.36" rotation="22 0 -10"></a-cone>`;
    return s;
  }

  // ---------- 魔導士（角・馬）----------
  function mage(o) {
    o = o || {};
    const robe = o.robe || '#5e2e9e';
    const trim = o.trim || '#c9a0ff';
    const orb = o.orb || '#b07bff';
    const eye = o.eye || '#d9b3ff';
    const T = (c) => M(c, { metal: 0.4, rough: 0.3 });
    let s = o.promoted ? aura() : ring();
    // ローブ（裾広がり）
    s += `<a-cone ${M(robe, { rough: 0.6, metal: 0.1 })} radius-bottom="0.36" radius-top="0.12" height="0.92" position="0 0.46 0"></a-cone>`;
    s += `<a-cylinder ${T(trim)} radius="0.135" height="0.05" position="0 0.92 0"></a-cylinder>`;
    // 肩・フード
    s += `<a-sphere ${M(robe, { rough: 0.6 })} radius="0.2" position="0 0.95 0" scale="1 0.7 1"></a-sphere>`;
    s += `<a-cone ${M(robe, { rough: 0.6 })} radius-bottom="0.2" radius-top="0.02" height="0.34" position="0 1.2 -0.02"></a-cone>`;
    // フード内の暗がり＋光る目
    s += `<a-sphere ${M('#140a22', { rough: 1 })} radius="0.14" position="0 1.08 0.04"></a-sphere>`;
    s += `<a-sphere ${glow(eye, 1.6)} radius="0.028" position="-0.05 1.1 0.14"></a-sphere>
          <a-sphere ${glow(eye, 1.6)} radius="0.028" position="0.05 1.1 0.14"></a-sphere>`;
    // 杖＋大宝石＋回転ハロー
    s += `<a-cylinder ${M('#3a2a18', { rough: 0.5, metal: 0.2 })} radius="0.022" height="1.25" position="0.42 0.62 0.04"></a-cylinder>`;
    s += `<a-octahedron ${glow(orb, 1.4)} radius="0.1" position="0.42 1.32 0.04"
            animation__s="property: scale; from: 0.85 0.85 0.85; to: 1.15 1.15 1.15; dir: alternate; dur: 900; loop: true; easing: easeInOutSine"></a-octahedron>`;
    s += `<a-torus ${glow(trim, 0.8)} radius="0.16" radius-tubular="0.012" position="0.42 1.32 0.04"
            animation__r="property: rotation; from: 0 0 0; to: 360 180 0; dur: 4000; loop: true; easing: linear"></a-torus>`;
    // 浮遊する魔法の小宝石
    s += `<a-octahedron ${glow(orb, 1.2)} radius="0.04" position="-0.34 1.1 0.1"
            animation__o="property: rotation; from: 0 0 0; to: 360 360 0; dur: 3000; loop: true; easing: linear"></a-octahedron>`;
    if (o.wings) s += wing(-1, o.wings) + wing(1, o.wings);
    if (o.promoted) s += crest('dragon', trim, orb, T);
    return s;
  }

  // ---------- 王将 ----------
  function king() {
    const gold = '#e7c34a', trim = '#fff0a8';
    const A = (c) => M(c, { metal: 0.85, rough: 0.25 });
    const T = (c) => M(c, { metal: 0.95, rough: 0.15 });
    let s = ring();
    // 玉座
    s += `<a-box ${M('#5a1414', { rough: 0.6, metal: 0.2 })} width="0.78" height="1.05" depth="0.16" position="0 0.58 -0.3"></a-box>`;
    s += `<a-cone ${T(gold)} radius-bottom="0.07" radius-top="0" height="0.16" position="-0.34 1.16 -0.3"></a-cone>
          <a-cone ${T(gold)} radius-bottom="0.07" radius-top="0" height="0.16" position="0.34 1.16 -0.3"></a-cone>`;
    // マント
    s += `<a-plane ${M('#7a1020', { rough: 0.75, side: 'double' })} width="0.6" height="0.8" position="0 0.62 -0.2" rotation="10 0 0"></a-plane>`;
    // 脚
    s += `<a-cylinder ${A('#33373e')} radius="0.11" height="0.24" position="-0.14 0.12 0.04"></a-cylinder>
          <a-cylinder ${A('#33373e')} radius="0.11" height="0.24" position="0.14 0.12 0.04"></a-cylinder>`;
    // 草摺・胴
    s += `<a-cone ${A(gold)} radius-bottom="0.38" radius-top="0.26" height="0.46" position="0 0.44 0.02"></a-cone>`;
    s += `<a-box ${A(gold)} width="0.5" height="0.44" depth="0.34" position="0 0.86 0.02"></a-box>`;
    s += `<a-box ${T(trim)} width="0.52" height="0.07" depth="0.36" position="0 0.64 0.02"></a-box>`;
    // 胸の大宝石
    s += `<a-octahedron ${glow('#ff5a5a', 1.2)} radius="0.09" position="0 0.9 0.2"></a-octahedron>`;
    // 肩当て＋スパイク
    s += `<a-sphere ${A(gold)} radius="0.16" position="-0.33 1.04 0.02" scale="1 0.72 1"></a-sphere>
          <a-sphere ${A(gold)} radius="0.16" position="0.33 1.04 0.02" scale="1 0.72 1"></a-sphere>`;
    s += `<a-cone ${T(trim)} radius-bottom="0.06" radius-top="0" height="0.16" position="-0.38 1.16 0.02" rotation="0 0 26"></a-cone>
          <a-cone ${T(trim)} radius-bottom="0.06" radius-top="0" height="0.16" position="0.38 1.16 0.02" rotation="0 0 -26"></a-cone>`;
    // 頭・髭風・目
    s += `<a-sphere ${M('#ffdcb0', { rough: 0.65 })} radius="0.17" position="0 1.2 0.04"></a-sphere>`;
    s += `<a-box ${glow('#ffe07a', 1.3)} width="0.22" height="0.04" depth="0.02" position="0 1.2 0.18"></a-box>`;
    // 王冠
    s += `<a-cylinder ${T(gold)} radius="0.2" height="0.12" position="0 1.4 0.04"></a-cylinder>`;
    s += `<a-cone ${T(gold)} radius-bottom="0.05" radius-top="0" height="0.2" position="0 1.54 0.04"></a-cone>
          <a-cone ${T(gold)} radius-bottom="0.05" radius-top="0" height="0.15" position="-0.15 1.49 0.04"></a-cone>
          <a-cone ${T(gold)} radius-bottom="0.05" radius-top="0" height="0.15" position="0.15 1.49 0.04"></a-cone>`;
    s += `<a-octahedron ${glow('#7fe6ff', 1.2)} radius="0.05" position="0 1.5 0.14"></a-octahedron>`;
    return s;
  }

  // ---------- 足軽（歩兵）：最弱の駒らしく素朴・小柄・非金属 ----------
  function footsoldier(o) {
    o = o || {};
    const cloth = o.cloth || '#b5483f';
    const trim = o.trim || '#caa15a';
    const skin = o.skin || '#ffd0a0';
    const hat = o.hat || '#9a7b46';
    const C = (c) => M(c, { metal: 0.05, rough: 0.85 });   // 布（非金属・つや消し）
    const L = (c) => M(c, { metal: 0.15, rough: 0.6 });
    let s = ring();
    // 脚（脚絆）
    s += `<a-cylinder ${C('#6a4a30')} radius="0.07" height="0.2" position="-0.1 0.1 0.02"></a-cylinder>
          <a-cylinder ${C('#6a4a30')} radius="0.07" height="0.2" position="0.1 0.1 0.02"></a-cylinder>`;
    // 着物（裾広がり・控えめ）＋帯
    s += `<a-cone ${C(cloth)} radius-bottom="0.24" radius-top="0.17" height="0.44" position="0 0.4 0"></a-cone>`;
    s += `<a-cylinder ${L(trim)} radius="0.185" height="0.05" position="0 0.5 0"></a-cylinder>`;
    s += `<a-box ${C('#8a352e')} width="0.06" height="0.3" depth="0.02" position="0 0.56 0.165" rotation="0 0 8"></a-box>`;
    // 腕
    s += `<a-cylinder ${C(cloth)} radius="0.045" height="0.3" position="-0.21 0.56 0.02" rotation="0 0 7"></a-cylinder>
          <a-cylinder ${C(cloth)} radius="0.045" height="0.3" position="0.21 0.56 0.02" rotation="0 0 -7"></a-cylinder>`;
    // 頭（小さめ）＋素朴な点目
    s += `<a-sphere ${M(skin, { rough: 0.75 })} radius="0.135" position="0 0.84 0"></a-sphere>`;
    s += `<a-sphere ${M('#2a1c12', { rough: 0.5 })} radius="0.022" position="-0.05 0.85 0.12"></a-sphere>
          <a-sphere ${M('#2a1c12', { rough: 0.5 })} radius="0.022" position="0.05 0.85 0.12"></a-sphere>`;
    // 陣笠（円錐の笠）
    s += `<a-cone ${L(hat)} radius-bottom="0.27" radius-top="0.02" height="0.16" position="0 0.99 0"></a-cone>`;
    s += `<a-sphere ${L(hat)} radius="0.03" position="0 1.07 0"></a-sphere>`;
    // 素朴な竹槍
    s += `<a-cylinder ${C('#7a5a32')} radius="0.016" height="1.0" position="0.28 0.6 0.02"></a-cylinder>`;
    s += `<a-cone ${M('#c8cdd4', { metal: 0.45, rough: 0.45 })} radius-bottom="0.035" radius-top="0" height="0.13" position="0.28 1.16 0.02"></a-cone>`;
    return s;
  }

  // ---------- 各駒 ----------
  const B = {};
  B.fu   = () => footsoldier({ cloth: '#b5483f', trim: '#caa15a', hat: '#9a7b46' });
  B.kyo  = () => warrior({ armor: '#c5793a', trim: '#ffd9a0', metal: 0.45, rough: 0.45, helmet: 'simple',   weapon: 'longyari', eye: '#ffcf6a', gem: '#ffcf6a' });
  B.kei  = () => horseRider({ horse: '#6b4a2e', armor: '#2f9e57', trim: '#bdeccb', eye: '#a6ffc6', gem: '#a6ffc6' });
  B.gin  = () => warrior({ armor: '#c2cad4', trim: '#f0f5fb', metal: 0.85, rough: 0.25, helmet: 'kuwagata', weapon: 'katana',   cape: '#46577a', eye: '#cdeeff', gem: '#cdeeff' });
  B.kin  = () => warrior({ armor: '#e3b53a', trim: '#fff0a8', metal: 0.9, rough: 0.22, helmet: 'crescent', weapon: 'katana',   cape: '#7a3030', eye: '#fff0a8', gem: '#fff3b0' });
  B.kaku = () => mage({ robe: '#5e2e9e', trim: '#caa6ff', orb: '#b07bff', eye: '#e0c2ff' });
  B.hi   = () => warrior({ armor: '#3f6fd0', trim: '#bcd6ff', metal: 0.75, rough: 0.28, helmet: 'kuwagata', weapon: 'longyari', wheels: true, eye: '#bcecff', gem: '#bcecff' });
  B.ou   = () => king();

  B.to   = () => warrior({ armor: '#bd3a3a', trim: '#ffd700', metal: 0.5, rough: 0.4, helmet: 'crescent', weapon: 'yari',   eye: '#ffe07a', gem: '#ffd700', promoted: true });
  B.nkyo = () => warrior({ armor: '#cf8a3a', trim: '#ffe07a', metal: 0.6, rough: 0.35, helmet: 'crescent', weapon: 'longyari', eye: '#ffe07a', gem: '#ffd700', promoted: true });
  B.nkei = () => warrior({ armor: '#34ad60', trim: '#ffe07a', metal: 0.6, rough: 0.35, helmet: 'crescent', weapon: 'yari',   eye: '#cbffd9', gem: '#ffd700', promoted: true });
  B.ngin = () => warrior({ armor: '#cfd6e0', trim: '#ffe07a', metal: 0.9, rough: 0.2, helmet: 'crescent', weapon: 'katana', cape: '#5a4a2a', eye: '#fff0c0', gem: '#ffd700', promoted: true });
  B.uma  = () => mage({ robe: '#5e2e9e', trim: '#ffd700', orb: '#ffcf66', eye: '#ffe6a8', wings: '#b88bff', promoted: true });
  B.ryu  = () => warrior({ armor: '#2f6fd0', trim: '#ffd700', metal: 0.8, rough: 0.25, helmet: 'dragon', weapon: 'naginata', wings: '#37c2da', eye: '#aef0ff', gem: '#ffd700', promoted: true });

  // ---------- レジストリ ----------
  const PIECES = [
    { key: 'fu',   kanji: '歩',   name: '歩兵',  romaji: 'Fu / Pawn' },
    { key: 'kyo',  kanji: '香',   name: '香車',  romaji: 'Kyō / Lance', tall: true },
    { key: 'kei',  kanji: '桂',   name: '桂馬',  romaji: 'Kei / Knight', tall: true },
    { key: 'gin',  kanji: '銀',   name: '銀将',  romaji: 'Gin / Silver' },
    { key: 'kin',  kanji: '金',   name: '金将',  romaji: 'Kin / Gold' },
    { key: 'kaku', kanji: '角',   name: '角行',  romaji: 'Kaku / Bishop' },
    { key: 'hi',   kanji: '飛',   name: '飛車',  romaji: 'Hi / Rook', tall: true },
    { key: 'ou',   kanji: '王',   name: '王将',  romaji: 'Ō / King', tall: true },
    { key: 'to',   kanji: 'と',   name: 'と金',  romaji: 'To (+Pawn)',    promoted: true },
    { key: 'nkyo', kanji: '成香', name: '成香',  romaji: '+Lance',        promoted: true, tall: true },
    { key: 'nkei', kanji: '成桂', name: '成桂',  romaji: '+Knight',       promoted: true },
    { key: 'ngin', kanji: '成銀', name: '成銀',  romaji: '+Silver',       promoted: true },
    { key: 'uma',  kanji: '馬',   name: '龍馬',  romaji: 'Uma (+Bishop)', promoted: true },
    { key: 'ryu',  kanji: '龍',   name: '龍王',  romaji: 'Ryū (+Rook)',   promoted: true, tall: true },
  ];
  PIECES.forEach(p => { p.build = B[p.key]; });

  function pieceEntityHTML(key, opts) {
    opts = opts || {};
    const scale = opts.scale != null ? opts.scale : 1;
    const inner = (B[key] || B.fu)();
    const bob = opts.bob === false ? '' :
      `animation__bob="property: position; from: 0 0 0; to: 0 0.07 0; dir: alternate; dur: ${opts.bobDur || 1100}; loop: true; easing: easeInOutSine"`;
    return `<a-entity scale="${scale} ${scale} ${scale}" ${bob}>${inner}</a-entity>`;
  }

  window.SHOGI_PIECES = PIECES;
  window.SHOGI_BUILD = B;
  window.shogiPieceEntityHTML = pieceEntityHTML;
})();
