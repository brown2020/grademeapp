"use client"

import React from 'react';
import {
  RubricState,
  RubricType,
  AnalyticalRubric,
  HolisticRubric,
  SinglePointRubric,
  ChecklistRubric,
  MultiTraitRubric,
  OtherRubricType,
} from '@/lib/types/rubrics-types';


export default function RubricDisplay({ rubric }: { rubric: RubricState | null }) {

  if (!rubric) {
    return (
      <div className="w-full h-52 max-h-52 bg-secondary-97 rounded-md border border-dashed border-primary-30 rubric-criteria">
        <div className="flex flex-col p-1 rounded-md text-primary-20">
          <h2 className="text-left font-medium pl-2 pb-1">Rubric Criteria</h2>
          <div className="p-1 rounded-sm">
            <div className="mt-2 p-1 text-xs border-l-2 border-primary-40 h-40 max-h-40 overflow-auto">
              No rubric available
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-52 max-h-52 bg-secondary-97 rounded-md border border-dashed border-primary-30 rubric-criteria">
      <div className="flex flex-col p-1 rounded-md text-primary-20">
        <h2 className="text-left font-medium pl-2 pb-1">Rubric Criteria</h2>
        <div className="p-1 rounded-sm">
          <div className="mt-2 p-1 text-xs border-l-2 border-primary-40 h-40 max-h-40 overflow-auto">
            {renderRubricCriteria(rubric)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Base function to determine which rendering method to use
function renderRubricCriteria(rubric: RubricState) {
  switch (rubric.type) {
    case RubricType.Holistic:
      return renderOverallCriteria(rubric);
    case RubricType.Analytical:
      return renderDetailedCriteria(rubric);
    case RubricType.SinglePoint:
      return renderSinglePointCriteria(rubric as SinglePointRubric);
    case RubricType.Checklist:
      return renderChecklistCriteria(rubric as ChecklistRubric);
    case RubricType.MultiTrait:
      return renderMultiTraitCriteria(rubric as MultiTraitRubric);
    default:
      return renderGenericCriteria(rubric as OtherRubricType);
  }
}

// Generic renderer for rubrics that don't need specific treatment
function renderGenericCriteria(rubric: OtherRubricType) {
  return (
    <div>
      {Object.entries(rubric.criteria).map(([criterion, levels], index) => (
        <div key={`criterion-${index}`} className="mb-4">
          <h3 className=" font-semibold">{criterion}: </h3>
          {/* Check if levels are an object (i.e., for Analytical/MultiTrait), otherwise treat it as a simple string */}
          {typeof levels === 'object' ? (
            Object.entries(levels as Record<string, string>).map(([levelName, description], index) => (
              <div key={`level-${index}`} className="ml-4">
                <span className=" font-semibold">{levelName}: </span>
                <span className=" text-text">{typeof description === 'string' ? description : ''}</span>
              </div>
            ))
          ) : (
            <span className=" text-gray-600 ml-4">{levels as string}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// Renderer for Holistic rubrics
function renderOverallCriteria(rubric: HolisticRubric) {
  return (
    <div>
      {Object.entries(rubric.criteria).map(([levelName, description], index) => (
        <div key={`level-${index}`} className="mb-2">
          <span className=" font-semibold">{levelName}</span>
          <span className=" text-gray-600">{typeof description === 'string' ? description : ''}</span>
        </div>
      ))}
    </div>
  );
}

// Updated Renderer for Analytical rubrics to handle nested criteria
function renderDetailedCriteria(rubric: AnalyticalRubric) {
  return (
    <div>
      {Object.entries(rubric.criteria).map(([criterion, details], index) => (
        <div key={`criterion-${index}`} className="mb-4">
          <h3 className=" font-semibold mb-2">{criterion}</h3>
          {typeof details === 'object' && 'points' in details ? (
            <div>
              <span className="ml-3  font-medium mb-2">Points: {details.points as string | number}</span>
              {Object.entries(details)
                .filter(([detailKey]) => detailKey !== 'key')
                .map(([detailKey, content], index) =>
                  detailKey !== 'points' ? (
                    <div key={`detail-${index}`} className="flex flex-row flex-wrap gap-x-2 ml-3 mb-2">
                      <span className=" font-semibold">{detailKey}: </span>
                      <span>{renderContent(content)}</span>
                    </div>
                  ) : null
                )}
            </div>
          ) : (
            renderContent(details)
          )}
        </div>
      ))}
    </div>
  );
}

// Recursive function to render content
function renderContent(content: unknown): React.ReactNode {
  if (typeof content === 'string' || typeof content === 'number') {
    return <div className="text-gray-600">{content}</div>;
  } else if (Array.isArray(content)) {
    return content.map((item, index) => (
      <div key={`item-${index}`} className="text-gray-600 ml-3">
        {renderContent(item)}
      </div>
    ));
  } else if (React.isValidElement(content)) {
    // If content is a React element, render it directly
    return content;
  } else if (typeof content === 'object' && content !== null) {
    return (
      <div className="ml-3">
        {Object.entries(content)
          .filter(([entryKey]) => entryKey !== 'key') // Exclude 'key'
          .map(([entryKey, value], index) => {
            const uniqueKey = `entry-${index}-${entryKey}`;
            return (
              <div className="flex flex-row flex-wrap gap-2" key={uniqueKey}>
                <div className="font-semibold">{entryKey}: </div>
                <div>{renderContent(value)}</div>
              </div>
            );
          })}
      </div>
    );
  } else {
    return null;
  }
}

// Renderer for Single-Point rubrics
function renderSinglePointCriteria(rubric: SinglePointRubric) {
  return (
    <div>
      <div className="mb-4">
        <div className=" font-semibold">Proficient</div>
        <div className=" text-gray-600">{typeof rubric.criteria.Proficient === 'string' ? rubric.criteria.Proficient : ''}</div>
      </div>
      <div className="ml-4">
        <div className=" font-semibold">Strengths</div>
        <div className=" text-gray-600">{rubric.feedback?.Strengths || "No feedback provided"}</div>
      </div>
      <div className="ml-4">
        <div className=" font-semibold">Areas for Improvement</div>
        <div className=" text-gray-600">{rubric.feedback?.["Areas for Improvement"] || "No feedback provided"}</div>
      </div>
    </div>
  );
}

// Renderer for Checklist rubrics
function renderChecklistCriteria(rubric: ChecklistRubric) {
  return (
    <div>
      {Object.entries(rubric.criteria).map(([requirement, response]) => (
        <div key={requirement} className="mb-2">
          <div className=" font-semibold">{requirement}</div>
          <div className=" text-gray-600">{renderContent(response)}</div>
        </div>
      ))}
    </div>
  );
}

// Renderer for Multi-Trait rubrics
function renderMultiTraitCriteria(rubric: MultiTraitRubric) {
  return (
    <div>
      {Object.entries(rubric.criteria).map(([criterionName, criterion]) => (
        <div key={criterionName} className="mb-4">
          <h3 className="font-semibold">{criterionName}: </h3>
          <span className="text-gray-600 ml-2">{criterion.description}</span>
          {Object.entries(criterion.subCriteria).map(([subCriterionId, subCriterion]) => (
            <div key={subCriterionId} className="ml-4 mt-2">
              <h4 className="font-medium">{subCriterion.description}: </h4>
              <div className="ml-2">
                {Object.entries(subCriterion.levels).map(([levelName, description]) => (
                  <div key={levelName} className="flex flex-row gap-x-2">
                    <span className="font-semibold">{levelName}: </span>
                    <span className="text-gray-600">{description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
