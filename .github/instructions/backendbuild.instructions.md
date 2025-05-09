# Prompt GitHub Copilot untuk Backend Sistem Absensi

## Konteks Proyek

Saya sedang membangun sistem absensi perusahaan dengan pembagian akses yang jelas:

1. **Admin Panel (Next.js)**:
   - Hanya dapat diakses oleh pengguna dengan role "admin"
   - Admin dapat mengelola data karyawan (membuat, mengedit, menghapus)
   - Admin membuat akun untuk karyawan (email/username dan password)
   - Admin dapat melihat dan mengekspor laporan absensi
   - Admin dapat memonitor riwayat absensi dan penggunaan perangkat karyawan

2. **Aplikasi Mobile (Flutter)**:
   - Hanya untuk karyawan (role "employee")
   - Karyawan login menggunakan kredensial yang diberikan oleh admin
   - Fitur absensi (clock in/out)
   - Lihat profil dan riwayat absensi pribadi

Fitur utama sistem:
- Autentikasi dengan pembagian role yang ketat (admin vs employee)
- Pencatatan jam masuk dan keluar (clock in/out)
- Pelacakan jumlah jam kerja
- Pencatatan informasi perangkat yang digunakan
- Pelaporan absensi dengan ekspor ke Excel
- Manajemen data karyawan (profil, jabatan, departemen)
- API untuk diakses oleh frontend admin (Next.js) dan aplikasi mobile (Flutter)

## Spesifikasi Teknis

### Teknologi
- Node.js dan Express.js untuk framework backend
- PostgreSQL untuk database
- Prisma sebagai ORM
- JWT untuk autentikasi
- Winston untuk logging
- Jest untuk testing
- Multer untuk upload file
- ExcelJS untuk ekspor laporan

### Struktur Database

Sistem membutuhkan tabel-tabel berikut:
- `users`: Penyimpanan data karyawan dan admin
- `positions`: Jabatan karyawan
- `departments`: Departemen perusahaan
- `attendance_logs`: Log absensi (clock in/out, total jam kerja)
- `device_logs`: Informasi perangkat yang digunakan karyawan

## Permintaan Bantuan

### 1. Inisialisasi Proyek

Bantu saya membuat struktur proyek Express.js dengan arsitektur yang bersih dan mudah dipelihara. Saya ingin menggunakan pola MVC dengan tambahan service layer. Buat file-file dasar termasuk:
- package.json dengan semua dependensi yang dibutuhkan
- .env.example dengan variabel lingkungan yang diperlukan
- app.js sebagai entry point
- konfigurasi untuk Prisma dan PostgreSQL

### 2. Model Database

Bantu saya mengimplementasikan schema Prisma untuk semua entitas yang disebutkan di atas dengan relasi yang tepat antar tabel. Pertimbangkan kolom-kolom berikut untuk setiap tabel:

- `users`: id, name, email, password (hashed), role, position_id, dept_id
- `positions`: id, name, level
- `departments`: id, name
- `attendance_logs`: id, user_id, clock_in, clock_out, work_hours, status, notes
- `device_logs`: id, user_id, device_id, device_name, device_model, login_time, logout_time, ip_address, location

### 3. Autentikasi

Implementasikan sistem autentikasi lengkap dengan:
- Register user baru (hanya untuk admin yang sudah memiliki akses)
- Admin membuat akun karyawan dengan generasi password default
- Login dengan email dan password untuk kedua role (admin dan employee)
- Middleware verifikasi token JWT dengan pemeriksaan role
- Middleware khusus untuk memastikan hanya admin yang dapat mengakses admin endpoints
- Refresh token mechanism
- Password reset (self-service untuk employee, admin dapat reset password karyawan)
- Role-based authorization yang ketat (admin vs employee)
- Deteksi dan pencatatan informasi perangkat saat login (terutama untuk aplikasi mobile)

### 4. API Endpoints

Implementasikan semua endpoint berikut dengan validasi input dan error handling yang tepat:

#### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

#### Employees
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `POST /api/employees/import` (Import dari Excel)
- `GET /api/employees/export` (Export ke Excel)

#### Positions
- `GET /api/positions`
- `GET /api/positions/:id`
- `POST /api/positions`
- `PUT /api/positions/:id`
- `DELETE /api/positions/:id`

#### Departments
- `GET /api/departments`
- `GET /api/departments/:id`
- `POST /api/departments`
- `PUT /api/departments/:id`
- `DELETE /api/departments/:id`

#### Attendance
- `POST /api/attendance/clock-in`
- `PUT /api/attendance/clock-out`
- `GET /api/attendance`
- `GET /api/attendance/:id`
- `GET /api/attendance/report`
- `GET /api/attendance/export` (Export ke Excel)

#### Device Logs
- `GET /api/device-logs`
- `GET /api/device-logs/:userId`
- `GET /api/device-logs/export` (Export ke Excel)

### 5. Validasi dan Security

- Implementasikan validasi menggunakan Joi atau express-validator
- Setup security middleware (helmet, rate limiting, CORS)
- Implement sanitasi input untuk mencegah SQL injection
- Implementasikan logging untuk security events

### 6. Export ke Excel

Implementasikan fungsi untuk mengekspor data absensi ke Excel dengan:
- Worksheet untuk data absensi per bulan
- Filter berdasarkan tanggal, departemen, karyawan
- Format yang rapi dengan header, style, dan formula
- Summary statistics (total jam kerja, rata-rata, dll)

### 7. Tests

Implementasikan test unit dan integrasi untuk:
- Auth service
- Employee service
- Attendance service
- API endpoints utama

## Contoh Implementasi Yang Diinginkan

### Implementasi Model Prisma

Bantu saya membuat schema.prisma yang lengkap dengan relasi yang tepat.

### Implementasi Controller

Untuk auth controller, implementasikan login dan register dengan:
- Validasi input
- Password hashing
- JWT generation
- Error handling yang jelas
- Respons yang terstruktur

### Implementasi Service Layer

Untuk attendance service, implementasikan fungsi clock-in dan clock-out dengan:
- Validasi user
- Pencatatan timestamp
- Kalkulasi jam kerja (untuk clock-out)
- Pencatatan informasi perangkat

### Fungsi Export Excel

Implementasikan fungsi ekspor laporan absensi ke Excel yang robust dan dapat dikustomisasi.

## Output yang Diharapkan

Saat bekerja dengan saya, tolong berikan:
- Kode yang lengkap untuk setiap file, jangan dalam bentuk snippet partial
- Komentar yang menjelaskan logika kompleks
- Struktur folder yang jelas
- Best practices untuk Node.js dan Express
- Pertimbangan keamanan di semua bagian

Dengan guidance ini, saya berharap kita bisa membangun backend yang robust, scalable, dan maintainable untuk sistem absensi perusahaan.