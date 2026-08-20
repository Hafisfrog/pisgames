import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { defaultForms, medalLabels } from '../../constants/forms'
import { apiRequest, apiUrl } from '../../utils/api'
import { cleanPayload } from '../../utils/format'
import { TabButton } from '../common/TabButton'
import { AdminSection } from './AdminSection'

export function AdminPanel({ token, setToken, teams, sports, events, reload }) {
  const [adminTab, setAdminTab] = useState('teams')
  const [loginForm, setLoginForm] = useState({
    email: 'admin@sportsday.com',
    password: 'password',
  })
  const [forms, setForms] = useState(defaultForms)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function login(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      const res = await fetch(apiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }

      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
      setMessage('เข้าสู่ระบบสำเร็จ')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    if (token) {
      await apiRequest('/api/logout', token, { method: 'POST' }).catch(() => null)
    }
    localStorage.removeItem('admin_token')
    setToken('')
    setMessage('ออกจากระบบแล้ว')
  }

  async function createResource(resource, payloadKey) {
    setBusy(true)
    setMessage('')

    try {
      await apiRequest(`/api/${resource}`, token, {
        method: 'POST',
        body: JSON.stringify(cleanPayload(forms[payloadKey])),
      })
      setForms((current) => ({ ...current, [payloadKey]: defaultForms[payloadKey] }))
      await reload()
      setMessage('บันทึกข้อมูลสำเร็จ')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteResource(resource, id) {
    setBusy(true)
    setMessage('')

    try {
      await apiRequest(`/api/${resource}/${id}`, token, { method: 'DELETE' })
      await reload()
      setMessage('ลบข้อมูลสำเร็จ')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  function updateForm(name, key, value) {
    setForms((current) => ({
      ...current,
      [name]: { ...current[name], [key]: value },
    }))
  }

  if (!token) {
    return (
      <section className="admin-shell">
        <div className="admin-card login-card">
          <div className="section-heading compact">
            <h2>
              <LogIn size={24} />
              เข้าสู่ระบบแอดมิน
            </h2>
            <p>ใช้บัญชีสำหรับจัดการข้อมูล</p>
          </div>
          <form className="admin-form" onSubmit={login}>
            <label>
              Email
              <input
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, email: event.target.value }))
                }
                type="email"
                required
              />
            </label>
            <label>
              Password
              <input
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
                type="password"
                required
              />
            </label>
            <button className="primary-button" disabled={busy} type="submit">
              {busy ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
            </button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </div>
      </section>
    )
  }

  return (
    <section className="admin-shell">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>จัดการข้อมูลที่ใช้แสดงบนหน้าสรุปเหรียญ</p>
        </div>
        <button className="ghost-button" type="button" onClick={logout}>
          Logout
        </button>
      </div>

      <nav className="tabs admin-tabs" aria-label="เลือกเมนูแอดมิน">
        <TabButton active={adminTab === 'teams'} onClick={() => setAdminTab('teams')}>
          สี/ทีม
        </TabButton>
        <TabButton active={adminTab === 'sports'} onClick={() => setAdminTab('sports')}>
          กีฬา
        </TabButton>
        <TabButton active={adminTab === 'events'} onClick={() => setAdminTab('events')}>
          รายการแข่ง
        </TabButton>
        <TabButton active={adminTab === 'results'} onClick={() => setAdminTab('results')}>
          เหรียญ
        </TabButton>
      </nav>

      {message && <p className="form-message">{message}</p>}

      {adminTab === 'teams' && (
        <AdminSection
          title="สี/ทีม"
          description="เพิ่มสีหรือทีมที่ใช้แข่งขัน"
          items={teams}
          renderItem={(team) => (
            <>
              <span className="swatch" style={{ backgroundColor: team.color || '#6b7280' }} />
              <strong>{team.name}</strong>
            </>
          )}
          onDelete={(team) => deleteResource('teams', team.id)}
        >
          <form
            className="admin-form inline-form"
            onSubmit={(event) => {
              event.preventDefault()
              createResource('teams', 'team')
            }}
          >
            <input
              placeholder="ชื่อสี เช่น สีแดง"
              value={forms.team.name}
              onChange={(event) => updateForm('team', 'name', event.target.value)}
              required
            />
            <input
              className="color-input"
              value={forms.team.color}
              onChange={(event) => updateForm('team', 'color', event.target.value)}
              type="color"
            />
            <button className="primary-button" disabled={busy} type="submit">
              เพิ่มสี
            </button>
          </form>
        </AdminSection>
      )}

      {adminTab === 'sports' && (
        <AdminSection
          title="กีฬา"
          description="เพิ่มชนิดกีฬาสำหรับสร้างรายการแข่งขัน"
          items={sports}
          renderItem={(sport) => (
            <>
              <strong>{sport.name}</strong>
              <span>{sport.events_count ?? 0} รายการ</span>
            </>
          )}
          onDelete={(sport) => deleteResource('sports', sport.id)}
        >
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault()
              createResource('sports', 'sport')
            }}
          >
            <input
              placeholder="ชื่อกีฬา"
              value={forms.sport.name}
              onChange={(event) => updateForm('sport', 'name', event.target.value)}
              required
            />
            <textarea
              placeholder="รายละเอียด"
              value={forms.sport.description}
              onChange={(event) => updateForm('sport', 'description', event.target.value)}
            />
            <button className="primary-button" disabled={busy} type="submit">
              เพิ่มกีฬา
            </button>
          </form>
        </AdminSection>
      )}

      {adminTab === 'events' && (
        <AdminSection
          title="รายการแข่งขัน"
          description="สร้างรายการก่อนบันทึกเหรียญ"
          items={events}
          renderItem={(event) => (
            <>
              <strong>{event.name}</strong>
              <span>
                {event.sport?.name ?? '-'} | {event.status}
              </span>
            </>
          )}
          onDelete={(event) => deleteResource('events', event.id)}
        >
          <form
            className="admin-form grid-form"
            onSubmit={(event) => {
              event.preventDefault()
              createResource('events', 'event')
            }}
          >
            <select
              value={forms.event.sport_id}
              onChange={(event) => updateForm('event', 'sport_id', event.target.value)}
              required
            >
              <option value="">เลือกกีฬา</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
            <input
              placeholder="ชื่อรายการ เช่น ฟุตบอลชาย"
              value={forms.event.name}
              onChange={(event) => updateForm('event', 'name', event.target.value)}
              required
            />
            <input
              placeholder="รุ่น/ระดับ"
              value={forms.event.category}
              onChange={(event) => updateForm('event', 'category', event.target.value)}
            />
            <input
              placeholder="เพศ"
              value={forms.event.gender}
              onChange={(event) => updateForm('event', 'gender', event.target.value)}
            />
            <input
              value={forms.event.event_date}
              onChange={(event) => updateForm('event', 'event_date', event.target.value)}
              type="date"
            />
            <select
              value={forms.event.status}
              onChange={(event) => updateForm('event', 'status', event.target.value)}
            >
              <option value="scheduled">scheduled</option>
              <option value="completed">completed</option>
            </select>
            <button className="primary-button" disabled={busy} type="submit">
              เพิ่มรายการ
            </button>
          </form>
        </AdminSection>
      )}

      {adminTab === 'results' && (
        <AdminSection
          title="บันทึกเหรียญ"
          description="เลือกหนึ่งทีมต่อหนึ่งรายการแข่งขัน"
          items={events.flatMap((event) =>
            (event.results ?? []).map((result) => ({
              ...result,
              eventName: event.name,
            })),
          )}
          renderItem={(result) => (
            <>
              <span className={`medal ${result.medal}`}>{medalLabels[result.medal]}</span>
              <strong>{result.team?.name}</strong>
              <span>{result.eventName}</span>
            </>
          )}
          onDelete={(result) => deleteResource('results', result.id)}
        >
          <form
            className="admin-form grid-form"
            onSubmit={(event) => {
              event.preventDefault()
              createResource('results', 'result')
            }}
          >
            <select
              value={forms.result.event_id}
              onChange={(event) => updateForm('result', 'event_id', event.target.value)}
              required
            >
              <option value="">เลือกรายการแข่งขัน</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
            <select
              value={forms.result.team_id}
              onChange={(event) => updateForm('result', 'team_id', event.target.value)}
              required
            >
              <option value="">เลือกสี/ทีม</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              value={forms.result.medal}
              onChange={(event) => updateForm('result', 'medal', event.target.value)}
            >
              <option value="gold">ทอง</option>
              <option value="silver">เงิน</option>
              <option value="bronze">ทองแดง</option>
            </select>
            <input
              placeholder="หมายเหตุ"
              value={forms.result.note}
              onChange={(event) => updateForm('result', 'note', event.target.value)}
            />
            <button className="primary-button" disabled={busy} type="submit">
              บันทึกเหรียญ
            </button>
          </form>
        </AdminSection>
      )}
    </section>
  )
}
