import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n-config';
import { setRequestLocale } from 'next-intl/server';

type HomePageProps = {
  params: {
    locale: Locale;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function HomePage({ params: { locale } }: HomePageProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound();
  }

  // Set the request locale for next-intl
  setRequestLocale(locale);

  const t = useTranslations('home');
  
  // Example of using rich text formatting
  const welcomeMessage = t.rich('welcome', {
    strong: (chunks) => <strong>{chunks}</strong>,
    em: (chunks) => <em>{chunks}</em>,
  });
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm">
        <h1 className="mb-8 text-4xl font-bold">
          {welcomeMessage}
        </h1>
        
        <div className="mb-8 grid gap-4">
          <p>{t('description')}</p>
          <p>{t('greeting', { name: 'User' })}</p>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-xl font-semibold">{t('features.title')}</h2>
          <ul className="space-y-2 pl-5 list-disc">
            {[1, 2, 3].map((feature) => (
              <li key={feature}>{t(`features.${feature}`)}</li>
            ))}
          </ul>
        </div>

        {/* Example of a button with translation */}
        <div className="mt-8">
          <button 
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => console.log('Button clicked')}
          >
            {t('cta.learnMore')}
          </button>
        </div>
      </div>
    </main>
  );
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Set the revalidation time (in seconds)
export const revalidate = 3600; // 1 hour
