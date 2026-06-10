import './App.css'

// 9ダムのサンプルデータ（貯水率は仮の値）
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

function App() {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>利根川水系9ダム 貯水率ダッシュボード</h1>
        <p className="dashboard-note">
          学習用アプリ・サンプルデータ表示中（数値は仮のものです）
        </p>
      </header>

      <section className="dam-grid">
        {dams.map((dam) => (
          <article className="dam-card" key={dam.name}>
            <h2 className="dam-name">{dam.name}</h2>
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
