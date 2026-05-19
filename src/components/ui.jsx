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
  weight: "M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l1.43-1.43L19.14 22l2.14-2.14-1.43-1.43L22 17z",
  food: "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3",
  link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  copy: "M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4v4h8V4M8 4a2 2 0 012-2h4a2 2 0 012 2",
}

export const Icon = ({ name, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={PATHS[name] || PATHS.scissors}/>
  </svg>
)

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children }) => {
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

// ─── FIELD ────────────────────────────────────────────────────────────────────
export const Field = ({ label, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</label>
    {children}
  </div>
)

// ─── INPUT ────────────────────────────────────────────────────────────────────
export const Inp = (props) => (
  <input {...props} style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', fontSize:14, color:'var(--text)', outline:'none', boxSizing:'border-box', ...props.style }}/>
)

// ─── SELECT ───────────────────────────────────────────────────────────────────
export const Sel = ({ children, ...props }) => (
  <select {...props} style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', fontSize:14, color:'var(--text)', outline:'none', boxSizing:'border-box', ...props.style }}>
    {children}
  </select>
)

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export const Btn = ({ variant='primary', children, ...props }) => {
  const s = {
    primary:   { background:'var(--accent)', color:'#fff', border:'none' },
    secondary: { background:'transparent', color:'var(--text)', border:'1px solid var(--border)' },
    danger:    { background:'#ef4444', color:'#fff', border:'none' },
    ghost:     { background:'transparent', color:'var(--text-muted)', border:'none' },
    success:   { background:'#10b981', color:'#fff', border:'none' },
  }
  return (
    <button {...props} style={{ ...s[variant], borderRadius:8, padding:'10px 18px', fontSize:14, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, ...props.style }}>
      {children}
    </button>
  )
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, color }) => (
  <span style={{ background:color||'var(--accent-light)', color:color?'#fff':'var(--accent)', borderRadius:20, padding:'2px 9px', fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>{children}</span>
)

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, icon, color }) => (
  <div style={{ background:'var(--card)', borderRadius:12, padding:'16px 18px', display:'flex', gap:12, alignItems:'flex-start' }}>
    <div style={{ background:color||'var(--accent)', borderRadius:9, padding:9, color:'#fff', flexShrink:0 }}><Icon name={icon} size={18}/></div>
    <div>
      <div style={{ fontSize:20, fontWeight:800, lineHeight:1.1 }}>{value}</div>
      <div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{sub}</div>}
    </div>
  </div>
)

// ─── STATUS COLORS ────────────────────────────────────────────────────────────
export const STATUS_COLOR = {
  confirmed: '#6366f1',
  pending:   '#f59e0b',
  completed: '#10b981',
  cancelled: '#6b7280',
  noshow:    '#ef4444',
}

// ─── BOOKING FORM ─────────────────────────────────────────────────────────────
export const BookingForm = ({ form, setForm, onSave, onClose, saving }) => (
  <>
    <Field label="Client Name"><Inp value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} placeholder="Client name"/></Field>
    <Field label="Service"><Inp value={form.service} onChange={e=>setForm({...form,service:e.target.value})} placeholder="e.g. Fade + Beard"/></Field>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
      <Field label="Date"><Inp type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
      <Field label="Time"><Inp type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></Field>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
      <Field label="Price"><Inp type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="0"/></Field>
      <Field label="Status">
        <Sel value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="noshow">No Show</option>
        </Sel>
      </Field>
    </div>
    <Field label="Location"><Inp value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Client address or salon"/></Field>
    <Field label="Notes"><Inp value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Any notes..."/></Field>
    <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
      <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
      <Btn onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save Booking'}</Btn>
    </div>
  </>
)
