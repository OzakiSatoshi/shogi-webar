# 将棋WebAR

人間が物理盤・物理駒で指す将棋に、スマホブラウザ越しでローポリの3DキャラクターをAR表示する Web AR アプリ。
ルールエンジンは持たず、**見た目の演出（AR表現レイヤー）のみ**を担う。詳細は [`requirement.md`](./requirement.md) 参照。

技術: **A-Frame + MindAR.js（画像トラッキング）** / ビルドレスの静的サイト。
iOS Safari・Android Chrome 両対応。

---

## Phase 1-1 プロトタイプ（現在）

`index.html` ＝ 最小構成のプロトタイプ。

- 1枚の画像マーカーを認識すると、その上に**ローポリの「歩兵」**（赤い箱の胴体＋黄色いとんがり頭＋槍）が出現。
- 常時**アイドルアニメーション**（上下の揺れ＋微小な首振り）を自動再生。
- マーカーは MindAR 公式サンプル（`card`）を使用 → **すぐ動かして確認できる**。

> このフェーズの目的は「A-Frame×MindAR で物理マーカー上にプリミティブ製キャラを重畳・追従表示できる」ことの実証です。
> 将棋40駒の同時追従可否（最大の技術リスク）は Phase 1-3 で複数マーカーを使って実測します。

---

## 動かし方

カメラ利用には **HTTPS** が必要です（例外: `localhost` はHTTPでも可）。

### A. PCのブラウザで手早く確認（localhost）
```bash
# このディレクトリで静的サーバを起動（どれか1つ）
python3 -m http.server 8080
#   または
npx serve -l 8080
```
ブラウザで `http://localhost:8080` を開く → 「カメラを起動」→ PC画面/別端末に表示した**マーカー画像**を背面カメラで映す。

> マーカー画像はアプリの起動画面に表示されます。別のPC/スマホで開いて映すか、印刷してもOK。
> 直接: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png

### B. スマホ実機でテスト（HTTPSが必要）
ローカルの開発サーバをHTTPSで外部公開する。最も手軽なのはトンネル:
```bash
# 例: cloudflared でローカル8080をHTTPS公開
python3 -m http.server 8080 &
npx cloudflared tunnel --url http://localhost:8080
# 表示された https://....trycloudflare.com をスマホで開く
```
あるいは Vercel / GitHub Pages 等へ静的デプロイして、その HTTPS URL をスマホで開く。

> iOS Safari はユーザー操作（ボタンタップ）を起点にしないとカメラ権限を要求できないため、
> 本プロトタイプは「カメラを起動」ボタン押下で `mindarSystem.start()` を呼ぶ構成にしています。

---

## 自作マーカー（実際の将棋駒）への差し替え方

Phase 2 以降、将棋駒用のマーカーに置き換える手順:

1. マーカーにしたい画像を用意（駒の意匠／駒に貼る固有パターン等。特徴点が多くコントラストの高い画像が認識精度◎）。
2. MindAR の **Image Target Compiler** で `.mind` を生成
   → https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. 生成した `targets.mind` を本リポジトリ（例 `assets/targets.mind`）に配置。
4. `index.html` の `mindar-image="imageTargetSrc: ..."` を自作 `.mind` のパスに変更。
5. 複数マーカーは `.mind` に複数画像をまとめてコンパイルし、`mindar-image-target="targetIndex: N"` を画像ごとに用意。
   同時追従数は `mindar-image="maxTrack: N"` で指定（**増やすほど負荷増 → Phase 1-3 で実機実測**）。

---

## 次のステップ
- Phase 1-2: アイドル演出のブラッシュアップ、ライティング調整。
- Phase 1-3: **複数マーカーの同時追従を実機実測**（同時何枚まで安定するか → 初版スコープ確定）。
- Phase 2: 駒種ごとのローポリデザイン実装、成駒の差分。

詳細なフェーズ計画は [`requirement.md`](./requirement.md) の「8. 開発フェーズ計画」を参照。
