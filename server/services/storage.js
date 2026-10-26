import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const dataDir = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, '../data');
const dbFile = path.join(dataDir, 'db.json');

// Ensure data folder and db file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ users: [], resumes: {} }, null, 2));
}

const readDb = () => {
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { users: [], resumes: {} };
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing local database file:', err);
  }
};

export const localDb = {
  findUserByEmail: (email) => {
    const db = readDb();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: (id) => {
    const db = readDb();
    return db.users.find(u => u.id === id);
  },

  createUser: ({ name, email, password }) => {
    const db = readDb();
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name,
      email: email.toLowerCase(),
      password,
      createdAt: new Date()
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },

  getResume: (userId) => {
    const db = readDb();
    return db.resumes[userId] || null;
  },

  saveResume: (userId, resumeData) => {
    const db = readDb();
    const updated = {
      ...resumeData,
      userId,
      updatedAt: new Date()
    };
    db.resumes[userId] = updated;
    writeDb(db);
    return updated;
  }
};
