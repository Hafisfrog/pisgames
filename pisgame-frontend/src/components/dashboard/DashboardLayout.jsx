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
  Radio,
  Shield,
  Users,
} from 'lucide-react'
import { BrandMark } from '../common/BrandMark'
import { StateMessage } from '../common/StateMessage'
import { EventList } from './EventList'
import { MedalDonut } from './MedalDonut'
import { MedalTable } from './MedalTable'
import { OverviewCard } from './OverviewCard'

const labels = {
  th: {
    appName: 'พัฒนาเกมส์',
    year: 'ประจำปี 2026',
    dashboardNav: 'หน้าหลัก (Dashboard)',
    eventsNav: 'ตารางการแข่งขัน',
    committee: 'สำหรับกรรมการ',
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
    eventSchedule: 'ตารางการแข่งขัน',
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
  totals,
  loading,
  error,
  openAdmin,
}) {
  const completedEvents = events.filter((event) => event.status === 'completed')
  const now = new Date()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState(() => localStorage.getItem('dashboard_language') || 'th')
  const text = labels[language] ?? labels.th

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
          <a href="#events">
            <CalendarDays size={20} />
            {text.eventsNav}
          </a>
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
                  tone="red"
                  label={text.athletes}
                  value={standings.length}
                  icon={<Users size={42} />}
                />
                <OverviewCard
                  tone="green"
                  label={text.completedEvents}
                  value={completedEvents.length}
                  icon={<Clock3 size={42} />}
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
                <MedalDonut standings={standings} totals={totals} labels={text} />
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
                <EventList events={events} labels={text} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
