---
title: "Model State Management di Ekosistem React"
excerpt: "React State Management"
publishDate: 'Dec 10 2023'
tags:
  - JavaScript
  - React.js
  - State management
  - Redux
seo:
  image:
    src: '/post-1.jpg'
    alt: A person standing at the window
---

Konsep state management memiliki peran kunci dalam mengelola data dan state aplikasi dengan efisien. Saat pertama kali mempelajari React.js, banyak orang merasa asing dengan state management, dan sering kali mendengar istilah "React & Redux" sebagai pasangan yang tak terpisahkan.

Pertanyaan mengapa React selalu dikaitkan dengan Redux, jawabannya sederhana: Redux adalah pilihan yang populer dan kuat untuk menangani state management pada aplikasi react. Melalui pemanfaatan Redux, _developer_ dapat dengan mudah mengelola state aplikasi secara terpusat dan mempermudah alur kerja pengembangan. dan sebelum kita masuk ke macam-macam model state management di react, mari kita bahas mengenai state management.

## Apa itu state management?

State management merujuk pada cara mengelola dan menyimpan informasi atau data dalam aplikasi. Setiap kali kita bekerja dengan UI yang dinamis, di mana komponen-komponen dapat berinteraksi dan merespon perubahan, kita perlu memiliki cara untuk menyimpan dan memperbarui informasi yang relevan.

Secara sederhana, state management adalah cara aplikasi menyimpan dan mengelola data agar dapat diakses dengan konsisten di seluruh komponen.

