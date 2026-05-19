import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// ─── ICONS ────────────────────────────────────────────────────────────────────
const PATHS = {
  calendar: "M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z",
  dollar: "M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6",
  check: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  plus: "M12 5v14M5 12h14",
  x: "M18 6L6 18M6 6l12 12",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  scissors: "M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12",
  chevron_left: "M15 18l-6-6 6-6",
  chevron_right: "M9 18l6-6-6-6",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  weight: "M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l1.43-1.43L19.14 22l2.14-2.14-1.43-1.43L22 17z",
  food: "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3",
}
const Icon = ({ name, size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={PATHS[name]||PATHS.scissors}/>
  </svg>
)

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'var(--card)', borderRadius:16, width:'100%', maxWidth:520, maxHeight:'90vh', overflow:'auto', boxShadow:'0 25px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:700 }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Icon name="x"/></button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  )
}
const Field = ({ label, children, hint }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</label>
    {children}
    {hint && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{hint}</div>}
  </div>
)
const Inp = (props) => (
  <input {...props} style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', fontSize:14, color:'var(--text)', outline:'none', boxSizing:'border-box', ...props.style }}/>
)
const Sel = ({ children, ...props }) => (
  <select {...props} style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', fontSize:14, color:'var(--text)', outline:'none', boxSizing:'border-box', ...props.style }}>
    {children}
  </select>
)
const Btn = ({ variant='primary', children, ...props }) => {
  const s = {
    primary: { background:'var(--accent)', color:'#fff', border:'none' },
    secondary: { background:'transparent', color:'var(--text)', border:'1px solid var(--border)' },
    danger: { background:'#ef4444', color:'#fff', border:'none' },
    ghost: { background:'transparent', color:'var(--text-muted)', border:'none' },
    success: { background:'#10b981', color:'#fff', border:'none' },
  }
  return (
    <button {...props} style={{ ...s[variant], borderRadius:8, padding:'10px 18px', fontSize:14, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, ...props.style }}>
      {children}
    </button>
  )
}
const Badge = ({ children, color }) => (
  <span style={{ background:color||'var(--accent-light)', color:color?'#fff':'var(--accent)', borderRadius:20, padding:'2px 9px', fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>{children}</span>
)
const StatCard = ({ label, value, sub, icon, color }) => (
  <div style={{ background:'var(--card)', borderRadius:12, padding:'16px 18px', display:'flex', gap:12, alignItems:'flex-start' }}>
    <div style={{ background:color||'var(--accent)', borderRadius:9, padding:9, color:'#fff', flexShrink:0 }}><Icon name={icon} size={18}/></div>
    <div>
      <div style={{ fontSize:20, fontWeight:800, lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{sub}</div>}
    </div>
  </div>
)
const SC = { confirmed:'#6366f1', pending:'#f59e0b', completed:'#10b981', cancelled:'#6b7280', noshow:'#ef4444' }

const HOURS = Array.from({length:14},(_,i)=>i+8)

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  'Cream & Brown':    { bg:'#f5f0e8', card:'#ede7d9', border:'#d4c8b0', text:'#2c1a0e', muted:'#8c7355', accent:'#5c3317', accentLight:'rgba(92,51,23,0.1)', btnText:'#fff' },
  'Grey & Navy':      { bg:'#f0f2f5', card:'#e4e8ef', border:'#c8d0dc', text:'#1a2340', muted:'#6070a0', accent:'#1a3a6b', accentLight:'rgba(26,58,107,0.1)', btnText:'#fff' },
  'White & Black':    { bg:'#ffffff', card:'#f5f5f5', border:'#e0e0e0', text:'#111111', muted:'#777777', accent:'#111111', accentLight:'rgba(0,0,0,0.06)', btnText:'#fff' },
  'Off-white & Green':{ bg:'#f2f5f0', card:'#e6ede2', border:'#c4d4bc', text:'#1a2e18', muted:'#5a7a52', accent:'#2d6b28', accentLight:'rgba(45,107,40,0.1)', btnText:'#fff' },
  'Warm Grey & Brass':{ bg:'#f0ede8', card:'#e8e4dc', border:'#d0c8ba', text:'#2a2218', muted:'#8a7a62', accent:'#a07030', accentLight:'rgba(160,112,48,0.1)', btnText:'#fff' },
  'Stone & Charcoal': { bg:'#eeece8', card:'#e4e2dc', border:'#ccc8c0', text:'#222220', muted:'#78766e', accent:'#3a3830', accentLight:'rgba(58,56,48,0.08)', btnText:'#fff' },
  'Blush & Slate':    { bg:'#f8f0f0', card:'#f0e4e4', border:'#dcc8c8', text:'#2a2030', muted:'#8a6878', accent:'#4a3858', accentLight:'rgba(74,56,88,0.1)', btnText:'#fff' },
  'Linen & Terracotta':{ bg:'#f5f0e8', card:'#ede6d8', border:'#d8cdb8', text:'#2a1e14', muted:'#8a6e52', accent:'#b84a28', accentLight:'rgba(184,74,40,0.1)', btnText:'#fff' },
}
const DEFAULT_THEME = 'Stone & Charcoal'


// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id:'calendar', label:'Calendar', icon:'calendar' },
  { id:'clients',  label:'Clients',  icon:'users' },
  { id:'finance',  label:'Finance',  icon:'dollar' },
  { id:'tasks',    label:'Tasks',    icon:'check' },
  { id:'health',   label:'Health',   icon:'heart' },
  { id:'analytics',label:'Stats',    icon:'chart' },
  { id:'settings', label:'Settings', icon:'settings' },
]

// ─── CHECKOUT MODAL ───────────────────────────────────────────────────────────
function CheckoutModal({ booking, currency, onClose, onComplete, allBookings }) {
  const [step, setStep] = useState('checkout') // checkout | rebook
  const [method, setMethod] = useState('ziina')
  const [tip, setTip] = useState('')
  const [saving, setSaving] = useState(false)
  const [rebookWeeks, setRebookWeeks] = useState(null)
  const [ziinaLink, setZiinaLink] = useState(null)
  const [ziinaLoading, setZiinaLoading] = useState(false)
  const [ziinaCopied, setZiinaCopied] = useState(false)

  const createZiinaLink = async () => {
    setZiinaLoading(true)
    try {
      const res = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_ZIINA_API_KEY}`
        },
        body: JSON.stringify({
          amount: total * 100,
          currency_code: 'AED',
          message: `${booking?.service} — ${booking?.clientName}`,
          success_url: 'https://swakkmobilebarbering.vercel.app',
          cancel_url: 'https://swakkmobilebarbering.vercel.app',
        })
      })
      const data = await res.json()
      if (data.redirect_url) setZiinaLink(data.redirect_url)
      else setZiinaLink(null)
    } catch(e) {
      setZiinaLink(null)
    }
    setZiinaLoading(false)
  }

  const copyAndOpenWhatsApp = () => {
    if (!ziinaLink) return
    navigator.clipboard.writeText(ziinaLink).catch(()=>{})
    const msg = encodeURIComponent(`Hi ${booking?.clientName}, here's your payment link for your ${booking?.service} — AED ${total}: ${ziinaLink}`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }
  const base = Number(booking?.price||0)
  const tipAmt = Number(tip||0)
  const total = base + tipAmt

  // Find this client's average gap between cuts
  const clientHistory = (allBookings||[]).filter(b=>b.clientName===booking?.clientName && b.status==='completed').map(b=>b.date).sort()
  let avgGap = null
  if (clientHistory.length >= 2) {
    const gaps = []
    for (let i=1; i<clientHistory.length; i++) {
      const d1 = new Date(clientHistory[i-1]); const d2 = new Date(clientHistory[i])
      gaps.push(Math.round((d2-d1)/(1000*60*60*24*7)))
    }
    avgGap = Math.round(gaps.reduce((a,b)=>a+b,0)/gaps.length)
  }

  const complete = async () => {
    setSaving(true)
    await supabase.from('bookings').update({ status:'completed' }).eq('id', booking.id)
    await supabase.from('transactions').insert({
      type:'income', amount:String(total), category:'Haircut',
      description:`${booking.service} — ${booking.clientName}${tipAmt>0?` (incl. ${currency} ${tipAmt} tip)`:''}`,
      date:booking.date, payment_method:method,
    })
    setSaving(false)
    setStep('rebook')
  }

  const skipRebook = () => onComplete()

  const doRebook = async (weeks) => {
    setSaving(true)
    const next = new Date(booking.date+'T12:00:00')
    next.setDate(next.getDate() + weeks*7)
    const ref = Math.random().toString(36).substring(2,8).toUpperCase()
    await supabase.from('bookings').insert({
      client_name: booking.clientName, service: booking.service,
      date: next.toISOString().slice(0,10), time: booking.time,
      price: booking.price, status: 'confirmed', notes: '',
      booking_ref: ref, location: booking.location||''
    })
    setSaving(false); onComplete()
  }

  return (
    <Modal open={true} onClose={step==='rebook'?skipRebook:onClose} title={step==='rebook'?'Book Next Appointment?':'Checkout'}>
      {step === 'rebook' ? (
        <div>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:40, marginBottom:10 }}>✂️</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Cut complete!</div>
            <div style={{ fontSize:14, color:'var(--text-muted)' }}>Want to book {booking.clientName.split(' ')[0]}'s next appointment?</div>
            {avgGap && <div style={{ fontSize:12, color:'var(--accent)', marginTop:6 }}>Usually comes every {avgGap} weeks</div>}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
            {[2,3,4,6].map(w=>{
              const next = new Date(booking.date+'T12:00:00')
              next.setDate(next.getDate() + w*7)
              const dateStr = next.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})
              const isRec = avgGap === w
              return (
                <button key={w} onClick={()=>doRebook(w)} disabled={saving}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', borderRadius:10, border:`1.5px solid ${isRec?'var(--accent)':'var(--border)'}`, background:isRec?'var(--accent-light)':'var(--bg)', cursor:'pointer', textAlign:'left' }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14 }}>In {w} weeks {isRec && <span style={{ color:'var(--accent)', fontSize:11, marginLeft:6 }}>RECOMMENDED</span>}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{dateStr} at {booking.time}</div>
                  </div>
                  <span style={{ color:'var(--accent)', fontSize:18 }}>→</span>
                </button>
              )
            })}
          </div>
          <Btn variant="secondary" onClick={skipRebook} style={{ width:'100%', justifyContent:'center' }}>Skip for now</Btn>
        </div>
      ) : (
      <>
      <div style={{ background:'var(--bg)', borderRadius:12, padding:16, marginBottom:20 }}>
        <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>{booking?.clientName}</div>
        <div style={{ fontSize:13, color:'var(--text-muted)' }}>{booking?.service} · {booking?.date} at {booking?.time}</div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, fontSize:15 }}>
          <span style={{ color:'var(--text-muted)' }}>Service</span><span style={{ fontWeight:700 }}>{currency} {base}</span>
        </div>
        {tipAmt>0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, marginTop:6 }}>
          <span style={{ color:'var(--text-muted)' }}>Tip</span><span style={{ fontWeight:700, color:'#10b981' }}>+{currency} {tipAmt}</span>
        </div>}
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:800, marginTop:10, paddingTop:10, borderTop:'1px solid var(--border)' }}>
          <span>Total</span><span style={{ color:'var(--accent)' }}>{currency} {total}</span>
        </div>
      </div>
      <Field label="Payment Method">
        <div style={{ display:'flex', gap:8 }}>
          {[{id:'ziina',label:'Ziina',icon:'📱'},{id:'cash',label:'Cash',icon:'💵'},{id:'card',label:'Card',icon:'💳'}].map(m=>(
            <button key={m.id} onClick={()=>setMethod(m.id)}
              style={{ flex:1, padding:'12px 8px', borderRadius:10, border:`1.5px solid ${method===m.id?'var(--accent)':'var(--border)'}`, background:method===m.id?'var(--accent-light)':'var(--bg)', cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:20 }}>{m.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:method===m.id?'var(--accent)':'var(--text)', marginTop:4 }}>{m.label}</div>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Add a Tip (optional)">
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          {[20,30,50].map(t=>(
            <button key={t} onClick={()=>setTip(String(t))}
              style={{ flex:1, padding:'8px', borderRadius:8, border:`1.5px solid ${tip===String(t)?'var(--accent)':'var(--border)'}`, background:tip===String(t)?'var(--accent-light)':'var(--bg)', fontSize:13, fontWeight:700, cursor:'pointer', color:tip===String(t)?'var(--accent)':'var(--text)' }}>
              +{t}
            </button>
          ))}
        </div>
        <Inp type="number" value={tip} onChange={e=>setTip(e.target.value)} placeholder="Custom amount"/>
      </Field>
      <div style={{ display:'flex', gap:10, marginTop:8 }}>
        <Btn variant="secondary" onClick={onClose} style={{ flex:1 }}>Cancel</Btn>
        <Btn onClick={complete} disabled={saving} style={{ flex:2, justifyContent:'center' }}>
          {saving?'Processing...':`Complete — ${currency} ${total}`}
        </Btn>
      </div>
      {method==='ziina' && (
        <div style={{ marginTop:10 }}>
          {!ziinaLink ? (
            <button onClick={createZiinaLink} disabled={ziinaLoading}
              style={{ width:'100%', background:'#6c3bff', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:14, fontWeight:700, cursor:ziinaLoading?'wait':'pointer', opacity:ziinaLoading?0.7:1 }}>
              {ziinaLoading ? '⏳ Creating link...' : '⚡ Generate Payment Link'}
            </button>
          ) : (
            <button onClick={copyAndOpenWhatsApp}
              style={{ width:'100%', background:'#25d366', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              💬 Send AED {total} link on WhatsApp
            </button>
          )}
        </div>
      )}
      </>
      )}
    </Modal>
  )
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
function CalendarPage({ data, reload }) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0,10)
  const isMobile = window.innerWidth < 768
  const [view, setView] = useState('week')
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(),today.getMonth(),1))
  const [selDay, setSelDay] = useState(todayStr)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [checkoutB, setCheckoutB] = useState(null)
  const blank = (d) => ({ clientName:'',service:'',date:d||selDay,time:'10:00',price:'',status:'confirmed',notes:'',location:'' })
  const [form, setForm] = useState(blank(todayStr))
  const currency = data.settings.currency||'AED'
  const yr=viewDate.getFullYear(), mo=viewDate.getMonth()
  const thisMonth=`${yr}-${String(mo+1).padStart(2,'0')}`
  const monthIncome = data.transactions.filter(t=>t.type==='income'&&t.date?.startsWith(thisMonth)).reduce((s,t)=>s+Number(t.amount),0)
  const todayB = data.bookings.filter(b=>b.date===todayStr&&b.status!=='cancelled').length
  const booksOnDay = (ds) => data.bookings.filter(b=>b.date===ds&&b.status!=='cancelled').sort((a,b)=>a.time>b.time?1:-1)
  const openNew = (ds, t) => { setEditing(null); setForm({...blank(ds||selDay), time:t||''}); setModalOpen(true) }
  const openEdit = (b) => { setEditing(b.id); setForm({...b}); setModalOpen(true) }
  const saveB = async () => {
    if (!form.clientName||!form.date) return
    setSaving(true)
    const p={client_name:form.clientName,service:form.service,date:form.date,time:form.time,price:form.price,status:form.status,notes:form.notes,location:form.location}
    if (editing) await supabase.from('bookings').update(p).eq('id',editing)
    else {
      const ref=Math.random().toString(36).substring(2,8).toUpperCase()
      await supabase.from('bookings').insert({...p,booking_ref:ref})
      // Auto-create client if doesn't exist
      const existing = data.clients.find(c=>c.name.toLowerCase().trim()===form.clientName.toLowerCase().trim())
      if (!existing) {
        await supabase.from('clients').insert({
          name: form.clientName.trim(),
          preferred_service: form.service||'',
          since: new Date().toISOString().slice(0,10),
        })
      }
      // Send WhatsApp notification
      try {
        const clientRecord = data.clients.find(c=>c.name.toLowerCase().trim()===form.clientName.toLowerCase().trim())
        await fetch('https://nnidxufnykutfpszfjja.supabase.co/functions/v1/notify-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ type: 'new_booking', booking: { clientName: form.clientName, service: form.service, date: form.date, time: form.time, price: form.price, location: form.location, bookingRef: ref, clientPhone: clientRecord?.phone||null } })
        })
      } catch(e) { console.log('Notification failed', e) }
    }
    await reload(); setSaving(false); setModalOpen(false)
  }
  const removeB = async (id) => { await supabase.from('bookings').delete().eq('id',id); await reload() }
  const prev = () => {
    if(view==='month') setViewDate(new Date(yr,mo-1,1))
    else if(view==='week'||view==='day'){const d=new Date(selDay+'T12:00:00');d.setDate(d.getDate()-(view==='week'?7:1));setSelDay(d.toISOString().slice(0,10))}
  }
  const next = () => {
    if(view==='month') setViewDate(new Date(yr,mo+1,1))
    else if(view==='week'||view==='day'){const d=new Date(selDay+'T12:00:00');d.setDate(d.getDate()+(view==='week'?7:1));setSelDay(d.toISOString().slice(0,10))}
  }
  const headerLabel = () => {
    if(view==='month') return viewDate.toLocaleDateString('en-GB',{month:'long',year:'numeric'})
    if(view==='day') return new Date(selDay+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})
    const d=new Date(selDay+'T12:00:00'),dow=(d.getDay()+6)%7,mon=new Date(d);mon.setDate(d.getDate()-dow);const sun=new Date(mon);sun.setDate(mon.getDate()+6)
    return `${mon.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} – ${sun.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}`
  }
  const weekDays = () => {
    const d=new Date(selDay+'T12:00:00'),dow=(d.getDay()+6)%7,mon=new Date(d);mon.setDate(d.getDate()-dow)
    return Array.from({length:7},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x.toISOString().slice(0,10)})
  }

  const BCard = ({ b }) => (
    <div style={{ background:'var(--bg)', borderRadius:10, padding:'12px 14px', borderLeft:`3px solid ${SC[b.status]||'var(--accent)'}`, marginBottom:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14 }}>{b.clientName}</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{b.time}{b.service?` · ${b.service}`:''}</div>
          {b.location && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>📍 {b.location}</div>}
          <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:6 }}>
            <Badge color={SC[b.status]}>{b.status}</Badge>
            {b.price && <span style={{ fontSize:12, fontWeight:700, color:'var(--accent)' }}>{currency} {b.price}</span>}
          </div>
          {b.status==='confirmed' && (
            <button onClick={()=>setCheckoutB(b)} style={{ marginTop:8, background:'#10b981', color:'#fff', border:'none', borderRadius:7, padding:'6px 12px', fontSize:12, fontWeight:700, cursor:'pointer', width:'100%' }}>
              ✓ Checkout
            </button>
          )}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:2, flexShrink:0 }}>
          <Btn variant="ghost" onClick={()=>openEdit(b)} style={{ padding:4 }}><Icon name="edit" size={13}/></Btn>
          <Btn variant="ghost" onClick={()=>removeB(b.id)} style={{ padding:4, color:'#ef4444' }}><Icon name="trash" size={13}/></Btn>
        </div>
      </div>
    </div>
  )

  const MonthView = () => {
    const dim=new Date(yr,mo+1,0).getDate(), fdow=(new Date(yr,mo,1).getDay()+6)%7
    const cells=[...Array(fdow).fill(null),...Array.from({length:dim},(_,i)=>i+1)]
    while(cells.length%7!==0) cells.push(null)
    const selBooks=booksOnDay(selDay)
    return (
      <div style={{ display:'flex', flexDirection:isMobile?'column':'row', gap:16, flex:1, overflow:isMobile?'visible':'hidden' }}>
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:4 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700, color:'var(--text-muted)', padding:'3px 0', textTransform:'uppercase', letterSpacing:'0.06em' }}>{d}</div>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, flex:1, alignContent:'start' }}>
            {cells.map((day,i)=>{
              if(!day) return <div key={`e${i}`}/>
              const ds=`${yr}-${String(mo+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const db=booksOnDay(ds), isT=ds===todayStr, isS=ds===selDay
              return (
                <div key={ds} onClick={()=>setSelDay(ds)} style={{ minHeight:isMobile?60:78, border:`1.5px solid ${isS?'var(--accent)':isT?'rgba(99,102,241,0.5)':'var(--border)'}`, borderRadius:10, padding:'7px 8px', cursor:'pointer', background:isS?'rgba(99,102,241,0.1)':'var(--card)' }}>
                  <div style={{ fontSize:13, fontWeight:isT?800:600, color:isT?'var(--accent)':'var(--text)', marginBottom:4 }}>{day}</div>
                  {db.slice(0,2).map(b=><div key={b.id} style={{ fontSize:10, fontWeight:600, background:SC[b.status]||'var(--accent)', color:'#fff', borderRadius:4, padding:'2px 5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{b.time} {b.clientName}</div>)}
                  {db.length>2 && <div style={{ fontSize:10, color:'var(--text-muted)' }}>+{db.length-2}</div>}
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ width:isMobile?'100%':270, flexShrink:0, display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ background:'var(--card)', borderRadius:14, padding:16, flex:1, overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800 }}>{new Date(selDay+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'})}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(selDay+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long'})}</div>
              </div>
              <Btn onClick={()=>openNew(selDay)} style={{ padding:'7px 12px', fontSize:12 }}><Icon name="plus" size={13}/> Add</Btn>
            </div>
            {selBooks.length===0 ? <div style={{ textAlign:'center', color:'var(--text-muted)', paddingTop:32 }}><div style={{ fontSize:28, marginBottom:8 }}>✂️</div><div style={{ fontSize:13 }}>No bookings</div></div>
              : selBooks.map(b=><BCard key={b.id} b={b}/>)}
          </div>
          <div style={{ background:'var(--card)', borderRadius:12, padding:'12px 16px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>This Month</div>
            {[['Revenue',`${currency} ${monthIncome.toLocaleString()}`],['Bookings',data.bookings.filter(b=>b.date?.startsWith(thisMonth)).length],['Clients',data.clients.length]].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5 }}>
                <span style={{ color:'var(--text-muted)' }}>{l}</span><span style={{ fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const WeekView = () => {
    const days = weekDays()
    return (
      <div style={{ flex:1, overflow:'auto' }}>
        {/* Day headers */}
        <div style={{ display:'grid', gridTemplateColumns:`60px repeat(7,1fr)`, position:'sticky', top:0, background:'var(--bg)', zIndex:10, borderBottom:'1px solid var(--border)' }}>
          <div/>
          {days.map(ds=>{
            const isToday=ds===todayStr, isSel=ds===selDay
            const d=new Date(ds+'T12:00:00')
            return (
              <div key={ds} onClick={()=>setSelDay(ds)} style={{ textAlign:'center', padding:'10px 4px', cursor:'pointer', borderLeft:'1px solid var(--border)', background:isSel?'rgba(99,102,241,0.1)':'transparent' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>{d.toLocaleDateString('en-GB',{weekday:'short'})}</div>
                <div style={{ fontSize:18, fontWeight:800, color:isToday?'var(--accent)':isSel?'var(--accent)':'var(--text)', marginTop:2 }}>{d.getDate()}</div>
              </div>
            )
          })}
        </div>
        {/* Hour rows */}
        {HOURS.map(h=>(
          <div key={h} style={{ display:'grid', gridTemplateColumns:`60px repeat(7,1fr)`, minHeight:60, borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', padding:'6px 8px', textAlign:'right', paddingTop:4 }}>{String(h).padStart(2,'0')}:00</div>
            {days.map(ds=>{
              const hStr=String(h).padStart(2,'0')
              const sb=data.bookings.filter(b=>b.date===ds&&b.time&&b.time.startsWith(hStr+':')&&b.status!=='cancelled')
              return (
                <div key={ds} onClick={()=>{setSelDay(ds);openNew(ds,hStr+':00')}} style={{ borderLeft:'1px solid var(--border)', padding:2, cursor:'pointer' }}>
                  {sb.map(b=>(
                    <div key={b.id} onClick={e=>{e.stopPropagation();openEdit(b)}}
                      style={{ background:SC[b.status]||'var(--accent)', borderRadius:5, padding:'3px 6px', fontSize:11, fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', cursor:'pointer' }}>
                      {b.time} {b.clientName}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  const AgendaView = () => {
    const upcoming = data.bookings.filter(b=>b.date>=todayStr&&b.status!=='cancelled').sort((a,b)=>(a.date+a.time)>(b.date+b.time)?1:-1)
    const grouped = {}
    upcoming.forEach(b=>{ if(!grouped[b.date]) grouped[b.date]=[]; grouped[b.date].push(b) })
    return (
      <div style={{ flex:1, overflow:'auto' }}>
        {Object.keys(grouped).length===0 && <div style={{ textAlign:'center', color:'var(--text-muted)', paddingTop:60 }}><div style={{ fontSize:32, marginBottom:12 }}>📅</div><div style={{ fontSize:14 }}>No upcoming bookings</div></div>}
        {Object.keys(grouped).sort().map(ds=>{
          const isT=ds===todayStr
          return (
            <div key={ds} style={{ marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ fontSize:13, fontWeight:800, color:isT?'var(--accent)':'var(--text)' }}>{isT?'Today — ':''}{new Date(ds+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div>
                <div style={{ flex:1, height:1, background:'var(--border)' }}/>
                <Btn onClick={()=>openNew(ds)} style={{ padding:'5px 10px', fontSize:12 }}><Icon name="plus" size={12}/></Btn>
              </div>
              {grouped[ds].map(b=><BCard key={b.id} b={b}/>)}
            </div>
          )
        })}
      </div>
    )
  }

  const DayView = () => {
    const db=booksOnDay(selDay)
    return (
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--text-muted)' }}>{db.length} booking{db.length!==1?'s':''}</div>
          <Btn onClick={()=>openNew(selDay)} style={{ padding:'7px 14px', fontSize:13 }}><Icon name="plus" size={13}/> Add</Btn>
        </div>
        {HOURS.map(h=>{
          const hStr=String(h).padStart(2,'0')
          const sb=data.bookings.filter(b=>b.date===selDay&&b.time&&b.time.startsWith(hStr+':')&&b.status!=='cancelled')
          return (
            <div key={h} style={{ display:'flex', gap:12, marginBottom:4, minHeight:56 }}>
              <div style={{ width:44, fontSize:12, color:'var(--text-muted)', paddingTop:4, textAlign:'right', flexShrink:0 }}>{String(h).padStart(2,'0')}:00</div>
              <div style={{ flex:1, borderTop:'1px solid var(--border)', paddingTop:4 }}>
                {sb.map(b=><BCard key={b.id} b={b}/>)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:isMobile?'auto':'calc(100vh - 56px)', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>Calendar</h2>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{todayB} booking{todayB!==1?'s':''} today · {currency} {monthIncome.toLocaleString()} this month</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <div style={{ display:'flex', background:'var(--card)', borderRadius:10, padding:3, gap:2 }}>
            {['week','day','agenda','month'].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{ padding:'6px 10px', borderRadius:7, border:'none', background:view===v?'var(--accent)':'transparent', color:view===v?'var(--bg)':'var(--text-muted)', fontSize:12, fontWeight:600, cursor:'pointer', textTransform:'capitalize' }}>{v}</button>
            ))}
          </div>
          {view!=='agenda' && (            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Btn variant="secondary" onClick={prev} style={{ padding:'6px 10px' }}><Icon name="chevron_left" size={14}/></Btn>
              <span style={{ fontSize:13, fontWeight:700, minWidth:isMobile?100:160, textAlign:'center' }}>{headerLabel()}</span>
              <Btn variant="secondary" onClick={next} style={{ padding:'6px 10px' }}><Icon name="chevron_right" size={14}/></Btn>
            </div>
          )}
          <Btn onClick={()=>{ setSelDay(todayStr); setViewDate(new Date(today.getFullYear(),today.getMonth(),1)) }} style={{ padding:"6px 12px", fontSize:12, fontWeight:700 }}>{today.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</Btn>
          <Btn onClick={()=>openNew(selDay)} style={{ padding:'8px 14px' }}><Icon name="plus" size={14}/> Book</Btn>
        </div>
      </div>
      {(()=>{
        const todayBookings = data.bookings.filter(b=>b.date===todayStr&&b.status!=='cancelled').sort((a,b)=>a.time>b.time?1:-1)
        if (todayBookings.length===0) return null
        return (
          <div style={{ background:'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)', borderRadius:12, padding:'14px 16px', marginBottom:14, color:'#fff' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', opacity:0.9 }}>Today's Bookings</div>
              <div style={{ fontSize:11, fontWeight:700, background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:10 }}>{todayBookings.length} cut{todayBookings.length>1?'s':''}</div>
            </div>
            <div style={{ display:'flex', flexDirection:isMobile?'column':'row', gap:6, flexWrap:'wrap' }}>
              {todayBookings.map(b=>(
                <div key={b.id} style={{ background:'rgba(255,255,255,0.15)', borderRadius:8, padding:'8px 12px', fontSize:13, fontWeight:600, flex:isMobile?'1':'0 1 auto' }}>
                  <span style={{ fontWeight:800 }}>{b.time}</span> · {b.clientName}{b.location?<div style={{ fontSize:11, opacity:0.85, marginTop:2 }}>📍 {b.location}</div>:''}
                </div>
              ))}
            </div>
          </div>
        )
      })()}
      {(()=>{
        // Week stats
        const days = weekDays()
        const weekStart = days[0], weekEnd = days[6]
        const weekBookings = data.bookings.filter(b=>b.date>=weekStart&&b.date<=weekEnd&&b.status!=='cancelled')
        const weekRevenue = weekBookings.reduce((s,b)=>s+Number(b.price||0),0)
        // New vs returning
        const clientFirstDates = {}
        data.bookings.forEach(b=>{
          if (!clientFirstDates[b.clientName] || b.date < clientFirstDates[b.clientName]) clientFirstDates[b.clientName] = b.date
        })
        let newCount=0, returningCount=0
        const seenThisWeek = new Set()
        weekBookings.forEach(b=>{
          if (seenThisWeek.has(b.clientName)) return
          seenThisWeek.add(b.clientName)
          if (clientFirstDates[b.clientName] >= weekStart) newCount++; else returningCount++
        })
        if (weekBookings.length===0) return null
        return (
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'repeat(3,1fr)', gap:8, marginBottom:14 }}>
            <div style={{ background:'var(--card)', borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>This Week</div>
              <div style={{ fontSize:18, fontWeight:800, marginTop:2 }}>{weekBookings.length} <span style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)' }}>cuts</span></div>
            </div>
            <div style={{ background:'var(--card)', borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Revenue</div>
              <div style={{ fontSize:18, fontWeight:800, marginTop:2, color:'#10b981' }}>{currency} {weekRevenue.toLocaleString()}</div>
            </div>
            <div style={{ background:'var(--card)', borderRadius:10, padding:'10px 14px', gridColumn:isMobile?'span 2':'auto' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Clients</div>
              <div style={{ fontSize:14, fontWeight:700, marginTop:2 }}>
                <span style={{ color:'#10b981' }}>{newCount} new</span>
                <span style={{ color:'var(--text-muted)', margin:'0 6px' }}>·</span>
                <span>{returningCount} returning</span>
              </div>
            </div>
          </div>
        )
      })()}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {view==='week' && <WeekView/>}
        {view==='month' && <MonthView/>}
        {view==='day' && <DayView/>}
        {view==='agenda' && <AgendaView/>}
      </div>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Booking':'New Booking'}>
        {/* Client name — searchable dropdown */}
        {(() => {
          const [cSearch, setCSearch] = useState('')
          const [cOpen, setCOpen] = useState(false)
          const filtered = data.clients.filter(c=>c.name.toLowerCase().includes(cSearch.toLowerCase())).slice(0,8)
          return (
            <Field label="Client Name">
              <div style={{ position:'relative' }}>
                <Inp
                  value={cSearch||form.clientName}
                  onChange={e=>{ setCSearch(e.target.value); setForm({...form,clientName:e.target.value}); setCOpen(true) }}
                  onFocus={()=>setCOpen(true)}
                  placeholder="Search or type name..."
                />
                {cOpen && (cSearch||!form.clientName) && filtered.length>0 && (
                  <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, zIndex:50, marginTop:4, maxHeight:200, overflow:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
                    {filtered.map(c=>(
                      <div key={c.id} onMouseDown={()=>{ setForm({...form,clientName:c.name}); setCSearch(''); setCOpen(false) }}
                        style={{ padding:'10px 14px', cursor:'pointer', fontSize:14, borderBottom:'1px solid var(--border)' }}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--accent-light)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        {c.name}
                        {c.phone && <span style={{ color:'var(--text-muted)', fontSize:12, marginLeft:8 }}>{c.phone}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Field>
          )
        })()}
        {/* Service picker */}
        {(() => {
          const [groupSize, setGroupSize] = useState(2)
          const [beards, setBeards] = useState(0)
          const isGroup = form.service?.startsWith('Group')
          const updateGroup = (size, b) => {
            const price = (size * 150) + (b * 20)
            const svc = b > 0 ? `Group (${size} people, ${b} beard${b>1?'s':''})` : `Group (${size} people)`
            setForm({...form, service: svc, price: String(price)})
          }
          return (
            <Field label="Service">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom: isGroup ? 10 : 0 }}>
                {[{label:'Haircut',price:180},{label:'Hair & Beard',price:200}].map(s=>{
                  const active = form.service===s.label
                  return (
                    <button key={s.label} onMouseDown={()=>setForm({...form,service:s.label,price:String(s.price)})}
                      style={{ padding:'8px 16px', borderRadius:8, border:`1.5px solid ${active?'var(--accent)':'var(--border)'}`, background:active?'var(--accent-light)':'transparent', color:active?'var(--accent)':'var(--text)', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                      {s.label} <span style={{ opacity:0.6, fontSize:11 }}>AED {s.price}</span>
                    </button>
                  )
                })}
                <button onMouseDown={()=>{ setBeards(0); updateGroup(groupSize, 0) }}
                  style={{ padding:'8px 16px', borderRadius:8, border:`1.5px solid ${isGroup?'var(--accent)':'var(--border)'}`, background:isGroup?'var(--accent-light)':'transparent', color:isGroup?'var(--accent)':'var(--text)', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  Group <span style={{ opacity:0.6, fontSize:11 }}>↓</span>
                </button>
              </div>
              {isGroup && (
                <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)', width:64, flexShrink:0 }}>People</span>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {[2,3,4,5,6,7,8,9,10].map(n=>(
                        <button key={n} onMouseDown={()=>{ const b=Math.min(beards,n); setGroupSize(n); setBeards(b); updateGroup(n,b) }}
                          style={{ width:30, height:30, borderRadius:6, border:`1.5px solid ${groupSize===n?'var(--accent)':'var(--border)'}`, background:groupSize===n?'var(--accent)':'transparent', color:groupSize===n?'#fff':'var(--text)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)', width:64, flexShrink:0 }}>Beards</span>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {Array.from({length:groupSize+1},(_,n)=>(
                        <button key={n} onMouseDown={()=>{ setBeards(n); updateGroup(groupSize,n) }}
                          style={{ width:30, height:30, borderRadius:6, border:`1.5px solid ${beards===n?'var(--accent)':'var(--border)'}`, background:beards===n?'var(--accent)':'transparent', color:beards===n?'#fff':'var(--text)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', paddingTop:2 }}>
                    {groupSize} × AED 150{beards>0?` + ${beards} × AED 20`:''} = <span style={{ color:'var(--text)', fontWeight:700 }}>AED {(groupSize*150)+(beards*20)}</span>
                  </div>
                </div>
              )}
            </Field>
          )
        })()}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Date"><Inp type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
          <Field label="Time"><Inp type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></Field>
        </div>
        <Field label="Price"><Inp type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="0"/></Field>
        {editing && (
          <Field label="Mark as">
            <div style={{ display:'flex', gap:8 }}>
              <button onMouseDown={()=>setForm({...form,status:'noshow'})}
                style={{ flex:1, padding:'10px', borderRadius:8, border:`1.5px solid ${form.status==='noshow'?'#ef4444':'var(--border)'}`, background:form.status==='noshow'?'rgba(239,68,68,0.1)':'transparent', color:form.status==='noshow'?'#ef4444':'var(--text)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                🚫 No Show
              </button>
              <button onMouseDown={()=>setForm({...form,status:'cancelled'})}
                style={{ flex:1, padding:'10px', borderRadius:8, border:`1.5px solid ${form.status==='cancelled'?'#f59e0b':'var(--border)'}`, background:form.status==='cancelled'?'rgba(245,158,11,0.1)':'transparent', color:form.status==='cancelled'?'#f59e0b':'var(--text)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                ⚠️ Late Cancel
              </button>
            </div>
          </Field>
        )}
        <Field label="Location"><Inp value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Client address or salon"/></Field>
        <Field label="Notes"><Inp value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Any notes..."/></Field>
        <div style={{ display:"flex", gap:8, justifyContent:"space-between", marginTop:8, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:8 }}>
            {editing && <Btn variant="danger" onClick={()=>{ if(window.confirm("Delete this booking?")){ removeB(editing); setModalOpen(false) } }}>Delete</Btn>}
            {editing && <Btn onClick={()=>{ const b=data.bookings.find(x=>x.id===editing); setModalOpen(false); if(b) setCheckoutB(b) }} style={{ background:'#10b981', border:'none' }}>Checkout</Btn>}
          </div>
          <div style={{ display:"flex", gap:8 }}><Btn variant="secondary" onClick={()=>setModalOpen(false)}>Cancel</Btn><Btn onClick={saveB} disabled={saving}>{saving?"Saving...":"Save"}</Btn></div>
        </div>
      </Modal>
      {checkoutB && <CheckoutModal booking={checkoutB} currency={currency} allBookings={data.bookings} onClose={()=>setCheckoutB(null)} onComplete={async()=>{setCheckoutB(null);await reload()}}/>}
    </div>
  )
}

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
function ClientsPage({ data, reload }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'',phone:'',email:'',notes:'',preferredService:'' })
  const openNew=()=>{setEditing(null);setForm({name:'',phone:'',email:'',notes:'',preferredService:''});setOpen(true)}
  const openEdit=(c)=>{setEditing(c.id);setForm({...c});setOpen(true)}
  const save=async()=>{
    if(!form.name) return; setSaving(true)
    const p={name:form.name,phone:form.phone,email:form.email,notes:form.notes,preferred_service:form.preferredService}
    if(editing) await supabase.from('clients').update(p).eq('id',editing)
    else await supabase.from('clients').insert({...p,since:new Date().toISOString().slice(0,10)})
    await reload(); setSaving(false); setOpen(false)
  }
  const remove=async(id)=>{await supabase.from('clients').delete().eq('id',id);await reload()}
  const getStats=(c)=>{
    const v=data.bookings.filter(b=>b.clientName===c.name&&b.status==='completed')
    const cancellations=data.bookings.filter(b=>b.clientName===c.name&&(b.status==='cancelled'||b.status==='noshow')).length
    const noShows=data.bookings.filter(b=>b.clientName===c.name&&b.status==='noshow').length
    return{visits:v.length,spent:v.reduce((s,b)=>s+Number(b.price||0),0),cancellations,noShows}
  }
  const filtered=data.clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone?.includes(search))
  const currency=data.settings.currency||'AED'
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>Clients</h2>
        <Btn onClick={openNew}><Icon name="plus" size={15}/> Add Client</Btn>
      </div>
      <Inp value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or phone..." style={{ marginBottom:16 }}/>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length===0 && <p style={{ color:'var(--text-muted)', textAlign:'center', padding:40 }}>No clients yet.</p>}
        {filtered.map(c=>{const st=getStats(c);return(
          <div key={c.id} style={{ background:'var(--card)', borderRadius:12, padding:16, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div style={{ display:'flex', gap:12 }}>
              <div style={{ width:42,height:42,borderRadius:'50%',background:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:16,flexShrink:0 }}>{c.name[0].toUpperCase()}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, display:'flex', alignItems:'center', gap:6 }}>
                  {c.name}
                  {(st.noShows>=2||st.cancellations>=3) && <span title={`${st.noShows} no-shows, ${st.cancellations} cancellations`} style={{ background:'#ef4444', color:'#fff', fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:10 }}>⚠ {st.noShows>=2?'NO-SHOW RISK':'FLAKY'}</span>}
                </div>
                {c.phone && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:1 }}>📞 {c.phone}</div>}
                {c.preferredService && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:1 }}>✂️ {c.preferredService}</div>}
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>
                  {st.visits} visits · {currency} {st.spent} spent
                  {st.cancellations>0 && <span style={{ color:'#ef4444', marginLeft:6 }}>· {st.cancellations} cancelled{st.noShows>0?` (${st.noShows} no-show)`:''}</span>}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn variant="ghost" onClick={()=>openEdit(c)} style={{ padding:6 }}><Icon name="edit" size={14}/></Btn>
              <Btn variant="ghost" onClick={()=>remove(c.id)} style={{ padding:6, color:'#ef4444' }}><Icon name="trash" size={14}/></Btn>
            </div>
          </div>
        )})}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title={editing?'Edit Client':'New Client'}>
        <Field label="Name"><Inp value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+971..."/></Field>
        <Field label="Email"><Inp value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
        <Field label="Preferred Service"><Inp value={form.preferredService} onChange={e=>setForm({...form,preferredService:e.target.value})} placeholder="e.g. Skin fade"/></Field>
        <Field label="Notes"><Inp value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></Field>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
          <Btn variant="secondary" onClick={()=>setOpen(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving?'Saving...':'Save'}</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─── FINANCE ─────────────────────────────────────────────────────────────────
function FinancePage({ data, reload }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('month')
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const today = new Date().toISOString().slice(0,10)
  const [form, setForm] = useState({ type:'income',amount:'',category:'',description:'',date:today,paymentMethod:'cash' })
  const currency = data.settings.currency||'AED'
  const thisMonth = today.slice(0,7)
  const save=async()=>{
    if(!form.amount||!form.date) return; setSaving(true)
    await supabase.from('transactions').insert({type:form.type,amount:form.amount,category:form.category,description:form.description,date:form.date,payment_method:form.paymentMethod})
    await reload(); setSaving(false); setOpen(false)
    setForm({type:'income',amount:'',category:'',description:'',date:today,paymentMethod:'cash'})
  }
  const remove=async(id)=>{await supabase.from('transactions').delete().eq('id',id);await reload()}

  const categorise=(m)=>{
    const s=m.toLowerCase()
    if(/enoc|eppco|emarat|adnoc|fuel|petrol/.test(s)) return 'Fuel'
    if(/noon|instashop|spinneys|waitrose|lulu|carrefour|groceries|supermarket|tudo|keeta/.test(s)) return 'Food & Groceries'
    if(/amazon|apple|airalo|viva|du|etisalat/.test(s)) return 'Tech & Subscriptions'
    if(/careem|uber|taxi/.test(s)) return 'Transport'
    if(/gym|fitness/.test(s)) return 'Gym'
    return 'General'
  }

  const handleImport=async(e)=>{
    const file=e.target.files[0]; if(!file) return
    setImporting(true); setImportResult(null)
    const text=await file.text()
    const lines=text.split('\n').filter(l=>l.trim())
    const headers=lines[0].split(',')
    const idx={time:headers.indexOf('Time'),type:headers.indexOf('Type'),amount:headers.indexOf('Amount'),customer:headers.indexOf('Customer')}
    const rows=lines.slice(1).map(line=>{
      const cols=[];let cur='';let inQ=false
      for(const ch of line){if(ch==='"')inQ=!inQ;else if(ch===','&&!inQ){cols.push(cur.trim());cur=''}else cur+=ch}
      cols.push(cur.trim()); return cols
    })
    const toInsert=[]; let imported=0,skipped=0
    for(const row of rows){
      const rawType=row[idx.type]?.trim(),rawAmount=parseFloat(row[idx.amount]),rawTime=row[idx.time]?.trim()
      if(!rawType||isNaN(rawAmount)||!rawTime){skipped++;continue}
      const parts=rawTime.split(' ')[0].split('/')
      if(parts.length!==3){skipped++;continue}
      const date=`${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`
      const isIncome=rawType==='Invoice',absAmount=Math.abs(rawAmount),customer=row[idx.customer]?.trim()||''
      toInsert.push({type:isIncome?'income':'expense',amount:String(absAmount),category:isIncome?'Haircut':categorise(customer),description:isIncome?(customer?`Haircut — ${customer}`:'Haircut'):customer||'Expense',date,payment_method:'ziina'})
      imported++
    }
    for(let i=0;i<toInsert.length;i+=50) await supabase.from('transactions').insert(toInsert.slice(i,i+50))
    await reload(); setImporting(false); setImportResult({imported,skipped}); e.target.value=''
  }

  const filtered=data.transactions.filter(t=>filter==='all'?true:filter==='month'?t.date?.startsWith(thisMonth):t.type===filter)
  const inc=filtered.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
  const exp=filtered.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>Finance</h2>
        <div style={{ display:'flex', gap:8 }}>
          <label style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 14px', fontSize:13, fontWeight:600, cursor:'pointer', color:'var(--text)', display:'inline-flex', alignItems:'center', gap:6 }}>
            {importing?'Importing...':'⬆ Import Ziina'}
            <input type="file" accept=".csv" onChange={handleImport} style={{ display:'none' }} disabled={importing}/>
          </label>
          <Btn onClick={()=>setOpen(true)}><Icon name="plus" size={15}/> Add</Btn>
        </div>
      </div>
      {importResult && (
        <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:14, color:'#10b981', fontWeight:600 }}>✓ Imported {importResult.imported} transactions{importResult.skipped>0?` (${importResult.skipped} skipped)`:''}</span>
          <button onClick={()=>setImportResult(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:16 }}>×</button>
        </div>
      )}
      <div style={{ background:'var(--card)', borderRadius:14, padding:20, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>
          {filter==='month'?'This Month':filter==='all'?'All Time':filter==='income'?'Income':'Expenses'}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#10b981', textTransform:'uppercase', marginBottom:4 }}>In</div>
            <div style={{ fontSize:20, fontWeight:800 }}>{currency} {inc.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#ef4444', textTransform:'uppercase', marginBottom:4 }}>Out</div>
            <div style={{ fontSize:20, fontWeight:800 }}>{currency} {exp.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:'center', background:inc-exp>=0?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', borderRadius:10, padding:'8px 4px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:inc-exp>=0?'#10b981':'#ef4444', textTransform:'uppercase', marginBottom:4 }}>Net</div>
            <div style={{ fontSize:20, fontWeight:800, color:inc-exp>=0?'#10b981':'#ef4444' }}>{currency} {(inc-exp).toLocaleString()}</div>
          </div>
        </div>
        {(()=>{
          const byM={};filtered.filter(t=>t.type==='income').forEach(t=>{const m=t.paymentMethod||'other';byM[m]=(byM[m]||0)+Number(t.amount)})
          const methods=Object.entries(byM).sort((a,b)=>b[1]-a[1])
          if(!methods.length) return null
          const icons={ziina:'📱',cash:'💵',card:'💳',other:'💰',transfer:'🏦'}
          return <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:8 }}>Income by Method</div>
            <div style={{ display:'flex', gap:8 }}>
              {methods.map(([m,v])=><div key={m} style={{ flex:1, background:'var(--bg)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                <div style={{ fontSize:18 }}>{icons[m]||'💰'}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'capitalize', marginTop:4 }}>{m}</div>
                <div style={{ fontSize:14, fontWeight:800, marginTop:2 }}>{currency} {v.toLocaleString()}</div>
              </div>)}
            </div>
          </div>
        })()}
        {(()=>{
          const byCat={};filtered.filter(t=>t.type==='expense').forEach(t=>{const c=t.category||'General';byCat[c]=(byCat[c]||0)+Number(t.amount)})
          const cats=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5)
          if(!cats.length) return null
          return <div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:8 }}>Where it's going</div>
            {cats.map(([cat,val])=><div key={cat} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                <span style={{ fontWeight:600 }}>{cat}</span>
                <span style={{ fontWeight:700, color:'#ef4444' }}>{currency} {val.toLocaleString()}</span>
              </div>
              <div style={{ height:6, background:'var(--bg)', borderRadius:3 }}>
                <div style={{ height:'100%', background:'#ef4444', borderRadius:3, width:`${(val/cats[0][1])*100}%`, opacity:0.7 }}/>
              </div>
            </div>)}
          </div>
        })()}
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {['all','month','income','expense'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?'var(--accent)':'var(--card)', color:filter===f?'#fff':'var(--text-muted)', border:'none', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer', textTransform:'capitalize' }}>
            {f==='month'?'This Month':f}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.length===0 && <p style={{ color:'var(--text-muted)', textAlign:'center', padding:40 }}>No transactions.</p>}
        {filtered.map(t=>(
          <div key={t.id} style={{ background:'var(--card)', borderRadius:10, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>{t.description||t.category||(t.type==='income'?'Income':'Expense')}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{t.date} · {t.paymentMethod}{t.category?` · ${t.category}`:''}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontWeight:800, fontSize:15, color:t.type==='income'?'#10b981':'#ef4444' }}>{t.type==='income'?'+':'-'}{currency} {Number(t.amount).toLocaleString()}</span>
              <Btn variant="ghost" onClick={()=>remove(t.id)} style={{ padding:4, color:'#ef4444' }}><Icon name="trash" size={13}/></Btn>
            </div>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title="Add Transaction">
        <Field label="Type"><Sel value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="income">Income</option><option value="expense">Expense</option></Sel></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Amount"><Inp type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0"/></Field>
          <Field label="Date"><Inp type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
        </div>
        <Field label="Category"><Inp value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Haircut, Products, Travel..."/></Field>
        <Field label="Description"><Inp value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></Field>
        <Field label="Payment Method"><Sel value={form.paymentMethod} onChange={e=>setForm({...form,paymentMethod:e.target.value})}><option value="cash">Cash</option><option value="ziina">Ziina</option><option value="card">Card</option><option value="transfer">Transfer</option></Sel></Field>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
          <Btn variant="secondary" onClick={()=>setOpen(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving?'Saving...':'Save'}</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─── TASKS ────────────────────────────────────────────────────────────────────
function TasksPage({ data, reload }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title:'',priority:'medium',dueDate:'',category:'' })
  const PC={ high:'#ef4444',medium:'#f59e0b',low:'#10b981' }
  const save=async()=>{
    if(!form.title) return
    await supabase.from('tasks').insert({title:form.title,priority:form.priority,due_date:form.dueDate,category:form.category,done:false})
    await reload(); setOpen(false); setForm({title:'',priority:'medium',dueDate:'',category:''})
  }
  const toggle=async(t)=>{await supabase.from('tasks').update({done:!t.done}).eq('id',t.id);await reload()}
  const remove=async(id)=>{await supabase.from('tasks').delete().eq('id',id);await reload()}
  const pending=data.tasks.filter(t=>!t.done), done=data.tasks.filter(t=>t.done)
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>Tasks</h2>
        <Btn onClick={()=>setOpen(true)}><Icon name="plus" size={15}/> Add Task</Btn>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
        {pending.length===0 && <p style={{ color:'var(--text-muted)', textAlign:'center', padding:24 }}>All done! 🎉</p>}
        {pending.map(t=>(
          <div key={t.id} style={{ background:'var(--card)', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
            <button onClick={()=>toggle(t)} style={{ width:22,height:22,borderRadius:6,border:`2px solid ${PC[t.priority]}`,background:'transparent',cursor:'pointer',flexShrink:0,marginTop:1 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{t.title}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3, display:'flex', gap:8, alignItems:'center' }}>
                <Badge color={PC[t.priority]}>{t.priority}</Badge>
                {t.category && <span>{t.category}</span>}
                {t.dueDate && <span>Due {t.dueDate}</span>}
              </div>
            </div>
            <Btn variant="ghost" onClick={()=>remove(t.id)} style={{ padding:4, color:'#ef4444' }}><Icon name="trash" size={13}/></Btn>
          </div>
        ))}
      </div>
      {done.length>0 && <>
        <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Completed ({done.length})</div>
        {done.map(t=>(
          <div key={t.id} style={{ background:'var(--card)', borderRadius:10, padding:'10px 16px', display:'flex', alignItems:'center', gap:12, opacity:0.5, marginBottom:6 }}>
            <button onClick={()=>toggle(t)} style={{ width:22,height:22,borderRadius:6,border:'none',background:'#10b981',cursor:'pointer',flexShrink:0,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center' }}><Icon name="check" size={11}/></button>
            <span style={{ fontSize:14, textDecoration:'line-through', flex:1 }}>{t.title}</span>
            <Btn variant="ghost" onClick={()=>remove(t.id)} style={{ padding:4, color:'#ef4444' }}><Icon name="trash" size={13}/></Btn>
          </div>
        ))}
      </>}
      <Modal open={open} onClose={()=>setOpen(false)} title="New Task">
        <Field label="Task"><Inp value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="What needs doing?"/></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Priority"><Sel value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></Sel></Field>
          <Field label="Due Date"><Inp type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></Field>
        </div>
        <Field label="Category"><Inp value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Business, Personal, Health..."/></Field>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
          <Btn variant="secondary" onClick={()=>setOpen(false)}>Cancel</Btn>
          <Btn onClick={save}>Add Task</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─── HEALTH ───────────────────────────────────────────────────────────────────
function HealthPage({ data, reload }) {
  const today=new Date().toISOString().slice(0,10)
  const [wf, setWf]=useState({weight:'',date:today,notes:''})
  const [mf, setMf]=useState({meal:'',calories:'',protein:'',time:'',date:today})
  const logW=async()=>{if(!wf.weight)return;await supabase.from('weight_logs').insert({weight:wf.weight,date:wf.date,notes:wf.notes});await reload();setWf({...wf,weight:'',notes:''})}
  const logM=async()=>{if(!mf.meal)return;await supabase.from('meal_logs').insert({meal:mf.meal,calories:mf.calories,protein:mf.protein,time:mf.time,date:mf.date});await reload();setMf({...mf,meal:'',calories:'',protein:'',time:''})}
  const todayMeals=data.mealLogs.filter(m=>m.date===today)
  const todayCal=todayMeals.reduce((s,m)=>s+Number(m.calories||0),0)
  const todayPro=todayMeals.reduce((s,m)=>s+Number(m.protein||0),0)
  const latest=data.weightLogs[0]
  return (
    <div>
      <h2 style={{ margin:'0 0 20px', fontSize:20, fontWeight:800 }}>Health</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
        <StatCard label="Current Weight" value={latest?`${latest.weight}kg`:'—'} icon="weight" color="#8b5cf6" sub={latest?.date}/>
        <StatCard label="Today's Calories" value={todayCal} icon="food" color="#f59e0b" sub={`${todayPro}g protein`}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ background:'var(--card)', borderRadius:12, padding:18 }}>
          <h3 style={{ margin:'0 0 14px', fontSize:15, fontWeight:700 }}>Log Weight</h3>
          <Field label="Weight (kg)"><Inp type="number" step="0.1" value={wf.weight} onChange={e=>setWf({...wf,weight:e.target.value})} placeholder="85.0"/></Field>
          <Field label="Date"><Inp type="date" value={wf.date} onChange={e=>setWf({...wf,date:e.target.value})}/></Field>
          <Field label="Notes"><Inp value={wf.notes} onChange={e=>setWf({...wf,notes:e.target.value})} placeholder="How you felt..."/></Field>
          <Btn onClick={logW} style={{ width:'100%', justifyContent:'center' }}>Log Weight</Btn>
          {data.weightLogs.slice(0,5).length>0 && <div style={{ marginTop:12 }}>
            {data.weightLogs.slice(0,5).map(w=><div key={w.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'5px 0', borderBottom:'1px solid var(--border)' }}><span style={{ color:'var(--text-muted)' }}>{w.date}</span><span style={{ fontWeight:700 }}>{w.weight}kg</span></div>)}
          </div>}
        </div>
        <div style={{ background:'var(--card)', borderRadius:12, padding:18 }}>
          <h3 style={{ margin:'0 0 14px', fontSize:15, fontWeight:700 }}>Log Meal</h3>
          <Field label="Meal"><Inp value={mf.meal} onChange={e=>setMf({...mf,meal:e.target.value})} placeholder="e.g. Chicken + Rice"/></Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <Field label="Calories"><Inp type="number" value={mf.calories} onChange={e=>setMf({...mf,calories:e.target.value})} placeholder="kcal"/></Field>
            <Field label="Protein (g)"><Inp type="number" value={mf.protein} onChange={e=>setMf({...mf,protein:e.target.value})} placeholder="g"/></Field>
          </div>
          <Field label="Date"><Inp type="date" value={mf.date} onChange={e=>setMf({...mf,date:e.target.value})}/></Field>
          <Btn onClick={logM} style={{ width:'100%', justifyContent:'center' }}>Log Meal</Btn>
          {todayMeals.length>0 && <div style={{ marginTop:12 }}>
            {todayMeals.map(m=><div key={m.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'5px 0', borderBottom:'1px solid var(--border)' }}><span>{m.meal}</span><span style={{ color:'var(--text-muted)' }}>{m.calories}kcal</span></div>)}
          </div>}
        </div>
      </div>
    </div>
  )
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsPage({ data }) {
  const currency=data.settings.currency||'AED'
  const months=Array.from({length:6},(_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);return d.toISOString().slice(0,7)})
  const md=months.map(m=>({label:new Date(m+'-01').toLocaleDateString('en-GB',{month:'short'}),income:data.transactions.filter(t=>t.type==='income'&&t.date?.startsWith(m)).reduce((s,t)=>s+Number(t.amount),0)}))
  const maxI=Math.max(...md.map(m=>m.income),1)
  const svb={};data.bookings.forEach(b=>{if(b.service)svb[b.service]=(svb[b.service]||0)+1})
  const top=Object.entries(svb).sort((a,b)=>b[1]-a[1]).slice(0,5)
  const totRev=data.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0)
  const comp=data.bookings.filter(b=>b.status==='completed').length
  const avg=comp>0?Math.round(totRev/comp):0
  return (
    <div>
      <h2 style={{ margin:'0 0 20px', fontSize:20, fontWeight:800 }}>Analytics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10, marginBottom:24 }}>
        <StatCard label="Total Revenue" value={`${currency} ${totRev.toLocaleString()}`} icon="dollar" color="#10b981"/>
        <StatCard label="All Bookings" value={data.bookings.length} icon="calendar"/>
        <StatCard label="Avg per Booking" value={`${currency} ${avg}`} icon="chart" color="#8b5cf6"/>
        <StatCard label="No Shows" value={data.bookings.filter(b=>b.status==='noshow').length} icon="x" color="#ef4444"/>
      </div>
      <div style={{ background:'var(--card)', borderRadius:12, padding:20, marginBottom:16 }}>
        <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>Revenue — Last 6 Months</h3>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
          {md.map((m,i)=><div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>{m.income>0?m.income:''}</div>
            <div style={{ width:'100%', background:'var(--accent)', borderRadius:'4px 4px 0 0', height:`${Math.max((m.income/maxI)*80,m.income>0?8:2)}px` }}/>
            <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>{m.label}</div>
          </div>)}
        </div>
      </div>
      <div style={{ background:'var(--card)', borderRadius:12, padding:20 }}>
        <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>Top Services</h3>
        {top.length===0 && <p style={{ color:'var(--text-muted)', fontSize:14 }}>No data yet.</p>}
        {top.map(([svc,cnt],i)=><div key={svc} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <div style={{ width:24,height:24,borderRadius:6,background:'var(--accent)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,flexShrink:0 }}>{i+1}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14 }}>{svc}</div>
            <div style={{ height:4, background:'var(--bg)', borderRadius:2, marginTop:4 }}>
              <div style={{ height:'100%', background:'var(--accent)', borderRadius:2, width:`${(cnt/top[0][1])*100}%` }}/>
            </div>
          </div>
          <span style={{ fontWeight:700, fontSize:14, color:'var(--text-muted)' }}>{cnt}</span>
        </div>)}
      </div>
    </div>
  )
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsPage({ data, onSave, themeName, applyTheme }) {
  const [s, setS]=useState(data.settings)
  const [ns, setNs]=useState('')
  const addSvc=()=>{if(!ns.trim())return;setS({...s,services:[...(s.services||[]),{name:ns}]});setNs('')}
  const rmSvc=(i)=>setS({...s,services:s.services.filter((_,idx)=>idx!==i)})
  const save=()=>{onSave(s);alert('Saved!')}
  return (
    <div>
      <h2 style={{ margin:'0 0 20px', fontSize:20, fontWeight:800 }}>Settings</h2>
      <div style={{ background:'var(--card)', borderRadius:12, padding:20, marginBottom:16 }}>
        <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>Business</h3>
        <Field label="Business Name"><Inp value={s.name} onChange={e=>setS({...s,name:e.target.value})}/></Field>
        <Field label="Type"><Sel value={s.type} onChange={e=>setS({...s,type:e.target.value})}><option value="mobile">Mobile Barber</option><option value="salon">Single Location</option><option value="both">Both</option></Sel></Field>
        <Field label="Currency"><Sel value={s.currency} onChange={e=>setS({...s,currency:e.target.value})}><option value="AED">AED</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="EUR">EUR</option><option value="INR">INR</option></Sel></Field>
      </div>
      <div style={{ background:'var(--card)', borderRadius:12, padding:20, marginBottom:16 }}>
        <h3 style={{ margin:'0 0 14px', fontSize:15, fontWeight:700 }}>Services Menu</h3>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <Inp value={ns} onChange={e=>setNs(e.target.value)} placeholder="e.g. Skin Fade" onKeyDown={e=>e.key==='Enter'&&addSvc()} style={{ flex:1 }}/>
          <Btn onClick={addSvc}><Icon name="plus" size={14}/></Btn>
        </div>
        {(s.services||[]).map((sv,i)=><div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontSize:14 }}>{sv.name}</span>
          <Btn variant="ghost" onClick={()=>rmSvc(i)} style={{ padding:4, color:'#ef4444' }}><Icon name="trash" size={13}/></Btn>
        </div>)}
      </div>
      <div style={{ background:'var(--card)', borderRadius:12, padding:20, marginBottom:16 }}>
        <h3 style={{ margin:'0 0 10px', fontSize:15, fontWeight:700 }}>Booking Link</h3>
        <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'var(--accent)', fontFamily:'monospace', wordBreak:'break-all' }}>
          {window.location.origin}/book
        </div>
      </div>
      <div style={{ background:'var(--card)', borderRadius:12, padding:20, marginBottom:16 }}>
        <h3 style={{ margin:'0 0 16px', fontSize:15, fontWeight:700 }}>Theme</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
          {Object.entries(THEMES).map(([name,t])=>{
            const active = themeName===name
            return (
              <button key={name} onClick={()=>applyTheme(name)}
                style={{ borderRadius:12, border:`2px solid ${active?t.accent:'transparent'}`, overflow:'hidden', cursor:'pointer', padding:0, background:'none', textAlign:'left', boxShadow:active?`0 0 0 2px ${t.accent}`:'none' }}>
                <div style={{ background:t.bg, padding:'12px 12px 8px' }}>
                  <div style={{ display:'flex', gap:5, marginBottom:8 }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:t.card, border:`1px solid ${t.border}` }}/>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
                      <div style={{ height:6, borderRadius:3, background:t.accent, width:'70%' }}/>
                      <div style={{ height:4, borderRadius:2, background:t.muted, opacity:0.4, width:'50%' }}/>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    <div style={{ height:20, borderRadius:4, background:t.accent, flex:1 }}/>
                    <div style={{ height:20, borderRadius:4, background:t.card, border:`1px solid ${t.border}`, flex:2 }}/>
                  </div>
                </div>
                <div style={{ background:t.card, padding:'6px 12px', borderTop:`1px solid ${t.border}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:t.text }}>{name}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <Btn onClick={save} style={{ width:'100%', justifyContent:'center' }}>Save Settings</Btn>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = window.innerWidth < 768
  const [tab, setTab] = useState('calendar')
  const [themeName, setThemeName] = useState(()=>localStorage.getItem('barber_theme')||DEFAULT_THEME)
  const theme = THEMES[themeName]||THEMES[DEFAULT_THEME]
  const applyTheme=(name)=>{ setThemeName(name); localStorage.setItem('barber_theme',name) }
  const [data, setData] = useState({
    bookings:[], clients:[], transactions:[], tasks:[], weightLogs:[], mealLogs:[],
    settings:{ name:'Swakk Mobile Barbering', type:'mobile', currency:'AED', services:[] }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoading(true)
    const [bookings,clients,transactions,tasks,weightLogs,mealLogs] = await Promise.all([
      supabase.from('bookings').select('*').order('date',{ascending:true}),
      supabase.from('clients').select('*').order('name',{ascending:true}),
      supabase.from('transactions').select('*').order('date',{ascending:false}),
      supabase.from('tasks').select('*').order('created_at',{ascending:false}),
      supabase.from('weight_logs').select('*').order('date',{ascending:false}),
      supabase.from('meal_logs').select('*').order('date',{ascending:false}),
    ])
    const storedSettings = JSON.parse(localStorage.getItem('barber_settings')||'null')
    const nb=(b)=>({id:b.id,clientName:b.client_name,service:b.service,date:b.date,time:b.time,price:b.price,status:b.status,notes:b.notes,location:b.location,bookingRef:b.booking_ref})
    const nc=(c)=>({id:c.id,name:c.name,phone:c.phone,email:c.email,notes:c.notes,preferredService:c.preferred_service,since:c.since})
    const nt=(t)=>({id:t.id,type:t.type,amount:t.amount,category:t.category,description:t.description,date:t.date,paymentMethod:t.payment_method})
    const ntask=(t)=>({id:t.id,title:t.title,priority:t.priority,dueDate:t.due_date,category:t.category,done:t.done})
    const nw=(w)=>({id:w.id,weight:w.weight,date:w.date,notes:w.notes})
    const nm=(m)=>({id:m.id,meal:m.meal,calories:m.calories,protein:m.protein,time:m.time,date:m.date})
    setData({
      bookings:bookings.data?.map(nb)||[], clients:clients.data?.map(nc)||[],
      transactions:transactions.data?.map(nt)||[], tasks:tasks.data?.map(ntask)||[],
      weightLogs:weightLogs.data?.map(nw)||[], mealLogs:mealLogs.data?.map(nm)||[],
      settings:storedSettings||{ name:'Swakk Mobile Barbering', type:'mobile', currency:'AED', services:[] }
    })
    setLoading(false)
  }

  const saveSettings = (settings) => {
    localStorage.setItem('barber_settings', JSON.stringify(settings))
    setData(d=>({...d,settings}))
  }

  const views = {
    calendar:  <CalendarPage  data={data} reload={loadAll}/>,
    clients:   <ClientsPage   data={data} reload={loadAll}/>,
    finance:   <FinancePage   data={data} reload={loadAll}/>,
    tasks:     <TasksPage     data={data} reload={loadAll}/>,
    health:    <HealthPage    data={data} reload={loadAll}/>,
    analytics: <AnalyticsPage data={data}/>,
    settings:  <SettingsPage  data={data} onSave={saveSettings} themeName={themeName} applyTheme={applyTheme}/>,
  }

  return (
    <>
      {/* dynamic theme */}<style>{`:root{--bg:${theme.bg};--card:${theme.card};--border:${theme.border};--text:${theme.text};--text-muted:${theme.muted};--accent:${theme.accent};--accent-light:${theme.accentLight};}*{box-sizing:border-box;}body{margin:0;font-family:'Bebas Neue',system-ui,sans-serif;background:var(--bg);color:var(--text);}input,select,button{font-family:inherit;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ display:'flex', flexDirection:isMobile?'column':'row', height:'100vh', overflow:'hidden' }}>
        {!isMobile && (
          <nav style={{ width:208, background:'var(--card)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'20px 10px', flexShrink:0 }}>
            <div style={{ padding:'0 8px 20px', borderBottom:'1px solid var(--border)', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Icon name="scissors" size={15}/></div>
                <div>
                  <div style={{ fontWeight:800, fontSize:13, lineHeight:1.2 }}>{data.settings.name}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', textTransform:'capitalize' }}>{data.settings.type}</div>
                </div>
              </div>
            </div>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setTab(n.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'none', background:tab===n.id?'var(--accent)':'transparent', color:tab===n.id?'var(--bg)':'var(--text-muted)', cursor:'pointer', fontSize:13, fontWeight:600, marginBottom:2, textAlign:'left', width:'100%' }}>
                <Icon name={n.icon} size={16}/>{n.label}
              </button>
            ))}
            <div style={{ marginTop:'auto', padding:'12px 8px 0', borderTop:'1px solid var(--border)' }}>
              <a href="/book" target="_blank" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:10, background:'var(--accent-light)', color:'var(--accent)', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                <Icon name="link" size={14}/> Booking Link
              </a>
            </div>
          </nav>
        )}
        {isMobile && (
          <div style={{ background:'var(--card)', borderBottom:'1px solid var(--border)', padding:'14px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Icon name="scissors" size={14}/></div>
            <div style={{ fontWeight:800, fontSize:15, flex:1 }}>{data.settings.name}</div>
            <a href="/book" target="_blank" style={{ fontSize:12, fontWeight:700, color:'var(--accent)', textDecoration:'none', background:'var(--accent-light)', padding:'6px 12px', borderRadius:20 }}>Book Link</a>
          </div>
        )}
        <main style={{ flex:1, overflow:'auto', padding:isMobile?'16px 16px 90px':'28px' }}>
          {loading ? <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--text-muted)', fontSize:14 }}>Loading...</div> : views[tab]}
        </main>
        {isMobile && (
          <nav style={{ position:'fixed', bottom:0, left:0, right:0, background:'var(--card)', borderTop:'1px solid var(--border)', display:'flex', padding:'8px 0 20px', zIndex:100 }}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'6px 2px', border:'none', background:'transparent', color:tab===n.id?'var(--accent)':'var(--text-muted)', cursor:'pointer', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                <Icon name={n.icon} size={20}/>{n.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  )
}
