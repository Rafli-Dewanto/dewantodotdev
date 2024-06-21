---
title: Tanstack Query Data fetching & Mutation in Next.js
excerpt: Data fetching yang tepat dan state management sangat penting untuk membangun aplikasi dalam pengembangan web.
publishDate: 'Jun 08 2024'
tags:
  - Next.js
seo:
  image:
    src: 'https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ebd2aa3n8a9wkjkei55.png'
    alt: tanstack query
isFeatured: true
---

Data fetching yang tepat dan state management sangat penting untuk membangun aplikasi dalam pengembangan web. TanStack Query (sebelumnya React Query), adalah library yang menyederhanakan data fetching, caching, sinkronisasi data, dan lebih banyak lagi.

Dalam postingan blog ini, kita akan menjelajahi cara mengintegrasikan dan menggunakan TanStack Query dalam proyek Next.js, mencakup konsep dasar dan contoh praktis untuk membantu Anda memulai.

## Benefit of TanStack Query in Next.js

TanStack Query memberikan beberapa kemudahan yang menjadikannya pilihan yang oke untuk manajemen data pada aplikasi React:

- **Declarative Data Fetching**: Tentukan dependensi data Anda secara deklaratif dan biarkan TanStack Query menangani sisanya.
- **Automatic Caching**: Data di-cache secara default, sehingga mengurangi request yang tidak perlu.
- **Background Updates**: Menjaga agar data tetap update dengan re-fetch secara otomatis di background.
- **Optimistic Update**: Meningkatkan pengalaman pengguna dengan memperbarui UI sebelum mendapat responsee dari server.
- **Error Handling**: Menyederhanakan error handling dengan built-in support untuk retry query dan fallback.

Ketika dikombinasikan dengan Next.js, fitur-fitur ini ditingkatkan dengan kemampuan rendering sisi server Next.js, yang menghasilkan pemuatan awal yang lebih cepat dan SEO yang lebih baik.

Namun dengan rilisnya React Server Component, ada kemungkinan TanStack Query akan menjadi tidak lagi digunakan. React Server Component adalah fitur baru dari React 18 yang memungkinkan kita untuk melakukan data fetching langsung di dalam component react

```jsx
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

ditambah juga dengan hadirnya server action kita juga bisa melakukan data mutation di server tanpa harus menggunakan client action.
```jsx
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Action
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Jadi jika kalian memang menggunakan framework react seperti Next.js atau Remix, kita bisa melakukan data fetching dan mutation tanpa menggunakan tanstack query. 

![tanstack-maintainer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/abhyb38qhubwo06y6htd.png)

Namun bukan berarti tanstack query menjadi usang dan tidak bisa digunakan, karena mungkin ada beberapa case yang dimana kita tetap membutuhkan fitur-fitur yang tersedia di tanstack query yang masih belum fully supported di react server component ataupun jika kalian memegang legacy codebase yang memang belum support react server component. Jika kalian ingin membaca lebih lanjut soal React Server Component, kalian bisa membaca di [sini](https://react.dev/reference/react-server-components).

Oke sudah cukup basa-basinya, sekarang kita akan membahas bagaimana cara mengintegrasikan TanStack Query dalam proyek Next.js.

## Setting up The Project

### Langkah 1: Membuat Project Next.js Baru

Pertama, kita perlu menginstal Next.js. Jika kalian belum menginstalnya, kalian bisa menggunakan npx create-next-app untuk membuatnya:

```bash
npx create-next-app my-tanstack-query-app
cd my-tanstack-query-app
```

### Langkah 2: Menginstal TanStack Query

Selanjutnya, instal TanStack Query dan dependensinya:

```bash
npm install @tanstack/react-query
```

### Langkah 3: Mengatur Query Client

Buat query client dan berikan ke aplikasi kalian. Kalian bisa melakukan ini di file `pages/_app.js`:

```javascript
// pages/_app.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '../styles/globals.css'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
```

atau pada App router
```tsx
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Langkah 4: Membuat Hook untuk Mengambil Data

Buat hook kustom untuk mengambil data menggunakan TanStack Query. Misalnya, kita akan mengambil daftar posting dari API placeholder:

```javascript
// hooks/usePosts.js
import { useQuery } from '@tanstack/react-query'

const fetchPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const usePosts = () => {
  return useQuery(['posts'], fetchPosts)
}
```

### Langkah 5: Menggunakan Hook di Komponen

Sekarang, kalian bisa menggunakan hook kustom ini di komponen Next.js kalian. Mari kita buat komponen `Posts` untuk menampilkan daftar posting:

```javascript
// components/Posts.js
import { usePosts } from '../hooks/usePosts'

const Posts = () => {
  const { data, error, isLoading } = usePosts()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>An error occurred: {error.message}</p>

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default Posts
```

### Langkah 6: Menambahkan Komponen ke Halaman

Terakhir, sertakan komponen `Posts` di salah satu halaman Next.js kalian:

```javascript
// pages/index.js
import Posts from '../components/Posts'

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Blog</h1>
      <Posts />
    </div>
  )
}
```

## Penggunaan Lanjutan

### Server-Side Rendering

TanStack Query bekerja dengan baik dengan server-side rendering Next.js. Untuk mengambil data di sisi server, gunakan fungsi `getServerSideProps`:

```javascript
// pages/index.js
import { dehydrate, QueryClient } from '@tanstack/react-query'
import Posts from '../components/Posts'
import { fetchPosts } from '../hooks/usePosts'

export async function getServerSideProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['posts'], fetchPosts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Blog</h1>
      <Posts />
    </div>
  )
}
```

### Infinite Queries

TanStack Query juga mendukung infinite scrolling. Berikut adalah contoh cepatnya:

```javascript
// hooks/useInfinitePosts.js
import { useInfiniteQuery } from '@tanstack/react-query'

const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const useInfinitePosts = () => {
  return useInfiniteQuery(['posts'], fetchPosts, {
    getNextPageParam: (lastPage, pages) => pages.length + 1,
  })
}
```

Di dalam komponen kalian:

```javascript
// components/InfinitePosts.js
import { useInfinitePosts } from '../hooks/useInfinitePosts'

const InfinitePosts = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfinitePosts()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>An error occurred: {error.message}</p>

  return (
    <div>
      <h1>Infinite Posts</h1>
      <ul>
        {data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}
      >
        {isFetching ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more posts'}
      </button>
    </div>
  )
}

export default InfinitePosts
```

## Kesimpulan

Mengintegrasikan TanStack Query dengan Next.js dapat secara signifikan meningkatkan kemampuan manajemen data aplikasi kalian. Dengan menyediakan pengambilan data deklaratif, caching otomatis, pembaruan latar belakang, dan lainnya, TanStack Query membantu kalian membangun aplikasi yang kinerja dan ketahanannya tinggi. Baik kalian sedang membangun blog sederhana atau aplikasi data-driven yang kompleks, menggabungkan dua alat yang kuat ini akan merampingkan proses pengembangan dan meningkatkan pengalaman pengguna kalian.

Happy coding!

Sources:
- https://tkdodo.eu/blog/you-might-not-need-react-query
- https://react.dev/reference/react-server-components