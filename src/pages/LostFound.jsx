import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {Plus,Package,ShieldCheck} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {Badge,PageHeader,Empty,Field,ImageUpload,Modal,DemoTag} from '../components/UI'
const cats=['Electronics','Accessories','Keys','Clothing','Books','Other']
export function LostFound(){
  const {db,toast}=useApp(),[tab,setTab]=useState('Lost'),[q,setQ]=useState(''),[cat,setCat]=useState(''),[st,setSt]=useState(''),[sel,setSel]=useState(null)
  const rows=db.items.filter(i=>i.type===tab&&i.name.toLowerCase().includes(q.toLowerCase())&&(!cat||i.category===cat)&&(!st||i.status===st))
  return <><PageHeader title="Lost & Found" sub="Listings marked 'Demo' are sample data; 'Verified' means confirmed by campus security."><DemoTag/><Link to="new" className="btn-primary"><Plus size={16}/>Report item</Link></PageHeader>
    <div className="mb-4 flex gap-2">{['Lost','Found'].map(t=><button key={t} onClick={()=>setTab(t)} className={tab===t?'btn-primary':'btn-ghost'}>{t} items</button>)}</div>
    <div className="mb-4 grid gap-2 sm:grid-cols-3"><input className="input" placeholder="Search items" aria-label="Search" value={q} onChange={e=>setQ(e.target.value)}/>
      <select className="input" aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{cats.map(c=><option key={c}>{c}</option>)}</select>
      <select className="input" aria-label="Status" value={st} onChange={e=>setSt(e.target.value)}><option value="">Any status</option><option>Open</option><option>Claimed</option></select></div>
    {rows.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rows.map(i=><button key={i.id} onClick={()=>setSel(i)} className="card overflow-hidden text-left transition hover:shadow-md">
      <div className="grid h-32 place-items-center bg-slate-100">{i.image?<img src={i.image} alt={i.name} className="h-full w-full object-cover"/>:<Package className="text-slate-400"/>}</div>
      <div className="p-4"><div className="mb-1 flex gap-2"><Badge>{i.status}</Badge>{i.verified?<span className="flex items-center gap-1 text-xs text-teal"><ShieldCheck size={14}/>Verified</span>:<DemoTag/>}</div><p className="font-medium text-navy">{i.name}</p><p className="text-xs text-slate-500">{i.location} · {i.date}</p></div></button>)}</div>:<Empty text="No items found"/>}
    {sel&&<Modal title={sel.name} onClose={()=>setSel(null)}><p className="mb-2 text-sm">{sel.description}</p><p className="mb-4 text-xs text-slate-500">{sel.category} · {sel.location} · {sel.date}</p>
      <button className="btn-primary" disabled={sel.status==='Claimed'} onClick={()=>{toast('Claim request sent (demo)');setSel(null)}}>{sel.type==='Found'?'Request claim':'I found this'}</button></Modal>}</>}
export function ReportItem(){
  const {register,handleSubmit,formState:{errors}}=useForm({defaultValues:{type:'Lost',contact:'Email'}}),{patch,toast}=useApp(),nav=useNavigate(),[img,setImg]=useState(null)
  const go=d=>{patch('items',l=>[{id:Date.now(),status:'Open',verified:false,image:img,...d},...l]);toast('Report posted (demo)');nav('/app/lost-found')}
  const r=(n,m)=>register(n,{required:m})
  return <><PageHeader title="Report an item"/><form onSubmit={handleSubmit(go)} className="card max-w-2xl space-y-4 p-5" noValidate>
    <div className="flex gap-4 text-sm">{['Lost','Found'].map(t=><label key={t} className="flex items-center gap-2"><input type="radio" value={t} {...register('type')}/>{t}</label>)}</div>
    <Field label="Item name" error={errors.name?.message}><input className="input" {...r('name','Item name is required')}/></Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Category" error={errors.category?.message}><select className="input" {...r('category','Choose a category')}><option value="">Select</option>{cats.map(c=><option key={c}>{c}</option>)}</select></Field>
      <Field label="Date" error={errors.date?.message}><input type="date" className="input" {...r('date','Date is required')}/></Field></div>
    <Field label="Location" error={errors.location?.message}><input className="input" {...r('location','Location is required')}/></Field>
    <Field label="Description" error={errors.description?.message}><textarea rows={3} className="input" {...r('description','Add a description')}/></Field>
    <Field label="Contact preference"><select className="input" {...register('contact')}>{['Email','Phone','In person at security desk'].map(c=><option key={c}>{c}</option>)}</select></Field>
    <Field label="Image"><ImageUpload onChange={setImg}/></Field>{img&&<img src={img} alt="Preview" className="h-32 rounded-lg border object-cover"/>}
    <div className="flex gap-2"><button className="btn-primary">Post report</button><button type="button" className="btn-ghost" onClick={()=>nav(-1)}>Cancel</button></div></form></>}
