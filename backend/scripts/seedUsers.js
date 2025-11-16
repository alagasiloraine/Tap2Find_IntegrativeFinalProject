import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, getDB, client } from '../db.js';

dotenv.config();

async function run() {
  try {
    await connectDB();
    const db = getDB('tap2find_db');
    const users = db.collection('users');

    const adminPlain = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const profPlain = process.env.SEED_PROFESSOR_PASSWORD || 'professor123';

    const [adminHash, profHash] = await Promise.all([
      bcrypt.hash(adminPlain, 10),
      bcrypt.hash(profPlain, 10),
    ]);

    const seedUsers = [
      {
        role: 'admin',
        emailAddress: process.env.SEED_ADMIN_EMAIL || 'admin@tap2find.local',
        password: adminHash,
        firstName: 'Admin',
        middleName: '',
        lastName: 'User',
        idNumber: 'ADMIN-0001',
        contactNumber: '00000000000',
        facultyPosition: 'N/A',
        program: '',
        yearLevel: '',
        section: '',
        avatarUrl: '',
        coverUrl: '',
        isVerified: true,
      },
      {
        role: 'professor',
        emailAddress: process.env.SEED_PROFESSOR_EMAIL || 'professor@tap2find.local',
        password: profHash,
        firstName: 'Jane',
        middleName: 'A',
        lastName: 'Smith',
        idNumber: 'P0002',
        contactNumber: '09111112222',
        facultyPosition: 'Professor II',
        program: '',
        yearLevel: '',
        section: '',
        avatarUrl: '',
        coverUrl: '',
        isVerified: true,
        status: 'Busy',
      },
    ];

    for (const u of seedUsers) {
      const exists = await users.findOne({ emailAddress: u.emailAddress });
      if (exists) {
        console.log(`ℹ️  User already exists, skipping: ${u.emailAddress}`);
        continue;
      }
      await users.insertOne(u);
      console.log(`✅ Inserted: ${u.role} -> ${u.emailAddress}`);
    }

    console.log('\nSeed complete.');
    console.log('Credentials:');
    console.log(`  Admin:    ${seedUsers[0].emailAddress} / ${adminPlain}`);
    console.log(`  Professor:${seedUsers[1].emailAddress} / ${profPlain}`);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exitCode = 1;
  } finally {
    try { await client.close(); } catch {}
  }
}

run();
