import { Facebook, Twitter, Linkedin, Link2, Mail } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  hashtags?: string[];
}

const SocialShare = ({ title, url, description = '', hashtags = [] }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : '';

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${hashtagString}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Share this article:</span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => handleShare('email')}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
          title="Share via Email"
          aria-label="Share via Email"
        >
          <Mail className="w-4 h-4" />
        </button>
        
        <button
          onClick={copyToClipboard}
          className="p-2 text-gray-600 hover:text-electric-600 hover:bg-electric-50 rounded-full transition-colors relative"
          title="Copy link"
          aria-label="Copy link"
        >
          <Link2 className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-900 text-white px-2 py-1 rounded">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;