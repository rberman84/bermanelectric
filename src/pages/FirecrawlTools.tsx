import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { firecrawlApi } from '@/lib/api/firecrawl';
import { Loader2, Search, Map, Globe, FileSearch, ExternalLink, Copy, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/shared/Footer';
import SEOEnhanced from '@/components/SEOEnhanced';

const FirecrawlTools = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('site-audit');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Site Audit State
  const [auditUrl, setAuditUrl] = useState('https://bermanelectrical.com');
  
  // Lead Research State
  const [leadQuery, setLeadQuery] = useState('');
  
  // Content Research State
  const [contentQuery, setContentQuery] = useState('');
  
  // Competitor Research State
  const [competitorUrl, setCompetitorUrl] = useState('');

  const handleSiteAudit = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      const response = await firecrawlApi.map(auditUrl, { 
        includeSubdomains: true,
        limit: 500 
      });
      if (response.success) {
        setResults({ type: 'map', data: response });
        toast({ title: 'Site Audit Complete', description: `Found ${response.data?.links?.length || 0} pages` });
      } else {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to audit site', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSearch = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      const response = await firecrawlApi.search(leadQuery, { 
        limit: 20,
        country: 'us',
        scrapeOptions: { formats: ['markdown'] }
      });
      if (response.success) {
        setResults({ type: 'search', data: response });
        toast({ title: 'Search Complete', description: `Found ${response.data?.length || 0} results` });
      } else {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to search', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentResearch = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      const response = await firecrawlApi.search(contentQuery, { 
        limit: 15,
        tbs: 'qdr:m', // Last month
        scrapeOptions: { formats: ['markdown'] }
      });
      if (response.success) {
        setResults({ type: 'content', data: response });
        toast({ title: 'Research Complete', description: `Found ${response.data?.length || 0} articles` });
      } else {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to research', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompetitorScrape = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      const response = await firecrawlApi.scrape(competitorUrl, { 
        formats: ['markdown', 'links'],
        onlyMainContent: true
      });
      if (response.success) {
        setResults({ type: 'scrape', data: response });
        toast({ title: 'Scrape Complete', description: 'Content extracted successfully' });
      } else {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to scrape', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <>
      <SEOEnhanced
        title="Firecrawl Research Tools | Berman Electric Admin"
        description="Internal research tools for site auditing, lead generation, content research, and competitor analysis."
        canonical="https://bermanelectrical.com/admin/firecrawl"
      />
      <Navbar />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Research & Analysis Tools</h1>
            <p className="text-muted-foreground">
              Use Firecrawl to audit your site, find leads, research content, and analyze competitors.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="site-audit" className="flex items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Site Audit
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Lead Research
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Content Ideas
              </TabsTrigger>
              <TabsTrigger value="competitors" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Competitors
              </TabsTrigger>
            </TabsList>

            {/* Site Audit Tab */}
            <TabsContent value="site-audit">
              <Card>
                <CardHeader>
                  <CardTitle>Site Audit</CardTitle>
                  <CardDescription>
                    Map all pages on your website to find broken links, orphan pages, and SEO issues.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="audit-url">Website URL</Label>
                      <Input
                        id="audit-url"
                        value={auditUrl}
                        onChange={(e) => setAuditUrl(e.target.value)}
                        placeholder="https://bermanelectrical.com"
                      />
                    </div>
                    <Button 
                      onClick={handleSiteAudit} 
                      disabled={isLoading}
                      className="self-end"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Audit Site'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lead Research Tab */}
            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Research</CardTitle>
                  <CardDescription>
                    Search for businesses, new construction, or properties that might need electrical services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="lead-query">Search Query</Label>
                      <Input
                        id="lead-query"
                        value={leadQuery}
                        onChange={(e) => setLeadQuery(e.target.value)}
                        placeholder="new restaurant opening Long Island 2024"
                      />
                    </div>
                    <Button 
                      onClick={handleLeadSearch} 
                      disabled={isLoading || !leadQuery}
                      className="self-end"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Example searches:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>new construction Long Island permits 2024</li>
                      <li>commercial renovation Nassau County</li>
                      <li>new business opening Suffolk County</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Research Tab */}
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Research</CardTitle>
                  <CardDescription>
                    Find trending topics, electrical code updates, and industry news for blog content.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="content-query">Research Topic</Label>
                      <Input
                        id="content-query"
                        value={contentQuery}
                        onChange={(e) => setContentQuery(e.target.value)}
                        placeholder="New York electrical code changes 2024"
                      />
                    </div>
                    <Button 
                      onClick={handleContentResearch} 
                      disabled={isLoading || !contentQuery}
                      className="self-end"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Research'}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Content ideas:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>EV charger installation trends Long Island</li>
                      <li>smart home electrical requirements 2024</li>
                      <li>NEC code updates residential</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Competitor Research Tab */}
            <TabsContent value="competitors">
              <Card>
                <CardHeader>
                  <CardTitle>Competitor Analysis</CardTitle>
                  <CardDescription>
                    Scrape competitor websites to analyze their services, content, and offerings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="competitor-url">Competitor URL</Label>
                      <Input
                        id="competitor-url"
                        value={competitorUrl}
                        onChange={(e) => setCompetitorUrl(e.target.value)}
                        placeholder="https://competitor-electrician.com"
                      />
                    </div>
                    <Button 
                      onClick={handleCompetitorScrape} 
                      disabled={isLoading || !competitorUrl}
                      className="self-end"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Results Section */}
          {results && (
            <Card className="mt-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Results</CardTitle>
                  <CardDescription>
                    {results.type === 'map' && `Found ${results.data?.links?.length || 0} pages`}
                    {results.type === 'search' && `Found ${results.data?.data?.length || 0} results`}
                    {results.type === 'content' && `Found ${results.data?.data?.length || 0} articles`}
                    {results.type === 'scrape' && 'Content extracted'}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(results.data, null, 2))}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </Button>
              </CardHeader>
              <CardContent>
                {/* Site Audit Results */}
                {results.type === 'map' && results.data?.links && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.data.links.map((link: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Badge variant="outline">{i + 1}</Badge>
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {link}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search/Content Results */}
                {(results.type === 'search' || results.type === 'content') && results.data?.data && (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {results.data.data.map((item: any, i: number) => (
                      <div key={i} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-sm"
                          >
                            Visit <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        {item.markdown && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-primary">View Content</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {item.markdown.slice(0, 2000)}...
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Scrape Results */}
                {results.type === 'scrape' && (
                  <div className="space-y-4">
                    {results.data?.data?.metadata && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold mb-2">Page Info</h3>
                        <p><strong>Title:</strong> {results.data.data.metadata.title}</p>
                        <p><strong>Description:</strong> {results.data.data.metadata.description}</p>
                      </div>
                    )}
                    {(results.data?.data?.markdown || results.data?.markdown) && (
                      <div>
                        <h3 className="font-semibold mb-2">Content</h3>
                        <Textarea
                          readOnly
                          value={results.data?.data?.markdown || results.data?.markdown}
                          className="min-h-[300px] font-mono text-xs"
                        />
                      </div>
                    )}
                    {(results.data?.data?.links || results.data?.links) && (
                      <div>
                        <h3 className="font-semibold mb-2">Links Found ({(results.data?.data?.links || results.data?.links)?.length})</h3>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {(results.data?.data?.links || results.data?.links)?.map((link: string, i: number) => (
                            <a 
                              key={i}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-primary hover:underline"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FirecrawlTools;
