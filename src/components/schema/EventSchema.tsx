import StructuredData from "../town/StructuredData";

export interface EventData {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  offers?: {
    price?: number;
    priceCurrency?: string;
    availability?: "InStock" | "SoldOut" | "PreOrder";
    validFrom?: string;
  };
  eventType?: "Sale" | "EducationEvent" | "BusinessEvent";
}

interface EventSchemaProps {
  events: EventData[];
}

/**
 * EventSchema - For seasonal promotions and special offers
 * Helps with event rich snippets in search results
 */
const EventSchema = ({ events }: EventSchemaProps) => {
  const schemas = events.map((event, index) => ({
    "@context": "https://schema.org",
    "@type": event.eventType || "Event",
    "@id": `https://bermanelectrical.com/#event-${index}`,
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    ...(event.endDate && { "endDate": event.endDate }),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location || "Long Island, NY",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ronkonkoma",
        "addressRegion": "NY",
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "LocalBusiness",
      "@id": "https://bermanelectrical.com/#organization",
      "name": "Berman Electric",
      "url": "https://bermanelectrical.com"
    },
    ...(event.offers && {
      "offers": {
        "@type": "Offer",
        "url": "https://bermanelectrical.com/contact",
        "priceCurrency": event.offers.priceCurrency || "USD",
        ...(event.offers.price !== undefined && { "price": event.offers.price }),
        "availability": `https://schema.org/${event.offers.availability || "InStock"}`,
        ...(event.offers.validFrom && { "validFrom": event.offers.validFrom })
      }
    })
  }));

  return <StructuredData data={schemas} id="event-schema" />;
};

export default EventSchema;
