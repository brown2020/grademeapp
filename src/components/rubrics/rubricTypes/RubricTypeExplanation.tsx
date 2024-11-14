import React from 'react';

interface RubricTypeExplanationProps {
  selectedType: string;
}

const explanations: Record<string, string> = {
  'holistic': 'Holistic rubrics provide a single, overall assessment of a piece of work. They are useful for quickly evaluating overall quality but may not offer detailed feedback on specific aspects.',
  'analytical': 'Analytical rubrics break down the evaluation into multiple criteria, each assessed separately. They provide detailed feedback on various aspects of the work, allowing for a more comprehensive assessment.',
  'single-point': 'Single-point rubrics define the criteria for proficiency without predetermined levels. They allow for more open-ended feedback and are useful for promoting student self-assessment.',
  'developmental': 'Developmental rubrics focus on student progress over time. They are particularly useful for tracking growth and improvement across multiple assignments or throughout a course.',
  'content-specific': 'Content-specific rubrics are tailored to evaluate particular assignments or tasks within a specific subject area. They provide detailed, context-relevant criteria for assessment.',
  'multi-trait': 'Multi-trait rubrics assess multiple characteristics of performance independently. They are useful for evaluating complex tasks with distinct, important components.',
  'primary-trait': 'Primary trait rubrics focus on a single, key characteristic of performance. They are useful when you want to emphasize and assess one particular aspect of a task.',
  'skill-focused': 'Skill-focused rubrics assess specific skills or competencies. They are useful for tracking the development of particular abilities across various tasks or over time.',
  'standards-based': 'Standards-based rubrics align directly with established educational standards. They help ensure that assessments are tied to specific learning objectives or curriculum requirements.',
  'task-specific': 'Task-specific rubrics are designed for a particular assignment or task. They provide detailed, relevant criteria for evaluating performance on that specific task.'
};

const RubricTypeExplanation: React.FC<RubricTypeExplanationProps> = ({ selectedType }) => {
  const explanation = explanations[selectedType] || 'Please select a rubric type to see its explanation.';

  return (
    <div className="mb-4">
      <p className="text-primary-20">{explanation}</p>
    </div>
  );
};

export default RubricTypeExplanation;