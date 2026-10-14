import {useState} from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer} from 'recharts'
import {Plus,SearchCheck,CalendarDays} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {Badge,DemoTag,PageHeader,Field} from '../components/UI'
import {statuses,departments} from '../data/mockData'
export const COLORS=['#64748b','#f59e0b','#14B8A6','#ef4444']
export const statusData=l=>statuses.map(s=>({name:s,value:l.filter(c=>c.status===s).length}))
export function Dashboard(){
  const {user,db}=useApp(),mine=db.complaints.filter(c=>c.student===user.name),up=db.events.filter(e=>db.registered.includes(e.id)&&e.date>='2026-10-13')
  const stats=[['Complaints submitted',mine.length],['In progress',mine.filter(c=>c.status==='In Progress').length],['Lost & found posts',db.items.length],['Registered events',up.length]]
  return <><PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} sub="Here's what's happening on campus."><DemoTag/></PageHeader>
    <div className="mb-6 flex flex-wrap gap-2"><Link to="complaints/new" className="btn-primary"><Plus size={16}/>Report an Issue</Link><Link to="lost-found/new" className="btn-ghost"><SearchCheck size={16}/>Report Lost Item</Link><Link to="events" className="btn-ghost"><CalendarDays size={16}/>Explore Events</Link></div>
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(([l,v])=><div key={l} className="card p-4"><p className="text-2xl font-bold text-navy">{v}</p><p className="text-sm text-slate-500">{l}</p></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="card p-4 lg:col-span-2"><h2 className="mb-3 font-semibold text-navy">Recent announcements</h2>{db.announcements.slice(0,3).map(a=><Link to="announcements" key={a.id} className="block border-t py-2 text-sm hover:text-brand">{a.title}<span className="ml-2 text-xs text-slate-400">{a.date}</span></Link>)}</div>
      <div className="card p-4"><h2 className="font-semibold text-navy">Complaint status</h2><div className="h-40"><ResponsiveContainer><PieChart><Pie data={statusData(mine)} dataKey="value" innerRadius={35} outerRadius={60}>{statuses.map((s,i)=><Cell key={s} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div>
      <div className="card p-4 lg:col-span-2"><h2 className="mb-3 font-semibold text-navy">Recent complaint activity</h2>{mine.slice(0,4).map(c=><div key={c.id} className="flex items-center justify-between border-t py-2 text-sm"><span>{c.title}</span><Badge>{c.status}</Badge></div>)}{!mine.length&&<p className="text-sm text-slate-500">No complaints yet.</p>}</div>
      <div className="card p-4"><h2 className="mb-3 font-semibold text-navy">Upcoming events</h2>{up.length?up.map(e=><p key={e.id} className="border-t py-2 text-sm">{e.title}<span className="block text-xs text-slate-400">{e.date}</span></p>):<p className="text-sm text-slate-500">Register for an event to see it here.</p>}</div></div></>}
export function Profile(){
  const {user,setUser,toast}=useApp(),{register,handleSubmit,reset,formState:{errors}}=useForm({defaultValues:user}),pw=useForm(),[tab,setTab]=useState('profile')
  return <><PageHeader title="My Profile"/><div className="card mb-4 flex items-center gap-4 p-5"><span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-2xl font-semibold text-white">{user.name[0]}</span><div><p className="font-semibold text-navy">{user.name}</p><p className="text-sm text-slate-500">{user.studentId} · {user.department} · Year {user.year}</p><p className="text-sm text-slate-500">{user.email}</p></div></div>
    <div className="mb-4 flex gap-2">{['profile','password'].map(t=><button key={t} onClick={()=>setTab(t)} className={tab===t?'btn-primary':'btn-ghost'}>{t==='profile'?'Edit profile':'Change password'}</button>)}</div>
    {tab==='profile'?<form className="card max-w-lg space-y-3 p-5" onSubmit={handleSubmit(d=>{setUser({...user,...d});toast('Profile saved')})}>
      <Field label="Full name" error={errors.name?.message}><input className="input" {...register('name',{required:'Name is required'})}/></Field>
      <Field label="Department"><select className="input" {...register('department')}>{departments.map(d=><option key={d}>{d}</option>)}</select></Field>
      <Field label="Year"><select className="input" {...register('year')}>{['1st','2nd','3rd','4th'].map(d=><option key={d}>{d}</option>)}</select></Field>
      <div className="flex gap-2"><button className="btn-primary">Save changes</button><button type="button" className="btn-ghost" onClick={()=>reset(user)}>Cancel</button></div></form>
    :<form className="card max-w-lg space-y-3 p-5" onSubmit={pw.handleSubmit(()=>{toast('Password updated (demo, nothing stored)');pw.reset()})}>
      <Field label="Current password" error={pw.formState.errors.cur?.message}><input type="password" className="input" {...pw.register('cur',{required:'Required'})}/></Field>
      <Field label="New password" error={pw.formState.errors.nw?.message}><input type="password" className="input" {...pw.register('nw',{required:'Required',minLength:{value:6,message:'At least 6 characters'}})}/></Field>
      <Field label="Confirm new password" error={pw.formState.errors.cf?.message}><input type="password" className="input" {...pw.register('cf',{validate:v=>v===pw.watch('nw')||'Passwords do not match'})}/></Field>
      <div className="flex gap-2"><button className="btn-primary">Update password</button><button type="button" className="btn-ghost" onClick={()=>pw.reset()}>Cancel</button></div></form>}</>}
