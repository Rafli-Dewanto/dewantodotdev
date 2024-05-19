---
title: Hydration Error di Next.js & Cara Mengatasinya
excerpt: Dalam dunia web development, rendering pattern/architecture adalah salah satu hal yang harus kita pahami sebagai software engineer.
publishDate: 'Jan 15 2024'
tags:
  - Next.js
seo:
  image:
    src: '/post-1.jpg'
    alt: A person standing at the window
isFeatured: true
---

Dalam dunia web development, rendering pattern/architecture adalah salah satu hal yang harus kita pahami sebagai software engineer. Next.js, adalah salah satu react framework yang mendukung beberapa rendering pattern, salah satunya adalah Server-Side Rendering. 

Namun ketika menggunakan rendering pattern yang satu ini, terkadang kita mendapati _unexpected behaviour_ seperti layout yang berantakan ataupun konten yang tidak sesuai, hal ini disebut dengan hydration error. 

Lalu bagaimana hal ini bisa terjadi? Sebelum masuk ke pembahasan kita perlu memahami terlebih dahulu bagaimana Server-Side Rendering bekerja.

![Diagram](https://app.eraser.io/workspace/TGhcfWieYeDlGHVyxV83/preview?elements=NV8Da92XOok-8w3jsZHp2A&type=embed)

**Penjelasan:**

**1. User request:** pengguna mengirim permintaan ke server.

**2. Server merender halaman:** Server menerima request dan merender halaman React menggunakan JavaScript di sisi server.

**3. Mengirimkan HTML:** Server mengirimkan HTML yang telah dirender ke browser klien.

**4. Browser memuat halaman:** Browser memuat HTML dan mulai menjalankan JavaScript.

**5. React berjalan:** React mulai berjalan di sisi klien.

**6. React merender ulang:** React merender ulang halaman untuk membuat virtual DOM.

**7. React membandingkan HTML:** React membandingkan virtual DOM dengan DOM di sisi browser.

**8. Hydration Success:** Jika kedua DOM cocok, hydration berhasil dan halaman siap untuk interaksi pengguna.

**9. Hydration Error:** Jika terdapat ketidakcocokan, React menghasilkan hydration error, menunjukkan kemungkinan masalah dalam proses rendering.

Bayangkan Anda sedang memesan pembangunan rumah:

**1. Blueprint (Rendering Sisi Server):**

- Arsitek membuat blueprint (HTML) terperinci di kantornya, mewakili struktur dan tata letak rumah.
- Blueprint ini dikirim ke tim konstruksi (browser).

**2. Konstruksi Dimulai (Client-side hydration):**

- Tim konstruksi mulai membangun rumah berdasarkan blueprint, meletakkan pondasi, memasang dinding rangka,dan menambahkan perlengkapan.
- Proses ini mencerminkan browser yang merender HTML menjadi halaman visual.

**3. Hydration Error (Material Bangunan Tidak Sesuai):**

- Tiba-tiba, tim menyadari mereka telah menerima beberapa bahan bangunan yang salah yang tidak sesuai dengan spesifikasi blueprint.
- Mungkin jendelanya ukurannya salah, atau ubin atap tidak sejajar dengan kusen.
- Ketidakkonsistenan ini mewakili hydration error dalam pengembangan web.

**4. Konsekuensi Error:**

- Jika tim terus membangun dengan bahan yang tidak sesuai, struktur rumah akan berantakan.
- Pintu mungkin tidak menutup dengan benar, jendela mungkin bocor, dan integritas keseluruhan rumah bisa terganggu.
- Demikian pula, kesalahan hidrasi dalam SSR dapat menyebabkan gangguan visual, fungsi yang rusak, atau bahkan kerusakan halaman web secara keseluruhan.

**5. Mengatasi Kesalahan (Memperbaiki Material dan Membangun Ulang):**

Untuk memperbaiki masalah, tim perlu:
  - Mendapatkan bahan yang tepat yang sesuai dengan blueprint.
  - Membongkar dan membangun kembali bagian rumah yang terkena dampak dengan hati-hati.
    
    
Dalam pengembangan web, ini melibatkan:
  - Mengidentifikasi akar penyebab ketidakcocokan hidrasi.
  - Menyesuaikan HTML di server atau JavaScript di klien untuk memastikan konsistensi.

**6. Pencegahan (Komunikasi Jelas dan Pemeriksaan Kualitas):**

Untuk mencegah kesalahan seperti itu di masa depan, arsitek dan tim konstruksi harus:
  - Berkomunikasi dengan jelas dan menyeluruh tentang blueprint dan material.
  - Menerapkan pemeriksaan kualitas untuk menangkap ketidakkonsistenan sejak dini.
    
Dalam pengembangan web, ini diterjemahkan menjadi:
  - Pengujian dan debugging menyeluruh untuk mengidentifikasi potensi masalah hidrasi.
  - Menggunakan praktik terbaik untuk SSR dan hidrasi untuk meminimalkan risiko.

Jadi hydration mengacu pada proses meng-"attach" interaktivitas dan fungsionalitas seperti *event listener* ke konten HTML statis. Dalam konteks Next.js, hydration melibatkan pengambilan halaman HTML yang dirender oleh server dan meningkatkannya dengan interaktivitas di sisi klien.

Hydration error terjadi ketika ada perbedaan antara HTML yang dihasilkan pada server dan HTML yang dihasilkan pada sisi klien (client-side) setelah aplikasi dihydrate. Hydration merupakan proses di mana React mencoba mengaitkan dan mengaktifkan kembali event listeners, state, dan properti lainnya ke elemen HTML yang telah dirender oleh server.

Mungkin kalian bertanya, jika react melakukan re-render component tree dengan virtual dom dengan menggunakan konten html dari server sebagai starting point, lalu bagaimana bisa ada perbedaan konten antara server dan client?

Meskipun React menggunakan HTML yang di-render oleh server sebagai titik awal, beberapa faktor dapat menyebabkan perbedaan yang menyebabkan kesalahan hidrasi:

**1. Asynchronous data fetching**

Jika data diambil secara asinkron di sisi klien (misalnya, setelah HTML yang di-render server dikirim), virtual DOM mungkin berisi konten yang berbeda dengan HTML yang di-render server.
 
Contoh: Sebuah komponen merender daftar item yang diambil dari API. HTML yang dirender di server mungkin menampilkan daftar kosong, tetapi pengambilan di sisi klien mengisi daftar tersebut, sehingga menyebabkan ketidaksesuaian.

**2. Konten dan State Dinamis**

Komponen yang bergantung pada interaksi pengguna, API peramban, atau faktor dinamis lainnya dapat menyebabkan ketidaksesuaian.

Contoh: Komponen dengan pengatur waktu atau komponen yang menggunakan `window.innerWidth` untuk merender konten secara conditional mungkin berbeda antara server dan klien.

**3. Third-Party library**

Beberapa library mungkin menyuntikkan konten atau memodifikasi DOM dengan cara yang tidak direplikasi di server.

Contoh: Library yang menambahkan tombol share social media mungkin menyisipkannya setelah hidrasi, sehingga menyebabkan ketidaksesuaian.

**4. Ketidakkonsistenan Rendering**

Bug pada kode React atau ketidakkonsistenan dalam logika rendering dapat menyebabkan perbedaan pada HTML yang dihasilkan.

Contoh: Sebuah komponen yang merender konten secara kondisional berdasarkan props dapat berperilaku berbeda pada server dan klien karena logika yang salah.

**5. Environment Server dan Klien yang Tidak Sesuai**

Perbedaan environtment Node.js dan browser (misalnya, variabel global, API) dapat menyebabkan ketidakkonsistenan.

> Contoh: Menggunakan `window.localStorage` di server mungkin tidak berfungsi seperti yang diharapkan, sehingga menyebabkan perbedaan rendering.

Untuk memudahkan kita dalam menemukan ketidakcocokan konten kita bisa menggunakan library dari [builder.io](https://github.com/BuilderIO/hydration-overlay) yang akan memudahkan kita dalam menemuka perbedaan konten dari server dan client.

Pertama kita perlu menginstall dulu librarynya
```bash
npm install @builder.io/react-hydration-overlay
```

Lalu kita membungkus aplikasi kita dengan component dari `react-hydration-overlay`
```tsx
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";

const App = () => {
  return (
    <HydrationOverlay>
      <YourApp />
    </HydrationOverlay>
  );
};
```

Terakhir kita juga perlu menambahkan beberapa konfigurasi ke next config
```js
const {
  withHydrationOverlay,
} = require("@builder.io/react-hydration-overlay/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** your config here */
};

module.exports = withHydrationOverlay({
  /**
   * Optional: `appRootSelector` is the selector for the root element of your app. By default, it is `#__next` which works
   * for Next.js apps with pages directory. If you are using the app directory, you should change this to `main`.
   */
  appRootSelector: "main",
})(nextConfig);
```

<video autoplay="autoplay" muted="muted" loop="" class="builder-video css-cz4v3a" playsinline="playsinline"><source type="video/mp4" src="https://cdn.builder.io/o/assets%2FYJIGb4i01jvw0SRdL5Bt%2F96ffc085bdd14ac382b787292f99c8a9%2Fcompressed?apiKey=YJIGb4i01jvw0SRdL5Bt&amp;token=96ffc085bdd14ac382b787292f99c8a9&amp;alt=media&amp;optimized=true"></video>

Mengatasi hydration error di Next.js sangat penting untuk memastikan pengalaman pengguna yang mulus dan optimal. Dengan memahami kesalahan umum dan menerapkan best practice, kita dapat mencegah kesalahan hidrasi dan meningkatkan kinerja aplikasi mereka secara keseluruhan. 

Sources:
- https://www.jacobparis.com/content/remix-hydration-errors
- https://www.builder.io/blog/announcing-react-hydration-overlay
