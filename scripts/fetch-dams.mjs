// 利根川ダム統合管理事務所の公式JSONを取得して、概要をコンソールに表示する実験スクリプト
// 実行方法: node scripts/fetch-dams.mjs
//
// 注意: このJSONは公式ページ内部用の非公式エンドポイントのため、
// サイト改修で予告なく構造が変わる可能性がある。手動実行のみとし、連続実行しないこと。

const URL = 'https://www.ktr.mlit.go.jp/tonedamu/teikyo/realtime2/json/E007010.json'

try {
  // 1. JSONのURLにアクセスする
  const response = await fetch(URL)

  // 2. ステータスコードをチェックする（404や500ならここで終了）
  if (!response.ok) {
    console.error(`取得に失敗しました: HTTP ${response.status} ${response.statusText}`)
    console.error('公式サイトの構造が変わった可能性があります。')
    process.exit(1)
  }

  // 3. テキストとして受け取り、先頭のBOM（不可視文字 ﻿）を除去してから解析する
  //    このJSONはBOM付きのため、response.json() を直接使うと解析エラーになる
  const text = await response.text()
  const data = JSON.parse(text.replace(/^﻿/, ''))

  // 4-5. 各ダムの dataList の最後の要素（=最新の観測値）を取り出して表示する
  console.log(`取得件数: ${data.damDataList.length}件（合計行を含む）`)
  console.log('--------------------------------------------------')

  for (const dam of data.damDataList) {
    const latest = dam.dataList[dam.dataList.length - 1]
    // padEnd は文字数を揃えるための空白埋め（表示を縦に揃えるだけの飾り）
    console.log(
      `${dam.observationName.padEnd(8, '　')} ${latest.observationTime}  貯水率 ${latest.waterRate}%`
    )
  }
} catch (error) {
  console.error('エラーが発生しました:', error.message)
  console.error('通信環境、または公式サイトの構造が変わった可能性があります。')
  process.exit(1)
}
