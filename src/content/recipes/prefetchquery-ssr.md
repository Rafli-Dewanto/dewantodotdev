---
title: 'SSR prefetchQuery (Tanstack Query)'
description: .
publishDate: 'Sep 03 2024'
isFeatured: false
seo:
  image:
    src: ''
    alt: ''
---

```tsx
// In Next.js, this file would be called: app/providers.jsx
'use client';

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

```tsx
// pages/posts.jsx
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from '@tanstack/react-query';

// This could also be getServerSideProps
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}

function Posts() {
  // This useQuery could just as well happen in some deeper child to
  // the <PostsRoute>, data will be available immediately either way
  //
  // Note that we are using useQuery here instead of useSuspenseQuery.
  // Because this data has already been prefetched, there is no need to
  // ever suspend in the component itself. If we forget or remove the
  // prefetch, this will instead fetch the data on the client, while
  // using useSuspenseQuery would have had worse side effects.
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments
  });

  // ...
}

export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  );
}
```

```tsx
// app/posts/page.jsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Posts from './posts';

export default async function PostsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
```

```tsx
// app/posts/posts.jsx
'use client';

export default function Posts() {
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts()
  });

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix.
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments
  });

  // ...
}
```

Nesting Server Components
A nice thing about Server Components is that they can be nested and exist on many levels in the React tree, making it possible to prefetch data closer to where it's actually used instead of only at the top of the application (just like Remix loaders). This can be as simple as a Server Component rendering another Server Component (we'll leave the Client Components out in this example for brevity):

```tsx
// app/posts/page.jsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Posts from './posts';
import CommentsServerComponent from './comments-server';

export default async function PostsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
      <CommentsServerComponent />
    </HydrationBoundary>
  );
}

// app/posts/comments-server.jsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Comments from './comments';

export default async function CommentsServerComponent() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments />
    </HydrationBoundary>
  );
}
```
