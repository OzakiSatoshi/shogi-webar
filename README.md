# 将棋WebAR

人間が物理盤・物理駒で指す将棋に、スマホブラウザ越しでローポリの3DキャラクターをAR表示する Web AR アプリ。
ルールエンジンは持たず、**見た目の演出（AR表現レイヤー）のみ**を担う。詳細は [`requirement.md`](./requirement.md) 参照。

技術: **A-Frame + MindAR.js（画像トラッキング）** / ビルドレスの静的サイト。
iOS Safari・Android Chrome 両対応。

---

## 現在の状態：Phase 2（駒キャラAR・統合済み）

`index.html` ＝ **本番ARアプリ**。各マーカー（駒の漢字付き）の上に、対応する
14種の駒キャラ（`pieces.js`）を立ててアイドル演出する。

- セット選択 `?set=`：`types`（全14種・既定）／`side`（先手20枚）／`full`（両陣40枚）
- マーカー種別 `?marker=`（UIのボタンでも切替）：
  - `std`（**一般・二字駒**・既定）／`real`（装飾・赤木地一字）／`koma`（自作の駒風）／`pattern`（抽象・最大追従）
- 各マーカー＝**駒面＋駒ごと固有の杢（追従＆同種駒の識別）**。後手は△▽で区別し180°反転。
- 画面に**印刷用マーカーシート**を表示。上部に「表示中 k/N 駒」、左上に FPS。

> **駒面画像のクレジット**
> - `std`（一般・二字駒）: **orangain / shogi-piece-images**（原作 Hari Seldon@Wikimedia）/ **CC BY-SA 3.0**。`assets/koma-std/CREDITS.md`
> - `real`（装飾・赤木地）: **Ka-hu / shogi-pieces** `kanji_red_wood` / **CC BY 4.0**。`assets/koma/CREDITS.md`

### 駒キャラ（`pieces.js` / ギャラリー `gallery.html`）
- A-Frame プリミティブのみで作る14種（基本8＋成6）。鎧・兜・武器・マント・翼・宝石・発光・成りオーラ等。
- 歩＝足軽（陣笠の素朴な雑兵）、桂馬＝騎馬、香車＝長槍、飛車＝戦車（車輪）、と金＝歩の面影＋金。
- `gallery.html` はカメラ不要で全14種を回転レビューできる（デザイン確認用）。

### `scaling.html`（旧 index）
- Phase 1-3 の**マルチマーカー・スケーリング検証**版（`?n=` で枚数指定）。同時追従数とFPSの実測用に保持。

### 実行時コンパイル方式（重要な設計判断）
MindARの `.mind` コンパイルは **tfjs の WebGL バックエンド必須**で、CI/ヘッドレス環境
（WSL2のソフトウェアGPU）では tfjs が CPU にフォールバックして失敗する
（`Kernel 'BinomialFilter' not registered for backend 'cpu'`）。
そこで本検証版は **実機ブラウザ（実GPU）上で、起動時にマーカーを生成→コンパイル→
そのまま AR に使用**する方式を採用。結果は **IndexedDB にキャッシュ**し、再読込を高速化。

- 初回読込：マーカーをコンパイル（数秒〜数十秒、プログレスバー表示）。カメラ権限は不要。
- 「カメラを起動」タップ：**ユーザー操作内で `getUserMedia`** を発火（iOS対策）。

### 完了済み
- **Phase 1**：単一→複数マーカー追従の実証。**〜20枚安定・ほぼ60FPS**（`scaling.html` で実測）。
- **Phase 2**：14種の駒キャラ実装＋ARアプリへ統合。

### `assets/`
- `marker-01〜12.png` … 生成済みマーカー（512px、印刷用）。`markers-grid.png` は n=12 のシート。
  ページは実行時に同一アルゴリズムで再生成するため、これらは印刷の便宜用。

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
