import { Trophy } from 'lucide-react'
import { StateMessage } from '../common/StateMessage'

export function MedalTable({ standings }) {
  if (standings.length === 0) {
    return (
      <StateMessage
        title="ยังไม่มีข้อมูลเหรียญ"
        text="เพิ่มทีมและผลการแข่งขันจากฝั่งแอดมินก่อน"
      />
    )
  }

  return (
    <section className="panel standings-panel">
      <div className="section-heading">
        <h2>
          <Trophy size={26} />
          ตารางคะแนนรวม
          <span className="live-badge">LIVE</span>
        </h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>อันดับ</th>
              <th>คณะสี</th>
              <th>ทอง</th>
              <th>เงิน</th>
              <th>ทองแดง</th>
              <th>รวมคะแนน</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.team_id}>
                <td className="rank-cell">{index + 1}</td>
                <td>
                  <div className="team-name">
                    <span
                      className="swatch"
                      style={{ backgroundColor: team.color || '#111827' }}
                    />
                    {team.team_name}
                  </div>
                </td>
                <td className="gold-number">{team.gold}</td>
                <td>{team.silver}</td>
                <td className="bronze-number">{team.bronze}</td>
                <td>
                  <strong className="total-score">{team.total}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
