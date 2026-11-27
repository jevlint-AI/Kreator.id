# Kreator.id: website statis (siap Vercel)

## Ganti gambar produk
Taruh file di `assets/products/` dengan nama persis seperti ini (format .webp, .png, .jpg, .jpeg, atau .avif):
- brosur, kartu-vocer, nota, packaging, mug-thumbler, kaos, topi, totebag, stiker, kalender

Contoh: `assets/products/brosur.webp`. Sebelum file ada, tampil placeholder otomatis.
Rasio ideal 1:1 (mis. 800x800), latar transparan atau putih, sudut kamera dan pencahayaan konsisten.
Foto testimoni (opsional): `assets/avatars/budi|siti|andi|rina.webp`.
Produk baru / harga / tautan: edit array `products` di bagian atas `app.js`.

## Deploy ke Vercel
1. Buat repo GitHub `kreator-id-website`, upload semua isi folder ini, push ke `main`.
2. Vercel > Add New > Project > Import repo.
3. Framework Preset: Other. Build Command dan Install Command: kosongkan. Output Directory: ./
4. Deploy.

## Sebelum live
- Harga di `app.js` masih contoh. Ganti dengan harga resmi.
- Tautan `/produk/...` dan `/login` belum ada halamannya. Buat dulu atau ubah `href`.
- Ganti logo di `assets/logo-kreator.svg` dan `logo-kreator-light.svg` (versi footer) dengan file final.

- Kontak (WA, email, tautan Maps) ada di bagian "kontak" `app.js`. Tautan Maps masih pencarian "Kreator Corporation"; ganti dengan link share Google Maps resmi.
- Teks dua bahasa: kamus ID/EN ada di `DICT` (`app.js`); nama produk dan testimoni berbentuk `["Indonesia", "English"]`.
