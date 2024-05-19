---
title: 'Rendering Patterns Next.js App Router'
publishedAt: 2024-03-02
excerpt: "Rendering pattern adalah pola atau metode yang digunakan untuk merender halaman web dan konten di dalamnya. Dalam konteks Next.js, rendering pattern mengacu pada cara aplikasi menghasilkan dan menyajikan konten kepada pengguna."
publishDate: 'Feb 02 2024'
tags:
  - Next.js
seo:
  image:
    src: ''
    alt: ""
isFeatured: true
---

Dengan dirilisnya Next.js app router, terjadi update yang cukup signifikan pada Next.js dalam menangani routing dan rendering walaupun sebenarnya patternnya masih sama, tetapi ada perbedaan cara kita as developer melakukan teknik rendering. Sebelum kita masuk ke topik pembahasan, mari kita bahas apa itu rendering pattern, khususnya pattern yang tersedia pada Next.js app router.

### Apa itu Rendering Pattern?

Rendering pattern adalah pola atau metode yang digunakan untuk merender halaman web dan konten di dalamnya. Dalam konteks Next.js, rendering pattern mengacu pada cara aplikasi menghasilkan dan menyajikan konten kepada pengguna.

Simplenya rendering pattern adalah bagaimana proses data dan kode kita berubah menjadi sebuah halaman HTML yang bisa kita lihat pada browser. Proses ini bisa dilakukan di server, client / web browser, maupun keduanya, dan bisa dilakukan secara bersamaan maupun secara parsial.

Sebenarnya terdapat banyak rendering pattern selain yang saya akan bahas pada blog ini, namun yang akan saya bahas khususnya di Next.js sendiri diantaranya, Static Site Generation (SSG), Incremental Static Regeneration (ISR), Client-Side Rendering (CSR), dan Server-Side Rendering (SSR). Mari kita bahas satu per-satu.

### Static Site Generation (SSG)
Next.js, by default akan membuat halaman kita dirender secara static pada saat build time. Kemudian, server akan merender setiap halaman dan menyimpannya sebagai file HTML yang sudah jadi. Nantinya, file-file ini akan dikirim kepada client ketika ada request ke server, sehingga tidak perlu melakukan pemrosesan di sisi server untuk setiap permintaan. 

Rendering pattern ini sangat menguntungkan jika content web tidak sering berubah dan tidak memerlukan interaktivitas. Hal ini akan meningkatkan load time yang cepat, meningkatkan SEO, dan mengurangi beban server. Untuk contohnya bisa kita lihat pada kode di bawah ini.

```tsx
// app/page.tsx

export default function Home() {
  const num = Math.floor(Math.random() * 1000);
  return (
    <main>
      num: {num}
    </main>
  );
}

```

Jika kita perhatikan, mungkin kita akan berpikir bahwa Next.js akan render angka yang berbeda setiap kita refresh halaman. Namun seperti yang sudah saya jelaskan sebelumnya, yang mana Next.js by default akan render page secara static, maka pada saat build time Next.js hanya akan menjalankan fungsi `Math` sekali saja dan angka tersebut tidak akan berubah. 

> Tapi ini waktu saya coba kodingannya dan direfresh, angkanya tetap berubah kok!.

Iya, karena kalian menjalankan kodenya di development, namun ketika kalian sudah build Next.js project kalian dan menjalankannya di production, ketika kalian coba refresh halaman tersebut angkanya akan tetap sama.

`development`
![ss-dev](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lymm13t9bmfnq8u2bgsp.gif)

`production`
![ssg-prod](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/naclbnph2hdajt57bpmh.gif)

Jika kita menjalankan command `npm run build` mungkin kalian akan notice dengan 2 symbol yang berbeda, seperti gambar di bawah ini,

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0s0sul2lkjsjqxtdinmk.JPG)

simbol `lingkaran` menggambarkan bahwa halaman atau routes kita akan dirender secara static, sedangkan symbol `lambda` akan merender halaman kita secara dynamic. Lalu bagaimana cara melakukan dynamic rendering?

### Server-Side Rendering (SSR)
Server-Side rendering melibatkan proses rendering pada sisi server sebelum mengirim halaman tersebut ke browser. Ketika user mengirim request ke browser, server akan mengexecute kode javascript dan mengambil data yang diperlukan lalu akan digenerate file HTML secara dynamic, lalu file ini akan dikirim ke client yang mana akan mengurangi beban pada client, tidak seperti rendering pattern single-page application yang mana user harus mendownload bundle JavaScript yang cukup besar, serta memudahkan search engine untuk meng-index dan crawl web page kita, sehingga dapat meningkatkan SEO pada web kita.

Untuk melakukan server-side rendering di Next.js kita bisa mengatur route segment di file, page.tsx, layout.tsx, ataupun route.ts jika kalian menggunakan routes handler Next.js, ataupun menggunakan fungsi `import { unstable_noStore as noStore } from 'next/cache';` untuk *opt-out* dari static rendering.

Contoh

```tsx
// app/page.tsx

export const dynamic = "force-dynamic"

export default function Home() {
  const num = Math.floor(Math.random() * 1000);
  return (
    <main>
      SSR : num = {num}
    </main>
  );
}
```

```tsx
// app/page.tsx
import { unstable_noStore as noStore } from 'next/cache';

export default function Home() {
  noStore()
  const num = Math.floor(Math.random() * 1000);
  return (
    <main>
      SSR : num = {num}
    </main>
  );
}
```

SSR (dev && prod)
![ssr](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icthts06skrhc5nv2ueh.gif)

