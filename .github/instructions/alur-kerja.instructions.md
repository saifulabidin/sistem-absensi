# Alur Kerja dan Kontrol Akses Sistem Absensi

## Pembagian Akses

Sistem absensi memiliki dua tipe pengguna dengan akses yang berbeda:

### 1. Admin
- Mengakses **Admin Panel** berbasis web 
- Memiliki kontrol penuh atas sistem
- Dapat mengelola data karyawan dan laporan

### 2. Employee (Karyawan)
- Mengakses **Mobile App** (Flutter)
- Akses terbatas hanya untuk melakukan absensi dan melihat data pribadi
- Tidak dapat mengakses Admin Panel

## Alur Kerja Sistem

```
┌─────────────────┐                  ┌─────────────────┐
│                 │                  │                 │
│  Super Admin    │                  │    Karyawan     │
│                 │                  │                 │
└────────┬────────┘                  └────────┬────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────┐                  ┌─────────────────┐
│                 │                  │                 │
│   Admin Panel   │                  │   Mobile App    │
│                 │                  │    (Flutter)    │
│                 │                  │                 │
└────────┬────────┘                  └────────┬────────┘
         │                                    │
         │                                    │
         │         ┌─────────────────┐        │
         │         │                 │        │
         └────────►│    Backend      │◄───────┘
                   │    (Node.js)    │
                   │                 │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │                 │
                   │    Database     │
                   │  (PostgreSQL)   │
                   │                 │
                   └─────────────────┘
```

## Proses Pembuatan dan Manajemen Akun

### 1. Setup Awal Sistem
- Super Admin dibuat saat inisialisasi sistem
- Super Admin memiliki akses penuh ke semua fitur

### 2. Penambahan Karyawan Baru
- Admin membuat akun karyawan melalui Admin Panel
- Admin mengisi data karyawan (nama, email, jabatan, departemen, dll)
- Sistem otomatis membuat password default atau menghasilkan password acak
- Admin memberikan kredensial (email & password) kepada karyawan

### 3. Akses Karyawan
- Karyawan mengunduh aplikasi mobile (Flutter)
- Login menggunakan kredensial yang diberikan oleh admin


## Mekanisme Kontrol Akses

### Backend Middleware
```javascript
// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak: Token tidak ditemukan' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Akses ditolak: Token tidak valid' });
  }
};

// Middleware untuk batasi akses hanya untuk admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak: Memerlukan hak akses admin' });
  }
};

// Middleware untuk batasi akses hanya untuk employee
const employeeOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak: Memerlukan hak akses karyawan' });
  }
};
```

### Implementasi pada Route API

```javascript
// Routes untuk Admin Panel
router.get('/admin/dashboard', verifyToken, adminOnly, adminController.getDashboard);
router.post('/employees', verifyToken, adminOnly, employeeController.createEmployee);
router.get('/attendance/report', verifyToken, adminOnly, attendanceController.getReport);

// Routes untuk Mobile App
router.post('/attendance/clock-in', verifyToken, employeeOnly, attendanceController.clockIn);
router.post('/attendance/clock-out', verifyToken, employeeOnly, attendanceController.clockOut);
router.get('/profile', verifyToken, userController.getProfile);
```

## Fitur Khusus Admin Panel

### Manajemen Karyawan
- Tambah, edit, hapus karyawan
- Unggah data karyawan massal (bulk upload)
- Reset password karyawan
- Nonaktifkan atau suspend akun karyawan

### Monitoring dan Pelaporan
- Dashboard real-time untuk monitoring kehadiran
- Filter data berdasarkan departemen, tanggal, status kehadiran
- Ekspor laporan ke Excel
- Grafik dan statistik kehadiran

### Pengaturan Sistem
- Konfigurasi jam kerja
- Pengaturan toleransi keterlambatan
- Pengelolaan departemen dan jabatan
- Pengaturan hari libur

## Fitur Khusus Mobile App (Karyawan)

### Absensi
- Clock in dengan lokasi GPS
- Clock out dengan lokasi GPS dan kalkulasi jam kerja
- Tampilkan status kehadiran hari ini

### Profil dan Riwayat
- Lihat informasi profil
- Riwayat absensi pribadi
- Total jam kerja
- Status kehadiran (tepat waktu, terlambat, absen)

### Keamanan
- Ganti password hanya untuk admin panel
- Info perangkat yang digunakan
- Deteksi login tidak wajar

## Ketentuan Password dan Keamanan

### Untuk Admin
- Password minimum 8 karakter
- Harus mengandung kombinasi huruf besar, huruf kecil, angka, dan simbol


### Untuk Karyawan
- Password minimum 6 karakter
- Harus mengandung kombinasi huruf dan angka
