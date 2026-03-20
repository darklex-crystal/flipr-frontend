import React, { useState } from 'react'

const CONDITIONS = [
  { id: 'mauvais', emoji: '💀', label: 'MAUVAIS' },
  { id: 'acceptable', emoji: '😐', label: 'ACCEPTABLE' },
  { id: 'bon', emoji: '👍', label: 'BON' },
  { id: 'tres_bon', emoji: '✨', label: 'TRÈS BON' },
  { id: 'neuf', emoji: '🪣', label: 'NEUF' },
]

const DELAYS = [
  { id: 'rapide', label: 'Rapide', sub: '1–3 jours' },
  { id: 'normal', label: 'Normal', sub: '~1 semaine' },
  { id: 'patient', label: 'Patient', sub: '2–4 semaines' },
]

export default function App() {
  const [query, setQuery] = useState('')
  const [condition, setCondition] = useState('bon')
  const [delay, setDelay] = useState('normal')
  const [paid, setPaid] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('https://flipr-backend-czf2.onrender.com/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, condition, speed: delay, paid_price: paid ? Number(paid) : null }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch (e) {
      setError('Erreur de connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.logo}>↑$FLIPR</span>
          <span style={styles.tagline}>QUEL PRIX DEMANDER ?</span>
        </div>

        <div style={styles.searchRow}>
          <input
            style={styles.input}
            placeholder="iphone 13"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button style={styles.iconBtn}>📷</button>
          <button style={styles.goBtn} onClick={handleSearch}>→</button>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>ÉTAT</div>
          <div style={styles.optionRow}>
            {CONDITIONS.map(c => (
              <button
                key={c.id}
                style={{ ...styles.optionBtn, ...(condition === c.id ? styles.optionBtnActive : {}) }}
                onClick={() => setCondition(c.id)}
              >
                <span style={styles.optionEmoji}>{c.emoji}</span>
                <span style={styles.optionLabel}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>DÉLAI DE VENTE</div>
          <div style={styles.delayRow}>
            {DELAYS.map(d => (
              <button
                key={d.id}
                style={{ ...styles.delayBtn, ...(delay === d.id ? styles.delayBtnActive : {}) }}
                onClick={() => setDelay(d.id)}
              >
                <span style={styles.delayLabel}>{d.label}</span>
                <span style={styles.delaySub}>{d.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>J'AI PAYÉ (OPTIONNEL)</div>
          <div style={styles.paidRow}>
            <input
              style={styles.paidInput}
              type="number"
              placeholder="0"
              value={paid}
              onChange={e => setPaid(e.target.value)}
            />
            <span style={styles.paidCurrency}>$</span>
          </div>
        </div>

        {loading && <div style={styles.info}>Analyse en cours...</div>}
        {error && <div style={styles.errorBox}>⚠ {error}</div>}
        {result && (
          <div style={styles.resultBox}>
            <div style={styles.resultPrice}>{result.price_range?.median} $</div>
            <div style={styles.resultMsg}>
              Fourchette : {result.price_range?.low}$ – {result.price_range?.high}$
            </div>
            <div style={styles.resultMsg}>{result.confidence_note}</div>
            {result.platforms?.filter(p => !p.disabled).map(p => (
              <div key={p.platform} style={{ ...styles.resultMsg, marginTop: 6 }}>
                {p.platform.toUpperCase()} → {p.list_price}$ ({p.fee_rate})
              </div>
            ))}
          </div>
        )}

        
          href="https://www.buymeacoffee.com/lexoliver"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}
        >
          <div style={{ background: '#FF5F5F', color: '#fff', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            ☕ Buy me a coffee
          </div>
        </a>

      </div>
    </div>
  )
}

const C = {
  bg: '#111',
  card: '#1a1a1a',
  border: '#2a2a2a',
  text: '#fff',
  muted: '#888',
  green: '#c8f135',
  red: '#ff4444',
}

const styles = {
  page: { minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' },
  card: { width: 340, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', alignItems: 'baseline', gap: 12 },
  logo: { color: C.green, fontWeight: 700, fontSize: 22, letterSpacing: 1 },
  tagline: { color: C.muted, fontSize: 11, letterSpacing: 2 },
  searchRow: { display: 'flex', gap: 8 },
  input: { flex: 1, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px', color: C.text, fontSize: 15, outline: 'none' },
  iconBtn: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: '0 12px', cursor: 'pointer', fontSize: 16 },
  goBtn: { background: C.green, border: 'none', borderRadius: 6, padding: '0 16px', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: '#000' },
  section: { display: 'flex', flexDirection: 'column', gap: 10 },
  sectionLabel: { color: C.muted, fontSize: 10, letterSpacing: 3 },
  optionRow: { display: 'flex', gap: 6 },
  optionBtn: { flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: C.muted, fontSize: 9, letterSpacing: 1 },
  optionBtnActive: { border: `1px solid ${C.green}`, color: C.green, background: '#1e2a00' },
  optionEmoji: { fontSize: 18 },
  optionLabel: {},
  delayRow: { display: 'flex', gap: 8 },
  delayBtn: { flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: '12px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: C.muted },
  delayBtnActive: { border: `1px solid ${C.green}`, color: C.green, background: '#1e2a00' },
  delayLabel: { fontSize: 13, fontWeight: 600 },
  delaySub: { fontSize: 10 },
  paidRow: { display: 'flex', alignItems: 'center', gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 14px' },
  paidInput: { background: 'transparent', border: 'none', color: C.text, fontSize: 15, outline: 'none', width: 80 },
  paidCurrency: { color: C.muted, fontSize: 15 },
  info: { color: C.muted, fontSize: 12, textAlign: 'center' },
  errorBox: { background: '#2a0000', border: `1px solid ${C.red}`, borderRadius: 6, padding: '12px 16px', color: C.red, fontSize: 12 },
  resultBox: { background: '#1e2a00', border: `1px solid ${C.green}`, borderRadius: 6, padding: '16px', textAlign: 'center' },
  resultPrice: { color: C.green, fontSize: 32, fontWeight: 700 },
  resultMsg: { color: C.muted, fontSize: 12, marginTop: 6 },
}
