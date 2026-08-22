import { useEffect, useRef, useState } from 'react'
import {
  BarChart3,
  CalendarDays,
  Check,
  Clock3,
  Dumbbell,
  Flag,
  Menu,
  PieChart,
  Shield,
} from 'lucide-react'
import { BrandMark } from '../common/BrandMark'
import { StateMessage } from '../common/StateMessage'
import { EventList } from './EventList'
import { MedalTable } from './MedalTable'
import { OverviewCard } from './OverviewCard'

const labels = {
  th: {
    appName: 'พัฒนาเกมส์',
    year: 'ประจำปี 2026',
    dashboardNav: 'หน้าหลัก (Dashboard)',
    eventsNav: 'ผลการแข่งขัน',
    openMenu: 'เปิดเมนู',
    languageAria: 'เลือกภาษา',
    translate: 'แปลภาษา',
    thai: 'ไทย',
    malay: 'มลายู',
    login: 'เข้าสู่ระบบ',
    overview: 'ภาพรวมการแข่งขัน',
    updated: 'อัปเดต',
    loadingTitle: 'กำลังโหลดข้อมูล',
    loadingText: 'รอสักครู่',
    backendTitle: 'เชื่อมต่อ backend ไม่ได้',
    teams: 'คณะสี',
    athletes: 'นักกีฬา',
    completedEvents: 'แข่งขันนี้',
    sportTypes: 'ประเภทกีฬา',
    eventSchedule: 'ผลการแข่งขัน',
    completedSummary: (completed, total) => `แข่งเสร็จแล้ว ${completed} จาก ${total} รายการ`,
    medalsEmptyTitle: 'ยังไม่มีข้อมูลเหรียญ',
    medalsEmptyText: 'เพิ่มทีมและผลการแข่งขันจากฝั่งแอดมินก่อน',
    standingsTitle: 'ตารางคะแนนรวม',
    rank: 'อันดับ',
    gold: 'ทอง',
    silver: 'เงิน',
    bronze: 'ทองแดง',
    totalScore: 'รวมคะแนน',
    donutTitle: 'สัดส่วนเหรียญรวม',
    medalUnit: 'เหรียญ',
    emptyEvents: 'ยังไม่มีรายการแข่งขัน',
    unknownSport: 'ไม่ระบุกีฬา',
    unknownDetails: 'ยังไม่ระบุรายละเอียด',
    pending: 'รอผล',
    teamNames: {
      ชมพู: 'ชมพู',
      ฟ้า: 'ฟ้า',
      ส้ม: 'ส้ม',
      แดง: 'แดง',
      เหลือง: 'เหลือง',
      เขียว: 'เขียว',
      น้ำเงิน: 'น้ำเงิน',
      ม่วง: 'ม่วง',
    },
  },
  ms: {
    appName: 'Pattana Games',
    year: 'Tahun 2026',
    dashboardNav: 'Utama (Dashboard)',
    eventsNav: 'Jadual pertandingan',
    committee: 'Untuk jawatankuasa',
    openMenu: 'Buka menu',
    languageAria: 'Pilih bahasa',
    translate: 'Terjemah',
    thai: 'Thai',
    malay: 'Melayu',
    login: 'Log masuk',
    overview: 'Ringkasan pertandingan',
    updated: 'Dikemas kini',
    loadingTitle: 'Sedang memuatkan data',
    loadingText: 'Sila tunggu sebentar',
    backendTitle: 'Tidak dapat sambung ke backend',
    teams: 'Pasukan warna',
    athletes: 'Atlet',
    completedEvents: 'Acara selesai',
    sportTypes: 'Jenis sukan',
    eventSchedule: 'Jadual pertandingan',
    completedSummary: (completed, total) => `${completed} daripada ${total} acara selesai`,
    medalsEmptyTitle: 'Tiada data pingat',
    medalsEmptyText: 'Tambah pasukan dan keputusan daripada bahagian admin dahulu',
    standingsTitle: 'Kedudukan keseluruhan',
    rank: 'Kedudukan',
    gold: 'Emas',
    silver: 'Perak',
    bronze: 'Gangsa',
    totalScore: 'Jumlah markah',
    donutTitle: 'Nisbah jumlah pingat',
    medalUnit: 'Pingat',
    emptyEvents: 'Tiada acara pertandingan',
    unknownSport: 'Sukan tidak dinyatakan',
    unknownDetails: 'Butiran belum ditetapkan',
    pending: 'Menunggu keputusan',
    teamNames: {
      ชมพู: 'Merah jambu',
      ฟ้า: 'Biru muda',
      ส้ม: 'Oren',
      แดง: 'Merah',
      เหลือง: 'Kuning',
      เขียว: 'Hijau',
      น้ำเงิน: 'Biru',
      ม่วง: 'Ungu',
    },
  },
}

