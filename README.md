# Kaito-Iwasaki Portfolio

赤・白・丸い形とベニテングダケをモチーフにした静的ポートフォリオです。

## 構成

- dist/index.html: 自己紹介、スキル、作品一覧の入れ物、詳細モーダル、連絡先
- dist/projects.js: 作品データ（作品を追加・編集する場所）
- dist/style.css: スマートフォン対応デザイン
- dist/script.js: 作品一覧の生成、モーダル、スクリーンショット切替、フェードイン、Discordコピー
- dist/mushroom.svg: オリジナルアイコン
- dist/images/: 作品の画像

外部ライブラリやビルドは不要です。作品情報はサイト内のデータから読み込むため、GitHubのAPIやリポジトリに依存しません。

## 作品を追加する

dist/projects.js の window.portfolioProjects 配列に、以下のような作品データを追加します。idは作品ごとに違う名前にしてください。

```js
{
  id: "my-new-work",
  title: "新しい作品",
  tags: ["C++", "3D"],
  summary: "カードとモーダルの最初に表示する短い紹介文。",
  description: [
    "作品の詳しい説明。",
    "段落を増やすときは文字列を追加します。"
  ],
  screenshots: [
    {
      src: "images/my-work-01.png",
      alt: "タイトル画面",
      caption: "ゲームのタイトル画面"
    },
    {
      src: "images/my-work-02.png",
      alt: "プレイ画面",
      caption: "ゲームのプレイ画面"
    }
  ],
  highlights: [
    "制作時に工夫した点。",
    "担当した部分や、課題を解決した方法。"
  ],
  links: [
    { label: "遊んでみる", url: "https://example.com/" }
  ]
}
```

- screenshotsには複数の画像を指定できます。モーダルの矢印で切り替えます。
- highlightsを空の配列 [] にすると「詳細を準備中です。」と表示します。
- screenshotsを [] にすると「スクリーンショットを準備中です。」と表示します。
- linksは任意です。[] にすると関連リンク欄を表示しません。GitHubリンクは不要です。
- デモ、動画、配布ページなどのHTTP/HTTPSリンクを登録できます。
- 一覧のカバー画像にはscreenshotsの最初の画像を使います。
- 画像はdist/images/に追加し、srcではimages/から始まるパスを指定します。
- 配列の作品数に合わせてカードを自動生成します。HTMLのカードを手作業で増やす必要はありません。

## 掲載内容

GitHubの公開ソースから確認できたC++、DirectX 9、Visual Studioを掲載。経験年数や個人の担当範囲は未確認のため記載していません。
現在の3作品は、ユーザー指定の3Dキャラクター画像を共通の仮画像として使い、詳しい説明と工夫した点は準備中にしています。

## 公開

mainへ変更を反映すると、GitHub ActionsがdistをGitHub Pagesへ公開します。
公開先: https://kaito-iwasaki.github.io/amanita-portfolio/

dist/index.htmlをブラウザーで開くこともできます。クリップボード操作にはHTTPSまたはlocalhostが必要です。