Jika kita menggunakan route segment ataupun fungsi noStore, Next.js akan merender halaman kita secara dynamic. Lalu bagaimana kita menentukan harus menggunakan route segment daripada fungsi noStore, bisa dilihat pada dokumentasi official Next.js di bawah.

![noStore](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nwkbvdkgosr4k7bonk7u.png)

Jadi untuk penggunaannya bisa disesuaikan ketika kita ingin seluruh halaman untuk menjadi dynamic kita bisa menggunakan route segment, namun untuk component tertentu saja kita lebih baik menggunakan fungsi `noStore`.

Sekarang kita sudah tau cara melakukan Server-Side rendering dan juga Static rendering, namun bagaimana cara kita melakukan Static rendering dan ingin mengupdate data secara berkala?

### Incremental Static Regeneration (ISR)
Incremental Static Regeneration (ISR) adalah versi *enhancement* dari SSG, yang memungkinkan halaman yang sudah dipre-render untuk diperbarui secara berkala di background saat halaman tersebut direquest, memastikan bahwa konten tetap update sambil tetap memanfaatkan keuntungan kinerja dari SSG. Dengan ISR, halaman dapat divalidasi ulang dan diperbarui tanpa memerlukan re-build secara keseluruhan, menjadikannya ideal untuk situs web dengan konten atau data yang sering berubah.

Ada dua metode untuk revalidate data:

1. Revalidate berbasis waktu: Metode ini secara otomatis memverifikasi data setelah periode waktu yang telah ditentukan. Metode ini bekerja dengan baik untuk data yang kebaruannya tidak terlalu penting dan hanya berubah sesekali.

2. Revalidate sesuai request: Berdasarkan suatu peristiwa (seperti form request), data divalidasi secara manual. Kelompok data dapat divalidasi secara bersamaan dengan validasi ulang sesuai permintaan menggunakan metodologi berbasis jalur atau berbasis tag. Misalnya, ketika materi dari CMS tanpa kepala diubah, dan Anda ingin memastikan data terbaru ditampilkan secepat mungkin, hal ini bisa sangat membantu.

#### Revalidate berbasis waktu
Untuk melakukan revalidasi berdasarkan waktu kita memiliki 2 opsi, yaitu:

menggunakan opsi next revalidate pada `fetch` web API yang sudah di "extends" oleh Next.js.

> fetch('https://...', { next: { revalidate: 3600 } })

route segment `revalidate`

> export const revalidate = 3600

```tsx
// app/page.tsx
export const revalidate = 5; // revalidate setelah 5 detik

export default function Home() {
  const num = Math.floor(Math.random() * 1000);
  return (
    <main>
      ISR : num = {num}
    </main>
  );
}
```

![ISR](https://cdn-images-1.medium.com/v2/resize:fit:1600/1*Iji_RRiVHdLVBY4Syg9uPg.gif)

#### Revalidate sesuai request
Pada Next.js, ada fungsi  `revalidatePath` dan `revalidateTag` yang memungkinkan pengguna untuk membersihkan data cache secara langsung berdasarkan permintaan untuk path atau tag cache tertentu.

RevalidatePath memungkinkan pengguna untuk membersihkan data cache berdasarkan permintaan untuk path spesifik. Misalnya, jika terdapat halaman atau layout yang perlu diperbarui secara khusus, pengguna dapat menggunakan revalidatePath untuk melakukan proses tersebut.

Sementara itu, revalidateTag memungkinkan pengguna untuk membersihkan data cache berdasarkan permintaan untuk tag cache tertentu. Fitur ini sangat berguna ketika terdapat banyak entri cache yang terkait dengan tag tertentu dan pengguna ingin membersihkannya secara bersamaan.

Untuk lebih lengkapnya kalian bisa membaca [dokumentasi](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation) dari Next.js

### Client-Side Rendering (CSR)
Client-Side Rendering melibatkan merender halaman web di browser menggunakan JavaScript. Ketika pengguna mengunjungi sebuah halaman, server mengirimkan dokumen HTML minimal bersama dengan kode JavaScript yang mana akan sangat terasa berat karena user harus mendownload bundle JavaScript yang begitu besar. 

Browser kemudian mengeksekusi kode JavaScript tersebut, yang mengambil data dari API dan merender konten secara dinamis di sisi klien. CSR menawarkan pengalaman pengguna yang sangat interaktif namun dapat mengakibatkan load time halaman yang lebih lambat dan mungkin memiliki dampak pada SEO. 

CSR merupakan rendering pattern yang digunakan library react biasa seperti CRA. Jadi ketika kita ingin menggunakan react hooks, membutuhkan interaktivitas langsung dari user, menggunakan react context, kita perlu membuat halaman yang kita buat menjadi client component dengan cara mendeklarasikan *directive* "use client" di atas file kita.

```tsx
"use client" // gunakan directive agar Next.js membuat file ini menjadi client component

import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.example.com/data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Data from API:</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

Masing-masing rendering pattern memiliki kelebihan dan kelemahan tersendiri, dan pilihan tergantung pada kebutuhan spesifik dari project yang sedang dikerjakan. SSG dan SSR cocok untuk aplikasi yang memerlukan kecepatan muat yang tinggi dan SEO yang baik, sementara CSR memberikan pengalaman pengguna yang sangat interaktif namun dapat mengakibatkan load time halaman yang lebih lambat.

Dengan pemahaman yang mendalam tentang berbagai rendering pattern ini, developer dapat memilih pendekatan yang paling sesuai dengan kebutuhan project mereka, serta mengoptimalkan kinerja dan pengalaman pengguna dari aplikasi web yang kita bangun.

Referensi:
- https://nextjs.org/docs
- https://www.youtube.com/watch?v=Dkx5ydvtpCA