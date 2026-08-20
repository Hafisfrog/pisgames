const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`
}

async function parseJsonResponse(res) {
  const contentType = res.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    throw new Error(
      API_BASE_URL
        ? 'Backend did not return JSON. Check backend URL and CORS settings.'
        : 'Backend URL is not configured for production.',
    )
  }

  return res.json()
}

export async function fetchDashboardData() {
  const [standingsRes, eventsRes, sportsRes, teamsRes] = await Promise.all([
    fetch(apiUrl('/api/standings')),
    fetch(apiUrl('/api/events')),
    fetch(apiUrl('/api/sports')),
    fetch(apiUrl('/api/teams')),
  ])

  if (!standingsRes.ok || !eventsRes.ok || !sportsRes.ok || !teamsRes.ok) {
    throw new Error('โหลดข้อมูลไม่สำเร็จ')
  }

  const standingsData = await parseJsonResponse(standingsRes)
  const eventsData = await parseJsonResponse(eventsRes)
  const sportsData = await parseJsonResponse(sportsRes)
  const teamsData = await parseJsonResponse(teamsRes)

  return {
    standings: standingsData.standings ?? [],
    events: eventsData.events ?? [],
    sports: sportsData.sports ?? [],
    teams: teamsData.teams ?? [],
  }
}

export async function apiRequest(path, token, options = {}) {
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
  const data = await parseJsonResponse(res).catch(() => ({}))

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
