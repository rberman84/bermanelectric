import StructuredData from "../town/StructuredData";

interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}

const VideoSchema = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl
}: VideoSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    ...(duration && { "duration": duration }),
    ...(contentUrl && { "contentUrl": contentUrl }),
    ...(embedUrl && { "embedUrl": embedUrl }),
    "publisher": {
      "@type": "Organization",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bermanelectrical.com/logo-optimized.webp"
      }
    }
  };

  return <StructuredData data={schema} id="video-schema" />;
};

export default VideoSchema;
