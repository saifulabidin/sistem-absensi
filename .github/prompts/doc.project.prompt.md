# Dokumentasi Sistem Absensi Perusahaan

## Pendahuluan

Sistem Absensi Perusahaan adalah aplikasi terpadu yang mengelola presensi karyawan, memantau jam kerja, dan membuat laporan absensi. Sistem ini terdiri dari tiga komponen utama:
- Backend API (Node.js/Express)
- Portal Admin (Next.js)
- Aplikasi Mobile Karyawan (Flutter)

## Arsitektur Sistem

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Flutter Mobile   │     │   Admin Portal    │     │  Database Server  │
│   Application     │◄────┤    (Next.js)      │◄────┤   (PostgreSQL)    │
│                   │     │                   │     │                   │
└───────┬───────────┘     └───────┬───────────┘     └───────────────────┘
        │                         │                          ▲
        │                         │                          │
        │                         ▼                          │
        │               ┌───────────────────┐                │
        └──────────────►│     Backend       │────────────────┘
                        │     (Node.js)     │
                        │                   │
                        └───────────────────┘
```

## Spesifikasi Backend

### Teknologi
- **Bahasa Pemrograman:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize/Prisma
- **Autentikasi:** JWT (JSON Web Token)
- **Logging:** Winston/Pino
- **Testing:** Jest
- **Dokumentasi API:** Swagger/OpenAPI

### Struktur Direktori

```
/backend
├── /src
│   ├── /config         # Konfigurasi aplikasi
│   ├── /controllers    # Controller API
│   ├── /middleware     # Middleware aplikasi
│   ├── /models         # Model database
│   ├── /routes         # Definisi rute API
│   ├── /services       # Logika bisnis
│   ├── /utils          # Utilitas dan helper
│   └── index.js        # Entry point aplikasi
├── /tests              # Unit dan integration tests
├── .env                # Variabel lingkungan
├── package.json        # Dependensi npm
└── README.md           # Dokumentasi
```

## Spesifikasi Frontend Admin (Next.js)

### Teknologi
- **Framework:** Next.js
- **State Management:** Redux/Context API
- **UI Library:** Material-UI/Chakra UI/Tailwind CSS
- **Chart Library:** Chart.js/Recharts
- **Tabel:** React Table/MUI DataGrid
- **Form Handling:** Formik/React Hook Form
- **Validasi:** Yup/Zod
- **HTTP Client:** Axios/Fetch API

### Struktur Direktori

```
/admin-portal
├── /public            # Asset statis
├── /src
│   ├── /components    # Komponen UI
│   ├── /contexts      # Context API
│   ├── /hooks         # Custom hooks
│   ├── /pages         # Halaman Next.js
│   ├── /services      # Service API
│   ├── /store         # State management
│   ├── /styles        # CSS/SCSS files
│   └── /utils         # Utilitas dan helper
├── .env               # Variabel lingkungan
├── package.json       # Dependensi npm
└── README.md          # Dokumentasi
```

### Fitur Admin Portal
1. **Dashboard**
   - Ringkasan data absensi
   - Grafik kehadiran harian/mingguan/bulanan
   - Jumlah karyawan hadir, absen, terlambat

2. **Manajemen Karyawan**
   - CRUD karyawan
   - Import/export data karyawan (Excel/CSV)
   - Manajemen jabatan dan departemen

3. **Monitoring Absensi**
   - Log aktivitas absensi real-time
   - Filter berdasarkan tanggal, departemen, karyawan
   - Detail log per karyawan

4. **Laporan**
   - Laporan absensi harian, mingguan, bulanan
   - Export ke Excel/PDF
   - Laporan jam kerja dan overtime

5. **Pengaturan**
   - Jam kerja
   - Kebijakan absensi
   - Hak akses pengguna

## Spesifikasi Aplikasi Mobile (Flutter)

### Teknologi
- **Framework:** Flutter
- **State Management:** Provider/Bloc/Riverpod
- **HTTP Client:** Dio/http
- **Storage Lokal:** Shared Preferences/Hive
- **Lokasi:** Geolocator
- **Biometrik:** local_auth
- **Deteksi Perangkat:** device_info_plus

### Struktur Direktori

```
/mobile_app
├── /android           # Android-specific files
├── /ios               # iOS-specific files
├── /lib
│   ├── /api           # API services
│   ├── /blocs         # State management
│   ├── /models        # Model data
│   ├── /screens       # UI screens
│   ├── /utils         # Utilitas dan helper
│   ├── /widgets       # Reusable widgets
│   └── main.dart      # Entry point aplikasi
├── pubspec.yaml       # Dependensi Flutter
└── README.md          # Dokumentasi
```

### Fitur Aplikasi Mobile
1. **Autentikasi**
   - Login dengan email dan password
   - Persistensi sesi
   - Reset password

2. **Absensi**
   - Clock in/out dengan timestamp
   - Deteksi lokasi
   - Verifikasi perangkat
   - Catatan/komentar

3. **Profil Karyawan**
   - Informasi personal
   - Riwayat absensi
   - Jam kerja total

4. **Notifikasi**
   - Pengingat absensi
   - Pemberitahuan penting
   - Status approval

## Database

### Skema Database

#### Tabel `users`
| Kolom       | Tipe      | Keterangan                      |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| name        | VARCHAR   | Nama lengkap                   |
| email       | VARCHAR   | Email (unique)                 |
| password    | VARCHAR   | Password terenkripsi           |
| role        | ENUM      | 'admin', 'employee'            |
| position_id | UUID      | Foreign key ke positions       |
| dept_id     | UUID      | Foreign key ke departments     |
| created_at  | TIMESTAMP | Waktu pembuatan                |
| updated_at  | TIMESTAMP | Waktu pembaruan                |

#### Tabel `positions`
| Kolom       | Tipe      | Keterangan                      |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| name        | VARCHAR   | Nama jabatan                   |
| level       | INTEGER   | Level jabatan                  |
| created_at  | TIMESTAMP | Waktu pembuatan                |
| updated_at  | TIMESTAMP | Waktu pembaruan                |

#### Tabel `departments`
| Kolom       | Tipe      | Keterangan                      |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| name        | VARCHAR   | Nama departemen                |
| created_at  | TIMESTAMP | Waktu pembuatan                |
| updated_at  | TIMESTAMP | Waktu pembaruan                |

#### Tabel `attendance_logs`
| Kolom       | Tipe      | Keterangan                      |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| user_id     | UUID      | Foreign key ke users           |
| clock_in    | TIMESTAMP | Waktu masuk                    |
| clock_out   | TIMESTAMP | Waktu keluar                   |
| work_hours  | DECIMAL   | Jumlah jam kerja               |
| status      | ENUM      | 'present', 'late', 'absent'    |
| notes       | TEXT      | Catatan absensi                |
| created_at  | TIMESTAMP | Waktu pembuatan                |
| updated_at  | TIMESTAMP | Waktu pembaruan                |

#### Tabel `device_logs`
| Kolom        | Tipe      | Keterangan                      |
|--------------|-----------|--------------------------------|
| id           | UUID      | Primary key                    |
| user_id      | UUID      | Foreign key ke users           |
| device_id    | VARCHAR   | ID perangkat                   |
| device_name  | VARCHAR   | Nama perangkat                 |
| device_model | VARCHAR   | Model perangkat                |
| login_time   | TIMESTAMP | Waktu login                    |
| logout_time  | TIMESTAMP | Waktu logout                   |
| ip_address   | VARCHAR   | Alamat IP                      |
| location     | POINT     | Koordinat lokasi               |
| created_at   | TIMESTAMP | Waktu pembuatan                |
| updated_at   | TIMESTAMP | Waktu pembaruan                |

## API Endpoints

### Autentikasi
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Informasi user saat ini

### Karyawan
- `GET /api/employees` - Daftar karyawan
- `GET /api/employees/:id` - Detail karyawan
- `POST /api/employees` - Tambah karyawan baru
- `PUT /api/employees/:id` - Update karyawan
- `DELETE /api/employees/:id` - Hapus karyawan
- `POST /api/employees/import` - Import data karyawan
- `GET /api/employees/export` - Export data karyawan

### Jabatan
- `GET /api/positions` - Daftar jabatan
- `GET /api/positions/:id` - Detail jabatan
- `POST /api/positions` - Tambah jabatan baru
- `PUT /api/positions/:id` - Update jabatan
- `DELETE /api/positions/:id` - Hapus jabatan

### Departemen
- `GET /api/departments` - Daftar departemen
- `GET /api/departments/:id` - Detail departemen
- `POST /api/departments` - Tambah departemen baru
- `PUT /api/departments/:id` - Update departemen
- `DELETE /api/departments/:id` - Hapus departemen

### Absensi
- `POST /api/attendance/clock-in` - Absen masuk
- `PUT /api/attendance/clock-out` - Absen keluar
- `GET /api/attendance` - Riwayat absensi
- `GET /api/attendance/:id` - Detail absensi
- `GET /api/attendance/report` - Laporan absensi
- `GET /api/attendance/export` - Export laporan absensi

### Device Log
- `GET /api/device-logs` - Daftar log perangkat
- `GET /api/device-logs/:userId` - Log perangkat per user
- `GET /api/device-logs/export` - Export log perangkat

## Autentikasi dan Keamanan

### JWT Authentication
Sistem menggunakan JWT (JSON Web Token) untuk autentikasi:
1. User login dengan email dan password
2. Server memverifikasi kredensial dan mengeluarkan token JWT
3. Token JWT digunakan untuk setiap permintaan API berikutnya
4. Token memiliki masa berlaku dan perlu diperbarui secara berkala

### Middleware Autentikasi
```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};
```

### Keamanan
1. **Password Hashing**: Menggunakan bcrypt untuk mengenkripsi password
2. **Rate Limiting**: Membatasi jumlah permintaan API dari satu IP
3. **CORS**: Mengonfigurasi Cross-Origin Resource Sharing
4. **Helmet**: Mengamankan header HTTP
5. **Validasi Input**: Memvalidasi semua input user
6. **Sanitasi Data**: Membersihkan data sebelum menyimpan ke database

## Fitur-fitur Utama

### 1. Sistem Absensi

#### Clock In/Out
- Karyawan melakukan absensi masuk (clock in) melalui aplikasi mobile
- Sistem mencatat waktu, lokasi, dan informasi perangkat
- Pada akhir shift, karyawan melakukan absensi keluar (clock out)
- Sistem menghitung total jam kerja secara otomatis

#### Verifikasi Kehadiran
- Deteksi lokasi GPS untuk memastikan karyawan berada di area kerja
- Identifikasi perangkat untuk mencegah penyalahgunaan
- Opsional: Verifikasi biometrik (sidik jari/wajah)

### 2. Monitoring Absensi

#### Dashboard Admin
- Visualisasi data kehadiran real-time
- Statistik kehadiran per departemen dan individu
- Alert untuk keterlambatan dan ketidakhadiran

#### Tracking Aktivitas
- Pencatatan aktivitas login/logout
- Monitoring perangkat yang digunakan
- Histori lokasi absensi

### 3. Pelaporan dan Analisis

#### Laporan Absensi
- Laporan harian, mingguan, bulanan
- Ekspor data ke format Excel
- Ringkasan jam kerja per karyawan

#### Analisis Data
- Tren kehadiran
- Tingkat keterlambatan
- Perbandingan antar departemen

### 4. Manajemen Karyawan

#### Data Karyawan
- Informasi personal (nama, email, kontak)
- Jabatan dan departemen
- Riwayat pekerjaan

#### Hak Akses
- Admin: Akses penuh ke semua fitur
- Manager: Akses ke data departemen yang dikelola
- Karyawan: Akses terbatas ke profil dan absensi pribadi

## Implementasi

### Backend Implementation

#### Setup Project
```bash
# Inisialisasi proyek Node.js
npm init -y

