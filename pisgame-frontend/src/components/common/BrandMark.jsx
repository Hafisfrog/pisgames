import pisLogo from '../../assets/pislogo.jpg'

export function BrandMark({ large = false }) {
  return (
    <div className={`brand ${large ? 'large' : ''}`}>
      <img className="crest" src={pisLogo} alt="Pattana Games2026 logo" />
      {!large && <strong>Pattana Games2026</strong>}
    </div>
  )
}
