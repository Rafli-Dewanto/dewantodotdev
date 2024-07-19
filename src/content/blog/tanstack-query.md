---
title: Tanstack Query Data fetching & Mutation in Next.js
excerpt: Data fetching yang tepat dan state management sangat penting untuk membangun aplikasi dalam pengembangan web.
publishDate: 'Jul 20 2024'
tags:
  - Next.js
  - Tanstack Query
seo:
  image:
    src: 'https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4k4rvdwwszpnqwjalv89.png'
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

async function Note({ id }) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({ id }) {
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

function EmptyNote() {
  async function createNoteAction() {
    // Server Action
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
```

Jadi jika kalian memang menggunakan framework react seperti Next.js atau Remix, kita bisa melakukan data fetching dan mutation tanpa menggunakan tanstack query.

![tanstack-maintainer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/abhyb38qhubwo06y6htd.png)

Namun bukan berarti tanstack query menjadi usang dan tidak bisa digunakan, karena mungkin ada beberapa case yang dimana kita tetap membutuhkan fitur-fitur yang tersedia di tanstack query yang masih belum fully supported di react server component ataupun jika kalian memegang legacy codebase yang memang belum support react server component. Jika kalian ingin membaca lebih lanjut soal React Server Component, kalian bisa membaca di [sini](https://react.dev/reference/rsc/server-components) atau Rendering patterns di blog saya sebelumnya di [sini](https://dewanto.dev/blog/next-rendering-patterns/).

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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
```

atau pada App router

```tsx
'use client';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
```

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/components/react-query';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
```

### Langkah 4: Membuat fungsi untuk Mengambil Data

Di sini saya membuat fungsi yang berkaitan dengan entity tertentu, yang mana pada kasus ini merupakan `post`. Pada file ini saya biasanya mendefinisikan hal-hal yang berkaitan dengan suatu `entity`, seperti baseURL-nya, type definition, dan lain-lain.

```tsx
// api/posts.ts
import axios from 'axios';

const baseURL = 'https://jsonplaceholder.typicode.com/';

const instance = axios.create({
  baseURL
});

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await instance.get(`/posts`);
    if (!response.data) {
      throw new Error('Product not found');
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Something went wrong');
  }
}
```

### Langkah 5: Membuat Custom Hook

Langkah selanjutnya kita bisa membuat custom hook untuk fungsi yang sudah kita definisikan sebelumnya.

```tsx
// components/Posts.js
import { getPosts } from '@/api/posts';
import { useMutation, useQuery } from '@tanstack/react-query';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });
}
```

### Langkah 6: Menambahkan Komponen ke Halaman

Terakhir kita bisa menggunakan custom hook tadi untuk melakukan data fetching pada component yang kita buat. React Query sendiri juga sudah menyediakan state `error` dan `loading` jadi kita tidak perlu membuat banyak _unnecessary_ state

```tsx
'use client';

import usePosts from '@/hooks/posts';

const Post = () => {
  const { data, isError, isLoading } = usePosts();

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="flex justify-center items-center">
          <p className="text-lg font-semibold text-blue-500">Loading...</p>
        </div>
      )}
      {isError && (
        <div className="flex justify-center items-center">
          <p className="text-lg font-semibold text-red-500">Error fetching data</p>
        </div>
      )}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
```

Maka, komponen Post kita sekarang sudah dapat mengambil data dari custom hook usePosts yang kita buat sebelumnya. Dengan memanfaatkan state isLoading, isError, dan data yang disediakan oleh React Query, kita dapat mengatur tampilan UI sesuai dengan kondisi data fetching tersebut. Jika data sedang diambil, kita akan menampilkan pesan "Loading..."; jika terjadi kesalahan, kita akan menampilkan pesan error; dan jika data sudah berhasil diambil, kita akan menampilkan daftar postingan dalam grid layout. Dengan pendekatan ini, kita dapat menghindari pembuatan state yang tidak diperlukan dan menjaga kode kita tetap bersih dan mudah dipahami.

![post-page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xz22s1k8l7gz8poou8qb.png)

Nah itu tadi adalah cara untuk menggunakan react query pada project next.js. Selanjutnya kita akan mengimplementasikan penggunaan `useMutation` react query pada next.js.

Pertama kita akan melakukan hal sama yaitu dengan mendefinisikan fungsi fetching API pada file `post.ts` yang sudah kita buat sebelumnya.

```tsx
// api/post.ts
export async function createPosts({ body, title }: { title: string; body: string }) {
  try {
    const response = await instance.post(`/posts`, {
      title: title,
      body: body,
      userId: Math.floor(Math.random() * 100) + 1
    });
    if (!response.data) {
      throw new Error('Failed to create post');
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Something went wrong');
  }
}
```

Selanjutnya kita buat juga custom hook untuk create post.

```tsx
// src/hooks/posts.ts
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPosts,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}
```
Dengan menggunakan useMutation, kita tidak perlu mengelola state untuk loading atau error secara manual karena React Query sudah menyediakan ini untuk kita. useMutation memungkinkan kita untuk mengatur state dan side effect yang terkait dengan operasi create, update, atau delete. Pada contoh ini, ketika form disubmit, kita menggunakan postMutation.mutate untuk mengirimkan data postingan baru ke server. Jika permintaan berhasil, kita akan menavigasi kembali ke halaman utama menggunakan router.replace('/').

Lalu kita bisa menggunakan fungsi ini pada component yang kita buat

```tsx
'use client';

import { useCreatePost } from '@/hooks/posts';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const postMutation = useCreatePost();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    postMutation.mutate(
      {
        body,
        title
      },
      {
        onSuccess: () => {
          router.replace('/');
        }
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
```
Di sini bisa kita lihat bahwa fungsi untuk create post berjalan dengan baik namun karena saya menggunakan dummy API datanya tidak masuk ke server dan hanya menampilkan response payload kita saja.

![create-post](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4k4rvdwwszpnqwjalv89.png)

Pendekatan ini membuat kode kita lebih bersih dan terorganisir, mengurangi boilerplate code yang sering ditemukan saat mengelola state secara manual. Selain itu, dengan onSuccess callback, kita bisa dengan mudah menentukan tindakan yang perlu dilakukan setelah mutasi berhasil, seperti navigasi ulang atau menampilkan pesan sukses.

## Kesimpulan

Mengintegrasikan _TanStack Query_ dengan _Next.js_ dapat secara signifikan meningkatkan kemampuan manajemen data aplikasi kalian. Dengan menyediakan pengambilan data deklaratif, caching otomatis, pembaruan latar belakang, dan lainnya, _TanStack Query_ membantu kalian membangun aplikasi yang kinerja dan ketahanannya tinggi. Namun, kembali lagi jika memang kalian menggunakan framework seperti _Next.js_ atau _Remix_, kemungkinan besar kalian tidak perlu _overengineer_ dan menggunakan library ini, tapi hal ini kembali lagi ke project yang dikerjakan serta requirements yang ada.

Happy coding!

Sources:

- https://tkdodo.eu/blog/you-might-not-need-react-query
- https://react.dev/reference/react-server-components