export function DashboardLayout({
  standings,
  events,
  sports,
  teams,
  loading,
  error,
  openAdmin,
}) {
  const completedEvents = events.filter((event) => event.status === 'completed')
  const now = new Date()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [eventsNavOpen, setEventsNavOpen] = useState(false)
  const [expandedSportId, setExpandedSportId] = useState(null)
  const [mobileSportId, setMobileSportId] = useState('')
  const [selectedEventGroup, setSelectedEventGroup] = useState(null)
  const [language, setLanguage] = useState(() => localStorage.getItem('dashboard_language') || 'th')
  const text = labels[language] ?? labels.th
  const sportNavItems = buildSportNavItems(events, sports)
  const selectedMobileSport = sportNavItems.find((item) => String(item.id) === mobileSportId)
  const filteredEvents = selectedEventGroup
    ? events.filter((event) => eventGroupKey(event) === selectedEventGroup.key)
    : []

  useEffect(() => {
    document.documentElement.lang = language === 'ms' ? 'ms' : 'th'
    localStorage.setItem('dashboard_language', language)
  }, [language])

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [menuOpen])

  function selectLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    setMenuOpen(false)
  }

  function handleOpenAdmin() {
    setMenuOpen(false)
    openAdmin()
  }

  function scrollToEvents() {
    window.requestAnimationFrame(() => {
      document.getElementById('events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggleEventsNav() {
    setEventsNavOpen((isOpen) => !isOpen)
    scrollToEvents()
  }

  function toggleSport(sportId) {
    setEventsNavOpen(true)
    setExpandedSportId((current) => (current === sportId ? null : sportId))
    scrollToEvents()
  }

  function selectEventGroup(sport, group) {
    setSelectedEventGroup({
      ...group,
      sportName: sport.name,
      label: eventGroupLabel(group),
    })
    setMobileSportId(String(sport.id))
    scrollToEvents()
  }

  function selectMobileSport(nextSportId) {
    setMobileSportId(nextSportId)
    setSelectedEventGroup(null)
    setExpandedSportId(nextSportId || null)
  }

  function selectMobileEventGroup(groupKey) {
    const group = selectedMobileSport?.groups.find((item) => item.key === groupKey)

    if (selectedMobileSport && group) {
      selectEventGroup(selectedMobileSport, group)
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <BrandMark large />
        <div className="sidebar-title">
          <strong>{text.appName}</strong>
          <span>{text.year}</span>
        </div>
        <nav className="side-nav">
          <a className="active" href="#dashboard">
            <PieChart size={20} />
            {text.dashboardNav}
          </a>
          {/* <a href="#live">
            <Radio size={20} />
            ถ่ายทอดสด (Live)
          </a> */}
          <button
            className={eventsNavOpen ? 'nav-button nav-button-open' : 'nav-button'}
            type="button"
            onClick={toggleEventsNav}
          >
            <CalendarDays size={20} />
            <span>{text.eventsNav}</span>
            <span className="nav-caret">{eventsNavOpen ? '▾' : '▸'}</span>
          </button>
          {eventsNavOpen && (
            <div className="event-nav-tree">
              {sportNavItems.length === 0 && (
                <span className="event-nav-empty">{text.emptyEvents}</span>
              )}
              {sportNavItems.map((item) => (
                <div className="event-nav-sport" key={item.id}>
                  <button
                    className={expandedSportId === item.id ? 'event-nav-sport-button active' : 'event-nav-sport-button'}
                    type="button"
                    onClick={() => toggleSport(item.id)}
                  >
                    <span>{item.name}</span>
                    <small>{item.events.length}</small>
                  </button>
                  {expandedSportId === item.id && (
                    <div className="event-nav-groups">
                      {item.groups.length === 0 && (
                        <span className="event-nav-empty">ยังไม่มีประเภท</span>
                      )}
                      {item.groups.map((group) => (
                        <button
                          className={selectedEventGroup?.key === group.key ? 'active' : ''}
                          type="button"
                          key={group.key}
                          onClick={() => selectEventGroup(item, group)}
                        >
                          {eventGroupLabel(group)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </nav>
        <div className="committee-label">{text.committee}</div>
      </aside>

      <div className="main-area">
        <header className="site-header">
          <BrandMark />
          <div className="header-actions" ref={menuRef}>
            <button
              className="menu-button"
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={text.openMenu}
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
            >
              <Menu size={24} />
            </button>

            {menuOpen && (
              <div className="header-menu" role="menu">
                <div className="language-group" aria-label={text.languageAria}>
                  <div className="menu-label">
                    <span className="flag-icon" aria-hidden="true">🇹🇭</span>
                    <span className="flag-icon" aria-hidden="true">🇲🇾</span>
                    {text.translate}
                  </div>
                  <div className="language-options">
                    <button
                      className={language === 'th' ? 'active' : ''}
                      type="button"
                      role="menuitemradio"
                      aria-checked={language === 'th'}
                      onClick={() => selectLanguage('th')}
                    >
                      <span className="flag-icon" aria-hidden="true">🇹🇭</span>
                      {text.thai}
                      {language === 'th' && <Check size={16} />}
                    </button>
                    <button
                      className={language === 'ms' ? 'active' : ''}
                      type="button"
                      role="menuitemradio"
                      aria-checked={language === 'ms'}
                      onClick={() => selectLanguage('ms')}
                    >
                      <span className="flag-icon" aria-hidden="true">🇲🇾</span>
                      {text.malay}
                      {language === 'ms' && <Check size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  className="login-button menu-login-button"
                  type="button"
                  role="menuitem"
                  onClick={handleOpenAdmin}
                >
                  <Shield size={20} />
                  {text.login}
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="dashboard-content" id="dashboard">

          <div className="content-heading">
            <div>
              <h1>
                <BarChart3 size={34} />
                {text.overview}
              </h1>
            </div>
            <div className="updated-pill">
              <Clock3 size={18} />
              {text.updated}: {now.toLocaleTimeString(language === 'ms' ? 'ms-MY' : 'th-TH')}
            </div>
          </div>

          {loading && <StateMessage title={text.loadingTitle} text={text.loadingText} />}
          {error && !loading && (
            <StateMessage title={text.backendTitle} text={error} />
          )}

          {!loading && !error && (
            <>
              <section className="overview-grid">
                <OverviewCard
                  tone="blue"
                  label={text.teams}
                  value={teams.length}
                  icon={<Flag size={42} />}
                />
               
                <OverviewCard
                  tone="yellow"
                  label={text.sportTypes}
                  value={sports.length}
                  icon={<Dumbbell size={42} />}
                />
              </section>

              <section className="dashboard-grid">
                <MedalTable standings={standings} labels={text} />
              </section>

              <section className="panel event-panel" id="events">
                <div className="section-heading">
                  <h2>
                    <CalendarDays size={24} />
                    {text.eventSchedule}
                  </h2>
                  <p>
                    {text.completedSummary(completedEvents.length, events.length)}
                  </p>
                </div>
                <div className="mobile-event-picker">
                  <select
                    value={mobileSportId}
                    onChange={(event) => selectMobileSport(event.target.value)}
                  >
                    <option value="">เลือกชนิดกีฬา</option>
                    {sportNavItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedEventGroup?.key ?? ''}
                    onChange={(event) => selectMobileEventGroup(event.target.value)}
                    disabled={!selectedMobileSport}
                  >
                    <option value="">เลือกประเภท / เพศ / รุ่น</option>
                    {(selectedMobileSport?.groups ?? []).map((group) => (
                      <option key={group.key} value={group.key}>
                        {eventGroupLabel(group)}
                      </option>
                    ))}
                  </select>
                </div>
                <EventList
                  events={filteredEvents}
                  labels={text}
                  selectedGroup={selectedEventGroup}
                />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function eventGroupKey(event) {
  const sportId = event.sport_id ?? event.sport?.id ?? 'unknown'
  return [sportId, event.gender || '', event.category || ''].join('|')
}

function eventGroupLabel(group) {
  return [group.gender || 'ไม่ระบุเพศ', group.category ? `รุ่น ${group.category}` : 'ไม่ระบุรุ่น'].join(' | ')
}

function buildSportNavItems(events, sports) {
  const sportsById = new Map(sports.map((sport) => [sport.id, sport]))
  const itemsById = new Map()

  events.forEach((event) => {
    const sportId = event.sport_id ?? event.sport?.id ?? `unknown-${event.sport?.name ?? 'sport'}`
    const sport = sportsById.get(sportId) ?? event.sport ?? {
      id: sportId,
      name: 'ไม่ระบุกีฬา',
    }

    if (!itemsById.has(sportId)) {
      itemsById.set(sportId, {
        id: sportId,
        name: sport.name,
        events: [],
        groupsByKey: new Map(),
      })
    }

    const item = itemsById.get(sportId)
    const key = eventGroupKey(event)
    item.events.push(event)

    if (!item.groupsByKey.has(key)) {
      item.groupsByKey.set(key, {
        key,
        gender: event.gender,
        category: event.category,
        events: [],
      })
    }

    item.groupsByKey.get(key).events.push(event)
  })

  return Array.from(itemsById.values())
    .sort((a, b) => a.name.localeCompare(b.name, 'th'))
    .map((item) => ({
      ...item,
      groups: Array.from(item.groupsByKey.values()).sort((a, b) =>
        eventGroupLabel(a).localeCompare(eventGroupLabel(b), 'th'),
      ),
    }))
}
