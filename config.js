/*
 * イベント計測用の設定。
 * イベントが終わったら COUNTER_ENABLED を false にして再デプロイすれば、
 * カウント送信だけを止められる（アプリ本体はそのまま動き続ける）。
 */

const CONFIG = {
  COUNTER_ENABLED: true,
  COUNTER_WORKSPACE: 'design-jumper',
  // CounterAPI側のダッシュボードでカウンター名入力時に
  // slugが「入力名(ハイフン化)+元の名前」で二重生成される事象が発生したため、
  // 実際に生成されたslugをそのまま指定している（Getリクエストで確認済み）。
  COUNTER_NAMES: {
    diagnosisStart: 'diagnosis-startdiagnosis_start',
    noteClick: 'note-clicknote_click',
  },
};