> State management is nothing more than patterns to make it "easier" for us to change state - [crinkles.dev](https://crinkles.dev/writing/state-management/)

Dalam aplikasi React, setiap komponen dapat memiliki state sendiri, yang berisi data yang berubah seiring waktu. Namun, ketika aplikasi menjadi lebih kompleks, terutama dengan banyak komponen bersarang atau berbagi data, state management dapat menjadi tantangan.

Misal dalam konteks aplikasi e-commerce, state management menjadi krusial untuk menyediakan pengalaman pengguna yang lancar dan terkoordinasi. Sebagai contoh, pertimbangkan fitur penambahan produk ke keranjang belanja dan alur proses checkout. Pertama-tama, perlu ada suatu cara untuk menyimpan informasi mengenai produk, seperti nama, harga, dan stoknya. Inilah yang disebut sebagai state produk. Setiap kali pengguna menambahkan produk ke dalam keranjang, sistem perlu memantau keranjang belanja dengan detail produk dan kuantitasnya. Oleh karena itu, kita memerlukan state khusus untuk menyimpan informasi keranjang belanja.

Dalam aplikasi ini, proses penambahan produk ke keranjang dilakukan dengan memperbarui state produk dan state keranjang belanja secara bersamaan. Saat pengguna menambahkan suatu produk, informasi produk tersebut ditambahkan ke dalam keranjang belanja, dan stok produk dikurangi untuk mencerminkan pembelian. Dengan demikian, state management memainkan peran kunci dalam menjaga konsistensi dan integritas data di seluruh aplikasi.

Manfaat utama dari pendekatan ini adalah menghindari ketidakselarasan data antar komponen dan memastikan bahwa perubahan satu bagian dari aplikasi secara otomatis tercermin di bagian lainnya. Dengan adanya state management yang baik, kita dapat memberikan pengalaman pengguna yang mulus, di mana informasi keranjang belanja tetap konsisten dan terkini. Ini menciptakan dasar yang kuat untuk mengembangkan fitur-fitur lanjutan seperti proses checkout dengan memanfaatkan state yang terorganisir dengan baik.

Dengan pemahaman tentang pentingnya state management, saatnya kita bahas berbagai model atau jenis state management yang dapat diterapkan dalam pengembangan dengan React.

## **1. Uni-directional (e.g., Redux, Zustand)**

![udf](https://bs-uploads.toptal.io/blackfish-uploads/public-files/react_state_management-8f13c8c642a8caef9e37466be79cc830.gif)
Source: [toptal](https://www.toptal.com/react/react-state-management-tools-enterprise)

Dalam model uni-directional state management, data mengalir dalam satu arah, umumnya mengikuti arsitektur uni-directional data flow (UDF). Actions meng-_trigger_ perubahan state, dan state diperbarui melalui _pure function_ [(reducers)](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#writing-reducers).

**Karakteristik:**

-   Penyimpanan terpusat: Seluruh state aplikasi disimpan dalam satu penyimpanan terpusat.
-   Imutabilitas: state umumnya bersifat _immutable_, dan perubahan dilakukan melalui pembuatan objek state baru. Dalam pola state management ini, struktur unidireksional memastikan bahwa setiap perubahan state diinisiasi oleh aksi dan direspons oleh _pure function_ yang menghasilkan state baru.

### Redux

```jsx
// actions
const tambah = () => ({ type: "TAMBAH" });
const kurang = () => ({ type: "KURANG" });

// reducer
const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case "TAMBAH":
            return state + 1;
        case "KURANG":
            return state - 1;
        default:
            return state;
    }
};

// store
import { createStore } from "redux";
const store = createStore(counterReducer);

// App
import React from "react";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
    const count = useSelector((state) => state);
    const dispatch = useDispatch();

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => dispatch(tambah())}>Tambah</button>
            <button onClick={() => dispatch(kurang())}>Kurang</button>
        </div>
    );
};
```

### Zustand

```jsx
import { create } from 'zustand'

type Store = {
  count: number
  inc: () => void
}

const useStore = create<Store>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

function Counter() {
  const { count, inc } = useStore()
  return (
    <div>
      <span>{count}</span>
      <button onClick={inc}>one up</button>
    </div>
  )
}
```

### Perbedaan redux & zustand

Secara konseptual, Zustand dan Redux sangat mirip, keduanya didasarkan pada _immutable state model_. Namun, Redux mengharuskan kita membungkus aplikasi dengan context provider [(React Context)](https://react.dev/learn/passing-data-deeply-with-context), zustand tidak.

## **2. Bi-directional (e.g., MobX, Valtio)**

![bi-directional](https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fpublic-files%2Freact_state_management-251c37369475e875c61a479c056745ca.png)
Source: [toptal](https://www.toptal.com/react/react-state-management-tools-enterprise)

State management bi-direksional memungkinkan aliran data yang lebih fleksibel, di mana perubahan dalam state dapat dipropagasi ke kedua arah. Hal ini sering terkait dengan [_reactive programming_](https://www.baeldung.com/cs/reactive-programming#:~:text=Reactive%20programming%20is%20a%20declarative,or%20reactive%20systems%20in%20general.).

**Karakteristik:**

-   **Pembaruan reaktif:** Perubahan dalam state secara otomatis dapat meng-trigger pembaruan dalam UI, dan sebaliknya.
-   **Observables:** Properti state direpresentasikan sebagai observables, yang dapat di-_observe_ untuk perubahan.

State management bi-direksional, seperti yang diimplementasikan dalam MobX dan Valtio, memperkenalkan dinamika yang lebih kompleks dalam alur data aplikasi. Pembaruan reaktif memungkinkan perubahan state secara langsung mencerminkan perubahan dalam antarmuka pengguna, dan sebaliknya, menciptakan keterkaitan erat antara model dan tampilan. Observables menjadi inti dari pendekatan ini, memungkinkan pemantauan yang efisien terhadap perubahan dalam state, sehingga respons terhadap perubahan dapat terjadi dengan cepat dan efektif. Pendekatan bi-direksional cocok untuk aplikasi yang membutuhkan interaksi yang dinamis dan cepat antara state dan UI aplikasi.

### Mobx

```jsx
// stores/counter.js
import { makeAutoObservable } from "mobx";

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.value += 1;
  }

  decrement() {
    this.value -= 1;
  }
}

export default CounterStore;

// index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import App from "./App";
import CounterStore from "./stores/counter";

ReactDOM.render(
  <Provider counter={new CounterStore()}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// App.js
import React from "react";
import { inject, observer } from "mobx-react";

const App = inject((stores) => ({ counter: stores.counter }))(
  observer(({ counter }) => {
    return (
      <div>
        <div>
          <button onClick={() => counter.increment()}>Increment</button>
          <span>{counter.value}</span>
          <button onClick={() => counter.decrement()}>Decrement</button>
        </div>
      </div>
    );
  })
);

export default App;
```

## **3. Atomic (e.g., Jotai, Recoil)**
![atomic](https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fpublic-files%2Freact_state_management-09414065d8d558fdb6bde7e9b6af50f9.png)

_Dikutip dari dokumentasi jotai,_

> Build state by combining atoms and renders are automatically optimized based on atom dependency. This solves the extra re-render issue of React context, eliminates the need for memoization, and provides a similar developer experience to signals while maintaining a declarative programming model.

State management atomic melibatkan pemecahan state menjadi bagian-bagian kecil independen yang disebut sebagai atom. Setiap atom dapat dimodifikasi secara independen, dan komponen-komponen dapat _subscribe_ pada atom-atom tertentu untuk mendapatkan value terbaru. Sederhananya state management atomic menggunakan _atom_ sebagai satu sumber state dan kita bisa menggunakannya seperti hook _useState_ pada react namun kita bisa _share_ state/atom tersebut ke komponen lain tanpa melakukan [prop drilling](https://dev.to/codeofrelevancy/what-is-prop-drilling-in-react-3kol). Pendekatan ini menggabungkan pattern state component dan _global store_ seperti redux.

**Karakteristik:**

-   **Atom:** Unit independen dari state yang dapat diperbarui secara individual.
-   **Selectors:** Mekanisme untuk "menurunkan" nilai atau menyusun state dari atom-atom.

### Recoil

```jsx
// atoms.js
import { atom } from "recoil";

export const usernameState = atom({
    key: "usernameState",
    default: "Guest",
});

// App.js
import React from "react";
import { useRecoilState } from "recoil";
import { usernameState } from "./atoms";

const App = () => {
    const [username, setUsername] = useRecoilState(usernameState);

    return (
        <div>
            <p>Welcome, {username}!</p>
            <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
    );
};
```

### Jotai

```jsx
const priceAtom = createAtom(15);

const discountAtom = createAtom(10);

// derived state
const discountedPriceAtom = createAtom((get) => get(priceAtom) / 100 * get(discountAtom));

const Header = () => {
  const [price, setPrice] = useAtom(priceAtom);
  const [discountedPriceAtom] = useAtom(discountedPriceAtom);
  ...
}
```

## **4. Event-driven (e.g., Effector, Storeon, Eventrix)**
![event-driven](https://www.mobileatscale.com/content/img/01_State.png)

Event-driven state management memperlakukan update state sebagai _stream of events_. Hal ini sering digunakan dalam skenario di mana perubahan bersifat terus-menerus atau asinkron.

**Karakteristik:**

-   **Event streams:** Perubahan state direpresentasikan sebagai aliran event yang kontinu.
-   **Asynchronous updates:** Pembaruan state dapat terjadi secara asinkron sebagai respons terhadap event.

Pendekatan state management berbasis event, seperti yang diimplementasikan dalam Effector dan Storeon, melibatkan state sebagai serangkaian event yang berkelanjutan. _Stream of events_ menciptakan model yang sangat responsif terhadap perubahan, memungkinkan pembaruan state untuk terjadi secara asinkron dan efisien. Pendekatan ini berguna dalam skenario di mana perubahan state tidak terbatas pada pembaruan yang terputus-putus, melainkan mengalir secara berkesinambungan/kontinu. Oleh karena itu, event-driven state management cocok untuk aplikasi yang mengandalkan perubahan dinamis dan asinkron yang kontinu, seperti aplikasi real-time atau sistem yang melibatkan banyak interaksi pengguna.

### Effector

```jsx
const fooChange = createEvent();
const fooValue = createStore(4).on(fooChange, (_, e) => +e.currentTarget.value);

const barChange = createEvent();
const barValue = createStore(4).on(barChange, (_, e) => +e.currentTarget.value);

const RangeGroup = ({ name, value, onChange }) => {
    const current = useStore(value);
    return (
        <>
            <label for={name}>{name}</label>
            <input
                name={name}
                type='range'
                min='2'
                max='10'
                step='1'
                value={current}
                onChange={onChange}
            />
            <output for={name}>{current}</output>
        </>
    );
};

const App = () => {
    return (
        <>
            <form>
                <RangeGroup name='foo' onChange={fooChange} value={fooValue} />
                <RangeGroup name='bar' onChange={barChange} value={barValue} />
            </form>
        </>
    );
};
```

## 5. Finite State Machine / FSM (e.g., XState)
![FSM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wzwwkcr17vknfd37h3wr.JPG)

Finite State Machine (FSM) merupakan model konseptual yang dapat berada dalam satu dari sejumlah state terbatas pada setiap waktu tertentu. Transisi antar state terjadi sebagai respons terhadap input eksternal, dan perubahan dari state satu ke state yang lain disebut transisi. Sebuah FSM didefinisikan oleh daftar statenya, initial state, dan kondisi-kondisi untuk setiap transisi.

> State machines: restricts the possible states something can be in, and limits the possibilities to move from one state to another.

_Key characteristic_ dari FSM melibatkan satu kumpulan state yang terdefinisi dengan baik dalam aplikasi dan transisi antar state yang dipicu oleh _event_ spesifik. Selain itu, FSM dapat mengorganisir state secara hierarki, menyediakan representasi terstruktur dari perilaku aplikasi.

**Karakteristik:**
-   States dan transisi: Sebuah aplikasi memiliki kumpulan state yang terdefinisi dengan baik, dan transisi antar state dipicu oleh _event_.
-   Hierarchical states: States dapat diatur secara hierarki, memberikan representasi terstruktur dari _behaviour_ aplikasi.

### XState

```jsx
// machine.js
import { createMachine } from "xstate";

export const lightSwitchMachine = createMachine({
    id: "lightSwitch",
    initial: "off",
    states: {
        off: { on: { TOGGLE: "on" } },
        on: { on: { TOGGLE: "off" } },
    },
});

// App.js
import React from "react";
import { lightSwitchMachine } from './machines'
import { useMachine } from '@xstate/react'

const App = () => {
    const [state, send] = useMachine(lightSwitchMachine);
    return (
        <div>
            <p>Current State: {state.value}</p>
            <button onClick={() => send({ type: "TOGGLE" })}>Toggle</button>
        </div>
    );
};
```

Salah satu keunggulan xstate dibanding state management lain yaitu [stately](https://stately.ai) (creator dari xstate), membuat vscode extension untuk memvisualisasikan manajemen state dari aplikasi kita, dan kita bisa langsung membuat perubahan state dan event pada visual editor yang mana nantinya kode kita juga akan ikut berubah secara "real-time" dengan perubahan yang kita buat pada visual editor.
![xstate](https://github.com/statelyai/xstate-tools/blob/main/assets/editor.png?raw=true)

Masing-masing model state management ini memiliki kelebihan dan kekurangannya sendiri, dan pilihannya sering kali bergantung pada _requirement_ spesifik dan arsitektur aplikasi. _Developer_ dapat memilih pola berdasarkan faktor-faktor seperti kompleksitas transisi state, kemudahan debugging, dan lain-lain.

Jika kalian ingin melihat perbandingan popularitas dari masing-masing state management yang ada, kalian bisa melihatnya pada link [berikut.](https://npm-compare.com/@reduxjs/toolkit,zustand,xstate,mobx,jotai,recoil,valtio/#timeRange=THREE_YEARS)
![state-trends](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/91kjjs9evqcfs3uko8va.JPG)

Referensi:
- https://medium.com/@nouraldin.alsweirki/state-management-in-react-d086459e0bc5
- https://levelup.gitconnected.com/atomic-state-management-in-react-161d9ebf2b97
- https://crinkles.dev/writing/state-management/
- https://statecharts.dev/what-is-a-state-machine.html
- https://www.toptal.com/react/react-state-management-tools-enterprise
