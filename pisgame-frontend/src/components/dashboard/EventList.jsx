import { medalLabels } from '../../constants/forms'
import { formatDate } from '../../utils/format'

export function EventList({ events }) {
  if (events.length === 0) {
    return <p className="empty-text">ยังไม่มีรายการแข่งขัน</p>
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <article className="event-row" key={event.id}>
          <div>
            <p className="event-sport">{event.sport?.name ?? 'ไม่ระบุกีฬา'}</p>
            <h3>{event.name}</h3>
            <p className="event-meta">
              {[event.category, event.gender, formatDate(event.event_date)]
                .filter(Boolean)
                .join(' | ') || 'ยังไม่ระบุรายละเอียด'}
            </p>
          </div>
          <div className="medal-stack">
            {(event.results ?? []).length === 0 && <span className="pending">รอผล</span>}
            {(event.results ?? []).map((result) => (
              <span className={`medal ${result.medal}`} key={result.id}>
                {medalLabels[result.medal]}: {result.team?.name}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
