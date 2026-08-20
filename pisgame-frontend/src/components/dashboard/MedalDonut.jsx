import { PieChart } from 'lucide-react'

export function MedalDonut({ standings, totals }) {
  const slices = standings.filter((team) => team.total > 0)
  let current = 0
  const gradient =
    totals.total === 0
      ? '#e5e7eb 0 100%'
      : slices
          .map((team) => {
            const start = current
            const size = (team.total / totals.total) * 100
            current += size
            return `${team.color || '#111827'} ${start}% ${current}%`
          })
          .join(', ')

  return (
    <section className="panel donut-panel">
      <div className="section-heading">
        <h2>
          <PieChart size={26} />
          สัดส่วนเหรียญรวม
        </h2>
      </div>
      <div className="donut-wrap">
        <div className="donut" style={{ background: `conic-gradient(${gradient})` }}>
          <div>
            <strong>{totals.total}</strong>
            <span>เหรียญ</span>
          </div>
        </div>
        <div className="legend">
          {standings.map((team) => (
            <span key={team.team_id}>
              <i style={{ backgroundColor: team.color || '#111827' }} />
              {team.team_name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
