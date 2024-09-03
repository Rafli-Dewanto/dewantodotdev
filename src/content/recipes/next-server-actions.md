---
title: 'Next.js Server Actions'
description: .
publishDate: 'Sep 03 2024'
isFeatured: false
seo:
  image:
    src: ''
    alt: ''
---

### Pagination

```tsx
import { DataView } from './helpers/data-view';
import { getServerData } from './helpers/server-data';

export default async function PaginationPage() {
  return (
    <div className="flex flex-col p-12 justify-center items-center">
      <h1 className="text-xl font-bold">The content below is initially server-rendered, and paginated with Server Actions</h1>
      <DataView initialData={await getServerData()} />
    </div>
  );
}
```

```tsx
'use client';

import { useState } from 'react';
import { getServerData } from './server-data';

export const DataView = (props: { initialData: string[] }) => {
  const [data, setData] = useState(props.initialData);

  async function loadMore() {
    const newData = await getServerData(data.length);

    setData([...data, ...newData]);
  }

  return (
    <div className="flex flex-col text-xl justify-center items-center bg-gray-800 py-4 px-20">
      {data.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
      <button className="border-1 p-2 hover:bg-gray-700" onClick={loadMore}>
        Load more...
      </button>
    </div>
  );
};
```

```tsx
'use server';

const SERVER_DATA = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25'
];

export const getServerData = async (current?: number) => {
  const start = current ?? 0;
  const end = start + 5;

  return SERVER_DATA.slice(start, end);
};
```
