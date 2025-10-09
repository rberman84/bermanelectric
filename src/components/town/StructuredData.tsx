import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  data: unknown | unknown[];
  id?: string;
}

const StructuredData = ({ data, id }: StructuredDataProps) => {
  const payload = Array.isArray(data) ? data : [data];
  const scriptContent = payload.length === 1 ? payload[0] : payload;

  return (
    <Helmet>
      <script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(scriptContent, null, 2),
        }}
      />
    </Helmet>
  );
};

export default StructuredData;
