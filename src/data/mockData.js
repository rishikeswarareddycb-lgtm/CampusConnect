// DEMONSTRATION DATA ONLY - replace with API responses (see services/).
export const complaints=[
{id:1,title:'Projector not working in Room 204',category:'Infrastructure',status:'In Progress',date:'2026-10-09',location:'Block A',priority:'Medium',student:'Aarav Mehta',description:'Projector shows no signal since Monday.'},
{id:2,title:'Corridor lights flickering',category:'Electricity',status:'Submitted',date:'2026-10-11',location:'Hostel B',priority:'Low',student:'Aarav Mehta',description:'Third floor lights flicker at night.'},
{id:3,title:'No water supply in washrooms',category:'Water',status:'Resolved',date:'2026-09-28',location:'Library',priority:'High',student:'Aarav Mehta',description:'No water since morning.'},
{id:4,title:'Wi-Fi drops in library',category:'Internet',status:'In Progress',date:'2026-10-05',location:'Library',priority:'Medium',student:'Sana Iqbal',description:'Frequent disconnects after 6 PM.'},
{id:5,title:'Overflowing bins near canteen',category:'Cleanliness',status:'Resolved',date:'2026-09-20',location:'Canteen',priority:'Low',student:'Rohan Das',description:'Bins not cleared for days.'},
{id:6,title:'Broken bench in quadrangle',category:'Infrastructure',status:'Rejected',date:'2026-09-15',location:'Quadrangle',priority:'Low',student:'Meera Nair',description:'Bench has loose planks.'},
{id:7,title:'Lab AC not cooling',category:'Electricity',status:'Submitted',date:'2026-10-12',location:'CS Lab 2',priority:'High',student:'Karan Rao',description:'AC runs but room is hot.'},
{id:8,title:'Slow internet in hostel',category:'Internet',status:'Submitted',date:'2026-10-10',location:'Hostel A',priority:'Medium',student:'Sana Iqbal',description:'Speeds under 1 Mbps.'}]
export const items=[
{id:1,type:'Lost',name:'Black wallet',category:'Accessories',status:'Open',location:'Canteen',date:'2026-10-10',description:'Leather wallet with student ID.',verified:false},
{id:2,type:'Found',name:'Blue water bottle',category:'Other',status:'Open',location:'Sports ground',date:'2026-10-11',description:'Steel bottle with dent.',verified:true},
{id:3,type:'Lost',name:'Scientific calculator',category:'Electronics',status:'Claimed',date:'2026-10-02',location:'Exam Hall 3',description:'Casio fx-991EX.',verified:false},
{id:4,type:'Found',name:'Set of keys',category:'Keys',status:'Open',location:'Library',date:'2026-10-12',description:'Three keys on a red ring.',verified:true},
{id:5,type:'Lost',name:'Grey hoodie',category:'Clothing',status:'Open',location:'Auditorium',date:'2026-10-08',description:'Size M, college logo.',verified:false}]
export const events=[
{id:1,title:'HackSprint 2026',category:'Technical',date:'2026-10-25',venue:'Main Auditorium',organizer:'Coding Club',seats:120,taken:96,description:'24-hour hackathon with mentors and prizes.'},
{id:2,title:'Cultural Fest: Rang',category:'Cultural',date:'2026-11-05',venue:'Open Air Theatre',organizer:'Cultural Committee',seats:500,taken:310,description:'Music, dance and drama performances.'},
{id:3,title:'Inter-Dept Cricket',category:'Sports',date:'2026-10-30',venue:'Sports Ground',organizer:'Sports Council',seats:60,taken:58,description:'Knockout cricket tournament.'},
{id:4,title:'Intro to Cloud Workshop',category:'Workshops',date:'2026-11-12',venue:'Seminar Hall',organizer:'IEEE Chapter',seats:80,taken:40,description:'Hands-on workshop on cloud deployment.'},
{id:5,title:'Robotics Expo',category:'Technical',date:'2026-09-18',venue:'Block C',organizer:'Robotics Club',seats:100,taken:100,description:'Student robotics showcase.'},
{id:6,title:'Photography Walk',category:'Workshops',date:'2026-09-05',venue:'Campus Gardens',organizer:'Photo Club',seats:30,taken:30,description:'Guided walk with pro photographers.'}]
export const announcements=[
{id:1,title:'Mid-semester exam schedule released',category:'Academic',date:'2026-10-12',pinned:true,body:'Mid-semester exams begin 3 November. The full timetable is available at the examination cell. Students must carry their ID cards to every exam. Report timetable clashes to your department office by 20 October.'},
{id:2,title:'Library timing extended during exams',category:'General',date:'2026-10-10',pinned:false,body:'The central library will stay open until 11 PM from 25 October to 15 November.'},
{id:3,title:'Scholarship applications open',category:'Academic',date:'2026-10-08',pinned:true,body:'Merit scholarship applications are open until 31 October. Submit documents to the accounts office.'},
{id:4,title:'Water tank cleaning on Sunday',category:'Maintenance',date:'2026-10-07',pinned:false,body:'Water supply will be interrupted from 9 AM to 1 PM on Sunday in all hostels.'},
{id:5,title:'Placement orientation session',category:'Placements',date:'2026-10-03',pinned:false,body:'Final-year students should attend the orientation in the main auditorium at 4 PM on Friday.'}]
export const students=[
{id:1,name:'Aarav Mehta',studentId:'CS21001',department:'Computer Science',year:'3rd',email:'aarav@college.edu'},
{id:2,name:'Sana Iqbal',studentId:'EC21014',department:'Electronics',year:'3rd',email:'sana@college.edu'},
{id:3,name:'Rohan Das',studentId:'ME22031',department:'Mechanical',year:'2nd',email:'rohan@college.edu'},
{id:4,name:'Meera Nair',studentId:'CS22007',department:'Computer Science',year:'2nd',email:'meera@college.edu'},
{id:5,name:'Karan Rao',studentId:'CE20045',department:'Civil',year:'4th',email:'karan@college.edu'}]
export const categories=['Infrastructure','Electricity','Water','Cleanliness','Internet','Other']
export const statuses=['Submitted','In Progress','Resolved','Rejected']
export const departments=['Computer Science','Electronics','Mechanical','Civil','Electrical']
