import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  // ── LIFESTYLE / PREMIUM ──
  'Cream & Brown':     { emoji:'🪵', bg:'#f5f0e8', bg2:'#ede7d9', border:'#d4c8b0', text:'#2c1a0e', muted:'#8c7355', accent:'#5c3317', accentLight:'rgba(92,51,23,0.1)', grad:'linear-gradient(135deg,#5c3317,#8c5a30)', green:'#4a7c3f', red:'#c0392b' },
  'Grey & Navy':       { emoji:'🌊', bg:'#f0f2f5', bg2:'#e4e8ef', border:'#c8d0dc', text:'#1a2340', muted:'#6070a0', accent:'#1a3a6b', accentLight:'rgba(26,58,107,0.1)', grad:'linear-gradient(135deg,#1a3a6b,#2e5fa3)', green:'#1a7a4a', red:'#c0392b' },
  'White & Black':     { emoji:'⬛', bg:'#ffffff', bg2:'#f5f5f5', border:'#e0e0e0', text:'#111111', muted:'#777777', accent:'#111111', accentLight:'rgba(0,0,0,0.06)', grad:'linear-gradient(135deg,#111,#444)', green:'#1a7a4a', red:'#c0392b' },
  'Off-white & Green': { emoji:'🌿', bg:'#f2f5f0', bg2:'#e6ede2', border:'#c4d4bc', text:'#1a2e18', muted:'#5a7a52', accent:'#2d6b28', accentLight:'rgba(45,107,40,0.1)', grad:'linear-gradient(135deg,#2d6b28,#4a9e43)', green:'#2d6b28', red:'#c0392b' },
  'Warm Grey & Brass': { emoji:'🥂', bg:'#f0ede8', bg2:'#e8e4dc', border:'#d0c8ba', text:'#2a2218', muted:'#8a7a62', accent:'#a07030', accentLight:'rgba(160,112,48,0.1)', grad:'linear-gradient(135deg,#a07030,#c89040)', green:'#4a7a3a', red:'#c0392b' },
  'Stone & Charcoal':  { emoji:'🪨', bg:'#edeae4', bg2:'#e4e0d8', border:'#c8c2b8', text:'#1e1c18', muted:'#7a7268', accent:'#2c2820', accentLight:'rgba(44,40,32,0.08)', grad:'linear-gradient(135deg,#2c2820,#4a4438)', green:'#3a6a30', red:'#b03020' },
  'Blush & Slate':     { emoji:'🌸', bg:'#f8f0f0', bg2:'#f0e4e4', border:'#dcc8c8', text:'#2a2030', muted:'#8a6878', accent:'#4a3858', accentLight:'rgba(74,56,88,0.1)', grad:'linear-gradient(135deg,#4a3858,#7a5888)', green:'#3a6a50', red:'#c04060' },
  'Linen & Terracotta':{ emoji:'🏺', bg:'#f5f0e8', bg2:'#ede6d8', border:'#d8cdb8', text:'#2a1e14', muted:'#8a6e52', accent:'#b84a28', accentLight:'rgba(184,74,40,0.1)', grad:'linear-gradient(135deg,#b84a28,#d4703e)', green:'#4a7a3a', red:'#b84a28' },

  // ── STREET / YOUTH ──
  'Dark Mode':         { emoji:'🌑', bg:'#0d0d0d', bg2:'#1a1a1a', border:'#2a2a2a', text:'#f0f0f0', muted:'#707070', accent:'#ffffff', accentLight:'rgba(255,255,255,0.07)', grad:'linear-gradient(135deg,#333,#555)', green:'#22c55e', red:'#ef4444' },
  'Neon Cyber':        { emoji:'⚡', bg:'#050510', bg2:'#0a0a20', border:'#1a1a40', text:'#e0e0ff', muted:'#6060a0', accent:'#00ffaa', accentLight:'rgba(0,255,170,0.1)', grad:'linear-gradient(135deg,#00ffaa,#00aaff)', green:'#00ffaa', red:'#ff4444' },
  'Midnight Purple':   { emoji:'🔮', bg:'#0e0818', bg2:'#160d24', border:'#281840', text:'#e8d8ff', muted:'#806898', accent:'#a855f7', accentLight:'rgba(168,85,247,0.12)', grad:'linear-gradient(135deg,#a855f7,#7c3aed)', green:'#22c55e', red:'#ef4444' },
  'Sunset Orange':     { emoji:'🌅', bg:'#1a0a00', bg2:'#240e00', border:'#3d1a00', text:'#ffe8d0', muted:'#a06040', accent:'#ff6b1a', accentLight:'rgba(255,107,26,0.12)', grad:'linear-gradient(135deg,#ff6b1a,#ff3d00)', green:'#22c55e', red:'#ff4444' },
  'Arctic Blue':       { emoji:'❄️', bg:'#f0f8ff', bg2:'#e0f0ff', border:'#b0d8f0', text:'#0a2040', muted:'#4a80b0', accent:'#0066cc', accentLight:'rgba(0,102,204,0.1)', grad:'linear-gradient(135deg,#0066cc,#0099ff)', green:'#0a8a4a', red:'#cc2200' },
  'Stealth Black':     { emoji:'🥷', bg:'#080808', bg2:'#101010', border:'#1c1c1c', text:'#cccccc', muted:'#505050', accent:'#cc0000', accentLight:'rgba(204,0,0,0.1)', grad:'linear-gradient(135deg,#cc0000,#880000)', green:'#22c55e', red:'#cc0000' },
  'Carbon':            { emoji:'🔩', bg:'#141414', bg2:'#1e1e1e', border:'#2c2c2c', text:'#e8e8e8', muted:'#686868', accent:'#e8e8e8', accentLight:'rgba(232,232,232,0.07)', grad:'linear-gradient(135deg,#555,#333)', green:'#22c55e', red:'#ef4444' },
  'Pastel':            { emoji:'🍬', bg:'#fef6fb', bg2:'#fce8f5', border:'#f0c8e8', text:'#3a1a38', muted:'#a06898', accent:'#e060c0', accentLight:'rgba(224,96,192,0.1)', grad:'linear-gradient(135deg,#e060c0,#a030a0)', green:'#2a9a60', red:'#e04060' },

  // ── SPORTS ──
  'Football':          { emoji:'⚽', bg:'#f0fff4', bg2:'#e0f8e8', border:'#a8e0b8', text:'#0a2010', muted:'#3a7050', accent:'#15803d', accentLight:'rgba(21,128,61,0.1)', grad:'linear-gradient(135deg,#15803d,#166534)', green:'#15803d', red:'#dc2626' },
  'Touch Rugby':       { emoji:'🏉', bg:'#fffbf0', bg2:'#fff3d0', border:'#e8d890', text:'#201000', muted:'#806020', accent:'#b45309', accentLight:'rgba(180,83,9,0.1)', grad:'linear-gradient(135deg,#b45309,#78350f)', green:'#15803d', red:'#dc2626' },
  'Basketball':        { emoji:'🏀', bg:'#fff8f0', bg2:'#ffe8d0', border:'#f0c8a0', text:'#200800', muted:'#904020', accent:'#ea580c', accentLight:'rgba(234,88,12,0.1)', grad:'linear-gradient(135deg,#ea580c,#c2410c)', green:'#15803d', red:'#dc2626' },
  'Golf':              { emoji:'⛳', bg:'#f5fbf0', bg2:'#e4f4d8', border:'#b8d8a0', text:'#102008', muted:'#507040', accent:'#4d7c0f', accentLight:'rgba(77,124,15,0.1)', grad:'linear-gradient(135deg,#4d7c0f,#3f6212)', green:'#4d7c0f', red:'#dc2626' },
  'Swimming':          { emoji:'🏊', bg:'#f0fbff', bg2:'#d8f0fc', border:'#90d0f0', text:'#001828', muted:'#307898', accent:'#0284c7', accentLight:'rgba(2,132,199,0.1)', grad:'linear-gradient(135deg,#0284c7,#075985)', green:'#15803d', red:'#dc2626' },
  'Boxing':            { emoji:'🥊', bg:'#0a0000', bg2:'#140000', border:'#280000', text:'#ffd0d0', muted:'#a04040', accent:'#dc2626', accentLight:'rgba(220,38,38,0.12)', grad:'linear-gradient(135deg,#dc2626,#991b1b)', green:'#22c55e', red:'#dc2626' },
  'Tennis':            { emoji:'🎾', bg:'#fdf8f0', bg2:'#f8ecd8', border:'#e8d098', text:'#201000', muted:'#806030', accent:'#b45309', accentLight:'rgba(180,83,9,0.1)', grad:'linear-gradient(135deg,#b45309,#92400e)', green:'#15803d', red:'#dc2626' },
  'Formula 1':         { emoji:'🏎️', bg:'#080808', bg2:'#100000', border:'#280000', text:'#f0e8e8', muted:'#806060', accent:'#e10600', accentLight:'rgba(225,6,0,0.12)', grad:'linear-gradient(135deg,#e10600,#9b0400)', green:'#22c55e', red:'#e10600' },
}

