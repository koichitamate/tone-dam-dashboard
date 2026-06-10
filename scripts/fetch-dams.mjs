// 利根川ダム統合管理事務所の公式JSONを取得して、
// 9ダム分を React 用に整形し src/data/dams.json に保存するスクリプト
// 実行方法: node scripts/fetch-dams.mjs
//
// 注意: このJSONは公式ページ内部用の非公式エンドポイントのため、
// サイト改修で予告なく構造が変わる可能性がある。手動実行のみとし、連続実行しないこと。

import { mkdirSync, writeFileSync } from 'node:fs'

const URL = 'https://www.ktr.mlit.go.jp/tonedamu/teikyo/realtime2/json/E007010.json'

// 合計行の名前（全角の「５」「９」である点に注意）
const EXCLUDE_NAMES = ['５ダム', '９ダム']

const SOURCE_NAME = '国土交通省 利根川ダム統合管理事務所'

const OUTPUT_DIR = 'src/data'
const OUTPUT_FILE = 'src/data/dams.json'

// dataList の中から observationTime が最大の行（=最新の観測値）を選ぶ。
// 配列の並び順には依存しない。時刻は "2026/06/10 08:00:00" のような
// ゼロ埋め形式なので、文字列の大小比較がそのまま新旧の比較になる
function latestOf(dataList) {
  return dataList.reduce((latest, row) =>
    row.observationTime > latest.observationTime ? row : latest
  )
}

// カンマ付き文字列（例 "50,416"）を数値に変換する。失敗したらエラー終了
function toNumber(value, label, damName) {
  const num = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(num)) {
    console.error(`数値変換に失敗しました: ${damName} の ${label} = "${value}"`)
    console.error('欠測データ、または公式サイトの構造が変わった可能性があります。')
    process.exit(1)
  }
  return num
}

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

  // 4-5. 各ダムの dataList から observationTime が最大の行（=最新の観測値）を取り出して表示する
  console.log(`取得件数: ${data.damDataList.length}件（合計行を含む）`)
  console.log('--------------------------------------------------')

  for (const dam of data.damDataList) {
    const latest = latestOf(dam.dataList)
    // padEnd は文字数を揃えるための空白埋め（表示を縦に揃えるだけの飾り）
    console.log(
      `${dam.observationName.padEnd(8, '　')} ${latest.observationTime}  貯水率 ${latest.waterRate}%`
    )
  }

  // 6. 合計行（５ダム・９ダム）を除外し、React用の5項目に整形する
  const dams = data.damDataList
    .filter((dam) => !EXCLUDE_NAMES.includes(dam.observationName))
    .map((dam) => {
      const latest = latestOf(dam.dataList)
      return {
        name: dam.observationName,
        storageRate: toNumber(latest.waterRate, '貯水率', dam.observationName),
        observationTime: latest.observationTime,
        waterCapacity: toNumber(latest.waterCapacity, '貯水量', dam.observationName),
        sourceName: SOURCE_NAME,
      }
    })

  // 7. 件数チェック（9件でなければサイト構造が変わったとみなして止める）
  if (dams.length !== 9) {
    console.error(`抽出結果が9件ではありません（${dams.length}件）。`)
    console.error('公式サイトの構造が変わった可能性があるため、保存せずに終了します。')
    process.exit(1)
  }

  // 8. src/data フォルダを作成して保存する（null, 2 は人間が読めるように整形するための指定）
  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(OUTPUT_FILE, JSON.stringify(dams, null, 2) + '\n')

  console.log('--------------------------------------------------')
  console.log(`9ダム分を ${OUTPUT_FILE} に保存しました。`)
} catch (error) {
  console.error('エラーが発生しました:', error.message)
  console.error('通信環境、または公式サイトの構造が変わった可能性があります。')
  process.exit(1)
}
