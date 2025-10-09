import { type ReactElement } from 'react';
import { cleanup, render } from '@testing-library/react';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';

import SEO from '../SEO';

describe('SEO component', () => {
  const renderWithHelmet = (ui: ReactElement) => {
    const helmetContext: { helmet?: HelmetServerState } = {};

    render(<HelmetProvider context={helmetContext}>{ui}</HelmetProvider>);

    return helmetContext.helmet;
  };

  beforeEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    window.location.href = 'https://bermanelectrical.com/test';
  });

  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders core metadata with brand-specific title and canonical fallback', () => {
    renderWithHelmet(
      <SEO title="Residential Services" description="Trusted electricians for your home." />,
    );

    expect(document.title).toBe(
      'Residential Services | Berman Electric - Licensed Electrician Long Island',
    );

    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical).toHaveAttribute('href', 'https://bermanelectrical.com/test');

    const description = document.head.querySelector('meta[name="description"]');
    expect(description).toHaveAttribute('content', 'Trusted electricians for your home.');

    const openGraphImage = document.head.querySelector('meta[property="og:image"]');
    expect(openGraphImage).toHaveAttribute(
      'content',
      '/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png',
    );
  });

  it('serialises additional structured data alongside the default business schema', () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'EV Charger Installation',
    };

    renderWithHelmet(
      <SEO
        title="EV Charger Installation"
        description="Professional EV charger installations on Long Island."
        structuredData={structuredData}
      />,
    );

    const scripts = Array.from(
      document.head.querySelectorAll('script[type="application/ld+json"]'),
    ).map((script) => script.textContent ?? '');

    expect(scripts.some((content) => content.includes('"@type":"LocalBusiness"'))).toBe(true);
    expect(scripts.some((content) => content.includes('"@type":"Service"'))).toBe(true);
  });
});
