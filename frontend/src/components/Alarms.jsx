import React, { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Alarms() {
  const [alarms, setAlarms] = useState([])
  const [label, setLabel] = useState('')
  const [time, setTime] = useState('07:00')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/alarms`)
      .then(r => r.json())
      .then(data => setAlarms(data))
      .catch(err => {
        console.error('Failed to load alarms', err)
      })
      .finally(() => setLoading(false))
  }, [])

  async function addAlarm() {
    if (!label) return
    const now = new Date()
    const [hh, mm] = time.split(':').map(Number)
    now.setHours(hh, mm, 0, 0)
    const payload = { title: label, timeISO: now.toISOString() }

    try {
      const res = await fetch(`${API}/alarms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const created = await res.json()
      setAlarms(prev => [created, ...prev])
      setLabel('')
    } catch (err) {
      console.error('Add alarm failed', err)
      alert('Failed to add alarm (see console)')
    }
  }

  async function toggle(id) {
    const alarm = alarms.find(a => a.id === id)
    if (!alarm) return
    const updated = { ...alarm, enabled: !alarm.enabled }
    try {
      await fetch(`${API}/alarms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      setAlarms(prev => prev.map(a => a.id === id ? updated : a))
    } catch (err) {
      console.error('Toggle failed', err)
    }
  }

  async function remove(id) {
    try {
      await fetch(`${API}/alarms/${id}`, { method: 'DELETE' })
      setAlarms(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  if (loading) return <div>Loading alarms…</div>

  return (
    <div>
      <h2>Alarms (Backend)</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input value={label} placeholder="Label" onChange={e => setLabel(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button onClick={addAlarm}>Add</button>
      </div>

      {alarms.length === 0 && <div className="card">No alarms yet</div>}

      {alarms.map(a => (
        <div className="card" key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div><strong>{a.title}</strong></div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{new Date(a.timeISO).toLocaleString()}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => toggle(a.id)} style={{ background: a.enabled ? '#ef4444' : '#10b981' }}>
              {a.enabled ? 'Disable' : 'Enable'}
            </button>
            <button style={{ background: '#6b7280' }} onClick={() => remove(a.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
