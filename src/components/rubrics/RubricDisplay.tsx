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
  ContentSpecificRubric,
  SkillFocusedRubric,
  DevelopmentalRubric,
  PrimaryTraitRubric,
  TaskSpecificRubric,
  StandardsBasedRubric,
} from '@/lib/types/rubrics-types';


export default function RubricDisplay({ rubric }: { rubric: RubricState | null }) {
  console.log(rubric);

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
    case RubricType.ContentSpecific:
      return renderContentSpecificCriteria(rubric as ContentSpecificRubric);
    case RubricType.SkillFocused:
      return renderSkillFocusedCriteria(rubric as SkillFocusedRubric);
    case RubricType.Developmental:
      return renderDevelopmentalCriteria(rubric as DevelopmentalRubric);
    case RubricType.PrimaryTrait:
      return renderPrimaryTraitCriteria(rubric as PrimaryTraitRubric);
    case RubricType.TaskSpecific:
      return renderTaskSpecificCriteria(rubric as TaskSpecificRubric);
    case RubricType.StandardsBased:
      return renderStandardsBasedCriteria(rubric as StandardsBasedRubric);
    default:
      return <div>Unknown rubric type</div>;
  }
}




// Renderer for Holistic rubrics
function renderOverallCriteria(rubric: HolisticRubric) {
  return (
    <div>
      {Object.entries(rubric.criteria).map(([levelName, description], index) => (
        <div key={`level-${index}`} className="mb-2">
          <span className=" font-semibold">{levelName}: </span>
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
      {rubric.description && (
        <p className="mb-4">{rubric.description}</p>
      )}
      {Object.entries(rubric.criteria).map(([criterionName, levels], index) => (
        <div key={`criterion-${index}`} className="mb-4">
          <h3 className="font-semibold mb-2">{criterionName}</h3>
          {typeof levels === 'object' && levels !== null && (
            <div className="ml-4">
              {Object.entries(levels).map(([levelName, description], levelIndex) => (
                <div key={`level-${levelIndex}`} className="mb-2">
                  <span className="font-medium">{levelName}: </span>
                  <span className="text-gray-600">{renderContent(description)}</span>
                </div>
              ))}
            </div>
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
      <h3 className="font-semibold mb-2">Single-Point Rubric</h3>
      {rubric.description && (
        <p className="mb-4">{rubric.description}</p>
      )}
      <div className="mb-4">
        <div className="font-semibold">Proficient</div>
        <div className="text-gray-600">{renderContent(rubric.criteria.Proficient)}</div>
      </div>
      {rubric.feedback && (
        <>
          <div className="ml-4 mb-2">
            <div className="font-semibold">Strengths</div>
            <div className="text-gray-600">{rubric.feedback.Strengths || "No feedback provided"}</div>
          </div>
          <div className="ml-4">
            <div className="font-semibold">Areas for Improvement</div>
            <div className="text-gray-600">{rubric.feedback["Areas for Improvement"] || "No feedback provided"}</div>
          </div>
        </>
      )}
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

function renderContentSpecificCriteria(rubric: ContentSpecificRubric) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Content-Specific Rubric</h3>
      {Object.entries(rubric.criteria).map(([criterionName, criterionData], index) => (
        <div key={`criterion-${index}`} className="mb-4">
          <h4 className="font-medium">{criterionName}</h4>
          {typeof criterionData === 'object' && criterionData !== null && (
            <>
              {'description' in criterionData && criterionData.description && (
                <p className="ml-2 mb-2">{renderContent(criterionData.description)}</p>
              )}
              {'levels' in criterionData && criterionData.levels && (
                <div className="ml-4">
                  {Object.entries(criterionData.levels).map(([levelName, description], levelIndex) => (
                    <div key={`level-${levelIndex}`} className="mb-2">
                      <span className="font-medium">{levelName}: </span>
                      <span>{renderContent(description)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function renderSkillFocusedCriteria(rubric: SkillFocusedRubric) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Skill-Focused Rubric</h3>
      {rubric.description && (
        <p className="mb-4">{rubric.description}</p>
      )}
      {Object.entries(rubric.criteria).map(([skillName, levels], index) => (
        <div key={`skill-${index}`} className="mb-4">
          <h4 className="font-medium">{skillName}</h4>
          {typeof levels === 'object' && levels !== null && (
            <div className="ml-4">
              {Object.entries(levels).map(([levelName, description], levelIndex) => (
                <div key={`level-${levelIndex}`} className="mb-2 flex">
                  <span className="font-medium">{levelName}: </span>
                  <span className="text-gray-600 ml-1">{renderContent(description)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderDevelopmentalCriteria(rubric: DevelopmentalRubric) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Developmental Rubric</h3>
      {rubric.description && (
        <p className="mb-4">{rubric.description}</p>
      )}
      {Object.entries(rubric.criteria).map(([criterionName, levels], index) => (
        <div key={`criterion-${index}`} className="mb-4">
          <h4 className="font-medium">{criterionName}</h4>
          {typeof levels === 'object' && levels !== null && (
            <div className="ml-4">
              {Object.entries(levels).map(([levelName, description], levelIndex) => (
                <div key={`level-${levelIndex}`} className="mb-2">
                  <span className="font-medium">{levelName}: </span>
                  <span>{renderContent(description)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderPrimaryTraitCriteria(rubric: PrimaryTraitRubric) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Primary Trait Rubric</h3>
      {Object.entries(rubric.criteria).map(([traitName, traitData], index) => (
        <div key={`trait-${index}`} className="mb-4">
          <h4 className="font-medium">{traitName}</h4>
          {typeof traitData === 'object' && traitData !== null && (
            <>
              {'description' in traitData && traitData.description && (
                <p className="ml-2 mb-2">{renderContent(traitData.description)}</p>
              )}
              {'levels' in traitData && traitData.levels && (
                <div className="ml-4">
                  {Object.entries(traitData.levels).map(([levelName, description], levelIndex) => (
                    <div key={`level-${levelIndex}`} className="mb-2">
                      <span className="font-medium">{levelName}: </span>
                      <span>{description}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function renderTaskSpecificCriteria(rubric: TaskSpecificRubric) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Task-Specific Rubric</h3>
      {rubric.description && (
        <p className="mb-4">{rubric.description}</p>
      )}
      {Object.entries(rubric.criteria).map(([criterionName, levels], index) => (
        <div key={`criterion-${index}`} className="mb-4">
          <h4 className="font-medium">{criterionName}</h4>
          {typeof levels === 'object' && levels !== null && (
            <div className="ml-4">
              {Object.entries(levels).map(([levelName, description], levelIndex) => (
                <div key={`level-${levelIndex}`} className="mb-2">
                  <span className="font-medium min-w-[80px]">{levelName}: </span>
                  <span className="text-gray-600 ml-1">{renderContent(description)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderStandardsBasedCriteria(rubric: StandardsBasedRubric) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Standards-Based Rubric</h3>
      {Object.entries(rubric.criteria).map(([standardName, standardData], index) => (
        <div key={`standard-${index}`} className="mb-4">
          <h4 className="font-medium">{standardName}</h4>
          {typeof standardData === 'object' && standardData !== null && (
            <>
              {'description' in standardData && standardData.description && (
                <p className="ml-2 mb-2">{renderContent(standardData.description)}</p>
              )}
              {'levels' in standardData && standardData.levels && (
                <div className="ml-4">
                  {Object.entries(standardData.levels).map(([levelName, description], levelIndex) => (
                    <div key={`level-${levelIndex}`} className="mb-2">
                      <span className="font-medium">{levelName}: </span>
                      <span>{description}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
