import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {Eye,EyeOff,MessageSquareWarning,SearchCheck,CalendarDays,Megaphone,ArrowRight} from 'lucide-react'
import {Logo} from '../components/Layout'
import {Field,DemoTag} from '../components/UI'
import {useApp} from '../context/AppContext'
import {departments} from '../data/mockData'
const feats=[[MessageSquareWarning,'Campus Complaints','Report issues and follow them to resolution.'],[SearchCheck,'Lost & Found','Post lost items or return what you found.'],[CalendarDays,'Campus Events','Browse, register and manage seats.'],[Megaphone,'Announcements','Never miss an important notice.']]
export function Landing(){return <div>
  <header className="mx-auto flex max-w-6xl items-center justify-between p-4"><Logo/><nav className="flex items-center gap-4 text-sm"><a href="#features" className="hidden sm:block">Features</a><a href="#how" className="hidden sm:block">How it works</a><Link to="/login" className="btn-ghost">Log in</Link></nav></header>
  <section className="bg-navy px-4 py-20 text-center text-white"><div className="mx-auto max-w-3xl"><h1 className="text-4xl font-bold sm:text-5xl">Your Campus. One Connected Platform.</h1>
    <p className="mt-4 text-slate-300">CampusConnect brings announcements, complaints, lost items and events into one place for students, faculty and administrators.</p>
    <div className="mt-8 flex justify-center gap-3"><Link to="/register" className="btn bg-teal text-navy hover:bg-teal/90">Get Started <ArrowRight size={16}/></Link><a href="#features" className="btn border border-white/30 hover:bg-white/10">Explore Features</a></div></div></section>
  <section id="features" className="mx-auto max-w-6xl px-4 py-16"><h2 className="mb-8 text-center text-2xl font-semibold text-navy">Everything campus life needs</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{feats.map(([I,t,d])=><div key={t} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md"><I className="mb-3 text-brand"/><h3 className="font-semibold text-navy">{t}</h3><p className="mt-1 text-sm text-slate-500">{d}</p></div>)}</div></section>
  <section className="bg-white py-12"><div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4">{[['2,400','Students'],['380','Issues resolved'],['45','Events a year'],['96%','Notices read']].map(([n,l])=><div key={l}><p className="text-3xl font-bold text-navy">{n}</p><p className="text-sm text-slate-500">{l}</p></div>)}<div className="col-span-full"><DemoTag/></div></div></section>
  <section id="how" className="mx-auto max-w-4xl px-4 py-16"><h2 className="mb-8 text-center text-2xl font-semibold text-navy">How it works</h2>
    <ol className="grid gap-4 sm:grid-cols-3">{['Create your student account','Report, register or browse','Track updates in one dashboard'].map((s,i)=><li key={s} className="card p-5"><span className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-teal/15 font-semibold text-teal">{i+1}</span>{s}</li>)}</ol></section>
  <footer className="border-t border-slate-200 bg-white p-6 text-center text-sm text-slate-500"><div className="mb-2 flex justify-center gap-5"><a href="#top">About</a><a href="mailto:help@campusconnect.example">Contact</a><a href="#top">Privacy</a></div>© 2026 CampusConnect. Demo project.</footer></div>}
const emailRule={required:'Email is required',pattern:{value:/^\S+@\S+\.\S+$/,message:'Enter a valid email'}}
export function Login(){
  const {register,handleSubmit,formState:{errors}}=useForm(),[show,setShow]=useState(false),[busy,setBusy]=useState(false),{setUser,toast}=useApp(),nav=useNavigate()
  const go=d=>{setBusy(true);setTimeout(()=>{const admin=d.email.toLowerCase().includes('admin');setUser({name:admin?'Admin User':'Aarav Mehta',email:d.email,role:admin?'admin':'student',studentId:'CS21001',department:'Computer Science',year:'3rd'});toast('Welcome back!');nav(admin?'/admin':'/app')},700)}
  return <AuthShell title="Log in" foot={<>New here? <Link to="/register" className="text-brand">Register as a student</Link></>}>
    <p className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800">Demo mode: any valid email and password works. Use an email containing "admin" to enter the admin area.</p>
    <form onSubmit={handleSubmit(go)} className="space-y-4" noValidate>
      <Field label="Email" error={errors.email?.message}><input className="input" type="email" {...register('email',emailRule)}/></Field>
      <Field label="Password" error={errors.password?.message}><div className="relative"><input className="input pr-10" type={show?'text':'password'} {...register('password',{required:'Password is required',minLength:{value:6,message:'At least 6 characters'}})}/><button type="button" aria-label="Toggle password" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-slate-400">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></Field>
      <div className="flex justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" {...register('remember')}/>Remember me</label><a href="#top" className="text-brand">Forgot password?</a></div>
      <button className="btn-primary w-full" disabled={busy}>{busy?'Logging in…':'Log in'}</button></form></AuthShell>}
export function Register(){
  const {register,handleSubmit,watch,formState:{errors}}=useForm(),{setUser,toast}=useApp(),nav=useNavigate(),r=(n,m)=>register(n,{required:m})
  const go=d=>{setUser({name:d.name,email:d.email,role:'student',studentId:d.sid,department:d.dept,year:d.year});toast('Account created (demo)');nav('/app')}
  return <AuthShell title="Create student account" foot={<>Already registered? <Link to="/login" className="text-brand">Log in</Link></>}>
    <form onSubmit={handleSubmit(go)} className="space-y-3" noValidate>
      <Field label="Full name" error={errors.name?.message}><input className="input" {...r('name','Name is required')}/></Field>
      <Field label="College email" error={errors.email?.message}><input className="input" type="email" {...register('email',emailRule)}/></Field>
      <div className="grid grid-cols-2 gap-3"><Field label="Student ID" error={errors.sid?.message}><input className="input" {...r('sid','Required')}/></Field>
        <Field label="Year" error={errors.year?.message}><select className="input" {...r('year','Required')}><option value="">Select</option>{['1st','2nd','3rd','4th'].map(y=><option key={y}>{y}</option>)}</select></Field></div>
      <Field label="Department" error={errors.dept?.message}><select className="input" {...r('dept','Select a department')}><option value="">Select</option>{departments.map(d=><option key={d}>{d}</option>)}</select></Field>
      <Field label="Password" error={errors.password?.message}><input className="input" type="password" {...register('password',{required:'Required',minLength:{value:6,message:'At least 6 characters'}})}/></Field>
      <Field label="Confirm password" error={errors.confirm?.message}><input className="input" type="password" {...register('confirm',{required:'Required',validate:v=>v===watch('password')||'Passwords do not match'})}/></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...r('terms','Accept the terms to continue')}/>I accept the terms and conditions</label>{errors.terms&&<p role="alert" className="text-xs text-red-600">{errors.terms.message}</p>}
      <button className="btn-primary w-full">Create account</button></form></AuthShell>}
const AuthShell=({title,children,foot})=><div className="grid min-h-screen place-items-center p-4"><div className="w-full max-w-md"><Link to="/" className="mb-6 flex justify-center"><Logo/></Link><div className="card p-6"><h1 className="mb-4 text-xl font-semibold text-navy">{title}</h1>{children}</div><p className="mt-4 text-center text-sm text-slate-500">{foot}</p></div></div>
