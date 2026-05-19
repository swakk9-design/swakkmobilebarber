import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import BookingPage from './BookingPage'

const CORRECT_PIN = '5689'
const SESSION_KEY = 'barber_unlocked'

function PinLock({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleKey = (val) => {
    if (pin.length >= 4) return
    const next = pin + val
    setPin(next)
    setError(false)
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        sessionStorage.setItem(SESSION_KEY, '1')
        onUnlock()
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => { setPin(''); setShake(false) }, 800)
      }
    }
  }

  const del = () => { setPin(p => p.slice(0,-1)); setError(false) }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del']

  return (
    <div style={{ minHeight:'100vh', background:'#0c0c0e', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ textAlign:'center', width:280 }}>
        {/* Logo */}
        <div style={{ width:52, height:52, borderRadius:14, background:'#6366f1', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:24 }}>✂️</div>
        <div style={{ fontSize:15, fontWeight:700, color:'#eeeef2', marginBottom:6 }}>Swakk Mobile Barbering</div>
        <div style={{ fontSize:13, color:'#70708a', marginBottom:32 }}>Enter your PIN to continue</div>

        {/* Dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:14, marginBottom:36, animation:shake?'shake 0.4s ease':'none' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width:14, height:14, borderRadius:'50%', background: i < pin.length ? (error ? '#ef4444' : '#6366f1') : '#26262f', transition:'background 0.15s' }}/>
          ))}
        </div>

        {/* Keypad */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {keys.map((k, i) => {
            if (k === '') return <div key={i}/>
            return (
              <button key={i} onClick={() => k === 'del' ? del() : handleKey(k)}
                style={{ height:64, borderRadius:14, border:'none', background: k === 'del' ? 'transparent' : '#17171b', color: k === 'del' ? '#70708a' : '#eeeef2', fontSize: k === 'del' ? 13 : 22, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'background 0.1s' }}
                onMouseDown={e => e.currentTarget.style.background = k === 'del' ? '#111' : '#252530'}
                onMouseUp={e => e.currentTarget.style.background = k === 'del' ? 'transparent' : '#17171b'}>
                {k === 'del' ? '⌫' : k}
              </button>
            )
          })}
        </div>

        {error && <div style={{ color:'#ef4444', fontSize:13, marginTop:20, fontWeight:600 }}>Incorrect PIN</div>}
      </div>
    </div>
  )
}


class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return <div style={{ padding:40, fontFamily:'sans-serif', textAlign:'center' }}>
        <h2>Something went wrong</h2>
        <pre style={{ fontSize:12, textAlign:'left', background:'#f5f5f5', padding:16, borderRadius:8, overflow:'auto' }}>{this.state.error?.toString()}</pre>
        <p style={{ fontSize:12, color:'#666' }}>{this.state.error?.stack?.split('\n').slice(0,5).join('\n')}</p>
      </div>
    }
    return this.props.children
  }
}

function Root() {
  const path = window.location.pathname
  const isBookingPage = path === '/book' || path === '/book/'
  const [unlocked, setUnlocked] = useState(!!sessionStorage.getItem(SESSION_KEY))

  if (isBookingPage) {
    return (
      <React.Suspense fallback={<div style={{padding:40,textAlign:'center',fontFamily:'sans-serif'}}>Loading...</div>}>
        <ErrorBoundary>
          <BookingPage/>
        </ErrorBoundary>
      </React.Suspense>
    )
  }
  if (!unlocked) return <PinLock onUnlock={() => setUnlocked(true)}/>
  return <App/>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root/>
  </React.StrictMode>
)
