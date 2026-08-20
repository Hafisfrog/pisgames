export function OverviewCard({ tone, label, value, icon }) {
  return (
    <article className={`overview-card ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      {icon}
    </article>
  )
}
