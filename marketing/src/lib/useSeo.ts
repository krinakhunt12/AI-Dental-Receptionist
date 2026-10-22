import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description: string;
  path?: string;
}

/**
 * Lightweight SEO helper: sets the document title, meta description and
 * canonical/og tags. Replace with react-helmet or a dedicated SEO package
 * if the site grows beyond a handful of pages.
 */
export function useSeo({ title, description, path }: SeoOptions) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    if (path) {
      setMeta('meta[property="og:url"]', 'property', 'og:url', `https://smilecare.dental${path}`);
    }
  }, [title, description, path]);
}
