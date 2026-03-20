import React, { useState, useEffect, useRef } from 'react'

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
  const bmcRef = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'
    script.setAttribute('data-name', 'bmc-button')
    script.setAttribute('data-slug', 'lexoliver')
    script.setAttribute('data-color', '#FF5F5F')
    script.setAttribute('data-emoji', '')
    script.setAttribute('data-font', 'Cookie')
    script.setAttribute('data-text', 'Buy me a coffee')
    script.setAttribute('data-outline-color', '#000000')
    script.setAttribute('data-font-color', '#ffffff')
    script.setAttribute('data-coffee-color', '#FFDD00')
    script.async = true
    if (bmcRef.current) bmcRef.current.appendChild(script)
  }, [])

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
            style={styles.input
