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
import { useSavedLeads } from '@/hooks/useSavedLeads';
import { 
  Loader2, Search, Map, Globe, FileSearch, ExternalLink, Copy, Check, 
  Building2, HardHat, Store, Zap, Calendar, Bookmark, BookmarkCheck, 
  Trash2, Star, Clock, Mail, Phone
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/shared/Footer';
import SEOEnhanced from '@/components/SEOEnhanced';

const FirecrawlTools = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('site-audit');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { savedLeads, saveLead, updateLead, deleteLead, isUrlSaved, isSaving, isLoading: leadsLoading } = useSavedLeads();

  // Site Audit State
  const [auditUrl, setAuditUrl] = useState('https://bermanelectrical.com');
  
  // Lead Research State
  const [leadQuery, setLeadQuery] = useState('');
  const [leadTimeFilter, setLeadTimeFilter] = useState('qdr:w'); // Last week default
  
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

  const leadSearchTemplates = {
    construction: [
      'new construction project Long Island 2025',
      'building permits Nassau County 2025',
      'commercial development Suffolk County',
      'new residential development Long Island',
    ],
    commercial: [
      'new restaurant opening Long Island 2025',
      'retail store opening Nassau County',
      'new hotel Long Island construction',
      'office building renovation Suffolk County',
    ],
    permits: [
      'site:nassaucountyny.gov building permits',
      'site:suffolkcountyny.gov construction permits',
      'Long Island planning board approvals 2025',
      'zoning variance Long Island commercial',
    ],
    renovation: [
      'commercial renovation Long Island 2025',
      'restaurant remodel Nassau County',
      'retail renovation Suffolk County',
      'building modernization Long Island',
    ],
    evcharger: [
      'new EV charging station Long Island',
      'electric vehicle infrastructure New York',
      'PSEG Long Island EV program',
      'commercial EV charger installation NYC area',
    ],
  };

  const handleLeadSearch = async (customQuery?: string) => {
    const query = customQuery || leadQuery;
    if (!query) return;
    
    setIsLoading(true);
    setResults(null);
    try {
      const response = await firecrawlApi.search(query, { 
        limit: 25,
        country: 'us',
        tbs: leadTimeFilter,
        scrapeOptions: { formats: ['markdown'] }
      });
      if (response.success) {
        const resultCount = response.data?.length || 0;
        setResults({ type: 'leads', data: response, query });
        toast({ title: 'Lead Search Complete', description: `Found ${resultCount} potential leads` });
      } else {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to search', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const runQuickSearch = (query: string) => {
    setLeadQuery(query);
    handleLeadSearch(query);
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="site-audit" className="flex items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Site Audit
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Lead Research
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved ({savedLeads.length})
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
              <div className="space-y-6">
                {/* Quick Search Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Quick Lead Searches
                    </CardTitle>
                    <CardDescription>
                      One-click searches for common lead types on Long Island
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* New Construction */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <HardHat className="h-5 w-5 text-orange-500" />
                          <h3 className="font-semibold">New Construction</h3>
                        </div>
                        <div className="space-y-2">
                          {leadSearchTemplates.construction.map((q, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-auto py-2"
                              onClick={() => runQuickSearch(q)}
                              disabled={isLoading}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Commercial Openings */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <Store className="h-5 w-5 text-blue-500" />
                          <h3 className="font-semibold">Commercial Openings</h3>
                        </div>
                        <div className="space-y-2">
                          {leadSearchTemplates.commercial.map((q, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-auto py-2"
                              onClick={() => runQuickSearch(q)}
                              disabled={isLoading}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Permits & Approvals */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-green-500" />
                          <h3 className="font-semibold">Permits & Approvals</h3>
                        </div>
                        <div className="space-y-2">
                          {leadSearchTemplates.permits.map((q, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-auto py-2"
                              onClick={() => runQuickSearch(q)}
                              disabled={isLoading}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Renovations */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-purple-500" />
                          <h3 className="font-semibold">Renovations</h3>
                        </div>
                        <div className="space-y-2">
                          {leadSearchTemplates.renovation.map((q, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-auto py-2"
                              onClick={() => runQuickSearch(q)}
                              disabled={isLoading}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* EV Charger Opportunities */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          <h3 className="font-semibold">EV Charger Leads</h3>
                        </div>
                        <div className="space-y-2">
                          {leadSearchTemplates.evcharger.map((q, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-auto py-2"
                              onClick={() => runQuickSearch(q)}
                              disabled={isLoading}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Search */}
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Lead Search</CardTitle>
                    <CardDescription>
                      Search for specific opportunities with time filtering
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="lead-query">Search Query</Label>
                        <Input
                          id="lead-query"
                          value={leadQuery}
                          onChange={(e) => setLeadQuery(e.target.value)}
                          placeholder="new restaurant opening Long Island 2025"
                          onKeyDown={(e) => e.key === 'Enter' && handleLeadSearch()}
                        />
                      </div>
                      <div className="w-full md:w-48">
                        <Label>Time Filter</Label>
                        <Select value={leadTimeFilter} onValueChange={setLeadTimeFilter}>
                          <SelectTrigger>
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="qdr:d">Last 24 hours</SelectItem>
                            <SelectItem value="qdr:w">Last week</SelectItem>
                            <SelectItem value="qdr:m">Last month</SelectItem>
                            <SelectItem value="qdr:y">Last year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={() => handleLeadSearch()} 
                        disabled={isLoading || !leadQuery}
                        className="self-end"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search Leads'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Saved Leads Tab */}
            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookmarkCheck className="h-5 w-5" />
                    Saved Leads ({savedLeads.length})
                  </CardTitle>
                  <CardDescription>
                    Manage your saved leads for follow-up and outreach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : savedLeads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No saved leads yet</p>
                      <p className="text-sm">Search for leads and save promising ones for follow-up</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {savedLeads.map((lead) => (
                        <div key={lead.id} className="p-4 border rounded-lg space-y-3 hover:border-primary/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={
                                  lead.status === 'contacted' ? 'default' :
                                  lead.status === 'qualified' ? 'secondary' :
                                  lead.status === 'converted' ? 'default' : 'outline'
                                }>
                                  {lead.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {lead.priority} priority
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-foreground">{lead.title}</h3>
                              {lead.description && (
                                <p className="text-sm text-muted-foreground mt-1">{lead.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a 
                                href={lead.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1 text-sm"
                              >
                                Visit <ExternalLink className="h-3 w-3" />
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteLead(lead.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Status & Priority Controls */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t">
                            <Select 
                              value={lead.status} 
                              onValueChange={(value) => updateLead({ id: lead.id, updates: { status: value } })}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select 
                              value={lead.priority} 
                              onValueChange={(value) => updateLead({ id: lead.id, updates: { priority: value } })}
                            >
                              <SelectTrigger className="w-28 h-8 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                              <Clock className="h-3 w-3" />
                              {new Date(lead.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Contact Info Display */}
                          {lead.contact_info && (lead.contact_info.emails?.length || lead.contact_info.phones?.length) && (
                            <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">
                                📋 Extracted Contact Info
                              </p>
                              <div className="flex flex-wrap gap-3 text-sm">
                                {lead.contact_info.emails?.map((email, i) => (
                                  <a 
                                    key={i}
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-1 text-primary hover:underline"
                                  >
                                    <Mail className="h-3 w-3" />
                                    {email}
                                  </a>
                                ))}
                                {lead.contact_info.phones?.map((phone, i) => (
                                  <a 
                                    key={i}
                                    href={`tel:${phone.replace(/\D/g, '')}`}
                                    className="flex items-center gap-1 text-primary hover:underline"
                                  >
                                    <Phone className="h-3 w-3" />
                                    {phone}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {lead.source_query && (
                            <p className="text-xs text-muted-foreground">
                              Source: "{lead.source_query}"
                            </p>
                          )}

                          {lead.content_preview && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-primary font-medium">View Content</summary>
                              <pre className="mt-2 p-3 bg-muted rounded text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {lead.content_preview}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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

                {/* Lead Results */}
                {results.type === 'leads' && results.data?.data && (
                  <div className="space-y-4">
                    {results.query && (
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm"><strong>Search:</strong> {results.query}</p>
                        <p className="text-xs text-muted-foreground mt-1">Found {results.data.data.length} potential leads</p>
                      </div>
                    )}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {results.data.data.map((item: any, i: number) => (
                        <div key={i} className="p-4 border rounded-lg space-y-2 hover:border-primary/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-2">{i + 1}</Badge>
                              <h3 className="font-semibold text-foreground">{item.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant={isUrlSaved(item.url) ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => saveLead({
                                  title: item.title,
                                  url: item.url,
                                  description: item.description,
                                  content_preview: item.markdown,
                                  source_query: results.query,
                                  lead_type: 'research',
                                })}
                                disabled={isUrlSaved(item.url) || isSaving(item.url)}
                              >
                                {isSaving(item.url) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isUrlSaved(item.url) ? (
                                  <><BookmarkCheck className="h-4 w-4 mr-1" /> Saved</>
                                ) : (
                                  <><Bookmark className="h-4 w-4 mr-1" /> Save</>
                                )}
                              </Button>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1 text-sm"
                              >
                                Visit <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          {item.markdown && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-primary font-medium">View Full Content</summary>
                              <pre className="mt-2 p-3 bg-muted rounded text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">
                                {item.markdown.slice(0, 3000)}{item.markdown.length > 3000 ? '...' : ''}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
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
