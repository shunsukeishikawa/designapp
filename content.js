/*
 * 診断コンテンツ定義。
 *
 * 画面の見た目（文字・イラスト・ボタン）はすべて svgs/ と assets/ の画像です。
 * デザインを差し替えるときは、同じファイル名で上書きするだけで反映されます。
 * ボタンの位置を調整したいときは style.css の「ボタン位置」の数値
 * （Figmaのデザイン幅390px基準の座標）を変更してください。
 *
 * このファイルの文言（label / text / alt）は画面には表示されず、
 * 読み上げ（アクセシビリティ）用の代替テキストとして使われます。
 */

const CONTENT = {
  top: {
    base: 'svgs/app_top.svg',
    alt: '「あたり前」Jumper診断 〜あなたはどのJumperタイプ？〜 「あたり前を越えるアイデアをくれ」クライアントや上司に言われたら、あなたならどう飛び越えますか？ 4つの質問で診断してみましょう！',
    heroVideo: 'assets/top-hero.mp4',
    heroPoster: 'assets/top-hero-poster.jpg',
    startButton: { image: 'svgs/app_btn_top.svg', label: 'いますぐ診断へJump!' },
    counterLabel: 'これまでの診断数：{count}回',
  },

  // axis: 'personal'（＋個人 / −集団） or 'emotion'（＋感情 / −論理）
  // 配点は構成図（Figma）の「配点ロジック」に準拠。
  questions: [
    {
      base: 'svgs/app_q1.svg',
      text: 'Q1 「是非、力になって！」と言われた瞬間は？',
      axis: 'emotion',
      choices: [
        { key: 'A', label: '「もちろんです！任せてください！」', image: 'svgs/app_btn_q1-a.svg', score: 1 },
        { key: 'B', label: '「まずは目的から整理させてください」', image: 'svgs/app_btn_q1-b.svg', score: -1 },
      ],
    },
    {
      base: 'svgs/app_q2.svg',
      text: 'Q2 どっちの瞬間が多い？',
      axis: 'personal',
      choices: [
        { key: 'A', label: 'アイディアが実現した未来を妄想して「ムフフッ」', image: 'svgs/app_btn_q2-a.svg', score: 1 },
        { key: 'B', label: 'アイディアをブレストしてみんなで「いけそう！」', image: 'svgs/app_btn_q2-b.svg', score: -1 },
      ],
    },
    {
      base: 'svgs/app_q3.svg',
      text: 'Q3 想定外のことが起きて予定がくるった！',
      axis: 'emotion',
      choices: [
        { key: 'A', label: 'くるった箇所をしっかり直してから進める', image: 'svgs/app_btn_q3-a.svg', score: 1 },
        { key: 'B', label: 'くるった箇所は一旦そのままにして進める', image: 'svgs/app_btn_q3-b.svg', score: -1 },
      ],
    },
    {
      base: 'svgs/app_q4.svg',
      text: 'Q4 実際に行動に移す決め手は？',
      axis: 'emotion',
      choices: [
        { key: 'A', label: '使命感とバイブス', image: 'svgs/app_btn_q4-a.svg', score: 1 },
        { key: 'B', label: 'データによるガチ根拠', image: 'svgs/app_btn_q4-b.svg', score: -1 },
      ],
    },
  ],

  backButton: { image: 'svgs/app_btn_back.svg', label: 'もどる' },

  // 軸1（personal合計の符号）× 軸2（emotion合計の符号）→ タイプ
  matrix: {
    personal_emotion: 'A',
    group_emotion: 'B',
    personal_logic: 'C',
    group_logic: 'D',
  },

  results: {
    A: {
      name: 'Type-A 怖いもの知らJumper',
      page: 'svgs/app_A.svg',
      modal: 'svgs/app_modal_A.svg',
      card: 'svgs/app_btn_A.svg',
    },
    B: {
      name: 'Type-B 祭りだわっしょいわっJumper',
      page: 'svgs/app_B.svg',
      modal: 'svgs/app_modal_B.svg',
      card: 'svgs/app_btn_B.svg',
    },
    C: {
      name: 'Type-C 先んずれば人を制Jumper',
      page: 'svgs/app_C.svg',
      modal: 'svgs/app_modal_C.svg',
      card: 'svgs/app_btn_C.svg',
    },
    D: {
      name: 'Type-D シンクロナイJumper',
      page: 'svgs/app_D.svg',
      modal: 'svgs/app_modal_D.svg',
      card: 'svgs/app_btn_D.svg',
    },
  },

  noteButton: { image: 'svgs/app_btn_note.svg', label: 'note記事へJump!' },
  closeButton: { image: 'svgs/app_btn_close.svg', label: '閉じる' },

  noteArticleUrl: 'https://note.com/sompo_sprint/n/n93d0e97bf296',
};
