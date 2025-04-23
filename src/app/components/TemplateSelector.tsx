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
      <h3 className="text-md font-semibold mb-3 text-pink-600">Select Template</h3>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedTemplateId === template.id
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
            }`}
            onClick={() => onSelectTemplate(template.id)}
            title={template.description}
          >
            {template.name}
          </button>
        ))}
      </div>
      
      {/* Display description of currently selected template */}
      {selectedTemplateId && (
        <div className="mt-3 text-sm text-gray-600 bg-white p-2 rounded-md border border-gray-200">
          <p>{templates.find(t => t.id === selectedTemplateId)?.description || ''}</p>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector; 