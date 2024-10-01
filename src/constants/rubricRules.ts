interface RubricRules {
    [identity: string]: {
        [identityLevel: string]: {
            [textType: string]: {
                [prose: string]: string;
            };
        };
    };
}

export const rubricRules: RubricRules = {
    "student": {
        "3rd grade": {
            "narrative": {
                "personal narrative": "3rd Grade Holistic Personal Narrative Rubric", // Typically holistic
                "short story": "3rd Grade Holistic Short Story Rubric" // Typically holistic
            },
            "descriptive": {
                "descriptive essay": "3rd Grade Analytical Descriptive Essay Rubric", // Analytical to assess details and organization
                "character sketch": "3rd Grade Analytical Character Sketch Rubric", // Analytical to focus on character detail
                "place description": "3rd Grade Analytical Place Description Rubric" // Analytical to evaluate descriptive detail
            },
            "argumentative/persuasive": {
                "persuasive essay": "3rd Grade Analytical Persuasive Essay Rubric" // Analytical to assess argument and support
            },
            "expository": {
                "informational article": "3rd Grade Analytical Informational Article Rubric", // Analytical to assess clarity and factual content
                "report": "3rd Grade Analytical Report Rubric" // Analytical for structure and detail
            },
            "reflective": {
                "journal entry": "3rd Grade Holistic Journal Entry Rubric" // Holistic to focus on overall reflection and expression
            },
            "instructional": {
                "how-to guide": "3rd Grade Analytical How-To Guide Rubric" // Analytical to check for steps and clarity
            }
        },
        "4th grade": {
            "narrative": {
                "personal narrative": "4th Grade Holistic Personal Narrative Rubric", // Holistic to encourage creativity and voice
                "short story": "4th Grade Holistic Short Story Rubric" // Holistic for creative writing
            },
            "descriptive": {
                "descriptive essay": "4th Grade Analytical Descriptive Essay Rubric", // Analytical for focus on detail and structure
                "character sketch": "4th Grade Analytical Character Sketch Rubric", // Analytical to evaluate character portrayal
                "place description": "4th Grade Analytical Place Description Rubric" // Analytical for use of sensory detail
            },
            "argumentative/persuasive": {
                "persuasive essay": "4th Grade Analytical Persuasive Essay Rubric", // Analytical to assess structure, argument, and evidence
                "opinion piece": "4th Grade Analytical Opinion Piece Rubric" // Analytical to focus on opinion clarity and reasoning
            },
            "expository": {
                "informational article": "4th Grade Analytical Informational Article Rubric", // Analytical for content organization and factual support
                "report": "4th Grade Analytical Report Rubric", // Analytical for structure, research, and presentation of facts
                "explanatory essay": "4th Grade Analytical Explanatory Essay Rubric" // Analytical for clear explanations and transitions
            },
            "reflective": {
                "journal entry": "4th Grade Holistic Journal Entry Rubric", // Holistic to emphasize personal expression
                "reflective essay": "4th Grade Holistic Reflective Essay Rubric" // Holistic for overall depth and self-reflection
            },
            "instructional": {
                "how-to guide": "4th Grade Analytical How-To Guide Rubric" // Analytical for step-by-step clarity and effectiveness
            }
        },
        "5th grade": {
            "narrative": {
                "personal narrative": "5th Grade Holistic Personal Narrative Rubric", // Holistic for focus on storytelling
                "short story": "5th Grade Holistic Short Story Rubric" // Holistic for creative development
            },
            "descriptive": {
                "descriptive essay": "5th Grade Analytical Descriptive Essay Rubric", // Analytical to assess vivid detail and language use
                "character sketch": "5th Grade Analytical Character Sketch Rubric", // Analytical for character depth and description
                "place description": "5th Grade Analytical Place Description Rubric" // Analytical to evaluate descriptive accuracy
            },
            "argumentative/persuasive": {
                "persuasive essay": "5th Grade Analytical Persuasive Essay Rubric", // Analytical to focus on argument structure and evidence
                "opinion piece": "5th Grade Analytical Opinion Piece Rubric", // Analytical for reasoned opinion expression
                "debate speech": "5th Grade Analytical Debate Speech Rubric" // Analytical to assess argument and speaking skills
            },
            "expository": {
                "informational article": "5th Grade Analytical Informational Article Rubric", // Analytical to evaluate organization and information clarity
                "report": "5th Grade Analytical Report Rubric", // Analytical to focus on structure, research, and presentation
                "explanatory essay": "5th Grade Analytical Explanatory Essay Rubric", // Analytical for explaining complex ideas clearly
                "research paper": "5th Grade Analytical Research Paper Rubric" // Analytical to assess research and structure
            },
            "reflective": {
                "journal entry": "5th Grade Holistic Journal Entry Rubric", // Holistic to encourage depth of thought
                "reflective essay": "5th Grade Holistic Reflective Essay Rubric" // Holistic for self-reflection and insight
            },
            "instructional": {
                "how-to guide": "5th Grade Analytical How-To Guide Rubric", // Analytical for clear instructions and structure
                "step-by-step guide": "5th Grade Analytical Step-By-Step Guide Rubric" // Analytical for sequential clarity
            }
        },
        "6th grade": {
            narrative: {
                "personal narrative": "6th Grade Holistic Personal Narrative Rubric",
                "short story": "6th Grade Holistic Short Story Rubric"
            },
            descriptive: {
                "descriptive essay": "6th Grade Analytical Descriptive Essay Rubric",
                "character sketch": "6th Grade Analytical Character Sketch Rubric",
                "place description": "6th Grade Analytical Place Description Rubric"
            },
            "argumentative/persuasive": {
                "persuasive essay": "6th Grade Analytical Persuasive Essay Rubric",
                "opinion piece": "6th Grade Analytical Opinion Piece Rubric",
                "debate speech": "6th Grade Analytical Debate Speech Rubric"
            },
            expository: {
                "informational article": "6th Grade Analytical Informational Article Rubric",
                report: "6th Grade Analytical Report Rubric",
                "explanatory essay": "6th Grade Analytical Explanatory Essay Rubric",
                "research paper": "6th Grade Analytical Research Paper Rubric"
            },
            reflective: {
                "journal entry": "6th Grade Holistic Journal Entry Rubric",
                "reflective essay": "6th Grade Holistic Reflective Essay Rubric"
            },
            instructional: {
                "how-to guide": "6th Grade Analytical How-To Guide Rubric",
                "step-by-step guide": "6th Grade Analytical Step-By-Step Guide Rubric"
            }
        },
        "7th grade": {
            narrative: {
                "personal narrative": "7th Grade Holistic Personal Narrative Rubric",
                "short story": "7th Grade Holistic Short Story Rubric"
            },
            descriptive: {
                "descriptive essay": "7th Grade Analytical Descriptive Essay Rubric",
                "character sketch": "7th Grade Analytical Character Sketch Rubric",
                "place description": "7th Grade Analytical Place Description Rubric"
            },
            "argumentative/persuasive": {
                "persuasive essay": "7th Grade Analytical Persuasive Essay Rubric",
                "opinion piece": "7th Grade Analytical Opinion Piece Rubric",
                "debate speech": "7th Grade Analytical Debate Speech Rubric",
                "editorial": "7th Grade Analytical Editorial Rubric"
            },
            expository: {
                "informational article": "7th Grade Analytical Informational Article Rubric",
                report: "7th Grade Analytical Report Rubric",
                "explanatory essay": "7th Grade Analytical Explanatory Essay Rubric",
                "research paper": "7th Grade Analytical Research Paper Rubric"
            },
            reflective: {
                "journal entry": "7th Grade Holistic Journal Entry Rubric",
                "reflective essay": "7th Grade Holistic Reflective Essay Rubric"
            },
            instructional: {
                "how-to guide": "7th Grade Analytical How-To Guide Rubric",
                "step-by-step guide": "7th Grade Analytical Step-By-Step Guide Rubric"
            }
        },
        "8th grade": {
            narrative: {
                "personal narrative": "8th Grade Holistic Personal Narrative Rubric",
                "short story": "8th Grade Holistic Short Story Rubric",
                "memoir": "8th Grade Holistic Memoir Rubric"
            },
            descriptive: {
                "descriptive essay": "8th Grade Analytical Descriptive Essay Rubric",
                "character sketch": "8th Grade Analytical Character Sketch Rubric",
                "place description": "8th Grade Analytical Place Description Rubric"
            },
            "argumentative/persuasive": {
                "persuasive essay": "8th Grade Analytical Persuasive Essay Rubric",
                "opinion piece": "8th Grade Analytical Opinion Piece Rubric",
                "debate speech": "8th Grade Analytical Debate Speech Rubric",
                "editorial": "8th Grade Analytical Editorial Rubric",
                "letter to the editor": "8th Grade Analytical Letter to the Editor Rubric"
            },
            expository: {
                "informational article": "8th Grade Analytical Informational Article Rubric",
                report: "8th Grade Analytical Report Rubric",
                "explanatory essay": "8th Grade Analytical Explanatory Essay Rubric",
                "research paper": "8th Grade Analytical Research Paper Rubric"
            },
            reflective: {
                "journal entry": "8th Grade Holistic Journal Entry Rubric",
                "reflective essay": "8th Grade Holistic Reflective Essay Rubric"
            },
            instructional: {
                "how-to guide": "8th Grade Analytical How-To Guide Rubric",
                "step-by-step guide": "8th Grade Analytical Step-By-Step Guide Rubric",
                "procedure write-up": "8th Grade Analytical Procedure Write-Up Rubric"
            }
        },
        "9th grade": {
            narrative: {
                "personal narrative": "9th Grade Holistic Personal Narrative Rubric", // Holistic to focus on storytelling and self-expression
                "short story": "9th Grade Holistic Short Story Rubric", // Holistic for creative writing and literary elements
                "memoir": "9th Grade Holistic Memoir Rubric" // Holistic for deeper personal reflection
            },
            descriptive: {
                "descriptive essay": "9th Grade Analytical Descriptive Essay Rubric", // Analytical for vivid imagery and structure
                "character sketch": "9th Grade Analytical Character Sketch Rubric", // Analytical for depth and portrayal of character
                "place description": "9th Grade Analytical Place Description Rubric" // Analytical for sensory detail and vividness
            },
            "argumentative/persuasive": {
                "persuasive essay": "9th Grade Analytical Persuasive Essay Rubric", // Analytical for structure, argumentation, and evidence
                "opinion piece": "9th Grade Analytical Opinion Piece Rubric", // Analytical to assess opinion clarity and reasoning
                "debate speech": "9th Grade Analytical Debate Speech Rubric", // Analytical to evaluate argument strength and speaking skills
                "editorial": "9th Grade Analytical Editorial Rubric" // Analytical for persuasion and style in public discourse
            },
            expository: {
                "informational article": "9th Grade Analytical Informational Article Rubric", // Analytical for organization and factual accuracy
                report: "9th Grade Analytical Report Rubric", // Analytical for clear reporting of facts and ideas
                "explanatory essay": "9th Grade Analytical Explanatory Essay Rubric", // Analytical to assess clear and structured explanation
                "research paper": "9th Grade Analytical Research Paper Rubric" // Analytical for research skills and information synthesis
            },
            reflective: {
                "journal entry": "9th Grade Holistic Journal Entry Rubric", // Holistic for depth of thought and self-expression
                "reflective essay": "9th Grade Holistic Reflective Essay Rubric" // Holistic to evaluate self-reflection and insight
            },
            instructional: {
                "how-to guide": "9th Grade Analytical How-To Guide Rubric", // Analytical for clarity of instruction and logical flow
                "step-by-step guide": "9th Grade Analytical Step-By-Step Guide Rubric", // Analytical to ensure comprehensiveness of steps
                "procedure write-up": "9th Grade Analytical Procedure Write-Up Rubric" // Analytical for precise and logical sequence
            },
            critical: {
                "literary analysis": "9th Grade Analytical Literary Analysis Rubric", // Analytical for depth of analysis and critical thought
                "critical review": "9th Grade Analytical Critical Review Rubric" // Analytical for evaluation of a subject (e.g., book, film)
            }
        },
        "10th grade": {
            narrative: {
                "personal narrative": "10th Grade Holistic Personal Narrative Rubric", // Holistic for advanced storytelling and emotional connection
                "short story": "10th Grade Holistic Short Story Rubric", // Holistic for literary creativity and expression
                "memoir": "10th Grade Holistic Memoir Rubric" // Holistic for deep personal insights and life experiences
            },
            descriptive: {
                "descriptive essay": "10th Grade Analytical Descriptive Essay Rubric", // Analytical to evaluate sophisticated imagery and detail
                "character sketch": "10th Grade Analytical Character Sketch Rubric", // Analytical for character depth and psychological portrayal
                "place description": "10th Grade Analytical Place Description Rubric" // Analytical for engaging the reader through vivid setting
            },
            "argumentative/persuasive": {
                "persuasive essay": "10th Grade Analytical Persuasive Essay Rubric", // Analytical for persuasive techniques and argument structure
                "opinion piece": "10th Grade Analytical Opinion Piece Rubric", // Analytical for clear argument and logical reasoning
                "debate speech": "10th Grade Analytical Debate Speech Rubric", // Analytical for oral presentation and argumentation
                "editorial": "10th Grade Analytical Editorial Rubric", // Analytical for crafting opinion pieces with public appeal
                "letter to the editor": "10th Grade Analytical Letter to the Editor Rubric" // Analytical to assess concise arguments for publication
            },
            expository: {
                "informational article": "10th Grade Analytical Informational Article Rubric", // Analytical for complex information delivery and structure
                report: "10th Grade Analytical Report Rubric", // Analytical for detailed and factual presentation
                "explanatory essay": "10th Grade Analytical Explanatory Essay Rubric", // Analytical for well-organized and clear explanations
                "research paper": "10th Grade Analytical Research Paper Rubric" // Analytical for depth of research, structure, and citation
            },
            reflective: {
                "journal entry": "10th Grade Holistic Journal Entry Rubric", // Holistic for personal growth and reflection
                "reflective essay": "10th Grade Holistic Reflective Essay Rubric" // Holistic for insight and depth in self-reflection
            },
            instructional: {
                "how-to guide": "10th Grade Analytical How-To Guide Rubric", // Analytical for clear instructional flow and logic
                "step-by-step guide": "10th Grade Analytical Step-By-Step Guide Rubric", // Analytical to evaluate comprehensiveness and clarity
                "procedure write-up": "10th Grade Analytical Procedure Write-Up Rubric" // Analytical for technical writing and instructional clarity
            },
            critical: {
                "literary analysis": "10th Grade Analytical Literary Analysis Rubric", // Analytical for in-depth literary interpretation and critique
                "critical review": "10th Grade Analytical Critical Review Rubric" // Analytical for thorough critique of literature, media, etc.
            }
        },
        "11th grade": {
            narrative: {
                "personal narrative": "11th Grade Holistic Personal Narrative Rubric", // Holistic to assess storytelling and introspective depth
                "short story": "11th Grade Holistic Short Story Rubric", // Holistic for literary creativity, character development, and plot
                "memoir": "11th Grade Holistic Memoir Rubric" // Holistic for deep reflection on personal experiences
            },
            descriptive: {
                "descriptive essay": "11th Grade Analytical Descriptive Essay Rubric", // Analytical for advanced use of imagery, detail, and style
                "character sketch": "11th Grade Analytical Character Sketch Rubric", // Analytical for character complexity and vivid description
                "place description": "11th Grade Analytical Place Description Rubric" // Analytical for effective use of sensory details and setting
            },
            "argumentative/persuasive": {
                "persuasive essay": "11th Grade Analytical Persuasive Essay Rubric", // Analytical for argument strength, evidence, and rhetoric
                "opinion piece": "11th Grade Analytical Opinion Piece Rubric", // Analytical to assess clarity, persuasiveness, and logical structure
                "debate speech": "11th Grade Analytical Debate Speech Rubric", // Analytical for logical argumentation, presentation, and rebuttal
                "editorial": "11th Grade Analytical Editorial Rubric", // Analytical to evaluate persuasive language and public engagement
                "letter to the editor": "11th Grade Analytical Letter to the Editor Rubric" // Analytical for argument focus and public appeal
            },
            expository: {
                "informational article": "11th Grade Analytical Informational Article Rubric", // Analytical for depth of information, organization, and clarity
                report: "11th Grade Analytical Report Rubric", // Analytical for factual accuracy, structure, and thoroughness
                "explanatory essay": "11th Grade Analytical Explanatory Essay Rubric", // Analytical to evaluate clear explanations and logical flow
                "research paper": "11th Grade Analytical Research Paper Rubric", // Analytical for research depth, synthesis of sources, and citation
                "case study": "11th Grade Analytical Case Study Rubric" // Analytical for case detail, analysis, and comprehensive understanding
            },
            reflective: {
                "journal entry": "11th Grade Holistic Journal Entry Rubric", // Holistic for introspection, self-expression, and thematic exploration
                "reflective essay": "11th Grade Holistic Reflective Essay Rubric" // Holistic for in-depth self-reflection, insight, and narrative coherence
            },
            instructional: {
                "how-to guide": "11th Grade Analytical How-To Guide Rubric", // Analytical for clarity of steps, logical progression, and instructional tone
                "step-by-step guide": "11th Grade Analytical Step-By-Step Guide Rubric", // Analytical to ensure precision in instructions and logical sequence
                "procedure write-up": "11th Grade Analytical Procedure Write-Up Rubric" // Analytical for accuracy in process explanation and technical clarity
            },
            critical: {
                "literary analysis": "11th Grade Analytical Literary Analysis Rubric", // Analytical for critical thinking, textual evidence, and interpretation
                "critical review": "11th Grade Analytical Critical Review Rubric", // Analytical for comprehensive critique and evaluative depth
                "art critique": "11th Grade Analytical Art Critique Rubric", // Analytical for art interpretation, contextual analysis, and evaluative commentary
                "film review": "11th Grade Analytical Film Review Rubric" // Analytical for film analysis, narrative understanding, and review style
            }
        },
        "12th grade": {
            narrative: {
                "personal narrative": "12th Grade Holistic Personal Narrative Rubric", // Holistic to evaluate storytelling, personal insight, and depth
                "short story": "12th Grade Holistic Short Story Rubric", // Holistic for creative expression, complex character development, and plot structure
                "memoir": "12th Grade Holistic Memoir Rubric" // Holistic for deep reflection, thematic exploration, and connection to broader life themes
            },
            descriptive: {
                "descriptive essay": "12th Grade Analytical Descriptive Essay Rubric", // Analytical for sophisticated imagery, detailed description, and sensory language
                "character sketch": "12th Grade Analytical Character Sketch Rubric", // Analytical for complexity and depth in character portrayal
                "place description": "12th Grade Analytical Place Description Rubric" // Analytical for vivid description and engaging sensory detail
            },
            "argumentative/persuasive": {
                "persuasive essay": "12th Grade Analytical Persuasive Essay Rubric", // Analytical for persuasive techniques, rhetoric, argument clarity, and supporting evidence
                "opinion piece": "12th Grade Analytical Opinion Piece Rubric", // Analytical for compelling argumentation, reasoning, and use of evidence
                "debate speech": "12th Grade Analytical Debate Speech Rubric", // Analytical for debate structure, argumentation, and public speaking skills
                "editorial": "12th Grade Analytical Editorial Rubric", // Analytical for nuanced perspective, public engagement, and persuasive clarity
                "letter to the editor": "12th Grade Analytical Letter to the Editor Rubric", // Analytical for clarity of argument, tone, and relevance to public issues
                "position paper": "12th Grade Analytical Position Paper Rubric" // Analytical for in-depth analysis, clear stance, and comprehensive support
            },
            expository: {
                "informational article": "12th Grade Analytical Informational Article Rubric", // Analytical for factual content, clear organization, and objective tone
                report: "12th Grade Analytical Report Rubric", // Analytical for structured presentation of information, accuracy, and completeness
                "explanatory essay": "12th Grade Analytical Explanatory Essay Rubric", // Analytical for clarity in explanation, logical organization, and thoroughness
                "research paper": "12th Grade Analytical Research Paper Rubric", // Analytical for research methodology, citation, depth of analysis, and synthesis of sources
                "case study": "12th Grade Analytical Case Study Rubric", // Analytical for detailed analysis, problem-solving approach, and practical insights
                "technical report": "12th Grade Analytical Technical Report Rubric" // Analytical for precise and clear communication, technical detail, and structure
            },
            reflective: {
                "journal entry": "12th Grade Holistic Journal Entry Rubric", // Holistic to encourage introspection, thematic depth, and expressive writing
                "reflective essay": "12th Grade Holistic Reflective Essay Rubric" // Holistic for self-reflection, personal growth, and connection to experiences
            },
            instructional: {
                "how-to guide": "12th Grade Analytical How-To Guide Rubric", // Analytical for clarity of instruction, logical steps, and engaging tone
                "step-by-step guide": "12th Grade Analytical Step-By-Step Guide Rubric", // Analytical to ensure precise steps and comprehensive coverage
                "procedure write-up": "12th Grade Analytical Procedure Write-Up Rubric", // Analytical for technical accuracy, clarity, and logical process
                "manual": "12th Grade Analytical Manual Rubric" // Analytical for comprehensive guidance, logical structuring, and user-friendliness
            },
            critical: {
                "literary analysis": "12th Grade Analytical Literary Analysis Rubric", // Analytical for in-depth literary critique, textual evidence, and interpretive argument
                "critical review": "12th Grade Analytical Critical Review Rubric", // Analytical for evaluating quality and depth of review, critical judgment, and contextual understanding
                "art critique": "12th Grade Analytical Art Critique Rubric", // Analytical for evaluating artistic elements, technique, and cultural context
                "film review": "12th Grade Analytical Film Review Rubric", // Analytical for analyzing narrative, cinematic techniques, and overall impact
                "social critique": "12th Grade Analytical Social Critique Rubric" // Analytical for evaluating social issues, logical argumentation, and critical insight
            }
        },
        undergraduate: {
            narrative: {
                "personal narrative": "Undergraduate Holistic Personal Narrative Rubric", // Holistic to evaluate depth, reflection, and storytelling
                "short story": "Undergraduate Holistic Short Story Rubric", // Holistic for creative style, plot, and character development
                "memoir": "Undergraduate Holistic Memoir Rubric" // Holistic for thematic depth and personal insight
            },
            descriptive: {
                "descriptive essay": "Undergraduate Analytical Descriptive Essay Rubric", // Analytical for sophisticated description and imagery
                "character sketch": "Undergraduate Analytical Character Sketch Rubric", // Analytical for complexity of character portrayal
                "place description": "Undergraduate Analytical Place Description Rubric" // Analytical for detailed sensory engagement
            },
            "argumentative/persuasive": {
                "persuasive essay": "Undergraduate Analytical Persuasive Essay Rubric", // Analytical for argument strength, reasoning, and evidence
                "opinion piece": "Undergraduate Analytical Opinion Piece Rubric", // Analytical for clarity, persuasive rhetoric, and logical flow
                "debate speech": "Undergraduate Analytical Debate Speech Rubric", // Analytical for public speaking, argumentation, and rebuttal
                "editorial": "Undergraduate Analytical Editorial Rubric", // Analytical to assess viewpoint clarity and engagement with public issues
                "position paper": "Undergraduate Analytical Position Paper Rubric" // Analytical for depth of argument, research, and stance
            },
            expository: {
                "informational article": "Undergraduate Analytical Informational Article Rubric", // Analytical for thoroughness of content, clarity, and organization
                report: "Undergraduate Analytical Report Rubric", // Analytical for structured factual reporting, detail, and coherence
                "explanatory essay": "Undergraduate Analytical Explanatory Essay Rubric", // Analytical for clarity in explanations, logical progression, and depth
                "research paper": "Undergraduate Analytical Research Paper Rubric", // Analytical for depth of research, synthesis, and proper citation
                "case study": "Undergraduate Analytical Case Study Rubric", // Analytical for applied knowledge, detailed analysis, and practical insights
                "technical report": "Undergraduate Analytical Technical Report Rubric" // Analytical for precision in technical detail and clear communication
            },
            reflective: {
                "journal entry": "Undergraduate Holistic Journal Entry Rubric", // Holistic to emphasize personal growth, reflection, and expression
                "reflective essay": "Undergraduate Holistic Reflective Essay Rubric" // Holistic for self-awareness, personal insight, and depth
            },
            instructional: {
                "how-to guide": "Undergraduate Analytical How-To Guide Rubric", // Analytical for clarity, sequence, and completeness in instructions
                "step-by-step guide": "Undergraduate Analytical Step-By-Step Guide Rubric", // Analytical for precise and logical step-by-step guidance
                "procedure write-up": "Undergraduate Analytical Procedure Write-Up Rubric", // Analytical for technical accuracy and completeness
                "manual": "Undergraduate Analytical Manual Rubric" // Analytical for detailed instructions, user-friendly language, and coherence
            },
            critical: {
                "literary analysis": "Undergraduate Analytical Literary Analysis Rubric", // Analytical for text interpretation, critical thinking, and evidence-based arguments
                "critical review": "Undergraduate Analytical Critical Review Rubric", // Analytical for in-depth critique and evaluative insight
                "art critique": "Undergraduate Analytical Art Critique Rubric", // Analytical for analysis of artistic elements, interpretation, and argument
                "film review": "Undergraduate Analytical Film Review Rubric", // Analytical for narrative critique, visual analysis, and thematic interpretation
                "social critique": "Undergraduate Analytical Social Critique Rubric" // Analytical for argument development, critical insight into social issues
            }
        },
        graduate: {
            narrative: {
                "personal narrative": "Graduate Holistic Personal Narrative Rubric", // Holistic for deep reflection, professional/personal growth, and storytelling
                "memoir": "Graduate Holistic Memoir Rubric" // Holistic for rich narrative detail, theme development, and mature reflection
            },
            descriptive: {
                "descriptive essay": "Graduate Analytical Descriptive Essay Rubric", // Analytical for advanced imagery, detail, and descriptive language
                "character sketch": "Graduate Analytical Character Sketch Rubric", // Analytical for complex character portrayal and multi-dimensionality
                "place description": "Graduate Analytical Place Description Rubric" // Analytical for immersive description and sophisticated sensory detail
            },
            "argumentative/persuasive": {
                "persuasive essay": "Graduate Analytical Persuasive Essay Rubric", // Analytical for sophisticated argumentation, use of rhetoric, and in-depth support
                "opinion piece": "Graduate Analytical Opinion Piece Rubric", // Analytical for clear stance, sophisticated reasoning, and evidence-based argumentation
                "debate speech": "Graduate Analytical Debate Speech Rubric", // Analytical for structured arguments, rebuttal strategies, and public speaking skills
                "position paper": "Graduate Analytical Position Paper Rubric", // Analytical for nuanced argument, comprehensive research, and professional articulation
                "editorial": "Graduate Analytical Editorial Rubric", // Analytical for effective public argumentation, tone, and persuasive content
                "policy brief": "Graduate Analytical Policy Brief Rubric" // Analytical for concise argumentation, policy analysis, and real-world application
            },
            expository: {
                "informational article": "Graduate Analytical Informational Article Rubric", // Analytical for expert-level content, structure, and objective reporting
                report: "Graduate Analytical Report Rubric", // Analytical for detailed, data-driven content, logical flow, and clear conclusions
                "explanatory essay": "Graduate Analytical Explanatory Essay Rubric", // Analytical for advanced clarity, thorough explanation, and logical progression
                "research paper": "Graduate Analytical Research Paper Rubric", // Analytical for comprehensive research, critical synthesis, and scholarly writing style
                "case study": "Graduate Analytical Case Study Rubric", // Analytical for in-depth analysis, problem-solving, and practical implications
                "technical report": "Graduate Analytical Technical Report Rubric", // Analytical for detailed technical content, clarity of explanation, and accuracy
                "literature review": "Graduate Analytical Literature Review Rubric" // Analytical for comprehensive synthesis of sources, critical analysis, and scholarly organization
            },
            reflective: {
                "journal entry": "Graduate Holistic Journal Entry Rubric", // Holistic for advanced reflection, critical thinking, and depth of insight
                "reflective essay": "Graduate Holistic Reflective Essay Rubric", // Holistic for self-assessment, connection to theoretical frameworks, and professional growth
                "learning journal": "Graduate Holistic Learning Journal Rubric" // Holistic for synthesis of learning experiences, application to practice, and reflection on growth
            },
            instructional: {
                "how-to guide": "Graduate Analytical How-To Guide Rubric", // Analytical for clarity, thoroughness, and advanced topic explanation
                "step-by-step guide": "Graduate Analytical Step-By-Step Guide Rubric", // Analytical for procedural clarity, sequence, and depth of detail
                "procedure write-up": "Graduate Analytical Procedure Write-Up Rubric", // Analytical for methodological precision, detailed steps, and thorough explanation
                "training manual": "Graduate Analytical Training Manual Rubric" // Analytical for clear instructional content, logical structure, and practical application
            },
            critical: {
                "literary analysis": "Graduate Analytical Literary Analysis Rubric", // Analytical for complex textual interpretation, theoretical application, and critical insight
                "critical review": "Graduate Analytical Critical Review Rubric", // Analytical for detailed critique, evaluation of scholarly work, and balanced perspective
                "art critique": "Graduate Analytical Art Critique Rubric", // Analytical for advanced analysis of artistic techniques, themes, and cultural context
                "film review": "Graduate Analytical Film Review Rubric", // Analytical for cinematic interpretation, thematic critique, and cultural analysis
                "theoretical critique": "Graduate Analytical Theoretical Critique Rubric" // Analytical for in-depth examination of theoretical frameworks, critique, and argumentation
            },
            evaluative: {
                "program evaluation": "Graduate Analytical Program Evaluation Rubric", // Analytical for evaluating programs, assessing outcomes, and recommendations for improvement
                "policy analysis": "Graduate Analytical Policy Analysis Rubric", // Analytical for assessing policy implications, arguments, and real-world impacts
                "project assessment": "Graduate Analytical Project Assessment Rubric" // Analytical for evaluating project outcomes, implementation process, and effectiveness
            },
            proposal: {
                "research proposal": "Graduate Analytical Research Proposal Rubric", // Analytical for outlining research aims, methodology, significance, and feasibility
                "grant proposal": "Graduate Analytical Grant Proposal Rubric", // Analytical for effective presentation of research needs, objectives, and potential impact
                "business proposal": "Graduate Analytical Business Proposal Rubric" // Analytical for logical presentation of business ideas, objectives, and financial rationale
            }
        },
        doctoral: {
            narrative: {
                "personal narrative": "Doctoral Holistic Personal Narrative Rubric", // Holistic to capture depth of reflection, personal journey, and scholarly growth
                "memoir": "Doctoral Holistic Memoir Rubric" // Holistic for mature thematic development, personal insight, and connection to scholarly work
            },
            descriptive: {
                "descriptive essay": "Doctoral Analytical Descriptive Essay Rubric", // Analytical for advanced use of imagery, sophisticated description, and thematic connection
                "character sketch": "Doctoral Analytical Character Sketch Rubric", // Analytical for complex character analysis and portrayal linked to broader themes
                "place description": "Doctoral Analytical Place Description Rubric" // Analytical for advanced sensory description and deep thematic relevance
            },
            "argumentative/persuasive": {
                "persuasive essay": "Doctoral Analytical Persuasive Essay Rubric", // Analytical for rigorous argument, extensive research support, and theoretical integration
                "opinion piece": "Doctoral Analytical Opinion Piece Rubric", // Analytical for scholarly opinions, depth of argumentation, and application of theory
                "debate speech": "Doctoral Analytical Debate Speech Rubric", // Analytical for complex argumentation, use of rhetoric, and real-world application
                "position paper": "Doctoral Analytical Position Paper Rubric", // Analytical for comprehensive argument, critical analysis of research, and position clarity
                "editorial": "Doctoral Analytical Editorial Rubric", // Analytical for scholarly engagement with public debates, evidence-based argumentation, and influence
                "policy brief": "Doctoral Analytical Policy Brief Rubric" // Analytical for thorough policy analysis, clear recommendations, and critical assessment
            },
            expository: {
                "informational article": "Doctoral Analytical Informational Article Rubric", // Analytical for thorough content, scholarly tone, and depth of coverage
                report: "Doctoral Analytical Report Rubric", // Analytical for comprehensive reporting, critical analysis, and strong conclusions
                "explanatory essay": "Doctoral Analytical Explanatory Essay Rubric", // Analytical for clarity in complex explanations, theoretical relevance, and logical flow
                "research paper": "Doctoral Analytical Research Paper Rubric", // Analytical for depth of research, original contribution, critical synthesis, and proper citation
                "case study": "Doctoral Analytical Case Study Rubric", // Analytical for comprehensive case analysis, theoretical application, and practical insights
                "technical report": "Doctoral Analytical Technical Report Rubric", // Analytical for detailed technical documentation, precision, and scholarly communication
                "literature review": "Doctoral Analytical Literature Review Rubric" // Analytical for comprehensive coverage, critical synthesis, and academic rigor
            },
            reflective: {
                "journal entry": "Doctoral Holistic Journal Entry Rubric", // Holistic for depth of self-reflection, academic growth, and personal insight
                "reflective essay": "Doctoral Holistic Reflective Essay Rubric", // Holistic for integration of self, theory, and research practice
                "learning journal": "Doctoral Holistic Learning Journal Rubric" // Holistic for synthesis of advanced learning, self-assessment, and application of theory to practice
            },
            instructional: {
                "how-to guide": "Doctoral Analytical How-To Guide Rubric", // Analytical for clarity, comprehensive explanation, and scholarly relevance
                "step-by-step guide": "Doctoral Analytical Step-By-Step Guide Rubric", // Analytical for detailed procedure, logical sequence, and academic precision
                "procedure write-up": "Doctoral Analytical Procedure Write-Up Rubric", // Analytical for methodological rigor, detailed process, and relevance
                "training manual": "Doctoral Analytical Training Manual Rubric" // Analytical for clear instructional content, structure, and academic application
            },
            critical: {
                "literary analysis": "Doctoral Analytical Literary Analysis Rubric", // Analytical for complex interpretation, theoretical application, and critical argumentation
                "critical review": "Doctoral Analytical Critical Review Rubric", // Analytical for in-depth critique, balanced evaluation, and original perspective
                "art critique": "Doctoral Analytical Art Critique Rubric", // Analytical for advanced interpretation of art, theoretical lens, and contextual analysis
                "film review": "Doctoral Analytical Film Review Rubric", // Analytical for critical film analysis, cultural context, and thematic depth
                "theoretical critique": "Doctoral Analytical Theoretical Critique Rubric" // Analytical for evaluation of theories, critical examination, and scholarly discussion
            },
            evaluative: {
                "program evaluation": "Doctoral Analytical Program Evaluation Rubric", // Analytical for systematic assessment, outcome measurement, and critical evaluation
                "policy analysis": "Doctoral Analytical Policy Analysis Rubric", // Analytical for comprehensive policy critique, theoretical alignment, and real-world implications
                "project assessment": "Doctoral Analytical Project Assessment Rubric" // Analytical for evaluating project design, implementation, and effectiveness
            },
            proposal: {
                "research proposal": "Doctoral Analytical Research Proposal Rubric", // Analytical for advanced research planning, feasibility, and scholarly contribution
                "grant proposal": "Doctoral Analytical Grant Proposal Rubric", // Analytical for compelling argument, feasibility, and potential impact
                "business proposal": "Doctoral Analytical Business Proposal Rubric" // Analytical for logical presentation, strategic analysis, and financial viability
            },
            dissertation: {
                "dissertation proposal": "Doctoral Analytical Dissertation Proposal Rubric", // Analytical for comprehensive literature review, research design, and contribution to knowledge
                "dissertation chapter": "Doctoral Analytical Dissertation Chapter Rubric", // Analytical for scholarly writing, depth of research, and chapter coherence
                "full dissertation": "Doctoral Analytical Full Dissertation Rubric", // Analytical for original research contribution, rigorous methodology, and scholarly presentation
                "dissertation defense": "Doctoral Analytical Dissertation Defense Rubric" // Analytical for depth of defense, argumentation, and ability to respond to critique
            }
        }
    }
}
