import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description = SITE_CONFIG.description,
  path = '/',
  image = SITE_CONFIG.ogImage,
  noIndex = false,
  keywords = [],
}: GenerateMetadataOptions = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;

  const url = `${SITE_CONFIG.url}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'IT solutions',
      'software development',
      'cloud solutions',
      'IT consulting',
      'digital transformation',
      'cybersecurity',
      'Orion eSolutions',
      ...keywords,
    ],
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
  };
}
