import './App.css'

// 9ダムの架空サンプルデータ（貯水率は実際の値ではない）
// 将来リアルタイムデータに切り替えるときは、この配列を差し替えるだけでよい
const dams = [
  { name: '矢木沢ダム', storageRate: 85 },
  { name: '奈良俣ダム', storageRate: 72 },
  { name: '藤原ダム', storageRate: 91 },
  { name: '相俣ダム', storageRate: 64 },
  { name: '薗原ダム', storageRate: 47 },
  { name: '八ッ場ダム', storageRate: 78 },
  { name: '下久保ダム', storageRate: 38 },
  { name: '草木ダム', storageRate: 55 },
  { name: '渡良瀬貯水池', storageRate: 26 },
]

// 貯水率に応じてバーの色クラスを切り替える
// 50%以上: 青（正常） / 30〜50%: 黄（注意） / 30%未満: 赤（低水準）
function rateLevel(rate) {
  if (rate >= 50) return 'ok'
  if (rate >= 30) return 'warn'
  return 'low'
}

// 仮の更新時刻（リアルタイム取得を始めたら、APIの取得時刻に差し替える）
const updatedAt = '2026-06-10 09:00'

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
          表示中の数値は実際の貯水率ではありません
        </p>
      </header>

      <section className="summary">
        <div className="summary-item">
          <p className="summary-label">平均貯水率</p>
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
          <p className="summary-label">更新時刻（仮）</p>
          <p className="summary-value summary-value-small">{updatedAt}</p>
        </div>
        <p className="badge">架空サンプルデータ表示中</p>
      </section>

      <section className="dam-grid">
        {dams.map((dam) => (
          <article className="dam-card" key={dam.name}>
            <h2 className="dam-name">{dam.name}</h2>
            <p className="dam-rate-label">貯水率（架空値）</p>
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

      <p className="notice">
        ※ 防災判断には使わず、必ず公式情報を確認してください。
      </p>
    </main>
  )
}

export default App
