import { JsonPlaceholderPostDemo } from '@/components/rq-demo/json-placeholder-post';
import { Link } from '@/i18n';
import { getTranslations } from '@/i18n/server';

export default async function RqDemoPage() {
  const t = await getTranslations('RqDemo');

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-4 py-16">
      <JsonPlaceholderPostDemo />
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
