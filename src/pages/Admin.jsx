import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell} from 'recharts'
import {Plus,Pencil,Trash2} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {Badge,PageHeader,Modal,Confirm,Field,Empty,DemoTag} from '../components/UI'
import {statuses,categories} from '../data/mockData'
const PIE=['#14213D','#2563EB','#14B8A6','#f59e0b','#64748b','#ef4444']
export default function Admin({section}){
  const {db,patch,toast}=useApp(),[q,setQ]=useState(''),[st,setSt]=useState(''),[sort,setSort]=useState('date'),[edit,setEdit]=useState(null),[del,setDel]=useState(null)
  const cs=db.complaints,count=s=>cs.filter(c=>c.status===s).length
  const byCat=categories.map(c=>({name:c,value:cs.filter(x=>x.category===c).length})).filter(x=>x.value)
  const trend=['Jun','Jul','Aug','Sep','Oct'].map((m,i)=>({m,complaints:[4,7,5,9,cs.length][i]}))
  const rows=cs.filter(c=>c.title.toLowerCase().includes(q.toLowerCase())&&(!st||c.status===st)).sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):b.date.localeCompare(a.date))
  const crud=(key,fields,title)=><>
    <PageHeader title={title}><button className="btn-primary" onClick={()=>setEdit({key,fields,item:{}})}><Plus size={16}/>Create</button></PageHeader>
    {db[key].length?<div className="card divide-y">{db[key].map(x=><div key={x.id} className="flex items-center justify-between gap-2 p-4"><div><p className="font-medium text-navy">{x.title}</p><p className="text-xs text-slate-500">{x.category} · {x.date}</p></div>
      <div className="flex gap-1"><button aria-label="Edit" className="btn-ghost px-2" onClick={()=>setEdit({key,fields,item:x})}><Pencil size={14}/></button><button aria-label="Delete" className="btn-ghost px-2 text-red-600" onClick={()=>setDel({key,id:x.id})}><Trash2 size={14}/></button></div></div>)}</div>:<Empty text="Nothing yet"/>}</>
  return <>
    {section==='overview'&&<><PageHeader title="Admin dashboard" sub="Frontend demo role. Real authorization must be enforced by the backend."><DemoTag/></PageHeader>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{[['Total students',db.students.length],['Total complaints',cs.length],['Pending',count('Submitted')+count('In Progress')],['Resolved',count('Resolved')]].map(([l,v])=><div key={l} className="card p-4"><p className="text-2xl font-bold text-navy">{v}</p><p className="text-sm text-slate-500">{l}</p></div>)}</div>
      <div className="grid gap-4 lg:grid-cols-2"><div className="card p-4"><h2 className="mb-2 font-semibold text-navy">Complaint trend</h2><div className="h-56"><ResponsiveContainer><LineChart data={trend}><XAxis dataKey="m"/><YAxis allowDecimals={false}/><Tooltip/><Line dataKey="complaints" stroke="#2563EB" strokeWidth={2}/></LineChart></ResponsiveContainer></div></div>
        <div className="card p-4"><h2 className="mb-2 font-semibold text-navy">By category</h2><div className="h-56"><ResponsiveContainer><PieChart><Pie data={byCat} dataKey="value" nameKey="name" outerRadius={80} label>{byCat.map((_,i)=><Cell key={i} fill={PIE[i%6]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div></div></>}
    {section==='complaints'&&<><PageHeader title="Manage complaints"/>
      <div className="mb-4 grid gap-2 sm:grid-cols-3"><input className="input" placeholder="Search" aria-label="Search" value={q} onChange={e=>setQ(e.target.value)}/><select className="input" aria-label="Status" value={st} onChange={e=>setSt(e.target.value)}><option value="">All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select><select className="input" aria-label="Sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="date">Newest first</option><option value="title">Title A–Z</option></select></div>
      {rows.length?<div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{['Title','Student','Category','Status','Update'].map(h=><th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead><tbody>{rows.map(c=><tr key={c.id} className="border-t"><td className="p-3">{c.title}</td><td className="p-3">{c.student}</td><td className="p-3">{c.category}</td><td className="p-3"><Badge>{c.status}</Badge></td>
        <td className="p-3"><select aria-label="Update status" className="input py-1" value={c.status} onChange={e=>{patch('complaints',l=>l.map(x=>x.id===c.id?{...x,status:e.target.value}:x));toast('Status updated (demo)')}}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>:<Empty text="No complaints match"/>}</>}
    {section==='students'&&<><PageHeader title="Manage students"/><input className="input mb-4 max-w-sm" placeholder="Search name or ID" aria-label="Search" value={q} onChange={e=>setQ(e.target.value)}/>
      <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{['Name','ID','Department','Year','Email'].map(h=><th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead><tbody>{db.students.filter(s=>(s.name+s.studentId).toLowerCase().includes(q.toLowerCase())).map(s=><tr key={s.id} className="border-t"><td className="p-3">{s.name}</td><td className="p-3">{s.studentId}</td><td className="p-3">{s.department}</td><td className="p-3">{s.year}</td><td className="p-3">{s.email}</td></tr>)}</tbody></table></div></>}
    {section==='events'&&crud('events',['title','category','date','venue','organizer'],'Manage events')}
    {section==='announcements'&&crud('announcements',['title','category','date','body'],'Manage announcements')}
    {edit&&<EditModal {...edit} onClose={()=>setEdit(null)} onSave={d=>{patch(edit.key,l=>edit.item.id?l.map(x=>x.id===edit.item.id?{...x,...d}:x):[{id:Date.now(),pinned:false,seats:100,taken:0,...d},...l]);toast('Saved (demo)');setEdit(null)}}/>}
    {del&&<Confirm text="This permanently removes the item from the demo data." onYes={()=>{patch(del.key,l=>l.filter(x=>x.id!==del.id));toast('Deleted')}} onClose={()=>setDel(null)}/>}</>}
function EditModal({fields,item,onSave,onClose}){
  const {register,handleSubmit,formState:{errors}}=useForm({defaultValues:item})
  return <Modal title={item.id?'Edit':'Create'} onClose={onClose}><form onSubmit={handleSubmit(onSave)} className="space-y-3" noValidate>{fields.map(f=><Field key={f} label={f[0].toUpperCase()+f.slice(1)} error={errors[f]&&'Required'}>{f==='body'?<textarea rows={3} className="input" {...register(f,{required:true})}/>:<input type={f==='date'?'date':'text'} className="input" {...register(f,{required:true})}/>}</Field>)}
    <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div></form></Modal>}
