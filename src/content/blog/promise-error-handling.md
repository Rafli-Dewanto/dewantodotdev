---
title: "Ways I Love to Handle Errors in JavaScript Promises"
excerpt: Handling error in JavaScript promises.
publishDate: 'Dec 03 2023'
tags:
  - JavaScript
seo:
  image:
    src: '/post-1.jpg'
    alt: A person standing at the window
isFeatured: true
---

Ketika memasuki dunia pemrograman, banyak dari kita terlalu fokus pada penulisan kode yang sempurna dan fungsional. Namun, seringkali kita melupakan aspek krusial yang dapat membuat perbedaan antara aplikasi yang sukses dan yang tidak, yaitu penanganan kesalahan atau error handling. Terlebih lagi, ketika kita berbicara tentang pengembangan aplikasi web menggunakan JavaScript, pemahaman yang baik tentang cara menangani kesalahan dalam promises menjadi hal yang sangat penting.

Pemula sering kali mengabaikan kebutuhan untuk mengatasi potensi kesalahan dalam kode mereka, tanpa menyadari bahwa bahkan aplikasi terbaik sekalipun dapat mengalami situasi tak terduga. Kesalahan dapat muncul dari berbagai sumber, seperti jaringan yang bermasalah, permintaan API yang gagal, atau kesalahan logika dalam kode itu sendiri.

Dalam artikel ini, kita akan membahas beberapa cara efektif untuk menangani kesalahan dalam JavaScript promise. Promise merupakan salah satu konsep inti dalam pemrograman asynchronous di JavaScript, dan memahami cara menangani kesalahan dalam promises dapat membantu kita membuat aplikasi yang lebih baik.

## Promise.all

_Dikutip dari dokumentasi MDN_

> The Promise.all() static method takes an iterable of promises as input and returns a single Promise. This returned promise fulfills when all of the input's promises fulfill (including when an empty iterable is passed), with an array of the fulfillment values. It rejects when any of the input's promises rejects, with this first rejection reason.

Metode ini menerima sebuah iterable (seperti array) dari promises sebagai argumen. Saat semua promises dalam iterable tersebut telah terpenuhi (fulfilled), maka promise yang dihasilkan oleh Promise.all() juga akan terpenuhi. Sebaliknya, jika salah satu promise di dalam iterable tersebut menolak (rejected), maka Promise.all() akan segera menolak dengan alasan dari promise yang pertama kali ditolak.

```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

async function handle() {
  const res = await Promise.all([promise1, promise2, promise3]);
  console.log(res);
}
// output: Array [3, 42, "foo"]
```

Atau kita juga bisa destructure value dari hasil promise tersebut

```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

async function handle() {
  const [p1, p2, p3] = await Promise.all([promise1, promise2, promise3]);
  console.log(p1);
  console.log(p2);
  console.log(p3);
}
handle();
// output:
// 3
// 42
// foo
```

Namun kita belum implementasi error handling, mari kita masukkan kode sebelumnya dengan try-catch

```javascript
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject("Error");
const promise3 = Promise.reject("Error");

async function handle() {
  try {
    const [p1, p2, p3] = await Promise.all([promise1, promise2, promise3]);
    console.log(p1);
    console.log(p2);
    console.log(p3);
  } catch (e) {
    // handle error
  }
}
```

Kode di atas mungkin akan terlihat sudah oke, namun sebenarnya ada masalah, misal promise pertama resolve, namun promise kedua reject, ini akan trigger catch block dan menjalankan error handlingnya. Lalu apa masalahnya?

Ketika catch block sudah tereksekusi, semisal promise ketiga reject juga, maka JavaScript akan menghasilkan Unhandled Promise rejection. Lantas bagaimana cara menanganinya?

## Promise.allSettled

_Dikutip dari dokumentasi MDN_

> The Promise.allSettled() static method takes an iterable of promises as input and returns a single Promise. This returned promise fulfills when all of the input's promises settle (including when an empty iterable is passed), with an array of objects that describe the outcome of each promise.

Metode ini mirip dengan Promise.all(), namun memberikan respons terhadap setiap promise, baik yang terpenuhi maupun yang ditolak. Dengan menggunakan Promise.allSettled(), kita dapat menangani setiap hasil promise secara individual, tanpa risiko unhandled promise rejection.

