export function TabButton({ active, children, onClick }) {
  return (
    <button className={active ? 'active' : ''} onClick={onClick} type="button">
      {children}
    </button>
  )
}
