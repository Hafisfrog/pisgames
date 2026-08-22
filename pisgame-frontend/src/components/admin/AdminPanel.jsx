import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { defaultForms, medalLabels } from '../../constants/forms'
import { apiRequest, apiUrl } from '../../utils/api'
import { cleanPayload, formatDate } from '../../utils/format'
import { TabButton } from '../common/TabButton'
import { AdminSection } from './AdminSection'

const defaultDetailEventForm = {
  name: '',
  category: '',
  gender: '',
}

export function AdminPanel({ token, setToken, teams, sports, events, reload }) {
  const [adminTab, setAdminTab] = useState('teams')
  const [loginForm, setLoginForm] = useState({
    email: 'admin@sportsday.com',
    password: 'password',
  })
  const [forms, setForms] = useState(defaultForms)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [detailEventForm, setDetailEventForm] = useState(defaultDetailEventForm)
  const [editingDetailEvent, setEditingDetailEvent] = useState(null)

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

  async function saveResource(resource, payloadKey) {
    if (!editing || editing.resource !== resource) {
      await createResource(resource, payloadKey)
      return
    }

    setBusy(true)
    setMessage('')

    try {
      await apiRequest(`/api/${resource}/${editing.id}`, token, {
        method: 'PUT',
        body: JSON.stringify(cleanPayload(forms[payloadKey])),
      })
      setForms((current) => ({ ...current, [payloadKey]: defaultForms[payloadKey] }))
      setEditing(null)
      await reload()
      setMessage('แก้ไขข้อมูลสำเร็จ')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteResource(resource, id) {
    if (!window.confirm('ยืนยันการลบข้อมูลนี้?')) {
      return
    }

    setBusy(true)
    setMessage('')

    try {
      await apiRequest(`/api/${resource}/${id}`, token, { method: 'DELETE' })
      if (editing?.resource === resource && editing.id === id) {
        setEditing(null)
      }
      if (selectedDetail?.resource === resource && selectedDetail.item.id === id) {
        setSelectedDetail(null)
      }
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

  function cancelEdit(payloadKey) {
    setEditing(null)
    setForms((current) => ({ ...current, [payloadKey]: defaultForms[payloadKey] }))
  }

  function editSport(sport) {
    setEditing({ resource: 'sports', id: sport.id })
    setForms((current) => ({
      ...current,
      sport: {
        name: sport.name ?? '',
        description: sport.description ?? '',
      },
    }))
  }

  function editEvent(event) {
    const eventDate = event.event_date ? String(event.event_date).slice(0, 10) : ''

    setEditing({ resource: 'events', id: event.id })
    setForms((current) => ({
      ...current,
      event: {
        sport_id: event.sport_id ? String(event.sport_id) : '',
        name: event.name ?? '',
        category: event.category ?? '',
        gender: event.gender ?? '',
        event_date: eventDate,
        status: event.status ?? 'scheduled',
      },
    }))
  }

  function viewDetail(resource, item) {
    if (selectedDetail?.resource === resource && selectedDetail.item.id === item.id) {
      setSelectedDetail(null)
      setDetailEventForm(defaultDetailEventForm)
      setEditingDetailEvent(null)
      return
    }

    setSelectedDetail({ resource, item })
    setDetailEventForm(defaultDetailEventForm)
    setEditingDetailEvent(null)
  }

  function updateDetailEventForm(key, value) {
    setDetailEventForm((current) => ({ ...current, [key]: value }))
  }

  function buildDetailEventName(sport) {
    return (
      detailEventForm.name ||
      [sport.name, detailEventForm.gender, detailEventForm.category]
        .filter(Boolean)
        .join(' ')
    )
  }

  function eventOptionLabel(event) {
    return [
      event.name,
      event.gender || 'ไม่ระบุเพศ',
      event.category ? `รุ่น ${event.category}` : 'ไม่ระบุรุ่น',
    ]
      .filter(Boolean)
      .join(' | ')
  }

  async function saveDetailEvent(sport) {
    const payload = cleanPayload({
      sport_id: sport.id,
      name: buildDetailEventName(sport),
      category: detailEventForm.category,
      gender: detailEventForm.gender,
      status: editingDetailEvent?.status ?? 'scheduled',
    })
    const path = editingDetailEvent ? `/api/events/${editingDetailEvent.id}` : '/api/events'

    setBusy(true)
    setMessage('')

    try {
      await apiRequest(path, token, {
        method: editingDetailEvent ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      })
      setDetailEventForm(defaultDetailEventForm)
      setEditingDetailEvent(null)
      await reload()
      setMessage(editingDetailEvent ? 'แก้ไขรุ่น/เพศสำเร็จ' : 'เพิ่มรุ่น/เพศสำเร็จ')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  function editDetailEvent(event) {
    setEditingDetailEvent(event)
    setDetailEventForm({
      name: event.name ?? '',
      category: event.category ?? '',
      gender: event.gender ?? '',
    })
  }

  function cancelDetailEventEdit() {
    setEditingDetailEvent(null)
    setDetailEventForm(defaultDetailEventForm)
  }

  function sportEvents(sport) {
    return events.filter((event) => event.sport_id === sport.id)
  }

  function groupSportEvents(relatedEvents) {
    return relatedEvents.reduce((groups, event) => {
      const gender = event.gender || 'ไม่ระบุเพศ'
      const category = event.category || 'ไม่ระบุรุ่น'
      const key = `${gender}-${category}`

      if (!groups[key]) {
        groups[key] = {
          gender,
          category,
          events: [],
        }
      }

      groups[key].events.push(event)
      return groups
    }, {})
  }

  function renderSportDetails(sport) {
    const relatedEvents = sportEvents(sport)
    const eventGroups = Object.values(groupSportEvents(relatedEvents))

    return (
      <>
        <div className="detail-heading">
          <h3>{sport.name}</h3>
          <span>{relatedEvents.length} รายการแข่ง</span>
        </div>
        {sport.description && <p className="detail-text">{sport.description}</p>}
        <form
          className="detail-editor"
          onSubmit={(event) => {
            event.preventDefault()
            saveDetailEvent(sport)
          }}
        >
          <input
            placeholder="ชื่อรายการ เช่น ฟุตบอลชาย รุ่น A"
            value={detailEventForm.name}
            onChange={(event) => updateDetailEventForm('name', event.target.value)}
          />
          <select
            value={detailEventForm.gender}
            onChange={(event) => updateDetailEventForm('gender', event.target.value)}
          >
            <option value="">ไม่ระบุเพศ</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
            <option value="ผสม">ผสม</option>
          </select>
          <input
            placeholder="รุ่น เช่น A, B, C, ม.1"
            value={detailEventForm.category}
            onChange={(event) => updateDetailEventForm('category', event.target.value)}
          />
          <div className="form-actions">
            <button className="primary-button" disabled={busy} type="submit">
              {editingDetailEvent ? 'บันทึกการแก้ไขรุ่น/เพศ' : 'เพิ่มรุ่น/เพศ'}
            </button>
            {editingDetailEvent && (
              <button className="ghost-button" disabled={busy} type="button" onClick={cancelDetailEventEdit}>
                ยกเลิก
              </button>
            )}
          </div>
        </form>
        <div className="detail-list">
          {relatedEvents.length === 0 && <p className="empty-text">ยังไม่มีรายการแข่งในกีฬานี้</p>}
          {eventGroups.map((group) => (
            <div className="detail-group" key={`${group.gender}-${group.category}`}>
              <div className="detail-group-heading">
                <strong>{group.gender}</strong>
                <span>รุ่น {group.category}</span>
              </div>
              {group.events.map((event) => (
                <div className="detail-event-row" key={event.id}>
                  <div className="detail-row-main">
                    <strong>{event.name}</strong>
                  </div>
                  <div className="row-actions">
                    <button className="ghost-button small-button" type="button" onClick={() => editDetailEvent(event)}>
                      แก้ไข
                    </button>
                    <button className="danger-button small-button" type="button" onClick={() => deleteResource('events', event.id)}>
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    )
  }

  function renderEventDetails(event) {
    return (
      <>
        <div className="detail-heading">
          <h3>{event.name}</h3>
          <span>{event.status}</span>
        </div>
        <div className="detail-fields">
          <span>กีฬา</span>
          <strong>{event.sport?.name ?? '-'}</strong>
          <span>เพศ</span>
          <strong>{event.gender || 'ไม่ระบุ'}</strong>
          <span>รุ่น/ระดับชั้น</span>
          <strong>{event.category || 'ไม่ระบุ'}</strong>
          <span>วันที่แข่ง</span>
          <strong>{formatDate(event.event_date) || '-'}</strong>
        </div>
        <div className="detail-list">
          {(event.results ?? []).length === 0 && <p className="empty-text">ยังไม่มีผลเหรียญ</p>}
          {(event.results ?? []).map((result) => (
            <div className="detail-row" key={result.id}>
              <span className={`medal ${result.medal}`}>{medalLabels[result.medal]}</span>
              <strong>{result.team?.name ?? '-'}</strong>
            </div>
          ))}
        </div>
      </>
    )
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
          description={editing?.resource === 'sports' ? 'แก้ไขข้อมูลกีฬา' : 'เพิ่มชนิดกีฬาสำหรับสร้างรายการแข่งขัน'}
          items={sports}
          renderItem={(sport) => (
            <>
              <strong>{sport.name}</strong>
              <span>{sport.events_count ?? 0} รายการ</span>
            </>
          )}
          selectedItem={selectedDetail?.resource === 'sports' ? selectedDetail.item : null}
          renderDetails={renderSportDetails}
          onView={(sport) => viewDetail('sports', sport)}
          onEdit={editSport}
          onDelete={(sport) => deleteResource('sports', sport.id)}
        >
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault()
              saveResource('sports', 'sport')
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
            <div className="form-actions">
              <button className="primary-button" disabled={busy} type="submit">
                {editing?.resource === 'sports' ? 'บันทึกการแก้ไข' : 'เพิ่มกีฬา'}
              </button>
              {editing?.resource === 'sports' && (
                <button className="ghost-button" disabled={busy} type="button" onClick={() => cancelEdit('sport')}>
                  ยกเลิก
                </button>
              )}
            </div>
          </form>
        </AdminSection>
      )}

      {adminTab === 'events' && (
        <AdminSection
          title="รายการแข่งขัน"
          description={editing?.resource === 'events' ? 'แก้ไขรายการแข่งขันและประเภท' : 'สร้างรายการก่อนบันทึกเหรียญ'}
          items={events}
          renderItem={(event) => (
            <>
              <strong>{event.name}</strong>
              <span>
                {event.sport?.name ?? '-'} | {event.gender || 'ไม่ระบุเพศ'} | {event.category || 'ไม่ระบุรุ่น'}
              </span>
            </>
          )}
          selectedItem={selectedDetail?.resource === 'events' ? selectedDetail.item : null}
          renderDetails={renderEventDetails}
          onView={(event) => viewDetail('events', event)}
          onEdit={editEvent}
          onDelete={(event) => deleteResource('events', event.id)}
        >
          <form
            className="admin-form grid-form"
            onSubmit={(event) => {
              event.preventDefault()
              saveResource('events', 'event')
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
              placeholder="รุ่น/ระดับ เช่น ม.1, ม.2, ม.ปลาย"
              value={forms.event.category}
              onChange={(event) => updateForm('event', 'category', event.target.value)}
            />
            <select
              value={forms.event.gender}
              onChange={(event) => updateForm('event', 'gender', event.target.value)}
            >
              <option value="">ไม่ระบุเพศ</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
              <option value="ผสม">ผสม</option>
            </select>
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
            <div className="form-actions">
              <button className="primary-button" disabled={busy} type="submit">
                {editing?.resource === 'events' ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'}
              </button>
              {editing?.resource === 'events' && (
                <button className="ghost-button" disabled={busy} type="button" onClick={() => cancelEdit('event')}>
                  ยกเลิก
                </button>
              )}
            </div>
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
              eventName: eventOptionLabel(event),
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
                  {eventOptionLabel(event)}
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