**Promise.allSettled menghasilkan 3 hal, yaitu:**

- status: sebuah string, antara "fulfilled" atau "rejected", tergantung state dari promise (resolve/reject)
- value: hanya ada jika status === "fulfilled".
- reason: hanya ada jika status === "rejected".

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject("Error");
const promise3 = Promise.reject("Error");

async function handle() {
  const [p1, p2, p3] = await Promise.allSettled([promise1, promise2, promise3]);
  // promise 1
  if (p1.result === "fulfilled") {
    const value = p1.value;
  } else {
    const err = p1.reason;
    handleError(err);
  }
  // promise 2
  if (p2.result === "fulfilled") {
    const value = p2.value;
  } else {
    const err = p2.reason;
    handleError(err);
  }
  // promise 3
  if (p3.result === "fulfilled") {
    const value = p3.value;
  } else {
    const err = p3.reason;
    handleError(err);
  }
}
handle();
```

Jika kode ini terlalu rumit, Anda bisa membungkusnya dengan sebuah fungsi

## Array destructuring

Ini merupakan salah satu cara yang paling saya suka dalam menghandle error di JavaScript, yaitu dengan menggunakan array destructuring. Array destructuring adalah fitur yang sangat berguna dalam JavaScript untuk mengekstrak nilai dari array atau properti objek dan menetapkannya ke variabel terpisah. Dalam konteks error handling, array destructuring dapat digunakan untuk menyederhanakan pengelolaan hasil dan pesan kesalahan. Berikut adalah contoh implementasi dalam JavaScript:

```js
async function handlePromise() {
  try {
    const data = await fetchData();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
```
Lalu kita bisa menggunakan fungsi tersebut seperti di bawah ini
```js
const [data, error] = await handlePromise();

if (error) {
  // handle error
}
```

Dengan cara ini juga kita bisa memanggil beberapa promise dengan satu baris,
```js
const [data1, error1] = await handlePromise1();
const [data2, error2] = await handlePromise2();

if (error1) {
  // handle error
}

if (error2) {
  // handle error
}
```

Jika kalian merupakan programmer golang mungkin kalian sudah familiar dengan pattern ini, menurut saya pattern ini merupakan salah satu cara terbaik untuk menghandle error karena kita tidak lagi perlu menggunakan try-catch block. Jika kalian menggunakan TypeScript kalian bisa define types-nya dengan tuple.
```ts
type DataTuple = [Data[] | null, null | string];

async function getData(): Promise<DataTuple> {
  try {
    const data = await db.findMany();
    return [data, null];
  } catch (error) {
    const message = getErrorMessage(error);
    return [null, message];
  }
}
```

## Promise.allSettled + Golang style
Cara ini merupakan gabungan dari promise.allSettled dan kita akan memodifikasinya dengan golang error handling.
```js
function promiseWrapper(promise) {
  return Promise.allSettled([promise]).then(([{ value, reason }]) => {
    // kita bisa menggunakan object maupun array, disini saya menggunakan object agar lebih akurat ketika kita menggunakan TypeScript
    return { data: value, error: reason }
  })
}
```
Disini kita membuat sebuah utility function yang mana kita bisa passing sebuah promise dalam fungsi ini yang nantinya kita akan mendapatkan either data maupun error jika promise berakhir dengan reject. Lalu kita bisa menggunakannya seperti contoh di bawah,
```js
const { data, error } = await promiseWrapper(promise);
if (error) {
  // handle it
}
// no error
```

Jika kita memiliki banyak promise dan ingin menggunakan utility function ini, kita bisa rename variablenya dengan object destructuring agar tidak terjadi conflict

```js

const { data: data1, error: error1 } = await promiseWrapper(promise1);
const { data: data2, error: error2 } = await promiseWrapper(promise2);

if (error1) {
  // handle it
}

if (error2) {

}
// no error

```

Tentunya cara yang saya sebut di atas tidak sempurna dan masih banyak lagi cara untuk handle error promise di JavaScript, namun ini merupakan cara yang saya pribadi gunakan.

Semoga dengan artikel ini bisa membantu kalian dan juga menambah insights tentang promise di JavaScript❤️.

Referensi:
- https://www.builder.io/blog/promises
- https://www.youtube.com/shorts/ITogH7lJTyE
