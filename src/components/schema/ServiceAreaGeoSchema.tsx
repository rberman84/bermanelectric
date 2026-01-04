import StructuredData from "../town/StructuredData";

interface ServiceAreaGeoSchemaProps {
  areas?: Array<{
    name: string;
    polygon?: [number, number][];
    circle?: { lat: number; lng: number; radius: number };
  }>;
}

/**
 * ServiceAreaGeoSchema - Defines exact service boundaries using GeoShape
 * This helps Google understand the precise geographic coverage
 */
const ServiceAreaGeoSchema = ({ areas }: ServiceAreaGeoSchemaProps) => {
  // Default Long Island service area polygon (Nassau + Suffolk Counties)
  const defaultPolygon: [number, number][] = [
    [40.5934, -73.7004], // Southwest - Queens border
    [40.6137, -73.4751], // South shore - Valley Stream area
    [40.6054, -73.2239], // South shore - Babylon
    [40.7282, -72.8622], // South shore - Shirley
    [40.8771, -72.6505], // East end - Riverhead
    [41.0294, -72.2885], // North Fork tip
    [41.1510, -72.1697], // Orient Point
    [41.1355, -71.9304], // Plum Island area
    [40.9444, -72.2917], // Shelter Island
    [40.8771, -72.6505], // Back to Riverhead
    [40.9036, -73.0564], // North shore - Port Jefferson
    [40.9281, -73.3600], // North shore - Oyster Bay
    [40.8762, -73.5583], // North shore - Great Neck
    [40.7778, -73.7197], // Northwest - Little Neck
    [40.5934, -73.7004], // Close polygon
  ];

  const defaultAreas = [
    {
      name: "Long Island Service Area",
      polygon: defaultPolygon
    },
    {
      name: "Nassau County",
      circle: { lat: 40.7376, lng: -73.5892, radius: 20000 }
    },
    {
      name: "Suffolk County", 
      circle: { lat: 40.8298, lng: -72.9784, radius: 35000 }
    }
  ];

  const areasToUse = areas || defaultAreas;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://bermanelectrical.com/#localbusiness",
    "name": "Berman Electric",
    "areaServed": areasToUse.map(area => {
      if (area.polygon) {
        return {
          "@type": "GeoShape",
          "name": area.name,
          "polygon": area.polygon.map(([lat, lng]) => `${lat},${lng}`).join(" ")
        };
      }
      if (area.circle) {
        return {
          "@type": "GeoCircle",
          "name": area.name,
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": area.circle.lat,
            "longitude": area.circle.lng
          },
          "geoRadius": area.circle.radius
        };
      }
      return {
        "@type": "AdministrativeArea",
        "name": area.name
      };
    })
  };

  return <StructuredData data={schema} id="service-area-geo-schema" />;
};

export default ServiceAreaGeoSchema;
