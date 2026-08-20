export async function fetchDashboardData() {
  const [standingsRes, eventsRes, sportsRes, teamsRes] = await Promise.all([
    fetch('/api/standings'),
    fetch('/api/events'),
    fetch('/api/sports'),
    fetch('/api/teams'),
  ])

  if (!standingsRes.ok || !eventsRes.ok || !sportsRes.ok || !teamsRes.ok) {
    throw new Error('โหลดข้อมูลไม่สำเร็จ')
  }

  const standingsData = await standingsRes.json()
  const eventsData = await eventsRes.json()
  const sportsData = await sportsRes.json()
  const teamsData = await teamsRes.json()

  return {
    standings: standingsData.standings ?? [],
    events: eventsData.events ?? [],
    sports: sportsData.sports ?? [],
    teams: teamsData.teams ?? [],
  }
}

export async function apiRequest(path, token, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      data.message ||
      Object.values(data.errors || {})
        .flat()
        .join(', ') ||
      'ทำรายการไม่สำเร็จ'

    throw new Error(message)
  }

  return data
}
