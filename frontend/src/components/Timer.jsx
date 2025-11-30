import React, { useState, useRef, useEffect } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(60)      // current ticking value
  const [initial, setInitial] = useState(60)      // set value to reset to
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000)
    } else {
      clearInterval(ref.current)
    }
    return () => clearInterval(ref.current)
  }, [running])

  function applyDuration() {
    const m = parseInt(document.getElementById('minutes').value || '0', 10)
    const s = parseInt(document.getElementById('seconds').value || '0', 10)
    const total = Math.max(0, (m * 60) + s)
    setInitial(total)
    setSeconds(total)
    setRunning(false)
  }

  function reset() {
    setRunning(false)
    setSeconds(initial)
  }

  const mm = Math.floor(seconds / 60)
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div>
      <h2>Timer</h2>
      <div style={{ marginBottom: 8 }}>
        <label>Min: <input id="minutes" type="number" defaultValue={Math.floor(initial/60)} style={{ width: 60 }} /></label>
        <label style={{ marginLeft: 8 }}>Sec: <input id="seconds" type="number" defaultValue={initial%60} style={{ width: 60 }} /></label>
        <button onClick={applyDuration} style={{ marginLeft: 8 }}>Set</button>
      </div>

      <div className="card" style={{ minWidth: 220 }}>
        <div style={{ fontSize: 28 }}>{mm}:{ss}</div>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
          <button onClick={reset} style={{ marginLeft: 8 }}>Reset</button>
        </div>
      </div>
    </div>
  )
}