const THEME_GROUPS = [
  { label:'Lifestyle', keys:['Cream & Brown','Grey & Navy','White & Black','Off-white & Green','Warm Grey & Brass','Stone & Charcoal','Blush & Slate','Linen & Terracotta'] },
  { label:'Street', keys:['Dark Mode','Neon Cyber','Midnight Purple','Sunset Orange','Arctic Blue','Stealth Black','Carbon','Pastel'] },
  { label:'Sports', keys:['Football','Touch Rugby','Basketball','Golf','Swimming','Boxing','Tennis','Formula 1'] },
]

const DEFAULT_THEME = 'Stone & Charcoal'
const THEME_KEY = 'swakk_booking_theme'

// ─── COLOUR SYSTEM (CSS vars, applied globally) ────────────────────────────────
// All components use C which is set from theme at runtime inside BookingPage

const TIME_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00'
]

const SERVICES = [
  { id:'haircut',    label:'Haircut',      price:180, duration:'1 hr',  desc:'Clean cut tailored to your style' },
  { id:'hair_beard', label:'Hair & Beard', price:200, duration:'1 hr',  desc:'Full cut with beard trim and shape' },
  { id:'group',      label:'Group Haircuts', price:150, duration:'Varies', desc:'AED 150 each · 2 or more people' },
]


