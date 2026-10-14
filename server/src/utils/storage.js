import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { getDbStatus } from '../config/db.js';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import LostFound from '../models/LostFound.js';
import Event from '../models/Event.js';
import Announcement from '../models/Announcement.js';
import {
  seedStudents,
  seedComplaints,
  seedItems,
  seedEvents,
  seedAnnouncements
} from '../config/defaultData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'campusconnect.db.json');

// Local storage cache
let localDB = null;

const ensureDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const saveLocalDB = () => {
  try {
    ensureDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(localDB, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save local DB:', err.message);
  }
};

export const initStorage = async () => {
  ensureDir();

  // If local DB file exists, read it
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      localDB = JSON.parse(content);
    } catch (e) {
      console.warn('Could not parse local DB file, reinitializing...');
    }
  }

  // If local DB is empty, initialize with default seed data
  if (!localDB || !localDB.users || localDB.users.length === 0) {
    // Hash default passwords
    const hashedUsers = await Promise.all(
      seedStudents.map(async (u, idx) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return {
          id: String(idx + 1),
          _id: String(idx + 1),
          name: u.name,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          role: u.role,
          studentId: u.studentId,
          department: u.department,
          year: u.year,
          createdAt: new Date().toISOString()
        };
      })
    );

    localDB = {
      users: hashedUsers,
      complaints: seedComplaints.map(c => ({ ...c, _id: String(c.id), id: String(c.id) })),
      items: seedItems.map(i => ({ ...i, _id: String(i.id), id: String(i.id) })),
      events: seedEvents.map(e => ({ ...e, _id: String(e.id), id: String(e.id) })),
      announcements: seedAnnouncements.map(a => ({ ...a, _id: String(a.id), id: String(a.id) }))
    };
    saveLocalDB();
  }

  // If MongoDB is connected and empty, seed it too
  if (getDbStatus().connected) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[MongoDB] Empty database detected. Seeding initial data...');
        for (const u of seedStudents) {
          const user = new User(u);
          await user.save();
        }
        await Complaint.insertMany(seedComplaints);
        await LostFound.insertMany(seedItems);
        await Event.insertMany(seedEvents);
        await Announcement.insertMany(seedAnnouncements);
        console.log('[MongoDB] Seeded successfully.');
      }
    } catch (err) {
      console.error('[MongoDB] Seeding error:', err.message);
    }
  }
};

