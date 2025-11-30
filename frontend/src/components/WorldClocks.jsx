import React, { useEffect, useState } from 'react'

const DEFAULTS = [
  { label: 'Local', tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: 'London', tz: 'Europe/London' },
  { label: 'New York', tz: 'America/New_York' },
  { label: 'Tokyo', tz: 'Asia/Tokyo' }
]

// basic validation: try to format a date with this timezone
function isValidTimeZone(tz) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz }).format()
    return true
  } catch {
    return false
  }
}

export default function WorldClocks() {
  const [clocks, setClocks] = useState(() => {
    const saved = localStorage.getItem('clocks_v1')
    return saved ? JSON.parse(saved) : DEFAULTS
  })
  const [now, setNow] = useState(new Date())
  const [label, setLabel] = useState('')
  const [tz, setTz] = useState('')

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    localStorage.setItem('clocks_v1', JSON.stringify(clocks))
  }, [clocks])

  function addClock() {
    const zone = tz.trim()
    const name = label.trim() || zone
    if (!zone) return alert('Enter a timezone (e.g. Asia/Kolkata or America/New_York)')
    if (!isValidTimeZone(zone)) return alert('Invalid IANA timezone')
    setClocks([{ label: name, tz: zone }, ...clocks])
    setLabel('')
    setTz('')
  }

  function removeClock(idx) {
    setClocks(c => c.filter((_, i) => i !== idx))
  }

  function formatTime(tz) {
    return new Intl.DateTimeFormat([], { timeStyle: 'medium', dateStyle: 'short', timeZone: tz }).format(now)
  }

  return (
    <div>
      <h2>World Clocks</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input placeholder="Label (optional)" value={label} onChange={e => setLabel(e.target.value)} />
        <input placeholder="IANA timezone (e.g. Asia/Kolkata)" value={tz} onChange={e => setTz(e.target.value)} />
        <button onClick={addClock}>Add Clock</button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {clocks.map((c, i) => (
          <div key={i} className="card" style={{ minWidth: 180, position: 'relative' }}>
            <button
              onClick={() => removeClock(i)}
              style={{ position: 'absolute', right: 8, top: 8, background: '#ef4444', padding: '4px 6px', borderRadius: 6 }}
            >
              ✕
            </button>
            <strong>{c.label}</strong>
            <div style={{ color: '#374151' }}>{formatTime(c.tz)}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{c.tz}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
