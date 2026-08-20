export function AdminSection({ title, description, children, items, renderItem, onDelete }) {
  return (
    <div className="admin-grid">
      <div className="admin-card">
        <div className="section-heading compact">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {children}
      </div>
      <div className="admin-card">
        <div className="section-heading compact">
          <h2>ข้อมูลปัจจุบัน</h2>
          <p>{items.length} รายการ</p>
        </div>
        <div className="admin-list">
          {items.length === 0 && <p className="empty-text">ยังไม่มีข้อมูล</p>}
          {items.map((item) => (
            <div className="admin-list-row" key={item.id}>
              <div>{renderItem(item)}</div>
              <button className="danger-button" type="button" onClick={() => onDelete(item)}>
                ลบ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
