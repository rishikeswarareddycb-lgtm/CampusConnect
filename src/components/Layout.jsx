import {useState} from 'react'
import {NavLink,Outlet,useNavigate} from 'react-router-dom'
import {LayoutDashboard,MessageSquareWarning,SearchCheck,CalendarDays,Megaphone,User,LogOut,Menu,Bell,Search,Users,GraduationCap,X} from 'lucide-react'
import {useApp} from '../context/AppContext'
const student=[['/app','Dashboard',LayoutDashboard],['/app/complaints','Complaints',MessageSquareWarning],['/app/lost-found','Lost & Found',SearchCheck],['/app/events','Campus Events',CalendarDays],['/app/announcements','Announcements',Megaphone],['/app/profile','My Profile',User]]
const admin=[['/admin','Admin Dashboard',LayoutDashboard],['/admin/complaints','Manage Complaints',MessageSquareWarning],['/admin/students','Manage Students',Users],['/admin/events','Manage Events',CalendarDays],['/admin/announcements','Manage Announcements',Megaphone]]
export const Logo=()=><span className="flex items-center gap-2 font-semibold text-navy"><span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-teal"><GraduationCap size={18}/></span>CampusConnect</span>
export default function Layout(){
  const {user,setUser,db}=useApp(),nav=useNavigate(),[open,setOpen]=useState(false),[menu,setMenu]=useState(false)
  const links=user.role==='admin'?admin:student,unread=db.announcements.filter(a=>!db.read.includes(a.id)).length
  const logout=()=>{setUser(null);nav('/login')}
  const item=([to,label,Icon])=><NavLink key={to} to={to} end onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive?'bg-brand text-white':'text-slate-300 hover:bg-white/10'}`}><Icon size={18}/>{label}</NavLink>
  return <div className="min-h-screen lg:pl-64">
    {open&&<div className="fixed inset-0 z-30 bg-navy/50 lg:hidden" onClick={()=>setOpen(false)}/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy p-4 transition-transform lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="mb-6 flex items-center justify-between px-2 text-white [&_*]:text-white"><Logo/><button className="lg:hidden" aria-label="Close menu" onClick={()=>setOpen(false)}><X/></button></div>
      <nav className="flex-1 space-y-1">{links.map(item)}</nav>
      <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10"><LogOut size={18}/>Logout</button>
    </aside>
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <button className="lg:hidden" aria-label="Open menu" onClick={()=>setOpen(true)}><Menu/></button>
      <div className="relative max-w-md flex-1"><Search size={16} className="absolute left-3 top-2.5 text-slate-400"/><input aria-label="Search" placeholder="Search CampusConnect" className="input pl-9"/></div>
      <NavLink to={user.role==='admin'?'/admin/announcements':'/app/announcements'} aria-label="Notifications" className="relative rounded-lg p-2 hover:bg-slate-100"><Bell size={20}/>{unread>0&&<span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-teal px-1 text-[10px] text-white">{unread}</span>}</NavLink>
      <div className="relative"><button onClick={()=>setMenu(!menu)} className="flex items-center gap-2" aria-label="Profile menu"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{user.name[0]}</span></button>
        {menu&&<div className="card absolute right-0 mt-2 w-48 p-1 text-sm"><p className="px-3 py-2 text-slate-500">{user.name} ({user.role})</p>{user.role==='student'&&<NavLink to="/app/profile" onClick={()=>setMenu(false)} className="block rounded px-3 py-2 hover:bg-slate-50">My Profile</NavLink>}<button onClick={logout} className="w-full rounded px-3 py-2 text-left hover:bg-slate-50">Logout</button></div>}</div>
    </header>
    <main className="mx-auto max-w-6xl p-4 sm:p-6"><Outlet/></main>
  </div>
}