export const storage = {
  // USER / AUTH
  users: {
    async findByEmail(email, includePassword = false) {
      const normEmail = email.toLowerCase().trim();
      if (getDbStatus().connected) {
        return includePassword
          ? await User.findOne({ email: normEmail }).select('+password')
          : await User.findOne({ email: normEmail });
      }
      const user = localDB.users.find(u => u.email === normEmail);
      if (!user) return null;
      if (!includePassword) {
        const { password, ...safeUser } = user;
        return safeUser;
      }
      return user;
    },

    async findById(id) {
      if (getDbStatus().connected) {
        return await User.findById(id);
      }
      const user = localDB.users.find(u => String(u._id || u.id) === String(id));
      if (!user) return null;
      const { password, ...safeUser } = user;
      return safeUser;
    },

    async create(data) {
      if (getDbStatus().connected) {
        const user = new User(data);
        await user.save();
        const safeUser = user.toObject();
        delete safeUser.password;
        return safeUser;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const newId = String(Date.now());
      const newUser = {
        _id: newId,
        id: newId,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role || (data.email.toLowerCase().includes('admin') ? 'admin' : 'student'),
        studentId: data.studentId || data.sid || '',
        department: data.department || data.dept || '',
        year: data.year || '',
        createdAt: new Date().toISOString()
      };
      localDB.users.push(newUser);
      saveLocalDB();
      const { password, ...safeUser } = newUser;
      return safeUser;
    },

    async update(id, data) {
      if (getDbStatus().connected) {
        const user = await User.findById(id);
        if (!user) return null;
        if (data.name) user.name = data.name;
        if (data.department) user.department = data.department;
        if (data.year) user.year = data.year;
        if (data.password) user.password = data.password;
        await user.save();
        const safeUser = user.toObject();
        delete safeUser.password;
        return safeUser;
      }
      const idx = localDB.users.findIndex(u => String(u._id || u.id) === String(id));
      if (idx === -1) return null;
      const user = localDB.users[idx];
      if (data.name) user.name = data.name;
      if (data.department) user.department = data.department;
      if (data.year) user.year = data.year;
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(data.password, salt);
      }
      localDB.users[idx] = user;
      saveLocalDB();
      const { password, ...safeUser } = user;
      return safeUser;
    },

    async getAllStudents(search = '') {
      if (getDbStatus().connected) {
        const query = { role: 'student' };
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } }
          ];
        }
        return await User.find(query).select('-password');
      }
      let list = localDB.users.filter(u => u.role === 'student');
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(u =>
          (u.name && u.name.toLowerCase().includes(s)) ||
          (u.studentId && u.studentId.toLowerCase().includes(s))
        );
      }
      return list.map(({ password, ...u }) => u);
    }
  },

  // COMPLAINTS
  complaints: {
    async getAll(filters = {}) {
      const { q, search, category, status, student, range } = filters;
      const searchTerm = q || search;

      if (getDbStatus().connected) {
        const query = {};
        if (category) query.category = category;
        if (status) query.status = status;
        if (student) query.student = student;
        if (searchTerm) {
          query.$or = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { location: { $regex: searchTerm, $options: 'i' } }
          ];
        }
        if (range) {
          const cutoff = new Date(Date.now() - Number(range) * 864e5).toISOString().slice(0, 10);
          query.date = { $gte: cutoff };
        }
        return await Complaint.find(query).sort({ date: -1, createdAt: -1 });
      }

      let list = [...localDB.complaints];
      if (category) list = list.filter(c => c.category === category);
      if (status) list = list.filter(c => c.status === status);
      if (student) list = list.filter(c => c.student === student || c.studentEmail === student);
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        list = list.filter(c =>
          c.title?.toLowerCase().includes(s) ||
          c.description?.toLowerCase().includes(s) ||
          c.location?.toLowerCase().includes(s)
        );
      }
      if (range) {
        const cutoff = new Date(Date.now() - Number(range) * 864e5).toISOString().slice(0, 10);
        list = list.filter(c => c.date >= cutoff);
      }
      return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    },

    async getById(id) {
      if (getDbStatus().connected) {
        return await Complaint.findById(id);
      }
      return localDB.complaints.find(c => String(c._id || c.id) === String(id)) || null;
    },

    async create(data) {
      const item = {
        title: data.title,
        category: data.category,
        priority: data.priority || 'Medium',
        status: 'Submitted',
        location: data.location,
        description: data.description,
        image: data.image || null,
        student: data.student,
        studentEmail: data.studentEmail,
        date: data.date || new Date().toISOString().slice(0, 10)
      };

      if (getDbStatus().connected) {
        const complaint = new Complaint(item);
        return await complaint.save();
      }

      const newId = String(Date.now());
      const newComplaint = { _id: newId, id: newId, ...item, createdAt: new Date().toISOString() };
      localDB.complaints.unshift(newComplaint);
      saveLocalDB();
      return newComplaint;
    },

    async updateStatus(id, status) {
      if (getDbStatus().connected) {
        return await Complaint.findByIdAndUpdate(id, { status }, { new: true });
      }
      const idx = localDB.complaints.findIndex(c => String(c._id || c.id) === String(id));
      if (idx === -1) return null;
      localDB.complaints[idx].status = status;
      saveLocalDB();
      return localDB.complaints[idx];
    },

    async delete(id) {
      if (getDbStatus().connected) {
        return await Complaint.findByIdAndDelete(id);
      }
      const idx = localDB.complaints.findIndex(c => String(c._id || c.id) === String(id));
      if (idx === -1) return false;
      localDB.complaints.splice(idx, 1);
      saveLocalDB();
      return true;
    }
  },

  // LOST & FOUND
  lostFound: {
    async getAll(filters = {}) {
      const { type, category, status, q, search } = filters;
      const searchTerm = q || search;

      if (getDbStatus().connected) {
        const query = {};
        if (type) query.type = type;
        if (category) query.category = category;
        if (status) query.status = status;
        if (searchTerm) {
          query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { location: { $regex: searchTerm, $options: 'i' } }
          ];
        }
        return await LostFound.find(query).sort({ date: -1, createdAt: -1 });
      }

      let list = [...localDB.items];
      if (type) list = list.filter(i => i.type.toLowerCase() === type.toLowerCase());
      if (category) list = list.filter(i => i.category === category);
      if (status) list = list.filter(i => i.status === status);
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        list = list.filter(i =>
          i.name?.toLowerCase().includes(s) ||
          i.description?.toLowerCase().includes(s) ||
          i.location?.toLowerCase().includes(s)
        );
      }
      return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    },

    async getById(id) {
      if (getDbStatus().connected) {
        return await LostFound.findById(id);
      }
      return localDB.items.find(i => String(i._id || i.id) === String(id)) || null;
    },

    async create(data) {
      const item = {
        type: data.type || 'Lost',
        name: data.name,
        category: data.category,
        status: data.status || 'Open',
        location: data.location,
        date: data.date || new Date().toISOString().slice(0, 10),
        description: data.description,
        contact: data.contact || 'Email',
        image: data.image || null,
        verified: data.verified || false,
        reportedBy: data.reportedBy || ''
      };

      if (getDbStatus().connected) {
        const lostFound = new LostFound(item);
        return await lostFound.save();
      }

      const newId = String(Date.now());
      const newItem = { _id: newId, id: newId, ...item, createdAt: new Date().toISOString() };
      localDB.items.unshift(newItem);
      saveLocalDB();
      return newItem;
    },

    async update(id, data) {
      if (getDbStatus().connected) {
        return await LostFound.findByIdAndUpdate(id, data, { new: true });
      }
      const idx = localDB.items.findIndex(i => String(i._id || i.id) === String(id));
      if (idx === -1) return null;
      localDB.items[idx] = { ...localDB.items[idx], ...data };
      saveLocalDB();
      return localDB.items[idx];
    },

    async delete(id) {
      if (getDbStatus().connected) {
        return await LostFound.findByIdAndDelete(id);
      }
      const idx = localDB.items.findIndex(i => String(i._id || i.id) === String(id));
      if (idx === -1) return false;
      localDB.items.splice(idx, 1);
      saveLocalDB();
      return true;
    }
  },

  // EVENTS
  events: {
    async getAll() {
      if (getDbStatus().connected) {
        return await Event.find().sort({ date: 1 });
      }
      return [...localDB.events].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    },

    async getById(id) {
      if (getDbStatus().connected) {
        return await Event.findById(id);
      }
      return localDB.events.find(e => String(e._id || e.id) === String(id)) || null;
    },

    async create(data) {
      const item = {
        title: data.title,
        category: data.category,
        date: data.date,
        venue: data.venue,
        organizer: data.organizer,
        seats: Number(data.seats) || 100,
        taken: Number(data.taken) || 0,
        description: data.description || '',
        registeredEmails: []
      };

      if (getDbStatus().connected) {
        const event = new Event(item);
        return await event.save();
      }

      const newId = String(Date.now());
      const newEvent = { _id: newId, id: newId, ...item, createdAt: new Date().toISOString() };
      localDB.events.push(newEvent);
      saveLocalDB();
      return newEvent;
    },

    async update(id, data) {
      if (getDbStatus().connected) {
        return await Event.findByIdAndUpdate(id, data, { new: true });
      }
      const idx = localDB.events.findIndex(e => String(e._id || e.id) === String(id));
      if (idx === -1) return null;
      localDB.events[idx] = { ...localDB.events[idx], ...data };
      saveLocalDB();
      return localDB.events[idx];
    },

    async delete(id) {
      if (getDbStatus().connected) {
        return await Event.findByIdAndDelete(id);
      }
      const idx = localDB.events.findIndex(e => String(e._id || e.id) === String(id));
      if (idx === -1) return false;
      localDB.events.splice(idx, 1);
      saveLocalDB();
      return true;
    },

    async register(id, studentEmail) {
      if (getDbStatus().connected) {
        const event = await Event.findById(id);
        if (!event) return { error: 'Event not found' };
        if (event.taken >= event.seats) return { error: 'This event is full' };
        if (!event.registeredEmails.includes(studentEmail)) {
          event.registeredEmails.push(studentEmail);
          event.taken += 1;
          await event.save();
        }
        return { event };
      }

      const event = localDB.events.find(e => String(e._id || e.id) === String(id));
      if (!event) return { error: 'Event not found' };
      if (event.taken >= event.seats) return { error: 'This event is full' };
      if (!event.registeredEmails) event.registeredEmails = [];
      if (!event.registeredEmails.includes(studentEmail)) {
        event.registeredEmails.push(studentEmail);
        event.taken = (event.taken || 0) + 1;
        saveLocalDB();
      }
      return { event };
    },

    async cancelRegistration(id, studentEmail) {
      if (getDbStatus().connected) {
        const event = await Event.findById(id);
        if (!event) return { error: 'Event not found' };
        const idx = event.registeredEmails.indexOf(studentEmail);
        if (idx !== -1) {
          event.registeredEmails.splice(idx, 1);
          event.taken = Math.max(0, event.taken - 1);
          await event.save();
        }
        return { event };
      }

      const event = localDB.events.find(e => String(e._id || e.id) === String(id));
      if (!event) return { error: 'Event not found' };
      if (!event.registeredEmails) event.registeredEmails = [];
      const idx = event.registeredEmails.indexOf(studentEmail);
      if (idx !== -1) {
        event.registeredEmails.splice(idx, 1);
        event.taken = Math.max(0, (event.taken || 1) - 1);
        saveLocalDB();
      }
      return { event };
    }
  },

  // ANNOUNCEMENTS
  announcements: {
    async getAll() {
      if (getDbStatus().connected) {
        return await Announcement.find().sort({ pinned: -1, date: -1 });
      }
      return [...localDB.announcements].sort(
        (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.date || '').localeCompare(a.date || '')
      );
    },

    async getById(id) {
      if (getDbStatus().connected) {
        return await Announcement.findById(id);
      }
      return localDB.announcements.find(a => String(a._id || a.id) === String(id)) || null;
    },

    async create(data) {
      const item = {
        title: data.title,
        category: data.category || 'General',
        date: data.date || new Date().toISOString().slice(0, 10),
        pinned: Boolean(data.pinned),
        body: data.body
      };

      if (getDbStatus().connected) {
        const announcement = new Announcement(item);
        return await announcement.save();
      }

      const newId = String(Date.now());
      const newAnn = { _id: newId, id: newId, ...item, createdAt: new Date().toISOString() };
      localDB.announcements.unshift(newAnn);
      saveLocalDB();
      return newAnn;
    },

    async update(id, data) {
      if (getDbStatus().connected) {
        return await Announcement.findByIdAndUpdate(id, data, { new: true });
      }
      const idx = localDB.announcements.findIndex(a => String(a._id || a.id) === String(id));
      if (idx === -1) return null;
      localDB.announcements[idx] = { ...localDB.announcements[idx], ...data };
      saveLocalDB();
      return localDB.announcements[idx];
    },

    async delete(id) {
      if (getDbStatus().connected) {
        return await Announcement.findByIdAndDelete(id);
      }
      const idx = localDB.announcements.findIndex(a => String(a._id || a.id) === String(id));
      if (idx === -1) return false;
      localDB.announcements.splice(idx, 1);
      saveLocalDB();
      return true;
    }
  },

  // ADMIN STATS
  async getAdminStats() {
    let complaints, students;

    if (getDbStatus().connected) {
      complaints = await Complaint.find();
      students = await User.find({ role: 'student' });
    } else {
      complaints = localDB.complaints;
      students = localDB.users.filter(u => u.role === 'student');
    }

    const totalStudents = students.length;
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(
      c => c.status === 'Submitted' || c.status === 'In Progress'
    ).length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

    const categories = ['Infrastructure', 'Electricity', 'Water', 'Cleanliness', 'Internet', 'Other'];
    const byCategory = categories
      .map(cat => ({
        name: cat,
        value: complaints.filter(c => c.category === cat).length
      }))
      .filter(x => x.value > 0);

    const trend = [
      { m: 'Jun', complaints: 4 },
      { m: 'Jul', complaints: 7 },
      { m: 'Aug', complaints: 5 },
      { m: 'Sep', complaints: 9 },
      { m: 'Oct', complaints: totalComplaints }
    ];

    return {
      totalStudents,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      byCategory,
      trend
    };
  }
};
