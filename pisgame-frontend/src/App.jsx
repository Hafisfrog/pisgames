import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AdminPanel } from './components/admin/AdminPanel'
import { BrandMark } from './components/common/BrandMark'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { fetchDashboardData } from './utils/api'

function App() {
  const [standings, setStandings] = useState([])
  const [events, setEvents] = useState([])
  const [sports, setSports] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [adminOpen, setAdminOpen] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const data = await fetchDashboardData()
      setStandings(data.standings)
      setEvents(data.events)
      setSports(data.sports)
      setTeams(data.teams)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const totals = useMemo(() => {
    return standings.reduce(
      (sum, team) => ({
        gold: sum.gold + team.gold,
        silver: sum.silver + team.silver,
        bronze: sum.bronze + team.bronze,
        total: sum.total + team.total,
      }),
      { gold: 0, silver: 0, bronze: 0, total: 0 },
    )
  }, [standings])

  if (adminOpen) {
    return (
      <main className="admin-page">
        <header className="admin-topbar">
          <BrandMark />
          <button className="ghost-button" type="button" onClick={() => setAdminOpen(false)}>
            หน้าหลัก
          </button>
        </header>
        <AdminPanel
          token={token}
          setToken={setToken}
          teams={teams}
          sports={sports}
          events={events}
          reload={loadData}
        />
      </main>
    )
  }

  return (
    <DashboardLayout
      standings={standings}
      events={events}
      sports={sports}
      teams={teams}
      totals={totals}
      loading={loading}
      error={error}
      openAdmin={() => setAdminOpen(true)}
    />
  )
}

export default App
