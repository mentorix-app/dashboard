'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from '@/i18n';

type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const POST_ID = 1;

async function fetchPost(id: number): Promise<JsonPlaceholderPost> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<JsonPlaceholderPost>;
}

export function JsonPlaceholderPostDemo() {
  const t = useTranslations('RqDemo');
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['demo', 'jsonplaceholder', 'post', POST_ID],
    queryFn: () => fetchPost(POST_ID),
  });

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t('title')}</h2>
        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          disabled={isFetching}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isFetching ? t('refetching') : t('refetch')}
        </button>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('apiHint', { id: POST_ID })}</p>

      {isPending ? <p className="text-zinc-600 dark:text-zinc-300">{t('loading')}</p> : null}

      {isError ? (
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error instanceof Error ? error.message : t('errorFallback')}
        </p>
      ) : null}

      {data ? (
        <article className="flex flex-col gap-2 text-left">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{data.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{data.body}</p>
          <p className="text-xs text-zinc-400">{t('postMeta', { id: data.id, userId: data.userId })}</p>
        </article>
      ) : null}
    </div>
  );
}
