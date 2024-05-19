---
title: 'Cara Set Up Path Alias TypeScript Di React + Vite Project'
excerpt: path alias adalah cara lain untuk mengimport file tanpa mengharuskan kita menggunakan relative path, dan mungkin jika kalian sudah menggunakan meta-framework seperti nextjs atau remix kalian sudah familiar dengan path alias. Disini saya akan memberi tahu cara set up path alias pada react jika kalian menggunakan vite sebagai build toolsnya.
publishDate: 'Jun 20 2023'
tags:
  - React.js
  - TypeScript
  - Vite
seo:
  image:
    src: '/post-1.jpg'
    alt: A person standing at the window
---
> Apa itu path alias?

path alias adalah cara lain untuk mengimport file tanpa mengharuskan kita menggunakan relative path, dan mungkin jika kalian sudah menggunakan meta-framework seperti [nextjs](https://nextjs.org/) atau [remix](http://remix.run/) kalian sudah familiar dengan path alias. Disini saya akan memberi tahu cara set up path alias pada react jika kalian menggunakan vite sebagai build toolsnya.

> Contoh

```js
import IProduct from "../utils/types/product";
```

Pada contoh di atas saya mengimport utility types dari src/utils/types.

mungkin untuk contoh di atas terlalu simple, tetapi bagaimana jika kita berada di dalam directory yang sangat dalam dan harus mengimport file yang berada di root project kita, misal

```js
// daripada harus menggunakan relative path yang panjang  
import { someFunction } from "../../../src/module";  
  
// kita bisa memanfaatkan path alias seperti ini  
import { someFunction } from "@/module";
```

Dengan menggunakan path alias kita jadi lebih mudah dalam mengimport sebuah file dengan simbol “@”, lalu bagaimana cara set upnya?

pertama buat file dengan nama _tsconfig.paths.json_ pada  root directory  dan paste code berikut:

```json
{  
    "compilerOptions": {  
        "baseUrl": ".",  
        "paths": {  
            "@/\*": \["./src/\*"\]  
        }  
    }  
}
```

Lalu tambahkan file ini ke file _tsconfig.json_ dengan extends file _tsconfig.paths.json_

```json
{  
    "compilerOptions": {  
       // konfigurasi ts  
    },  
    "include": "src/\*\*/\*"\],  
    "exclude": \["node\_modules", "build"\],  
    "extends": "./tsconfig.paths.json"  
}
```

baseUrl adalah opsi kompiler yang berfungsi sebagai direktori utama untuk resolve import path modul non-relatif yang digunakan bersama dengan opsi path compiler option untuk menentukan path alias untuk project kita.

opsi “paths” ini akan kita gunakan untuk mendefinisikan path alias yang akan kita gunakan, disini saya meng-aliaskan “@/” untuk merujuk ke directory “./src/\*”

> simbol “\*” disini adalah wildcard untuk semua file dan directory yang ada pada directory src

Terakhir kita perlu memberi tahu vite untuk resolve path aliasnya

```ts
import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  
import path from 'path';  
  
// https://vitejs.dev/config/  
export default defineConfig({  
  plugins: \[react()\],  
  resolve: {  
    alias: {  
      "@": path.resolve(\_\_dirname, "./src"),  
    },  
  },  
});
```

Sekarang, ketika kita menggunakan alias “@” dalam import statement.

```ts
import IProduct from "@/utils/types/product";
```
