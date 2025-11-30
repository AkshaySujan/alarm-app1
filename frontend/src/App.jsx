import React from 'react'
import WorldClocks from './components/WorldClocks'
import Alarms from './components/Alarms'
import Timer from './components/Timer'
import Stopwatch from './components/Stopwatch'

export default function App() {
  return (
    <div className="app">
      <h1>Alarm App — CI/CD Demo</h1>

      <section>
        <WorldClocks />
      </section>

      <section>
        <Alarms />
      </section>

      <section style={{ display: 'flex', gap: '20px' }}>
        <Timer />
        <Stopwatch />
      </section>
    </div>
  )
}
