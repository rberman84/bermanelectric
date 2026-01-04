import StructuredData from "../town/StructuredData";

export interface ImageData {
  url: string;
  caption?: string;
  name?: string;
  width?: number;
  height?: number;
  contentLocation?: string;
}

interface ImageObjectSchemaProps {
  images: ImageData[];
  pageUrl?: string;
}

/**
 * ImageObjectSchema - Rich image markup for Google Images search
 * Helps images appear in Google Image search with proper attribution
 */
const ImageObjectSchema = ({ images, pageUrl }: ImageObjectSchemaProps) => {
  const baseUrl = "https://bermanelectrical.com";
  
  const schemas = images.map((image, index) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${pageUrl || baseUrl}/#image-${index}`,
    "url": image.url.startsWith("http") ? image.url : `${baseUrl}${image.url}`,
    "contentUrl": image.url.startsWith("http") ? image.url : `${baseUrl}${image.url}`,
    ...(image.name && { "name": image.name }),
    ...(image.caption && { "caption": image.caption }),
    ...(image.width && { "width": image.width }),
    ...(image.height && { "height": image.height }),
    ...(image.contentLocation && {
      "contentLocation": {
        "@type": "Place",
        "name": image.contentLocation
      }
    }),
    "copyrightHolder": {
      "@type": "LocalBusiness",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric"
    },
    "creditText": "Berman Electric",
    "creator": {
      "@type": "LocalBusiness",
      "name": "Berman Electric"
    },
    "acquireLicensePage": "https://bermanelectrical.com/contact"
  }));

  return <StructuredData data={schemas} id="image-object-schema" />;
};

export default ImageObjectSchema;
