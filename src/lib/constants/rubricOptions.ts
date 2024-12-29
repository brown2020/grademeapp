export const rubricOptions = [
  {
    id: 1,
    rubric_name: "Analytical Rubric",
    rubric_description:
      "Breaks down an assignment into multiple criteria, each evaluated separately (e.g., content, grammar, structure).",
    prompt_engineering:
      "Grade this paper by evaluating the following criteria: content, organization, grammar, and citations. For each criterion, provide a score out of 10 and a short explanation of how the paper meets or fails to meet expectations.",
  },
  {
    id: 2,
    rubric_name: "Holistic Rubric",
    rubric_description:
      "Assesses student work as a whole rather than by individual components.",
    prompt_engineering:
      "Assess the overall quality of this paper based on its effectiveness, clarity, and coherence. Provide a single score out of 10 and a summary of strengths and weaknesses.",
  },
  {
    id: 3,
    rubric_name: "Single-Point Rubric",
    rubric_description:
      "Focuses on proficiency with a single level of achievement for each criterion, leaving space for personalized feedback.",
    prompt_engineering:
      "Evaluate whether this paper meets the expected level of proficiency in the following areas: argument, evidence, and clarity. For each area, provide feedback on what was done well and what could be improved.",
  },
  {
    id: 4,
    rubric_name: "Task-Specific Rubric",
    rubric_description:
      "Designed for a particular assignment or task with specific instructions.",
    prompt_engineering:
      "Grade this paper based on the following specific task requirements: 1) Proper use of APA citation style, 2) A clear thesis statement, 3) A minimum of three peer-reviewed sources, 4) Logical argumentation. Score each item out of 5 and explain your reasoning.",
  },
  {
    id: 5,
    rubric_name: "Developmental Rubric",
    rubric_description:
      "Measures progress over time by evaluating stages of learning or skill development.",
    prompt_engineering:
      "Assess this paper by focusing on the development of skills over time. Comment on how the student has improved in their ability to argue, research, and write. Provide suggestions for future growth and a final score out of 10.",
  },
  {
    id: 6,
    rubric_name: "Primary Trait Rubric",
    rubric_description:
      "Focuses on assessing one key trait or skill within an assignment (e.g., thesis development in an essay).",
    prompt_engineering:
      "Grade this paper with a focus on the development and clarity of the thesis statement. Provide a score out of 10 based on the effectiveness of the thesis and give feedback on how well the argument is supported.",
  },
  {
    id: 7,
    rubric_name: "Checklist Rubric",
    rubric_description:
      "A simple checklist that marks whether specific criteria were met or not.",
    prompt_engineering:
      "Evaluate this paper by checking whether the following criteria have been met: 1) Clear introduction, 2) Use of at least 3 sources, 3) Proper grammar, 4) Logical conclusion. Indicate 'yes' or 'no' for each and provide any additional comments.",
  },
  {
    id: 8,
    rubric_name: "Project-Based Rubric",
    rubric_description:
      "Evaluates both the process and final product of a project, often considering collaboration, research, creativity, and presentation.",
    prompt_engineering:
      "Grade this paper with a focus on the research process, creativity, and presentation. For each of these aspects, provide a score out of 10 and feedback on how effectively the student completed the project.",
  },
  {
    id: 9,
    rubric_name: "Criterion-Referenced Rubric",
    rubric_description:
      "Measures student performance against a set of predetermined criteria or standards.",
    prompt_engineering:
      "Grade this paper by comparing it against the following standards: 1) Strong thesis, 2) Effective use of evidence, 3) Clear structure, 4) Academic writing style. Provide a score out of 5 for each standard and feedback on how well the paper meets them.",
  },
  {
    id: 10,
    rubric_name: "Competency-Based Rubric",
    rubric_description:
      "Assesses whether students have achieved mastery of specific competencies or skills.",
    prompt_engineering:
      "Grade this paper by determining whether the student demonstrates mastery in argumentation, research skills, and writing clarity. For each competency, indicate whether the student has mastered it or needs improvement, and provide feedback on areas of strength and weakness.",
  },
];
