import { medalLabels } from '../../constants/forms'
import { formatDate } from '../../utils/format'

export function EventList({ events, labels }) {
  if (events.length === 0) {
    return <p className="empty-text">{labels.emptyEvents}</p>
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <article className="event-row" key={event.id}>
          <div>
            <p className="event-sport">{event.sport?.name ?? labels.unknownSport}</p>
            <h3>{event.name}</h3>
            <p className="event-meta">
              {[event.category, event.gender, formatDate(event.event_date)]
                .filter(Boolean)
                .join(' | ') || labels.unknownDetails}
            </p>
          </div>
          <div className="medal-stack">
            {(event.results ?? []).length === 0 && <span className="pending">{labels.pending}</span>}
            {(event.results ?? []).map((result) => (
              <span className={`medal ${result.medal}`} key={result.id}>
                {labels[result.medal] ?? medalLabels[result.medal]}:{' '}
                {labels.teamNames[result.team?.name] ?? result.team?.name}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
