import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {Plus} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {Badge,PageHeader,Empty,Field,ImageUpload,DemoTag} from '../components/UI'
import {categories,statuses} from '../data/mockData'
export function Complaints(){
  const {db,user}=useApp(),[q,setQ]=useState(''),[cat,setCat]=useState(''),[st,setSt]=useState(''),[range,setRange]=useState(''),[n,setN]=useState(5)
  const cutoff=range?new Date(Date.now()-range*864e5).toISOString().slice(0,10):''
  const rows=db.complaints.filter(c=>c.student===user.name&&c.title.toLowerCase().includes(q.toLowerCase())&&(!cat||c.category===cat)&&(!st||c.status===st)&&(!cutoff||c.date>=cutoff)).sort((a,b)=>b.date.localeCompare(a.date))
  return <><PageHeader title="Campus complaints" sub="Your submitted issues"><DemoTag/><Link to="new" className="btn-primary"><Plus size={16}/>New complaint</Link></PageHeader>
    <div className="mb-4 grid gap-2 sm:grid-cols-4"><input className="input" placeholder="Search title" aria-label="Search" value={q} onChange={e=>setQ(e.target.value)}/>
      <select className="input" aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
      <select className="input" aria-label="Status" value={st} onChange={e=>setSt(e.target.value)}><option value="">All statuses</option>{statuses.map(c=><option key={c}>{c}</option>)}</select>
      <select className="input" aria-label="Date" value={range} onChange={e=>setRange(e.target.value)}><option value="">Any date</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></div>
    {rows.length?<div className="card divide-y">{rows.slice(0,n).map(c=><div key={c.id} className="flex flex-wrap items-center justify-between gap-2 p-4"><div><p className="font-medium text-navy">{c.title}</p><p className="text-xs text-slate-500">{c.category} · {c.location} · {c.date}</p></div><Badge>{c.status}</Badge></div>)}</div>
      :<Empty text="No complaints match your filters" action={<Link to="new" className="btn-primary">Submit a complaint</Link>}/>}
    {rows.length>n&&<button className="btn-ghost mx-auto mt-4" onClick={()=>setN(n+5)}>Load more</button>}</>}
export function SubmitComplaint(){
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm(),{db,patch,user,toast}=useApp(),nav=useNavigate(),[img,setImg]=useState(null)
  const go=async d=>{await new Promise(r=>setTimeout(r,600));patch('complaints',l=>[{id:Date.now(),status:'Submitted',date:new Date().toISOString().slice(0,10),student:user.name,image:img,...d},...l]);toast('Complaint submitted (demo)');nav('/app/complaints')}
  return <><PageHeader title="Submit a complaint"/><form onSubmit={handleSubmit(go)} className="card max-w-2xl space-y-4 p-5" noValidate>
    <Field label="Title" error={errors.title?.message}><input className="input" {...register('title',{required:'Title is required',minLength:{value:5,message:'At least 5 characters'}})}/></Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Category" error={errors.category?.message}><select className="input" {...register('category',{required:'Choose a category'})}><option value="">Select</option>{categories.map(c=><option key={c}>{c}</option>)}</select></Field>
      <Field label="Priority"><select className="input" {...register('priority')} defaultValue="Medium">{['Low','Medium','High'].map(c=><option key={c}>{c}</option>)}</select></Field></div>
    <Field label="Location or building" error={errors.location?.message}><input className="input" {...register('location',{required:'Location is required'})}/></Field>
    <Field label="Description" error={errors.description?.message}><textarea rows={4} className="input" {...register('description',{required:'Describe the issue',minLength:{value:15,message:'Add at least 15 characters'}})}/></Field>
    <Field label="Image (optional)"><ImageUpload onChange={setImg}/></Field>{img&&<img src={img} alt="Preview" className="h-32 rounded-lg border object-cover"/>}
    <div className="flex gap-2"><button className="btn-primary" disabled={isSubmitting}>{isSubmitting?'Submitting…':'Submit complaint'}</button><button type="button" className="btn-ghost" onClick={()=>nav(-1)}>Cancel</button></div></form></>}
