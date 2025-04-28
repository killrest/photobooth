'use client';

import React from 'react';
import { Template } from '../constants/templates';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-3 text-amber-700">Select Template</h3>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedTemplateId === template.id
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:from-amber-600 hover:to-amber-700'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-cream-50 hover:border-amber-300 hover:text-amber-700'
            }`}
            onClick={() => onSelectTemplate(template.id)}
            title={template.description}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector; 