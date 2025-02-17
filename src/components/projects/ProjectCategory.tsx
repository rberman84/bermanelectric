
import { CheckCircle2 } from "lucide-react";

interface Project {
  title: string;
  location: string;
  features: string[];
}

interface ProjectCategoryProps {
  title: string;
  projects: Project[];
}

const ProjectCategory = ({ title, projects }: ProjectCategoryProps) => {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-electric-600 mb-6">{title}</h3>
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h4 className="text-xl font-semibold mb-4">{project.title}</h4>
            <p className="text-gray-600 mb-4">{project.location}</p>
            <ul className="space-y-3">
              {project.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-electric-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCategory;
