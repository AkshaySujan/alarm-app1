import React, { useState, useRef } from 'react'

export default function Stopwatch() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const ref = useRef(null)

  function start() {
    if (running) return
    setRunning(true)
    const startTime = Date.now() - ms
    ref.current = setInterval(() => setMs(Date.now() - startTime), 100)
  }

  function stop() {
    setRunning(false)
    clearInterval(ref.current)
  }

  function reset() {
    stop()
    setMs(0)
    setLaps([])
  }

  function lap() {
    setLaps(prev => [ms, ...prev])
  }

  return (
    <div>
      <h2>Stopwatch</h2>
      <div className="card" style={{ minWidth: 220 }}>
        <div style={{ fontSize: 24 }}>{(ms / 1000).toFixed(2)}s</div>

        <div style={{ marginTop: 8 }}>
          <button onClick={start} disabled={running}>Start</button>
          <button onClick={stop} disabled={!running} style={{ marginLeft: 8 }}>Stop</button>
          <button onClick={lap} disabled={!running} style={{ marginLeft: 8 }}>Lap</button>
          <button onClick={reset} style={{ marginLeft: 8 }}>Reset</button>
        </div>

        {laps.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <strong>Laps</strong>
            <ol>
              {laps.map((t, i) => (
                <li key={i}>{(t / 1000).toFixed(2)}s</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
