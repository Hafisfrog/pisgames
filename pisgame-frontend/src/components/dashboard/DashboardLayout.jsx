import {
  BarChart3,
  CalendarDays,
  Clock3,
  Dumbbell,
  Flag,
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

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <BrandMark large />
        <div className="sidebar-title">
          <strong>พัฒนาเกมส์</strong>
          <span>ประจำปี 2026</span>
        </div>
        <nav className="side-nav">
          <a className="active" href="#dashboard">
            <PieChart size={20} />
            หน้าหลัก (Dashboard)
          </a>
          {/* <a href="#live">
            <Radio size={20} />
            ถ่ายทอดสด (Live)
          </a> */}
          <a href="#events">
            <CalendarDays size={20} />
            ตารางการแข่งขัน
          </a>
        </nav>
        <div className="committee-label">สำหรับกรรมการ</div>
      </aside>

      <div className="main-area">
        <header className="site-header">
          <BrandMark />
          <button className="login-button" type="button" onClick={openAdmin}>
            <Shield size={22} />
            เข้าสู่ระบบ
          </button>
        </header>

        <main className="dashboard-content" id="dashboard">

          <div className="content-heading">
            <div>
              <h1>
                <BarChart3 size={34} />
                ภาพรวมการแข่งขัน
              </h1>
            </div>
            <div className="updated-pill">
              <Clock3 size={18} />
              อัปเดต: {now.toLocaleTimeString('th-TH')}
            </div>
          </div>

          {loading && <StateMessage title="กำลังโหลดข้อมูล" text="รอสักครู่" />}
          {error && !loading && (
            <StateMessage title="เชื่อมต่อ backend ไม่ได้" text={error} />
          )}

          {!loading && !error && (
            <>
              <section className="overview-grid">
                <OverviewCard
                  tone="blue"
                  label="คณะสี"
                  value={teams.length}
                  icon={<Flag size={42} />}
                />
                <OverviewCard
                  tone="red"
                  label="นักกีฬา"
                  value={standings.length}
                  icon={<Users size={42} />}
                />
                <OverviewCard
                  tone="green"
                  label="แข่งขันนี้"
                  value={completedEvents.length}
                  icon={<Clock3 size={42} />}
                />
                <OverviewCard
                  tone="yellow"
                  label="ประเภทกีฬา"
                  value={sports.length}
                  icon={<Dumbbell size={42} />}
                />
              </section>

              <section className="dashboard-grid">
                <MedalTable standings={standings} />
                <MedalDonut standings={standings} totals={totals} />
              </section>

              <section className="panel event-panel" id="events">
                <div className="section-heading">
                  <h2>
                    <CalendarDays size={24} />
                    ตารางการแข่งขัน
                  </h2>
                  <p>
                    แข่งเสร็จแล้ว {completedEvents.length} จาก {events.length} รายการ
                  </p>
                </div>
                <EventList events={events} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