const COUNTRY_CODES = [
  { code:'+971', flag:'🇦🇪', name:'UAE' },
  { code:'+44',  flag:'🇬🇧', name:'UK' },
  { code:'+1',   flag:'🇺🇸', name:'US/CA' },
  { code:'+61',  flag:'🇦🇺', name:'Australia' },
  { code:'+64',  flag:'🇳🇿', name:'New Zealand' },
  { code:'+91',  flag:'🇮🇳', name:'India' },
  { code:'+92',  flag:'🇵🇰', name:'Pakistan' },
  { code:'+20',  flag:'🇪🇬', name:'Egypt' },
  { code:'+966', flag:'🇸🇦', name:'Saudi Arabia' },
  { code:'+974', flag:'🇶🇦', name:'Qatar' },
  { code:'+965', flag:'🇰🇼', name:'Kuwait' },
  { code:'+973', flag:'🇧🇭', name:'Bahrain' },
  { code:'+968', flag:'🇴🇲', name:'Oman' },
  { code:'+33',  flag:'🇫🇷', name:'France' },
  { code:'+49',  flag:'🇩🇪', name:'Germany' },
  { code:'+34',  flag:'🇪🇸', name:'Spain' },
]
const REVIEWS = [
  { name:'Howie Baker',  rating:5, text:'What a top guy, great chat, with the flyest cuts. Nothing more to ask for. 🔥', time:'Last month' },
  { name:'James M',      rating:5, text:'Such great service and such a great guy. More than happy to recommend. My son is the happiest he has ever been with a haircut.', time:'2 months ago' },
  { name:'Tom R',        rating:5, text:'Came to my place, great cut, great vibes. Will definitely be booking again.', time:'2 months ago' },
]

const Stars = ({ n=5 }) => (
  <div style={{ display:'flex', gap:2 }}>{[1,2,3,4,5].map(i=><span key={i} style={{ fontSize:14, color:i<=n?'#f59e0b':'#ccc' }}>★</span>)}</div>
)