# Install dependencies
npm install express mongoose bcrypt jsonwebtoken cors helmet dotenv morgan winston multer

# Development dependencies
npm install -D nodemon jest supertest
```

#### Server Entry Point (app.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();
require('./config/database').connect();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
```

### Frontend Admin Implementation (Next.js)

#### Setup Project
```bash
# Create Next.js app
npx create-next-app admin-portal
cd admin-portal

# Install dependencies
npm install @mui/material @emotion/react @emotion/styled recharts axios jwt-decode
```

#### Authentication Service
```javascript
// services/authService.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user;
};
```

### Mobile App Implementation (Flutter)

#### Setup Project
```bash
# Create Flutter project
flutter create attendance_app
cd attendance_app

# Add dependencies in pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^5.0.0
  provider: ^6.0.5
  shared_preferences: ^2.1.0
  geolocator: ^9.0.2
  local_auth: ^2.1.6
  device_info_plus: ^8.1.0
  intl: ^0.18.0
```

#### Authentication Service
```dart
// lib/services/auth_service.dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final Dio _dio = Dio();
  final String _baseUrl = 'https://your-api-url.com/api';
  
  Future<bool> login(String email, String password) async {
    try {
      final response = await _dio.post(
        '$_baseUrl/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      
      if (response.statusCode == 200) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', response.data['token']);
        await prefs.setString('user', jsonEncode(response.data['user']));
        return true;
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }
  
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }
  
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }
  
  Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }
}
```

## Pemeliharaan

### Monitoring Sistem
- Menggunakan tools seperti PM2 untuk monitoring Node.js
- Log rotasi untuk mengelola file log
- Monitoring database untuk kinerja kueri

### Backup Data
- Backup database harian secara otomatis
- Penyimpanan backup di lokasi terpisah
- Prosedur pemulihan yang terdokumentasi

### Update dan Patch
- Pembaruan dependensi secara berkala
- Pengujian regresi setelah pembaruan
- Penerapan continuous integration/deployment

### Skalabilitas
- Desain arsitektur untuk mendukung pertumbuhan pengguna
- Optimasi database untuk volume data yang lebih besar
- Infrastruktur yang dapat diskalakan secara horizontal