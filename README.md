# Kalender Kegiatan KOIN - Kabinet Aswara Satya

Website kalender yang membaca data dari Google Sheets. Admin mengedit sheet, website otomatis menampilkan hasilnya.

## 1. Siapkan Google Sheets (sekali saja)
1. Unggah `Data_Kegiatan_KOIN.xlsx` ke Google Drive, buka dengan Google Sheets, lalu pilih **File > Simpan sebagai Google Sheets**.
2. Satu baris = satu kegiatan di satu tanggal (kegiatan beberapa hari = satu baris per tanggal). Wajib: Sumber, Tanggal, Nama kegiatan. Kolom lain boleh kosong dan tampil sebagai TBA.
3. Format tanggal yang paling aman: `2026-10-14`. Format `14/10/2026` dan `14 Okt 2026` juga terbaca.
4. Pindah kegiatan = ganti tanggalnya. Tambah kegiatan = tambah baris. Hapus baris = kegiatan hilang.
5. Atur siapa yang boleh mengedit lewat tombol **Bagikan** (admin = Editor). Itulah "login admin": akun Google.

## 2. Publikasikan datanya
1. **File > Bagikan > Publikasikan ke web**.
2. Pilih tab **DATA** dan format **Nilai yang dipisahkan koma (.csv)**, lalu **Publikasikan**.
3. Salin link yang muncul, lalu tempel ke `config.js` pada `sheetUrl`.

Perubahan di sheet muncul di website dalam beberapa menit (Google menyimpan cache sebentar). Tombol **Perbarui** memuat ulang data.

## 3. Deploy ke Vercel
Cara GitHub (disarankan, mudah dirawat):
1. Buat repository di GitHub, unggah seluruh isi folder ini.
2. Di vercel.com pilih **Add New > Project**, impor repository itu.
3. Framework Preset: **Other**. Build Command dan Output Directory dikosongkan. Klik **Deploy**.

Cara CLI: jalankan `npx vercel --prod` di dalam folder ini.

Setiap kali `config.js` diubah dan di-push, Vercel otomatis memperbarui website.

## 4. Domain
Di Vercel: **Settings > Domains**, tambahkan domain, lalu ikuti petunjuk DNS-nya.

## 5. Serah terima ke pengurus berikutnya
- Pindahkan kepemilikan Google Sheets ke akun komunitas (**Bagikan > ubah pemilik**).
- Gunakan akun GitHub dan Vercel milik komunitas, bukan akun pribadi.
- Catat di tempat aman: akun yang dipakai, link sheet, dan domain.

## Jika ada masalah
- Tertulis "Data contoh": `sheetUrl` di `config.js` masih kosong atau link salah.
- Ada peringatan baris dilewati: cek kolom Tanggal dan Nama kegiatan di baris itu.
- Sumber yang tidak dikenal tampil abu-abu. Nama yang dikenal: KPA, DIKYANMAS, KAMINFO, KADERISASI, HUBLU, DAURIS, KABINET.
- Menambah bidang baru atau mengubah warna: edit `SRC` di bagian atas `app.js`.
