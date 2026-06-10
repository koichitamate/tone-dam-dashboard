import './App.css'
// scripts/fetch-dams.mjs が生成した9ダム分のデータを読み込む
// データを最新にするには node scripts/fetch-dams.mjs を再実行する
import dams from './data/dams.json'

// 貯水率に応じてバーの色クラスを切り替える
// 50%以上: 青（正常） / 30〜50%: 黄（注意） / 30%未満: 赤（低水準）
function rateLevel(rate) {
  if (rate >= 50) return 'ok'
  if (rate >= 30) return 'warn'
  return 'low'
}

function App() {
  // 平均貯水率を dams 配列から自動計算する
  // reduce() は配列を1つの値（ここでは合計）にまとめる関数
  const totalRate = dams.reduce((sum, dam) => sum + dam.storageRate, 0)
  const averageRate = (totalRate / dams.length).toFixed(1)

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>利根川水系9ダム 貯水率ダッシュボード</h1>
        <p className="dashboard-warning">
          リアルタイム表示ではありません。スクリプト実行時点の取得値です。
        </p>
      </header>

      <section className="summary">
        <div className="summary-item">
          <p className="summary-label">平均貯水率（単純平均）</p>
          <p className="summary-value">
            {averageRate}
            <span className="summary-unit">%</span>
          </p>
        </div>
        <div className="summary-item">
          <p className="summary-label">対象ダム数</p>
          <p className="summary-value">
            {dams.length}
            <span className="summary-unit">ダム</span>
          </p>
        </div>
        <div className="summary-item">
          <p className="summary-label">観測時刻</p>
          <p className="summary-value summary-value-small">
            {dams[0].observationTime}
          </p>
        </div>
        <p className="badge">公式データ取得値（手動更新）</p>
      </section>

      <section className="dam-grid">
        {dams.map((dam) => (
          <article className="dam-card" key={dam.name}>
            <h2 className="dam-name">{dam.name}</h2>
            <p className="dam-rate-label">貯水率</p>
            <p className="dam-rate">
              {dam.storageRate}
              <span className="dam-rate-unit">%</span>
            </p>
            <div className="dam-bar">
              <div
                className={`dam-bar-fill ${rateLevel(dam.storageRate)}`}
                style={{ width: `${dam.storageRate}%` }}
              />
            </div>
          </article>
        ))}
      </section>

      <p className="source">出典：{dams[0].sourceName}</p>

      <p className="notice">
        ※ 防災判断には使わず、必ず公式情報を確認してください。
      </p>
    </main>
  )
}

export default App
