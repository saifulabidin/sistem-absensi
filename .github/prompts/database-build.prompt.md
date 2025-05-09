# Panduan Setup dan Migrasi Database

Dokumen ini menjelaskan langkah-langkah untuk mengatur database PostgreSQL dan menjalankan migrasi menggunakan Prisma ORM, baik di lingkungan pengembangan lokal maupun di lingkungan produksi.

## Persiapan Awal

### 1. Instalasi Tools

```bash
# Instalasi Prisma CLI
npm install prisma --save-dev

# Instalasi PostgreSQL client (jika belum ada)
# Untuk Ubuntu/Debian
sudo apt-get install postgresql-client

# Untuk macOS dengan Homebrew
brew install postgresql

# Untuk Windows, unduh dari https://www.postgresql.org/download/windows/
```

### 2. Struktur File Konfigurasi

Buat file konfigurasi untuk berbagai lingkungan:

```
/prisma
  ├── schema.prisma         # Schema utama database
  ├── migrations/           # Folder migrasi yang dihasilkan Prisma
  └── seed.js               # Script untuk mengisi data awal

/.env                       # Variabel lingkungan default (development)
/.env.production            # Variabel lingkungan produksi
/.env.example               # Contoh konfigurasi (untuk dokumentasi)
```

### 3. Konfigurasi Connection String

#### File `.env` (Development)

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/attendance_system_dev?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_dev
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Application
PORT=5000
NODE_ENV=development
```

#### File `.env.production`

```
# Database
DATABASE_URL="postgresql://username:password@production-db-host:5432/attendance_system_prod?schema=public"

# JWT
JWT_SECRET=your_secure_production_jwt_secret
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Application
PORT=5000
NODE_ENV=production
```

#### File `.env.example`

```
# Database
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Application
PORT=5000
NODE_ENV=development
```

## Setup Database Lokal (Development)

### 1. Membuat Database PostgreSQL Lokal

```bash
# Login ke PostgreSQL dengan user postgres
sudo -u postgres psql

# Dalam psql shell, buat database baru
CREATE DATABASE attendance_system_dev;

# Buat user baru (opsional tapi direkomendasikan)
CREATE USER attendance_admin WITH ENCRYPTED PASSWORD 'your_password';

# Berikan hak akses ke database
GRANT ALL PRIVILEGES ON DATABASE attendance_system_dev TO attendance_admin;

