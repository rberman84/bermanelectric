import StructuredData from "../town/StructuredData";

export interface QAItem {
  question: string;
  answer: string;
  upvoteCount?: number;
  dateCreated?: string;
}

interface QASchemaProps {
  questions: QAItem[];
}

const QASchema = ({ questions }: QASchemaProps) => {
  const schema = questions.map((qa, index) => ({
    "@context": "https://schema.org",
    "@type": "Question",
    "@id": `https://bermanelectrical.com/#question-${index}`,
    "name": qa.question,
    "text": qa.question,
    ...(qa.upvoteCount && { "upvoteCount": qa.upvoteCount }),
    ...(qa.dateCreated && { "dateCreated": qa.dateCreated }),
    "acceptedAnswer": {
      "@type": "Answer",
      "text": qa.answer,
      "author": {
        "@type": "Person",
        "name": "Robert Berman",
        "jobTitle": "Master Electrician",
        "worksFor": {
          "@type": "Organization",
          "@id": "https://bermanelectrical.com/#organization",
          "name": "Berman Electric"
        }
      }
    },
    "answerCount": 1,
    "suggestedAnswer": []
  }));

  return <StructuredData data={schema} id="qa-schema" />;
};

export default QASchema;
