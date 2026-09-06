/*
 * 診断コンテンツ定義。
 * タイプ名称・質問文・配色・note記事URLは未確定のため、
 * ここを書き換えるだけで差し替えられるようにしている。
 */

const CONTENT = {
  top: {
    eyebrow: 'SOMPO Design Studio Presents',
    title: 'あたり前JUMPER診断',
    subtitle: '〜あなたはどのJUMPERタイプ？〜',
    lead: '「あたり前を超えるアイデアをくれ」\nクライアントや上司に言われたら、\nあなたならどう飛び越えますか飛び越えますか？\nあなたの「あたり前」のJUMPタイプを診断してみましょう。',
    startButton: 'いますぐ診断へJUMP！',
    counterLabel: 'これまでの診断数：{count}回',
  },

  questions: [
    {
      id: 'Q1',
      title: 'Q1',
      text: '「力になって！」と言われた瞬間は？',
      axis: 'personal', // 'personal': 個人⇔集団, 'emotion': 感情⇔論理
      choices: [
        { key: 'A', label: 'ひとりで「モクモク・コソコソ...」', score: 2 },
        { key: 'B', label: '誰かに言いたい！「ねえちょっと聞いて？」', score: -2 },
      ],
    },
    {
      id: 'Q2',
      title: 'Q2',
      text: '仕事中どっちの瞬間が多い？',
      axis: 'emotion',
      choices: [
        { key: 'A', label: 'もちろんです！任せてください！', score: 1 },
        { key: 'B', label: 'まずは目的から整理させてください', score: -1 },
      ],
    },
    {
      id: 'Q3',
      title: 'Q3',
      text: '想定外のことが起きて予定がくるった！',
      axis: 'personal',
      choices: [
        { key: 'A', label: 'アイディアが実現した未来を妄想して「ムフフッ」', score: 1 },
        { key: 'B', label: 'アイディアをブレストしてみんなで「いけそう！」', score: -1 },
      ],
    },
    {
      id: 'Q4',
      title: 'Q4',
      text: '実際に行動に移す決め手は？',
      axis: 'emotion',
      choices: [
        { key: 'A', label: '使命感とバイブス', score: 2 },
        { key: 'B', label: 'データによるガチ根拠', score: -2 },
      ],
    },
  ],

  // 軸1（personal合計の符号）× 軸2（emotion合計の符号）→ タイプ
  // personal: +個人 / -集団, emotion: +感情 / -論理
  matrix: {
    'personal_emotion': 'A',
    'group_emotion': 'B',
    'personal_logic': 'C',
    'group_logic': 'D',
  },

  results: {
    A: {
      title: 'TYPE-A',
      tagline: 'ひとりで勢いよく。',
      name: '怖いもの知らずJUMPER',
      color: '#F2A93B',
      points: [
        '思い立ったら即行動、フットワークの軽さが武器',
        '前例がないことにワクワクする',
        '「まあ何とかなるっしょ」精神で突き進む',
        '一人で抱え込みすぎることもあるので要注意',
      ],
    },
    B: {
      title: 'TYPE-B',
      tagline: 'みんなで勢いよく。',
      name: '御神輿どっこいJUMPER',
      color: '#E8632C',
      points: [
        '「なんとかなるっしょ」の楽観力であたり前に挑む',
        '決起会などのイベント事はアガる',
        '巻き込んだ後で「あ、ごめん今思いついた！」',
        '一人だと不安なので仲間がいると謎の万能感が出る',
      ],
    },
    C: {
      title: 'TYPE-C',
      tagline: 'ひとりでじっくり。',
      name: '先んずれば人を制すJUMPER',
      color: '#2F5233',
      points: [
        'データと根拠を積み上げてから動き出す',
        '一人で仮説検証を回すのが得意',
        '納得感がないと動けないタイプ',
        '気づけば誰よりも先に準備が終わっている',
      ],
    },
    D: {
      title: 'TYPE-D',
      tagline: 'みんなでじっくり。',
      name: 'シンクロナイズドJUMPER',
      color: '#1F6F78',
      points: [
        'チームの合意形成を大事にする',
        '議論を重ねてから着実に前進する',
        '根回しと巻き込みが上手い',
        'みんなが納得した瞬間の一体感が好き',
      ],
    },
  },

  noteArticleUrl: 'https://note.com/REPLACE_ME',

  common: {
    aboutTitle: 'We Are\nSOMPO Design Studio',
    aboutBody:
      '私たちSOMPO Design Studioは\n「SOMPOの『あたり前』の向こうへ。」を\nミッションに掲げています。\n\n' +
      '歴史ある会社の枠組みをJUMPし、\n古い習慣を塗り替え、\n保険のイメージに囚われない、\n誰も見たことのない\n安心・安全・健康な暮らしを描くこと。',
    otherTypesLabel: '診断は当てはまりましたか？\n他のJUMPERタイプはこちら',
    noteButton: 'note記事へJUMP！',
    copyright: 'Copyright © 2026 Sompo Digital Lab. All right reserved.',
    disclaimer:
      '※ 本診断はSOMPO Design Studioが制作・参考目的で作成したものです。結果の正確性、有用性は保証いたしかねます。',
  },
};
