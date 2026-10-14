import {useState} from 'react'
import {CalendarDays,MapPin,Users} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {Badge,PageHeader,Empty,Modal,DemoTag} from '../components/UI'
const TODAY='2026-10-13',ecats=['Technical','Cultural','Sports','Workshops']
export function Events(){
  const {db,patch,toast}=useApp(),[q,setQ]=useState(''),[cat,setCat]=useState(''),[sel,setSel]=useState(null)
  const list=db.events.filter(e=>e.title.toLowerCase().includes(q.toLowerCase())&&(!cat||e.category===cat))
  const toggle=e=>{const on=db.registered.includes(e.id);if(!on&&e.taken>=e.seats)return toast('This event is full','error')
    patch('registered',r=>on?r.filter(x=>x!==e.id):[...r,e.id]);patch('events',l=>l.map(x=>x.id===e.id?{...x,taken:x.taken+(on?-1:1)}:x));toast(on?'Registration cancelled':'Registered (demo)')}
  const Card=({e,past})=>{const on=db.registered.includes(e.id),full=e.taken>=e.seats
    return <div className="card overflow-hidden"><div className="grid h-24 place-items-center bg-navy text-teal"><CalendarDays/></div><div className="p-4"><div className="mb-1 flex gap-2"><Badge>{e.category}</Badge>{on&&<Badge>Resolved</Badge>&&<span className="text-xs font-medium text-teal">Registered</span>}</div>
      <button onClick={()=>setSel(e)} className="text-left font-semibold text-navy hover:text-brand">{e.title}</button>
      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={12}/>{e.date}<MapPin size={12} className="ml-2"/>{e.venue}</p><p className="text-xs text-slate-500">By {e.organizer}</p>
      <p className="mt-2 flex items-center gap-1 text-xs"><Users size={12}/>{full?'Full':`${e.seats-e.taken} seats left`}</p>
      {!past&&<button className={`mt-3 w-full ${on?'btn-ghost':'btn-primary'}`} onClick={()=>toggle(e)} disabled={!on&&full}>{on?'Cancel registration':full?'Event full':'Register'}</button>}</div></div>}
  const sec=(t,rows,past)=><section className="mb-8"><h2 className="mb-3 font-semibold text-navy">{t}</h2>{rows.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rows.map(e=><Card key={e.id} e={e} past={past}/>)}</div>:<Empty text="No events"/>}</section>
  return <><PageHeader title="Campus events"><DemoTag/></PageHeader>
    <div className="mb-6 grid gap-2 sm:grid-cols-3"><input className="input" placeholder="Search events" aria-label="Search" value={q} onChange={e=>setQ(e.target.value)}/><select className="input" aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{ecats.map(c=><option key={c}>{c}</option>)}</select></div>
    {sec('Upcoming',list.filter(e=>e.date>=TODAY))}{sec('Past',list.filter(e=>e.date<TODAY),true)}
    {sel&&<Modal title={sel.title} onClose={()=>setSel(null)}><p className="mb-3 text-sm">{sel.description}</p><p className="text-xs text-slate-500">{sel.date} · {sel.venue} · {sel.organizer}</p><p className="mt-1 text-xs text-slate-500">{sel.taken}/{sel.seats} seats taken</p></Modal>}</>}
export function Announcements(){
  const {db,patch}=useApp(),[q,setQ]=useState(''),[cat,setCat]=useState(''),[open,setOpen]=useState(null)
  const cs=[...new Set(db.announcements.map(a=>a.category))]
  const rows=db.announcements.filter(a=>a.title.toLowerCase().includes(q.toLowerCase())&&(!cat||a.category===cat)).sort((a,b)=>b.pinned-a.pinned||b.date.localeCompare(a.date))
  const show=a=>{setOpen(a);patch('read',r=>r.includes(a.id)?r:[...r,a.id])}
  return <><PageHeader title="Announcements"><DemoTag/></PageHeader>
    <div className="mb-4 grid gap-2 sm:grid-cols-3"><input className="input" placeholder="Search" aria-label="Search" value={q} onChange={e=>setQ(e.target.value)}/><select className="input" aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{cs.map(c=><option key={c}>{c}</option>)}</select></div>
    {rows.length?<div className="space-y-3">{rows.map(a=>{const read=db.read.includes(a.id);return <div key={a.id} className={`card border-l-4 p-4 ${read?'border-l-transparent':'border-l-teal bg-teal/5'}`}>
      <div className="mb-1 flex flex-wrap items-center gap-2"><Badge>{a.category}</Badge>{a.pinned&&<span className="text-xs font-medium text-brand">Pinned</span>}<span className="text-xs text-slate-400">{a.date}</span>{!read&&<span className="text-xs font-medium text-teal">Unread</span>}</div>
      <h3 className="font-semibold text-navy">{a.title}</h3><p className="text-sm text-slate-600">{a.body.slice(0,90)}{a.body.length>90&&'…'}</p><button className="mt-1 text-sm text-brand" onClick={()=>show(a)}>Read more</button></div>})}</div>:<Empty text="No announcements found"/>}
    {open&&<Modal title={open.title} onClose={()=>setOpen(null)}><p className="mb-2 text-xs text-slate-400">{open.category} · {open.date}</p><p className="text-sm">{open.body}</p></Modal>}</>}