// ─── THEME-AWARE COMPONENTS (accept C as prop) ────────────────────────────────
const Inp = ({ C, ...props }) => (
  <input {...props} style={{ width:'100%', background:C.bg2, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'14px 16px', fontSize:15, color:C.text, outline:'none', boxSizing:'border-box', ...props.style }}/>
)
const Field = ({ C, label, children, hint }) => (
  <div style={{ marginBottom:20 }}>
    <label style={{ display:'block', fontSize:11, fontWeight:700, color:C.muted, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.07em' }}>{label}</label>
    {children}
    {hint && <div style={{ fontSize:12, color:C.muted, marginTop:5 }}>{hint}</div>}
  </div>
)
const Check = ({ C, checked, onChange, label, sub }) => (
  <button onClick={onChange} style={{ display:'flex', alignItems:'flex-start', gap:12, background:'none', border:'none', cursor:'pointer', padding:0, width:'100%', textAlign:'left', marginBottom:16 }}>
    <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${checked?C.accent:C.border}`, background:checked?C.accent:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, transition:'all 0.15s' }}>
      {checked && <span style={{ color:'#fff', fontSize:12, fontWeight:800 }}>✓</span>}
    </div>
    <div>
      <span style={{ fontSize:14, color:C.text, lineHeight:1.5 }}>{label}</span>
      {sub && <span style={{ display:'block', fontSize:12, color:C.muted, marginTop:2 }}>{sub}</span>}
    </div>
  </button>
)
const GradBtn = ({ C, children, onClick, disabled, style={} }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ width:'100%', background:disabled?'#ccc':C.grad, color:'#fff', border:'none', borderRadius:14, padding:'17px', fontSize:16, fontWeight:800, cursor:disabled?'not-allowed':'pointer', transition:'opacity 0.15s', boxShadow:disabled?'none':`0 4px 20px ${C.accentLight}`, ...style }}>
    {children}
  </button>
)
const OutlineBtn = ({ C, children, onClick }) => (
  <button onClick={onClick}
    style={{ width:'100%', background:'transparent', border:`1.5px solid ${C.border}`, color:C.muted, borderRadius:12, padding:'12px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
    {children}
  </button>
)
const Row = ({ C, label, value, highlight }) => (
  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
    <span style={{ color:C.muted }}>{label}</span>
    <span style={{ fontWeight:700, color:highlight?C.green:C.text, textTransform:'capitalize' }}>{value}</span>
  </div>
)
const Card = ({ C, children, style={} }) => (
  <div style={{ background:C.bg, borderRadius:16, padding:22, marginBottom:14, border:`1px solid ${C.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', ...style }}>
    {children}
  </div>
)
const SectionLabel = ({ C, children }) => (
  <div style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>{children}</div>
)

// ─── SERVICE + TIME PICKER ────────────────────────────────────────────────────
const ServicePicker = ({ C, service, onService, date, onDate, time, onTime, bookedSlots, groupMembers, onMemberUpdate }) => {
  const today = new Date().toISOString().slice(0,10)
  const isGroup = service==='group'
  const groupCount = isGroup ? 1 : 0
  return (
    <>
      <Card C={C}>
        <SectionLabel C={C}>Select Service</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {SERVICES.map(s=>(
            <button key={s.id} onClick={()=>onService(s.id)}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px', borderRadius:12, border:`1.5px solid ${service===s.id?C.accent:C.border}`, background:service===s.id?C.accentLight:C.bg, cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${service===s.id?C.accent:C.border}`, background:service===s.id?C.accent:'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {service===s.id && <div style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }}/>}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{s.label}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{s.duration} · {s.desc}</div>
                </div>
              </div>
              <div style={{ fontWeight:800, fontSize:15, color:service===s.id?C.accent:C.text, flexShrink:0, marginLeft:12 }}>AED {s.price}</div>
            </button>
          ))}
        </div>
        {isGroup && groupCount > 0 && (
          <div style={{ marginTop:18 }}>
            <SectionLabel C={C}>Who else is getting a cut?</SectionLabel>
            {Array.from({ length:groupCount }, (_,i) => (
              <div key={i} style={{ marginBottom:10 }}>
                <Inp C={C} value={groupMembers[i]?.name||''} onChange={e=>onMemberUpdate(i,'name',e.target.value)} placeholder={`Person ${i+2} name`}/>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card C={C}>
        <SectionLabel C={C}>Date & Time</SectionLabel>
        <Field C={C} label="Date">
          <Inp C={C} type="date" value={date} min={today} onChange={e=>{ onDate(e.target.value); onTime('') }}/>
        </Field>
        {date && (
          <Field C={C} label="Available Times">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {TIME_SLOTS.map(t=>{
                const booked=bookedSlots.includes(t); const sel=time===t
                return (
                  <button key={t} disabled={booked} onClick={()=>onTime(t)}
                    style={{ padding:'12px 4px', borderRadius:10, border:`1.5px solid ${sel?C.accent:C.border}`, background:sel?C.accent:booked?C.bg2:C.bg, color:sel?'#fff':booked?C.muted:C.text, fontSize:12, fontWeight:600, cursor:booked?'not-allowed':'pointer', opacity:booked?0.4:1, transition:'all 0.15s' }}>
                    {t}
                  </button>
                )
              })}
            </div>
          </Field>
        )}
      </Card>
    </>
  )
}

// ─── THEME PICKER MODAL ───────────────────────────────────────────────────────
const ThemePicker = ({ C, current, onSelect, onClose }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{ background:C.bg, borderRadius:'20px 20px 0 0', width:'100%', maxWidth:520, maxHeight:'85vh', overflow:'auto', padding:'20px 16px 40px' }}>
      <div style={{ width:36, height:4, borderRadius:2, background:C.border, margin:'0 auto 20px' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.text }}>Choose Your Theme</div>
        <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:C.muted }}>×</button>
      </div>
      {THEME_GROUPS.map(group=>(
        <div key={group.label} style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>{group.label}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {group.keys.map(name=>{
              const t = THEMES[name]
              const active = current===name
              return (
                <button key={name} onClick={()=>{ onSelect(name); onClose() }}
                  style={{ borderRadius:12, border:`2px solid ${active?t.accent:'transparent'}`, overflow:'hidden', cursor:'pointer', padding:0, background:'none', outline:'none' }}>
                  <div style={{ background:t.bg, padding:'10px 8px 6px', display:'flex', flexDirection:'column', gap:5 }}>
                    <div style={{ fontSize:20, textAlign:'center' }}>{t.emoji}</div>
                    <div style={{ height:8, borderRadius:4, background:t.grad }}/>
                    <div style={{ display:'flex', gap:3 }}>
                      <div style={{ height:5, borderRadius:2, background:t.bg2, flex:1, border:`1px solid ${t.border}` }}/>
                      <div style={{ height:5, borderRadius:2, background:t.accent, flex:1 }}/>
                    </div>
                  </div>
                  <div style={{ background:t.bg2, padding:'4px 6px', borderTop:`1px solid ${t.border}` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:t.text, textAlign:'center', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// ─── MAIN BOOKING PAGE ────────────────────────────────────────────────────────
export default function BookingPage() {
  const [themeName, setThemeName] = useState(()=>localStorage.getItem(THEME_KEY)||DEFAULT_THEME)
  const [themeOpen, setThemeOpen] = useState(false)
  const C = THEMES[themeName]||THEMES[DEFAULT_THEME]

  const applyTheme = (name) => { setThemeName(name); localStorage.setItem(THEME_KEY, name) }

  const [screen, setScreen] = useState('landing')
  const [showFirstTime, setShowFirstTime] = useState(true)
  const [bookedSlots, setBookedSlots] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [looking, setLooking] = useState(false)
  const [confirmed, setConfirmed] = useState(null)
  const [existingClient, setExistingClient] = useState(null)
  const [refInput, setRefInput] = useState('')
  const [managed, setManaged] = useState(null)
  const [manageError, setManageError] = useState('')
  const [cancelDone, setCancelDone] = useState(false)
  const [lookupValue, setLookupValue] = useState('')
  const [lookupMode, setLookupMode] = useState('phone')
  const [countryCode, setCountryCode] = useState('+971')
  const [phoneNum, setPhoneNum] = useState('')
  const [showCodes, setShowCodes] = useState(false)

  const blankNew = (phone='') => ({ firstName:'', lastName:'', address:'', phone:phone, sameWhatsapp:true, whatsapp:'', email:'', service:'', date:'', time:'', notes:'', mediaConsent:false, groupMembers:[] })
  const blankRet = () => ({ service:'', date:'', time:'', notes:'', groupMembers:[] })
  const [newForm, setNewForm] = useState(blankNew())
  const [retForm, setRetForm] = useState(blankRet())

  const nf = (u) => setNewForm(p=>({...p,...u}))
  const rf = (u) => setRetForm(p=>({...p,...u}))

  const updateMember = (isNew, idx, field, val) => {
    const setter = isNew ? nf : rf
    const form = isNew ? newForm : retForm
    const members = [...(form.groupMembers||[])]
    members[idx] = {...(members[idx]||{}), [field]:val}
    setter({ groupMembers: members })
  }

  const reset = () => { setScreen('lookup'); setExistingClient(null); setNewForm(blankNew()); setRetForm(blankRet()); setLookupValue('') }

  useEffect(()=>{
    const d = (retForm.date||newForm.date)
    if(!d) return
    supabase.from('bookings').select('time').eq('date',d).neq('status','cancelled').then(({data})=>{
      setBookedSlots((data||[]).map(b=>b.time))
    })
  },[retForm.date, newForm.date])

  const handleLookup = async (overrideVal) => {
    const v = (overrideVal || lookupValue).trim()
    if(!v) return
    setLooking(true)
    const isEmail = v.includes('@')
    const { data } = isEmail
      ? await supabase.from('clients').select('*').ilike('email', v).limit(1)
      : await supabase.from('clients').select('*').ilike('phone', `%${v.replace(/\s/g,'')}%`).limit(1)
    if(data?.length) { setExistingClient(data[0]); setScreen('returning') }
    else { setNewForm(blankNew(v)); setScreen('new_client') }
    setLooking(false)
  }

  const buildNotes = (notes, members) => {
    const parts = []
    if(notes) parts.push(notes)
    if(members?.length) parts.push('Group: '+members.filter(m=>m?.name).map(m=>m.name).join(', '))
    return parts.join(' | ')
  }

  const submitNew = async () => {
    const f = newForm
    if(!f.firstName||!f.lastName||!f.service||!f.date||!f.time||!f.email) return
    setSubmitting(true)
    const ref = Math.random().toString(36).substring(2,8).toUpperCase()
    const svc = SERVICES.find(s=>s.id===f.service)
    const phone = f.phone
    const ex = await supabase.from('clients').select('id').ilike('phone',`%${phone.replace(/\s/g,'')}%`).limit(1)
    if(!ex.data?.length) await supabase.from('clients').insert({name:f.name,phone:f.phone,email:f.email||null,preferred_service:svc?.label,notes:f.mediaConsent?'Media consent: yes':'Media consent: no',since:new Date().toISOString().slice(0,10)})
    const {error}=await supabase.from('bookings').insert({client_name:f.name,service:svc?.label,date:f.date,time:f.time,notes:buildNotes(f.notes,f.groupMembers),status:'confirmed',booking_ref:ref,location:f.address,price:String(svc?.price||'')})
    if(!error){
      setConfirmed({name:fullName,service:svc?.label,price:svc?.price,date:f.date,time:f.time,bookingRef:ref,isNew:true})
      setScreen('confirm')
      try {
        await fetch('https://nnidxufnykutfpszfjja.supabase.co/functions/v1/notify-booking', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({ type:'new_booking', booking:{ clientName:fullName, service:svc?.label, date:f.date, time:f.time, price:svc?.price, location:f.address, bookingRef:ref, clientPhone:f.phone } })
        })
      } catch(e) { console.log('notify failed', e) }
    }
    setSubmitting(false)
  }

  const submitReturning = async () => {
    const f = retForm; const c = existingClient
    if(!f.service||!f.date||!f.time) return
    setSubmitting(true)
    const ref = Math.random().toString(36).substring(2,8).toUpperCase()
    const svc = SERVICES.find(s=>s.id===f.service)
    const {error}=await supabase.from('bookings').insert({client_name:c.name,service:svc?.label,date:f.date,time:f.time,notes:buildNotes(f.notes,f.groupMembers),status:'confirmed',booking_ref:ref,location:'',price:String(svc?.price||'')})
    if(!error){
      setConfirmed({name:c.name,service:svc?.label,price:svc?.price,date:f.date,time:f.time,bookingRef:ref,isNew:false})
      setScreen('confirm')
      try {
        await fetch('https://nnidxufnykutfpszfjja.supabase.co/functions/v1/notify-booking', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({ type:'new_booking', booking:{ clientName:c.name, service:svc?.label, date:f.date, time:f.time, price:svc?.price, location:'', bookingRef:ref, clientPhone:c.phone||null } })
        })
      } catch(e) { console.log('notify failed', e) }
    }
    setSubmitting(false)
  }

  const handleManage = async () => {
    if(!refInput.trim()) return
    setManageError('')
    const {data}=await supabase.from('bookings').select('*').eq('booking_ref',refInput.trim().toUpperCase()).limit(1)
    if(data?.length) setManaged(data[0])
    else setManageError('Booking not found. Check the reference code.')
  }

  const cancelBooking = async () => {
    if(!managed) return
    await supabase.from('bookings').update({status:'cancelled'}).eq('id',managed.id)
    setCancelDone(true)
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Inter',system-ui,sans-serif", transition:'background 0.3s' }}>
      <style>{`*{box-sizing:border-box;}body{margin:0;}input,select,button,textarea{font-family:'Inter',system-ui,sans-serif;}`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bebas+Neue&display=swap" rel="stylesheet"/>

      {themeOpen && <ThemePicker C={C} current={themeName} onSelect={applyTheme} onClose={()=>setThemeOpen(false)}/>}

      {/* ── LANDING ── */}
      {screen==='landing' && (
        <div>
          {/* Hero */}
          <div style={{ background:C.grad, padding:'48px 24px 40px', textAlign:'center', position:'relative' }}>
            <button onClick={()=>setThemeOpen(true)}
              style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.2)', border:'none', borderRadius:20, padding:'6px 12px', fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
              {C.emoji} Theme
            </button>
            <div style={{ fontSize:48, marginBottom:12 }}>✂️</div>
            <h1 style={{ margin:'0 0 8px', fontSize:32, fontWeight:900, color:'#fff', fontFamily:"'Bebas Neue',sans-serif", letterSpacing:'0.02em' }}>Swakk Mobile Barbering</h1>
            <p style={{ margin:0, color:'rgba(255,255,255,0.85)', fontSize:15 }}>Premium cuts at your location · Dubai</p>
            <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:16 }}>
              <Stars n={5}/>
              <span style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600 }}>5.0 · 47+ happy clients</span>
            </div>
          </div>

          <div style={{ maxWidth:480, margin:'0 auto', padding:'24px 20px 60px' }}>
            {/* Services */}
            <div style={{ background:C.bg2, borderRadius:14, padding:20, marginBottom:20, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14, color:C.text }}>Services</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {SERVICES.map(s=>(
                  <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderRadius:10, background:C.bg, border:`1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{s.label}</div>
                      <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{s.duration}</div>
                    </div>
                    <div style={{ fontWeight:800, fontSize:15, color:C.accent }}>{s.id==='group' ? 'AED 150 each' : `AED ${s.price}`}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div style={{ background:C.bg2, borderRadius:14, padding:20, marginBottom:20, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14, color:C.text }}>What clients say</h3>
              {REVIEWS.map((r,i)=>(
                <div key={i} style={{ marginBottom:14, paddingBottom:14, borderBottom:i<REVIEWS.length-1?`1px solid ${C.border}`:'none' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{r.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{r.time}</div>
                  </div>
                  <Stars n={r.rating}/>
                  <div style={{ fontSize:13, color:C.muted, marginTop:5, lineHeight:1.5 }}>{r.text}</div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div style={{ background:C.bg2, borderRadius:14, padding:20, marginBottom:32, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14, color:C.text }}>Contact</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <a href="tel:0568788736" style={{ display:'flex', alignItems:'center', gap:10, color:C.text, textDecoration:'none', fontSize:14, fontWeight:600 }}>📞 056 878 8736</a>
                <a href="mailto:swakk9@gmail.com" style={{ display:'flex', alignItems:'center', gap:10, color:C.text, textDecoration:'none', fontSize:14, fontWeight:600 }}>✉️ swakk9@gmail.com</a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Book Now — always visible on landing */}
      {screen==='landing' && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px 20px 32px', background:'linear-gradient(to top, '+C.bg+' 70%, transparent)', zIndex:100 }}>
          <GradBtn C={C} onClick={()=>setScreen('lookup')}>Book Now</GradBtn>
        </div>
      )}

      {/* ── BOOKING FLOW ── */}
      {screen!=='landing' && (
        <div style={{ maxWidth:480, margin:'0 auto', padding:'24px 20px 60px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            {(screen==='lookup'||screen==='find') && (
              <button onClick={()=>setScreen('landing')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:14, display:'flex', alignItems:'center', gap:6, padding:0 }}>← Back</button>
            )}
            {screen!=='lookup' && screen!=='find' && <div/>}
            <button onClick={()=>setThemeOpen(true)}
              style={{ background:C.accentLight, border:`1px solid ${C.border}`, borderRadius:20, padding:'5px 10px', fontSize:11, fontWeight:700, color:C.accent, cursor:'pointer' }}>
              {C.emoji} Theme
            </button>
          </div>

          {(screen==='lookup'||screen==='find') && (
            <div style={{ display:'flex', background:C.bg2, borderRadius:14, padding:4, marginBottom:24, gap:4, border:`1px solid ${C.border}` }}>
              <button onClick={()=>setScreen('lookup')} style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:screen==='lookup'?C.accent:'transparent', color:screen==='lookup'?'#fff':C.muted, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>New Booking</button>
              <button onClick={()=>setScreen('find')} style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:screen==='find'?C.accent:'transparent', color:screen==='find'?'#fff':C.muted, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>Manage Booking</button>
            </div>
          )}

          {/* LOOKUP */}
          {screen==='lookup' && (
            <Card C={C}>
                  <div style={{ textAlign:'center', marginBottom:24 }}>
                    <h2 style={{ fontSize:20, fontWeight:800, marginBottom:8, color:C.text }}>Let's get you booked</h2>
                    <p style={{ color:C.muted, fontSize:14, lineHeight:1.6 }}>Booked before? We'll pull up your details automatically.</p>
                  </div>

                  {/* Toggle */}
                  <div style={{ display:'flex', background:C.bg2, borderRadius:12, padding:4, marginBottom:20, border:`1px solid ${C.border}` }}>
                    {['phone','email'].map(m=>(
                      <button key={m} onClick={()=>{ setLookupMode(m); setLookupValue(''); setPhoneNum('') }}
                        style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:lookupMode===m?C.accent:'transparent', color:lookupMode===m?'#fff':C.muted, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                        {m==='phone'?'📱 Phone':'✉️ Email'}
                      </button>
                    ))}
                  </div>

                  {lookupMode==='phone' ? (
                    <div style={{ display:'flex', gap:8, marginBottom:20, position:'relative' }}>
                      {/* Country code picker */}
                      <button onClick={()=>setShowCodes(!showCodes)}
                        style={{ background:C.bg2, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'14px 12px', fontSize:14, fontWeight:700, color:C.text, cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:4 }}>
                        {COUNTRY_CODES.find(c=>c.code===countryCode)?.flag} {countryCode} ▾
                      </button>
                      {showCodes && (
                        <div style={{ position:'absolute', top:'100%', left:0, background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, zIndex:50, marginTop:4, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', maxHeight:220, overflow:'auto', minWidth:180 }}>
                          {COUNTRY_CODES.map(c=>(
                            <button key={c.code} onClick={()=>{ setCountryCode(c.code); setShowCodes(false) }}
                              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 14px', background:'none', border:'none', cursor:'pointer', fontSize:13, color:C.text, textAlign:'left' }}
                              onMouseEnter={e=>e.currentTarget.style.background=C.bg2}
                              onMouseLeave={e=>e.currentTarget.style.background='none'}>
                              <span>{c.flag}</span>
                              <span style={{ fontWeight:600 }}>{c.code}</span>
                              <span style={{ color:C.muted }}>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <Inp C={C} value={phoneNum} onChange={e=>{ setPhoneNum(e.target.value); setLookupValue(countryCode+e.target.value) }} onKeyDown={e=>e.key==='Enter'&&handleLookup()} placeholder="56 878 8736" type="tel" style={{ flex:1 }}/>
                    </div>
                  ) : (
                    <div style={{ marginBottom:20 }}>
                      <Inp C={C} value={lookupValue} onChange={e=>setLookupValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLookup()} placeholder="you@example.com" type="email"/>
                    </div>
                  )}

                  <GradBtn C={C} onClick={()=>{ const v = lookupMode==='phone' ? countryCode+phoneNum : lookupValue; setLookupValue(v); handleLookup(v) }} disabled={lookupMode==='phone'?!phoneNum.trim():!lookupValue.trim()||looking}>
                    {looking?'Checking...':'Continue →'}
                  </GradBtn>
            </Card>
          )}

          {/* RETURNING */}
          {screen==='returning' && existingClient && (
            <>
              <div style={{ background:C.accentLight, border:`1.5px solid ${C.accent}`, borderRadius:16, padding:20, marginBottom:16, display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:C.grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:18, flexShrink:0 }}>
                  {existingClient.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:16, color:C.text }}>Welcome back, {existingClient.name.split(' ')[0]}! 👊</div>
                  <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>Just pick your service, date and time.</div>
                </div>
              </div>
              <ServicePicker C={C} service={retForm.service} onService={v=>rf({service:v})} date={retForm.date} onDate={v=>rf({date:v})} time={retForm.time} onTime={v=>rf({time:v})} bookedSlots={bookedSlots} groupMembers={retForm.groupMembers} onMemberUpdate={(i,f,v)=>updateMember(false,i,f,v)}/>
              <Card C={C}>
                <Field C={C} label="Notes (optional)">
                  <textarea value={retForm.notes} onChange={e=>rf({notes:e.target.value})} placeholder="Special requests, parking info..."
                    style={{ width:'100%', background:C.bg2, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'14px 16px', fontSize:15, color:C.text, outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:70 }}/>
                </Field>
              </Card>
              <GradBtn C={C} onClick={submitReturning} disabled={submitting||!retForm.service||!retForm.date||!retForm.time}>
                {submitting?'Booking...':'Confirm Booking →'}
              </GradBtn>
              <div style={{ marginTop:10 }}><OutlineBtn C={C} onClick={reset}>← Not you? Start over</OutlineBtn></div>
            </>
          )}

          {/* NEW CLIENT */}
          {screen==='new_client' && (
            <>
              {showFirstTime && (
                <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
                  <div style={{ background:C.bg, borderRadius:'24px 24px 0 0', padding:'32px 24px 48px', width:'100%', maxWidth:520, textAlign:'center' }}>
                    <div style={{ fontSize:52, marginBottom:16 }}>✂️</div>
                    <h2 style={{ fontSize:22, fontWeight:800, color:C.text, margin:'0 0 12px' }}>One time. That's it.</h2>
                    <p style={{ fontSize:15, color:C.muted, lineHeight:1.7, margin:'0 0 10px' }}>
                      We need your details just <strong style={{ color:C.text }}>once</strong> to set up your profile.
                    </p>
                    <p style={{ fontSize:15, color:C.muted, lineHeight:1.7, margin:'0 0 28px' }}>
                      Every booking after this? Just enter your number and you're done in <strong style={{ color:C.text }}>3 taps</strong>. No forms, no hassle.
                    </p>
                    <div style={{ background:C.accentLight, borderRadius:12, padding:'14px 16px', marginBottom:28, border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>📱 Name · Phone · Address</div>
                      <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Saved forever. Never asked again.</div>
                    </div>
                    <GradBtn C={C} onClick={()=>setShowFirstTime(false)}>Got it — let's go</GradBtn>
                  </div>
                </div>
              )}
              <Card C={C}>
                <SectionLabel C={C}>Your Details</SectionLabel>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                  <Field C={C} label="First Name"><Inp C={C} value={newForm.firstName} onChange={e=>nf({firstName:e.target.value})} placeholder="Ahmed"/></Field>
                  <Field C={C} label="Last Name"><Inp C={C} value={newForm.lastName} onChange={e=>nf({lastName:e.target.value})} placeholder="Al Mansoori"/></Field>
                </div>
                <Field C={C} label="Phone Number" hint="Used to find your profile next time">
                  <Inp C={C} value={newForm.phone} onChange={e=>nf({phone:e.target.value})} placeholder="+971 50 000 0000" type="tel"/>
                </Field>
                <Field C={C} label="Home / Location Address" hint="Where should we come to?">
                  <Inp C={C} value={newForm.address} onChange={e=>nf({address:e.target.value})} placeholder="Villa 12, Street 4, Jumeirah..."/>
                </Field>
                <Check C={C} checked={newForm.sameWhatsapp} onChange={()=>nf({sameWhatsapp:!newForm.sameWhatsapp})} label="WhatsApp same as phone number"/>
                {!newForm.sameWhatsapp && <Field C={C} label="WhatsApp Number"><Inp C={C} value={newForm.whatsapp} onChange={e=>nf({whatsapp:e.target.value})} placeholder="+971 50 000 0000" type="tel"/></Field>}
                <Field C={C} label="Email"><Inp C={C} value={newForm.email} onChange={e=>nf({email:e.target.value})} placeholder="you@email.com" type="email"/></Field>
                <Check C={C} checked={newForm.mediaConsent} onChange={()=>nf({mediaConsent:!newForm.mediaConsent})} label="I'm happy for photos/videos to be used for social media" sub="Optional — no worries if not"/>
              </Card>
              <ServicePicker C={C} service={newForm.service} onService={v=>nf({service:v})} date={newForm.date} onDate={v=>nf({date:v})} time={newForm.time} onTime={v=>nf({time:v})} bookedSlots={bookedSlots} groupMembers={newForm.groupMembers} onMemberUpdate={(i,f,v)=>updateMember(true,i,f,v)}/>
              <Card C={C}>
                <Field C={C} label="Notes (optional)">
                  <textarea value={newForm.notes} onChange={e=>nf({notes:e.target.value})} placeholder="Special requests, gate code, parking info..."
                    style={{ width:'100%', background:C.bg2, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'14px 16px', fontSize:15, color:C.text, outline:'none', boxSizing:'border-box', resize:'vertical', minHeight:70 }}/>
                </Field>
              </Card>
              <GradBtn C={C} onClick={submitNew} disabled={submitting||!newForm.firstName||!newForm.lastName||!newForm.phone||!newForm.address||!newForm.email||!newForm.service||!newForm.date||!newForm.time}>
                {submitting?'Booking...':'Confirm Booking →'}
              </GradBtn>
              <div style={{ marginTop:10 }}><OutlineBtn C={C} onClick={reset}>← Back</OutlineBtn></div>
            </>
          )}

          {/* CONFIRM */}
          {screen==='confirm' && confirmed && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
              <h2 style={{ fontSize:24, fontWeight:900, color:C.text, marginBottom:6 }}>You're booked!</h2>
              <p style={{ color:C.muted, fontSize:14, marginBottom:6 }}>See you on {confirmed.date} at {confirmed.time}.</p>
              {confirmed.isNew && <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Profile saved — next time just enter your number 🎉</p>}
              {!confirmed.isNew && <p style={{ color:C.muted, fontSize:13, marginBottom:24 }}>See you soon! 👊</p>}
              <Card C={C} style={{ textAlign:'left', marginBottom:24 }}>
                <Row C={C} label="Name" value={confirmed.name}/>
                <Row C={C} label="Service" value={confirmed.service}/>
                <Row C={C} label="Price" value={`AED ${confirmed.price}`}/>
                <Row C={C} label="Date" value={confirmed.date}/>
                <Row C={C} label="Time" value={confirmed.time}/>
              </Card>
              <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Your booking reference</div>
              <div style={{ fontSize:32, fontWeight:800, color:C.accent, letterSpacing:'0.18em', marginBottom:32 }}>{confirmed.bookingRef}</div>
              <GradBtn C={C} onClick={()=>{ setScreen('landing'); setConfirmed(null); setNewForm(blankNew()); setRetForm(blankRet()) }}>Done</GradBtn>
            </div>
          )}

          {/* FIND / MANAGE */}
          {screen==='find' && !managed && (
            <Card C={C}>
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <h2 style={{ fontSize:20, fontWeight:800, marginBottom:8, color:C.text }}>Manage Your Booking</h2>
                <p style={{ color:C.muted, fontSize:14 }}>Enter your booking reference code to view or cancel.</p>
              </div>
              <Field C={C} label="Booking Reference">
                <Inp C={C} value={refInput} onChange={e=>setRefInput(e.target.value.toUpperCase())} placeholder="e.g. A1B2C3" style={{ textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700 }}/>
              </Field>
              {manageError && <div style={{ color:C.red, fontSize:13, marginBottom:12 }}>{manageError}</div>}
              <GradBtn C={C} onClick={handleManage} disabled={!refInput.trim()}>Find Booking →</GradBtn>
            </Card>
          )}

          {screen==='find' && managed && !cancelDone && (
            <Card C={C}>
              <div style={{ textAlign:'center', marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:4 }}>Your Booking</h2>
              </div>
              <Row C={C} label="Name" value={managed.client_name}/>
              <Row C={C} label="Service" value={managed.service}/>
              <Row C={C} label="Date" value={managed.date}/>
              <Row C={C} label="Time" value={managed.time}/>
              <Row C={C} label="Status" value={managed.status} highlight={managed.status==='confirmed'}/>
              <div style={{ marginTop:20 }}>
                {managed.status==='confirmed' && (
                  <button onClick={cancelBooking}
                    style={{ width:'100%', background:'none', border:`1.5px solid ${C.red}`, color:C.red, borderRadius:12, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                    Cancel This Booking
                  </button>
                )}
                {managed.status==='cancelled' && <div style={{ textAlign:'center', color:C.muted, fontSize:14 }}>This booking is already cancelled.</div>}
              </div>
            </Card>
          )}

          {screen==='find' && cancelDone && (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:8 }}>Booking Cancelled</h2>
              <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>No problem — hope to see you again soon.</p>
              <GradBtn C={C} onClick={()=>{ setScreen('landing'); setManaged(null); setCancelDone(false); setRefInput('') }}>Back to Home</GradBtn>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