# Keluar dari psql shell
\q
```

### 2. Konfigurasi Prisma untuk Development

Buat file `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model
model User {
  id            String         @id @default(uuid())
  name          String
  email         String         @unique
  password      String
  role          Role           @default(EMPLOYEE)
  position      Position?      @relation(fields: [positionId], references: [id])
  positionId    String?
  department    Department?    @relation(fields: [departmentId], references: [id])
  departmentId  String?
  attendances   AttendanceLog[]
  deviceLogs    DeviceLog[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

// Position model
model Position {
  id        String   @id @default(uuid())
  name      String
  level     Int      @default(1)
  users     User[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Department model
model Department {
  id        String   @id @default(uuid())
  name      String
  users     User[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Attendance Log model
model AttendanceLog {
  id          String         @id @default(uuid())
  user        User           @relation(fields: [userId], references: [id])
  userId      String
  clockIn     DateTime
  clockOut    DateTime?
  workHours   Float?
  status      AttendanceStatus @default(PRESENT)
  notes       String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

// Device Log model
model DeviceLog {
  id           String   @id @default(uuid())
  user         User     @relation(fields: [userId], references: [id])
  userId       String
  deviceId     String
  deviceName   String
  deviceModel  String?
  loginTime    DateTime
  logoutTime   DateTime?
  ipAddress    String?
  latitude     Float?
  longitude    Float?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// Enums
enum Role {
  ADMIN
  EMPLOYEE
}

enum AttendanceStatus {
  PRESENT
  LATE
  ABSENT
}
```

### 3. Membuat dan Menjalankan Migrasi

```bash
# Membuat migrasi dari schema
npx prisma migrate dev --name init

# Perintah ini akan:
# 1. Membuat folder migrations dengan file SQL
# 2. Menjalankan migrasi di database
# 3. Men-generate Prisma Client
```

### 4. Mengisi Data Awal (Seed)

Buat file `prisma/seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Buat departemen
  const hrDept = await prisma.department.create({
    data: {
      name: 'Human Resources',
    },
  });

  const itDept = await prisma.department.create({
    data: {
      name: 'Information Technology',
    },
  });

  // Buat posisi/jabatan
  const managerPosition = await prisma.position.create({
    data: {
      name: 'Manager',
      level: 3,
    },
  });

  const staffPosition = await prisma.position.create({
    data: {
      name: 'Staff',
      level: 1,
    },
  });

  // Hash password untuk admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Buat super admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      departmentId: hrDept.id,
      positionId: managerPosition.id,
    },
  });

  // Buat sample employee
  const employee = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'employee@example.com',
      password: await bcrypt.hash('employee123', 10),
      role: 'EMPLOYEE',
      departmentId: itDept.id,
      positionId: staffPosition.id,
    },
  });

  console.log('Database seeded successfully!');
  console.log('Created:', { admin, employee, hrDept, itDept, managerPosition, staffPosition });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Tambahkan script seed di `package.json`:

```json
{
  "scripts": {
    "seed": "node prisma/seed.js"
  }
}
```

Jalankan seeding:

```bash
npx prisma db seed
```

## Setup Database Produksi

### 1. Persiapan Database Produksi

Opsi tersedia untuk produksi:

#### A. Database Terkelola (Direkomendasikan)
- **AWS RDS for PostgreSQL**
- **Google Cloud SQL for PostgreSQL**
- **Azure Database for PostgreSQL**
- **Digital Ocean Managed PostgreSQL**
- **Heroku Postgres**

#### B. Self-Hosted PostgreSQL
```bash
# Install PostgreSQL di server produksi
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Buat database dan user yang diperlukan
sudo -u postgres psql
CREATE DATABASE attendance_system_prod;
CREATE USER attendance_admin WITH ENCRYPTED PASSWORD 'secure_production_password';
GRANT ALL PRIVILEGES ON DATABASE attendance_system_prod TO attendance_admin;
\q
```

### 2. Migrasi Database Produksi

#### Metode 1: Menggunakan Prisma Migrate Deploy

```bash
# Buat file .env.production terlebih dahulu dengan koneksi DB produksi

# Jalankan migrasi di produksi tanpa membuat file migrasi baru
# (menggunakan file migrasi yang sudah ada)
npx dotenv -e .env.production -- prisma migrate deploy
```

#### Metode 2: Menggunakan SQL Migration (Manual)

```bash
# Ekspor skema SQL dari lokal
pg_dump -s attendance_system_dev > schema.sql

# Impor ke database produksi
psql -h your-production-host -U attendance_admin -d attendance_system_prod -f schema.sql
```

### 3. Seeding Data di Produksi

```bash
# Jalankan seed script dengan environment produksi
npx dotenv -e .env.production -- node prisma/seed.js

# ATAU tambahkan flag untuk hanya membuat admin
npx dotenv -e .env.production -- node prisma/seed.js --production-mode
```

## Automated Database Setup Script

Untuk memudahkan setup database di lingkungan development, buat script `setup-db.js`:

```javascript
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function setupDatabase() {
  try {
    console.log('🔄 Starting database setup...');
    
    // Step 1: Generate Prisma client
    console.log('🔄 Generating Prisma client...');
    await execPromise('npx prisma generate');
    
    // Step 2: Run migrations
    console.log('🔄 Running database migrations...');
    await execPromise('npx prisma migrate dev --name init');
    
    // Step 3: Seed database
    console.log('🔄 Seeding database with initial data...');
    await execPromise('node prisma/seed.js');
    
    console.log('✅ Database setup completed successfully!');
    console.log('👤 Admin user created:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('👤 Sample employee created:');
    console.log('   Email: employee@example.com');
    console.log('   Password: employee123');
    
  } catch (error) {
    console.error('❌ Database setup failed:');
    console.error(error.message);
    process.exit(1);
  }
}

setupDatabase();
```

Tambahkan script di `package.json`:

```json
{
  "scripts": {
    "setup-db": "node setup-db.js",
    "migrate:dev": "prisma migrate dev",
    "migrate:prod": "dotenv -e .env.production -- prisma migrate deploy",
    "seed:dev": "node prisma/seed.js",
    "seed:prod": "dotenv -e .env.production -- node prisma/seed.js"
  }
}
```

## Continuous Integration/Deployment untuk Database

### GitHub Actions Workflow untuk Migrasi DB

Buat file `.github/workflows/db-migration.yml`:

```yaml
name: Database Migration

on:
  push:
    branches: [ main ]
    paths:
      - 'prisma/**'
  workflow_dispatch:

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
```

## Backup dan Restore Database

### Script Backup Database

Buat file `scripts/backup-db.js`:

```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

// Extract database connection details from DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);
const dbName = dbUrl.pathname.substring(1);
const dbUser = dbUrl.username;
const dbPass = dbUrl.password;
const dbHost = dbUrl.hostname;
const dbPort = dbUrl.port || 5432;

// Create backups directory if it doesn't exist
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Create backup filename with date
const date = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `backup-${dbName}-${date}.sql`);

// Execute pg_dump command
const command = `PGPASSWORD="${dbPass}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c > ${backupFile}`;

console.log(`Creating backup of ${dbName} database...`);
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error creating backup: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Backup created successfully: ${backupFile}`);
});
```

### Script Restore Database

Buat file `scripts/restore-db.js`:

```javascript
const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Get backup file path from command line argument
const backupFile = process.argv[2];
if (!backupFile) {
  console.error('Please provide backup file path');
  process.exit(1);
}

// Extract database connection details from DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);
const dbName = dbUrl.pathname.substring(1);
const dbUser = dbUrl.username;
const dbPass = dbUrl.password;
const dbHost = dbUrl.hostname;
const dbPort = dbUrl.port || 5432;

// Execute pg_restore command
const command = `PGPASSWORD="${dbPass}" pg_restore -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -c "${backupFile}"`;

console.log(`Restoring ${dbName} database from backup...`);
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error restoring backup: ${error.message}`);
    return;
  }
  console.log(`Database restored successfully from: ${backupFile}`);
});
```

Tambahkan script di `package.json`:

```json
{
  "scripts": {
    "backup:dev": "node scripts/backup-db.js",
    "backup:prod": "NODE_ENV=production node scripts/backup-db.js",
    "restore:dev": "node scripts/restore-db.js",
    "restore:prod": "NODE_ENV=production node scripts/restore-db.js"
  }
}
```

## Tips dan Best Practices

### 1. Keamanan Database

- Jangan simpan kredensial database di kode sumber
- Gunakan variabel lingkungan untuk credential database
- Batasi akses database hanya ke IP server yang diperlukan
- Aktifkan SSL untuk koneksi database di produksi

### 2. Performance

- Buat index untuk kolom yang sering dicari
- Gunakan pooling koneksi untuk mengoptimalkan performa
- Monitor performa query dengan alat seperti pgAdmin atau pg_stat_statements

### 3. Migrasi dan Versioning

- Selalu lakukan backup sebelum migrasi di produksi
- Test migrasi di staging environment sebelum produksi 
- Jangan edit file migrasi yang sudah diterapkan
- Gunakan transaction dalam migrasi untuk rollback jika gagal

### 4. Monitoring dan Maintenance

- Setup backup otomatis harian/mingguan
- Monitor penggunaan disk dan CPU database
- Setup alerting untuk kondisi abnormal
- Jalankan VACUUM dan ANALYZE secara berkala untuk PostgreSQL