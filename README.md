# ⚙️ Backend EDRMS Enterprise

Repositori ini berisi kode sumber sisi peladen (server-side) untuk aplikasi **Electronic Document and Records Management System (EDRMS)**. Sistem ini dirancang khusus untuk memenuhi standar pengelolaan arsip dinamis, mulai dari tahap penciptaan (_capturing_), penggunaan, hingga pemberkasan dan retensi.

---

## 🚀 Informasi Infrastruktur & Tautan Utama

Berikut adalah akses poin utama untuk lingkungan produksi:

| Komponen                        | Tautan / Detail                                                                                                                    |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Server Production**           | [https://crack-be-raafiteam2madrid-production.up.railway.app](https://crack-be-raafiteam2madrid-production.up.railway.app)         |
| **API Documentation (Swagger)** | [https://crack-be-raafiteam2madrid-production.up.railway.app/api](https://crack-be-raafiteam2madrid-production.up.railway.app/api) |
| **Database Dashboard**          | [Supabase Console](https://zqlcypouzpsoprdhhbtp.supabase.co)                                                                       |
| **Deployment Platform**         | Railway                                                                                                                            |

---

## 🏗️ Arsitektur Teknologi (Tech Stack)

Sistem ini dibangun dengan teknologi modern untuk menjamin performa dan skalabilitas:

- **Framework:** NestJS (Node.js framework)
- **Bahasa:** TypeScript
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** Prisma / TypeORM
- **Keamanan:** JWT (JSON Web Token) & Bcrypt Password Hashing
- **Penyimpanan File:** Cloudinary (Cloud Storage) & Local Static Server

---

## 📊 Entity Relationship Diagram (ERD)

Struktur data ini dirancang untuk mendukung tata kelola arsip yang baik, termasuk pencatatan metadata dan jadwal retensi otomatis.

```mermaid
erDiagram
    USER ||--o{ ARCHIVE : "mengelola"
    USER {
        uuid id PK
        string email
        string password
        string role "ADMIN | ARSIPARIS | STAFF"
    }

    ARCHIVE ||--|| RETENTION : "memiliki"
    ARCHIVE {
        uuid id PK
        string judul_arsip
        string nomor_arsip
        string deskripsi
        string file_url
        datetime uploaded_at
        uuid created_by FK
    }

    RETENTION {
        uuid id PK
        date tanggal_retensi
        string status "AKTIF | INAKTIF | MUSNAH"
        uuid archive_id FK
    }

    USER ||--o{ AUDIT_LOG : "mencatat_aktivitas"
    AUDIT_LOG {
        uuid id PK
        string aksi
        datetime timestamp
        uuid user_id FK
    }


    ✨ Fitur Utama
Otorisasi Berbasis Peran: Login aman untuk Admin, Arsiparis, dan Staff menggunakan JWT.

Capturing & Metadata: Pengunggahan arsip PDF disertai penginputan metadata standar kearsipan.

Temu Kembali Arsip: Fitur pencarian cepat dokumen berdasarkan judul atau nomor arsip.

Manajemen Retensi: Pemantauan masa aktif arsip secara otomatis berdasarkan Jadwal Retensi Arsip (JRA).

Interaktif Swagger: Dokumentasi API yang dapat langsung diuji coba oleh pengembang.


👨‍💻 Kontributor
Aditya Raafi Yudhatama Manajemen Rekod dan Arsip Program Pendidikan Vokasi, Universitas Indonesia

© 2026 EDRMS Vokasi UI - All Rights Reserved.
```
