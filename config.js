/*
 * イベント計測用の設定。
 * イベントが終わったら COUNTER_ENABLED を false にして再デプロイすれば、
 * カウント送信だけを止められる（アプリ本体はそのまま動き続ける）。
 */

const CONFIG = {
  // カウントの送信（CounterAPIへの記録）を行うか
  COUNTER_ENABLED: true,
  // トップ画面に「これまでの診断数」を表示するか（記録とは別に切り替え可能）
  // 数値はCounterAPIのダッシュボードで確認できる
  SHOW_COUNT: false,
  COUNTER_WORKSPACE: 'design-jumper',
  COUNTER_WORKSPACE: 'design-jumper',
  // CounterAPI側のダッシュボードでカウンター名入力時に
  // slugが「入力名(ハイフン化)+元の名前」で二重生成される事象が発生したため、
  // 実際に生成されたslugをそのまま指定している（Getリクエストで確認済み）。
  COUNTER_NAMES: {
    diagnosisStart: 'diagnosis-startdiagnosis_start',
    noteClick: 'note-clicknote_click',
  },
};
