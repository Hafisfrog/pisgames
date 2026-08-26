import { medalLabels } from '../../constants/forms'
import { formatDate } from '../../utils/format'

export function EventList({ events, labels }) {
  const sportGroups = groupEventsBySport(events, labels)

  if (events.length === 0) {
    return <p className="empty-text">{labels.emptyEvents}</p>
  }

  return (
    <div className="event-list event-block-list">
      {sportGroups.map((sportGroup) => (
        <section className="event-sport-block" key={sportGroup.id}>
          <div className="event-sport-heading">
            <div>
              <p>{labels.sportTypes}</p>
              <h3>{sportGroup.name}</h3>
            </div>
            <span>{sportGroup.events.length} รายการ</span>
          </div>

          <div className="event-type-list">
            {sportGroup.types.map((typeGroup) => (
              <div className="event-type-block" key={typeGroup.key}>
                <div className="event-type-heading">
                  <strong>{typeGroup.label}</strong>
                  <span>{typeGroup.events.length} รายการ</span>
                </div>

                {typeGroup.events.map((event) => (
                  <article className="event-row" key={event.id}>
                    <div>
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
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function groupEventsBySport(events, labels) {
  const groupsBySport = new Map()

  events.forEach((event) => {
    const sportId = event.sport_id ?? event.sport?.id ?? `unknown-${event.sport?.name ?? 'sport'}`
    const sportKey = String(sportId)

    if (!groupsBySport.has(sportKey)) {
      groupsBySport.set(sportKey, {
        id: sportKey,
        name: event.sport?.name ?? labels.unknownSport,
        events: [],
        typesByKey: new Map(),
      })
    }

    const sportGroup = groupsBySport.get(sportKey)
    const typeKey = [event.gender || '', event.category || ''].join('|')

    sportGroup.events.push(event)

    if (!sportGroup.typesByKey.has(typeKey)) {
      sportGroup.typesByKey.set(typeKey, {
        key: typeKey,
        label: eventTypeLabel(event),
        events: [],
      })
    }

    sportGroup.typesByKey.get(typeKey).events.push(event)
  })

  return Array.from(groupsBySport.values())
    .sort((a, b) => a.name.localeCompare(b.name, 'th'))
    .map((sportGroup) => ({
      ...sportGroup,
      types: Array.from(sportGroup.typesByKey.values()).sort((a, b) =>
        a.label.localeCompare(b.label, 'th'),
      ),
    }))
}

function eventTypeLabel(event) {
  return [
    event.gender || 'ไม่ระบุเพศ',
    event.category ? `รุ่น ${event.category}` : 'ไม่ระบุรุ่น',
  ].join(' | ')
}
