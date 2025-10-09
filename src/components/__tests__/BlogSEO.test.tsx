import { type ReactElement } from 'react';
import { cleanup, render } from '@testing-library/react';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';

import BlogSEO from '../blog/BlogSEO';

describe('BlogSEO component', () => {
  const renderWithHelmet = (ui: ReactElement) => {
    const helmetContext: { helmet?: HelmetServerState } = {};

    render(<HelmetProvider context={helmetContext}>{ui}</HelmetProvider>);

    return helmetContext.helmet;
  };

  beforeEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
    window.location.href = 'https://bermanelectrical.com/blog/article';
  });

  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.title = '';
  });

  it('adds article specific metadata and schema definitions', () => {
    const article = {
      publishedTime: '2024-05-01T10:00:00-05:00',
      modifiedTime: '2024-05-02T12:00:00-05:00',
      author: 'Rob Berman',
      section: 'Upgrades',
      tags: ['electrical', 'panel upgrades'],
    };

    renderWithHelmet(
      <BlogSEO
        title="Ultimate Guide to Electrical Panel Upgrades"
        description="Everything homeowners need to know before upgrading their electrical panel."
        canonical="https://bermanelectrical.com/blog/panel-upgrade-guide"
        article={article}
      />,
    );

    expect(document.title).toBe('Ultimate Guide to Electrical Panel Upgrades | Berman Electric Blog');

    const publishedMeta = document.head.querySelector('meta[property="article:published_time"]');
    expect(publishedMeta).toHaveAttribute('content', '2024-05-01T10:00:00-05:00');

    const scripts = Array.from(
      document.head.querySelectorAll('script[type="application/ld+json"]'),
    )
      .map((script) => script.textContent)
      .filter((content): content is string => Boolean(content) && content !== 'null')
      .map((content) => JSON.parse(content));

    const articleSchema = scripts.find((schema) => schema['@type'] === 'BlogPosting');
    expect(articleSchema).toMatchObject({
      headline: 'Ultimate Guide to Electrical Panel Upgrades',
      articleSection: 'Upgrades',
      keywords: 'electrical, panel upgrades',
    });
  });

  it('generates FAQ schema when titles represent guides', () => {
    renderWithHelmet(
      <BlogSEO
        title="Homeowners Guide: Electrical Safety Tips"
        description="Key maintenance advice for keeping your home's electrical system safe."
        structuredData={{ '@type': 'BreadcrumbList', '@context': 'https://schema.org' }}
      />,
    );

    const faqScript = Array.from(
      document.head.querySelectorAll('script[type="application/ld+json"]'),
    )
      .map((script) => script.textContent ?? '')
      .find((content) => content.includes('"@type":"FAQPage"'));

    expect(faqScript).toBeDefined();
  });
});
