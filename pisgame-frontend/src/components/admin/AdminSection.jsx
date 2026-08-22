import { Fragment } from 'react'

export function AdminSection({
  title,
  description,
  children,
  items,
  renderItem,
  renderDetails,
  selectedItem,
  onView,
  onEdit,
  onDelete,
}) {
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
            <Fragment key={item.id}>
              <div className="admin-list-row">
                <div>{renderItem(item)}</div>
                <div className="row-actions">
                  {onView && (
                    <button className="ghost-button small-button" type="button" onClick={() => onView(item)}>
                      {selectedItem?.id === item.id ? 'ซ่อน' : 'รายละเอียด'}
                    </button>
                  )}
                  {onEdit && (
                    <button className="ghost-button small-button" type="button" onClick={() => onEdit(item)}>
                      แก้ไข
                    </button>
                  )}
                  <button className="danger-button small-button" type="button" onClick={() => onDelete(item)}>
                    ลบ
                  </button>
                </div>
              </div>
              {selectedItem?.id === item.id && renderDetails && (
                <div className="detail-panel inline-detail-panel">
                  {renderDetails(selectedItem)}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
