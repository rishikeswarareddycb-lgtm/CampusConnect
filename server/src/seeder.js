import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, getDbStatus } from './config/db.js';
import User from './models/User.js';
import Complaint from './models/Complaint.js';
import LostFound from './models/LostFound.js';
import Event from './models/Event.js';
import Announcement from './models/Announcement.js';
import {
  seedStudents,
  seedComplaints,
  seedItems,
  seedEvents,
  seedAnnouncements
} from './config/defaultData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'campusconnect.db.json');

const seedData = async () => {
  console.log('[Seeder] Starting data reset and seeding...');
  await connectDB();

  // 1. Seed MongoDB if connected
  if (getDbStatus().connected) {
    try {
      await User.deleteMany();
      await Complaint.deleteMany();
      await LostFound.deleteMany();
      await Event.deleteMany();
      await Announcement.deleteMany();

      for (const u of seedStudents) {
        const user = new User(u);
        await user.save();
      }
      await Complaint.insertMany(seedComplaints);
      await LostFound.insertMany(seedItems);
      await Event.insertMany(seedEvents);
      await Announcement.insertMany(seedAnnouncements);

      console.log('[Seeder] MongoDB seeded successfully!');
    } catch (error) {
      console.error('[Seeder] MongoDB seeding error:', error.message);
    }
  }

  // 2. Also seed local file store
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

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

  const localDB = {
    users: hashedUsers,
    complaints: seedComplaints.map(c => ({ ...c, _id: String(c.id), id: String(c.id) })),
    items: seedItems.map(i => ({ ...i, _id: String(i.id), id: String(i.id) })),
    events: seedEvents.map(e => ({ ...e, _id: String(e.id), id: String(e.id) })),
    announcements: seedAnnouncements.map(a => ({ ...a, _id: String(a.id), id: String(a.id) }))
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(localDB, null, 2), 'utf-8');
  console.log(`[Seeder] Local database written to: ${DB_FILE}`);
  console.log('[Seeder] Done!');
  process.exit(0);
};

seedData();
