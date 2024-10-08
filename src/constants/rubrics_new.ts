import { RubricState, RubricType, Rubrics } from "@/types/rubrics"

export const rubrics: Rubrics = {
    "student": {
        "3rd grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        name: "3rd Grade Holistic Personal Narrative Rubric",
                        description: "Evaluates the overall impact, engagement, and reflection of personal narratives.",
                        type: RubricType.Holistic,
                        criteria: {
                            Excellent: "The narrative is highly engaging, with clear expression of personal thoughts and feelings. It flows naturally, and details vividly support the personal experience.",
                            Proficient: "The narrative clearly expresses thoughts and feelings. The structure is logical, with some descriptive details.",
                            Developing: "The narrative expresses some thoughts and feelings, but the flow may be unclear. Limited details support the experience.",
                            Beginning: "The narrative lacks clear thoughts or feelings and may be difficult to follow, with minimal or unclear details."
                        }
                    },
                    "analytical": {
                        name: "3rd Grade Analytical Personal Narrative Rubric",
                        description: "Evaluates structure, sequence, and detail in personal narratives.",
                        type: RubricType.Analytical,
                        criteria: {
                            "Focus & Organization": {
                                Excellent: "The narrative has a clear focus and structure with a logical sequence of events that enhances the experience.",
                                Proficient: "The narrative is mostly structured with a logical sequence.",
                                Developing: "The narrative has some structure but may be unclear or lack logical sequence.",
                                Beginning: "The narrative lacks clear structure or logical flow."
                            },
                            "Details & Description": {
                                Excellent: "Provides vivid, descriptive details that enhance the experience and connect to the theme.",
                                Proficient: "Includes relevant details but may lack vividness.",
                                Developing: "Includes some details but lacks clarity and vividness.",
                                Beginning: "Provides few or unclear details."
                            },
                            "Conventions": {
                                Excellent: "Few or no errors in spelling, punctuation, or grammar.",
                                Proficient: "Some errors present but do not interfere with understanding.",
                                Developing: "Several errors may affect clarity.",
                                Beginning: "Many errors make the narrative difficult to understand."
                            }
                        }
                    },
                },
                "short story": {
                    "holistic": {
                        name: "3rd Grade Holistic Short Story Rubric",
                        description: "Assesses creativity, structure, and readability of short stories.",
                        type: RubricType.Holistic,
                        criteria: {
                            Excellent: "The short story is highly creative, captivating, and effectively tells a complete story. Characters, setting, and plot are clear and well-developed.",
                            Proficient: "The story has a clear plot and structure, with creative elements and developed characters and setting.",
                            Developing: "The story includes some creative elements and basic story structure, but it lacks clarity or full development of characters and plot.",
                            Beginning: "The story lacks creativity, structure, or development. It may be difficult to follow or appear incomplete."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "3rd Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the use of sensory details and organization in descriptive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Organization": {
                                "Excellent": "The essay is clearly focused around a central theme with a logical introduction, body, and conclusion.",
                                "Proficient": "The essay is organized around a theme but may lack a strong introduction or conclusion.",
                                "Developing": "Some organization is present, but the structure may be unclear.",
                                "Beginning": "The essay lacks a central theme and logical structure."
                            },
                            "Use of Sensory Details": {
                                "Excellent": "Vivid sensory details are used to create an engaging description of the topic.",
                                "Proficient": "Uses sensory details but may not consistently engage the reader.",
                                "Developing": "Includes some sensory details, but they may lack vividness.",
                                "Beginning": "Few or no sensory details are present."
                            },
                            "Vocabulary": {
                                "Excellent": "Uses a variety of precise, age-appropriate vocabulary.",
                                "Proficient": "Uses appropriate vocabulary, but it may lack variety.",
                                "Developing": "Uses basic vocabulary with limited variation.",
                                "Beginning": "Vocabulary is limited and repetitive."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "character sketch": {
                    "analytical": {
                        "name": "3rd Grade Analytical Character Sketch Rubric",
                        "description": "Evaluates the detail and organization of character sketches.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Character Detail": {
                                "Excellent": "Provides a detailed, vivid description of the character’s appearance, personality, and actions.",
                                "Proficient": "Describes the character clearly but may lack some vivid details.",
                                "Developing": "Includes basic character details but lacks depth.",
                                "Beginning": "Provides minimal or unclear details about the character."
                            },
                            "Organization & Clarity": {
                                "Excellent": "Ideas are clearly organized to provide a vivid picture of the character.",
                                "Proficient": "Ideas are organized but may lack smooth transitions.",
                                "Developing": "Some organization is present, but the description may be unclear.",
                                "Beginning": "Lacks clear organization and structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "place description": {
                    "analytical": {
                        "name": "3rd Grade Analytical Place Description Rubric",
                        "description": "Evaluates the use of imagery and organization in place descriptions.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Use of Imagery": {
                                "Excellent": "Uses vivid imagery to create a clear, engaging picture of the place.",
                                "Proficient": "Includes imagery but may lack vividness or consistency.",
                                "Developing": "Some imagery is present but lacks detail.",
                                "Beginning": "Provides few or unclear details about the place."
                            },
                            "Organization": {
                                "Excellent": "Description is logically organized with a clear sense of space and order.",
                                "Proficient": "The description is mostly organized but may lack some clarity.",
                                "Developing": "Some organization is present, but it may be unclear or confusing.",
                                "Beginning": "Lacks clear organization and structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "opinion paragraph": {
                    "analytical": {
                        "name": "3rd Grade Analytical Opinion Paragraph Rubric",
                        "description": "Evaluates students' ability to state and support an opinion in a single paragraph.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion Statement": {
                                "Excellent": "Clearly states an opinion with a strong point of view.",
                                "Proficient": "States an opinion, but the point of view may be less clear.",
                                "Developing": "Attempts to state an opinion but lacks clarity.",
                                "Beginning": "Does not clearly state an opinion."
                            },
                            "Supporting Details": {
                                "Excellent": "Provides strong supporting details that clearly back up the opinion.",
                                "Proficient": "Provides some supporting details, but they may lack strength.",
                                "Developing": "Includes limited or unclear supporting details.",
                                "Beginning": "Provides little to no supporting details."
                            },
                            "Organization": {
                                "Excellent": "The paragraph is logically organized with a clear beginning, middle, and end.",
                                "Proficient": "The paragraph is mostly organized but may have some flow issues.",
                                "Developing": "Some organization is present but may be confusing.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "persuasive essay": {
                    "analytical": {
                        "name": "3rd Grade Analytical Persuasive Essay Rubric",
                        "description": "Evaluates argument structure, support, and audience awareness in persuasive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Argument & Support": {
                                "Excellent": "Clearly states an opinion with strong, relevant reasons and examples tailored to the audience.",
                                "Proficient": "States an opinion with supporting reasons, but it may lack depth or audience focus.",
                                "Developing": "Attempts to state an opinion but lacks clarity or relevance.",
                                "Beginning": "Does not clearly state an opinion or provide support."
                            },
                            "Organization": {
                                "Excellent": "Ideas are logically organized with smooth transitions.",
                                "Proficient": "Ideas are organized, but transitions may be weak.",
                                "Developing": "Some organization is present, but ideas may lack clarity.",
                                "Beginning": "Lacks clear organization and transitions."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "expository": {
                "book report": {
                    "analytical": {
                        "name": "3rd Grade Analytical Book Report Rubric",
                        "description": "Evaluates students' ability to summarize and reflect on the main events of a book.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Summary of Events": {
                                "Excellent": "Provides a clear and concise summary of the main events, capturing key details.",
                                "Proficient": "Summarizes the main events with some key details but may lack clarity or conciseness.",
                                "Developing": "Includes some main events but misses key details or is unclear.",
                                "Beginning": "Lacks a clear summary of the book's main events."
                            },
                            "Personal Response": {
                                "Excellent": "Shares thoughtful personal reflections and connects them to specific events in the book.",
                                "Proficient": "Shares personal reflections, with some connection to events in the book.",
                                "Developing": "Provides limited personal response with minimal connection to the book's events.",
                                "Beginning": "Provides little to no personal response or connection to the book."
                            },
                            "Clarity & Organization": {
                                "Excellent": "The report is clearly organized with a logical flow.",
                                "Proficient": "The report is mostly organized, with some minor issues in flow.",
                                "Developing": "Some organization is present but may be confusing.",
                                "Beginning": "Lacks clear organization and structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "simple research project": {
                    "analytical": {
                        "name": "3rd Grade Analytical Research Project Rubric",
                        "description": "Assesses students' ability to conduct basic research and present information clearly.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Topic Introduction": {
                                "Excellent": "Clearly introduces the research topic and explains its relevance.",
                                "Proficient": "Introduces the topic but may lack explanation of its relevance.",
                                "Developing": "Attempts to introduce the topic, but lacks clarity or relevance.",
                                "Beginning": "Fails to introduce or explain the research topic."
                            },
                            "Accuracy of Information": {
                                "Excellent": "Provides accurate and relevant information, showing thorough research.",
                                "Proficient": "Provides mostly accurate information but may lack some relevance.",
                                "Developing": "Includes some information, but there are inaccuracies or irrelevance.",
                                "Beginning": "Provides little to no relevant or accurate information."
                            },
                            "Organization": {
                                "Excellent": "Organizes information logically with a clear beginning, middle, and end.",
                                "Proficient": "Information is mostly organized but may have minor flow issues.",
                                "Developing": "Some organization is present but may be confusing.",
                                "Beginning": "Lacks clear organization and logical structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "informational article": {
                    "analytical": {
                        "name": "3rd Grade Analytical Informational Article Rubric",
                        "description": "Evaluates clarity, factual content, and structure in informational articles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Clarity": {
                                "Excellent": "Clearly introduces the topic and maintains focus with clear explanations.",
                                "Proficient": "Introduces the topic but may not maintain focus throughout.",
                                "Developing": "Attempts to introduce topic but lacks clarity.",
                                "Beginning": "Fails to introduce or maintain a clear focus on the topic."
                            },
                            "Content & Details": {
                                "Excellent": "Provides detailed, accurate, and relevant information.",
                                "Proficient": "Provides relevant information but may lack detail.",
                                "Developing": "Limited or unclear information provided.",
                                "Beginning": "Provides little to no relevant information."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "report": {
                    "analytical": {
                        "name": "3rd Grade Analytical Report Rubric",
                        "description": "Evaluates purpose, content, and structure in reports.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Purpose & Organization": {
                                "Excellent": "Clearly states the purpose and maintains focus with a well-organized structure.",
                                "Proficient": "States the purpose but may lack clarity in some areas.",
                                "Developing": "Attempts to state the purpose but lacks clear focus or structure.",
                                "Beginning": "Fails to clearly state or maintain focus on the purpose."
                            },
                            "Content & Details": {
                                "Excellent": "Includes detailed and relevant facts with clear explanations.",
                                "Proficient": "Includes facts but may lack some detail.",
                                "Developing": "Limited or unclear facts provided.",
                                "Beginning": "Provides little to no relevant information."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the report difficult to understand."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "journal entry": {
                    "holistic": {
                        "name": "3rd Grade Holistic Journal Entry Rubric",
                        "description": "Assesses the overall quality of personal expression, reflection, and clarity in journal entries.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The journal entry provides a deeply thoughtful and personal reflection, with clear and vivid expression of ideas and emotions. The writing flows naturally, is engaging, and uses language effectively to convey meaning. Conventions are used correctly throughout, enhancing readability.",
                            "Proficient": "The journal entry provides a personal reflection with clear ideas and emotions. It is well-organized and mostly easy to follow, demonstrating effective language use. While there may be minor errors in conventions, they do not interfere with the overall understanding.",
                            "Developing": "The journal entry includes some reflection, but ideas and emotions may not be fully developed or clearly expressed. The organization may be inconsistent, and language may lack vividness or precision. There are noticeable errors in conventions that may affect readability.",
                            "Beginning": "The journal entry provides minimal reflection or lacks a clear expression of ideas and emotions. The writing is difficult to follow due to disorganized structure and unclear language. Frequent errors in conventions make the entry hard to understand."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "3rd Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates the clarity, steps, and details of instructional writing.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity of Instructions": {
                                "Excellent": "Provides clear, step-by-step instructions that are easy to follow.",
                                "Proficient": "Provides instructions but may lack some clarity or detail.",
                                "Developing": "Attempts to provide instructions, but they may be unclear or insufficient.",
                                "Beginning": "Instructions are unclear or missing."
                            },
                            "Use of Detail": {
                                "Excellent": "Includes detailed descriptions to support each step effectively.",
                                "Proficient": "Includes some details but may lack depth.",
                                "Developing": "Provides limited or unclear details.",
                                "Beginning": "Provides little to no detail."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            }
        },
        "4th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "4th Grade Holistic Personal Narrative Rubric",
                        "description": "Evaluates the overall development, organization, and expression of the personal narrative.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The personal narrative is highly engaging, with a strong structure and vivid, detailed descriptions that clearly depict the setting, characters, and plot. The narrative flows smoothly from beginning to end, and conventions are almost flawless.",
                            "Proficient": "The narrative is engaging and structured logically, with relevant details that describe the setting, characters, and plot. The story is easy to follow and demonstrates mostly correct use of conventions.",
                            "Developing": "The narrative contains a basic plot and some details, but the setting, characters, and events may not be well-developed. Organization may be inconsistent, and there are several errors in conventions.",
                            "Beginning": "The narrative lacks a clear plot or structure, and details are minimal or unclear. The story is difficult to follow, and errors in conventions significantly hinder understanding."
                        }
                    },
                    "analytical": {
                        "name": "4th Grade Analytical Personal Narrative Rubric",
                        "description": "Evaluates the clarity, development, and structure of personal narratives with a focus on deeper engagement and reflection.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Organization": {
                                "Excellent": "Clearly structured narrative with a logical flow of events and strong, consistent focus.",
                                "Proficient": "Mostly well-organized narrative, though the sequence of events may occasionally lose focus.",
                                "Developing": "Has a general focus but lacks clear organization or smooth transitions.",
                                "Beginning": "The narrative is unstructured and lacks a clear focus or flow."
                            },
                            "Details & Description": {
                                "Excellent": "Uses vivid and well-chosen details to enhance the narrative and connect to the theme.",
                                "Proficient": "Includes relevant details, but they may lack depth.",
                                "Developing": "Details are present but may not effectively support the theme or experience.",
                                "Beginning": "Provides minimal or unclear details."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some minor errors present but do not impede understanding.",
                                "Developing": "Several errors may interfere with clarity.",
                                "Beginning": "Frequent errors make the narrative difficult to understand."
                            }
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "4th Grade Holistic Short Story Rubric",
                        "description": "Assesses the overall creativity, structure, and readability of short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story is highly creative, captivating, and effectively communicates a complete storyline. Characters, setting, and plot are vivid and well-developed, with a clear structure that enhances readability.",
                            "Proficient": "The short story has a clear plot and structure, with creative elements. The characters and setting are developed but may lack depth. The story is easy to read and mostly follows conventions.",
                            "Developing": "The short story contains some creative elements and story structure, but lacks clarity or full development of characters and plot. Conventions are inconsistent, affecting readability.",
                            "Beginning": "The short story lacks creativity, structure, or development. It may be difficult to follow or appear incomplete, with numerous errors that hinder readability."
                        }
                    }
                },
                "fictional narrative": {
                    "holistic": {
                        "name": "4th Grade Holistic Fictional Narrative Rubric",
                        "description": "Evaluates creativity, character development, and plot structure in fictional narratives.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The fictional narrative is highly creative, with a well-developed plot, vivid characters, and clear structure. The story flows smoothly, demonstrating a strong command of conventions.",
                            "Proficient": "The narrative is creative and has a clear plot with developed characters. Some areas may lack depth, but the overall structure and conventions are mostly correct.",
                            "Developing": "The narrative contains basic elements of plot and character but may lack depth, vividness, or have an unclear structure. There may be errors in conventions that affect readability.",
                            "Beginning": "The narrative lacks creativity, structure, or development of characters and plot. The story is difficult to follow, with numerous errors in conventions."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "4th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the use of sensory details, organization, and clarity in descriptive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Organization": {
                                "Excellent": "Has a clear, central theme with well-organized ideas, logical transitions, and a strong introduction and conclusion.",
                                "Proficient": "Maintains a central theme, but the organization or transitions may lack fluidity.",
                                "Developing": "Has a theme but is inconsistently organized or lacks focus.",
                                "Beginning": "Lacks a central theme and has disorganized or unclear ideas."
                            },
                            "Use of Sensory Details": {
                                "Excellent": "Uses vivid sensory details across multiple senses to create an engaging description.",
                                "Proficient": "Includes some sensory details, but may not consistently engage all senses.",
                                "Developing": "Sensory details are limited or not vivid.",
                                "Beginning": "Few or no sensory details are present, making the description unclear."
                            },
                            "Vocabulary": {
                                "Excellent": "Uses a variety of grade-appropriate, precise vocabulary that enhances the description.",
                                "Proficient": "Uses appropriate vocabulary but may lack variety or specificity.",
                                "Developing": "Uses basic vocabulary; some words may be imprecise.",
                                "Beginning": "Uses limited and repetitive vocabulary, impacting clarity."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may occasionally hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "character sketch": {
                    "analytical": {
                        "name": "4th Grade Analytical Character Sketch Rubric",
                        "description": "Evaluates the depth of character portrayal and use of descriptive language.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Character Detail": {
                                "Excellent": "Provides in-depth character traits, personality, and background, showcasing an understanding of the character's motivations.",
                                "Proficient": "Describes character traits and background, but may lack depth or insight.",
                                "Developing": "Attempts to describe character traits, but details are limited or unclear.",
                                "Beginning": "Character description is minimal or not developed."
                            },
                            "Organization": {
                                "Excellent": "Character traits and details are organized logically, with clear progression of ideas.",
                                "Proficient": "Character details are organized but may lack some clarity.",
                                "Developing": "Character details are present but not clearly organized.",
                                "Beginning": "Character details are disorganized or incomplete."
                            },
                            "Use of Descriptive Language": {
                                "Excellent": "Uses varied and vivid language to bring the character to life, including dialogue and actions.",
                                "Proficient": "Uses descriptive language, but it may lack variety or vividness.",
                                "Developing": "Uses basic language; character portrayal may be unclear.",
                                "Beginning": "Language is limited and does not vividly describe the character."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may occasionally hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "place description": {
                    "analytical": {
                        "name": "4th Grade Analytical Place Description Rubric",
                        "description": "Evaluates the use of vivid imagery, detail, and structure in descriptions of places.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Use of Imagery": {
                                "Excellent": "Creates a clear and engaging picture of the place using vivid sensory details.",
                                "Proficient": "Includes some sensory details but may not consistently engage all senses.",
                                "Developing": "Provides limited sensory details, lacking vividness.",
                                "Beginning": "Provides few or unclear details about the place."
                            },
                            "Organization & Structure": {
                                "Excellent": "Description is logically organized with a clear sense of space and order.",
                                "Proficient": "Mostly organized but may lack some clarity.",
                                "Developing": "Some organization is present, but it may be unclear or confusing.",
                                "Beginning": "Lacks clear organization and structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors present but do not interfere with understanding.",
                                "Developing": "Several errors present that may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion letter": {
                    "analytical": {
                        "name": "4th Grade Analytical Opinion Letter Rubric",
                        "description": "Evaluates the structure, clarity, and persuasiveness of an opinion letter.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion Statement": {
                                "Excellent": "Clearly and persuasively states an opinion appropriate for a letter format, with a strong point of view.",
                                "Proficient": "States an opinion clearly, with appropriate letter format. Some points may lack strength.",
                                "Developing": "Attempts to state an opinion, but it may lack clarity or persuasive strength.",
                                "Beginning": "Does not clearly state an opinion or adhere to letter format."
                            },
                            "Supporting Details": {
                                "Excellent": "Provides strong supporting details that persuasively back up the opinion and are appropriate for the letter's audience.",
                                "Proficient": "Provides some relevant supporting details but may lack depth or strength.",
                                "Developing": "Includes limited or unclear supporting details.",
                                "Beginning": "Provides little to no supporting details or relevance to the opinion."
                            },
                            "Organization & Tone": {
                                "Excellent": "The letter is well-organized, with a clear beginning, middle, and end, and an appropriate tone for the audience.",
                                "Proficient": "The letter is organized, but the tone may be inconsistent or the structure may be unclear at times.",
                                "Developing": "Some organization is present, but structure or tone may be unclear or inappropriate.",
                                "Beginning": "Lacks clear organization and tone appropriate for an opinion letter."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors are present but do not impede understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the letter difficult to understand."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "4th Grade Analytical Persuasive Essay Rubric",
                        "description": "Evaluates the clarity of argument, use of evidence, and organizational structure in persuasive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Argument & Focus": {
                                "Excellent": "Clearly states an opinion and provides well-developed, relevant reasons and evidence to support it throughout the essay.",
                                "Proficient": "States an opinion and provides support, but may lack depth or clear focus.",
                                "Developing": "Attempts to state an opinion, but support is limited or unclear.",
                                "Beginning": "Opinion is not clearly stated, and support is lacking."
                            },
                            "Organization": {
                                "Excellent": "Ideas are logically organized with clear transitions, demonstrating progression of thought.",
                                "Proficient": "Ideas are organized, but transitions may be weak or unclear.",
                                "Developing": "Organization is attempted but may be inconsistent or confusing.",
                                "Beginning": "Ideas are not organized logically and lack transitions."
                            },
                            "Evidence & Support": {
                                "Excellent": "Provides strong, relevant reasons and evidence, including facts and examples.",
                                "Proficient": "Provides reasons and evidence, but they may lack depth or variety.",
                                "Developing": "Attempts to provide reasons, but evidence is unclear or insufficient.",
                                "Beginning": "Provides little to no evidence to support the opinion."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may occasionally hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "opinion paragraph": {
                    "analytical": {
                        "name": "4th Grade Analytical Opinion Paragraph Rubric",
                        "description": "Evaluates the ability to clearly state and support an opinion within a single paragraph.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion Statement": {
                                "Excellent": "Clearly states an opinion with a strong point of view.",
                                "Proficient": "States an opinion, but the point of view may lack clarity.",
                                "Developing": "Attempts to state an opinion, but it may lack clarity or strength.",
                                "Beginning": "Does not clearly state an opinion."
                            },
                            "Supporting Details": {
                                "Excellent": "Provides strong supporting details that clearly back up the opinion.",
                                "Proficient": "Provides some supporting details, but they may lack strength.",
                                "Developing": "Includes limited or unclear supporting details.",
                                "Beginning": "Provides little to no supporting details."
                            },
                            "Organization": {
                                "Excellent": "The paragraph is logically organized with a clear beginning, middle, and end.",
                                "Proficient": "The paragraph is mostly organized but may have some flow issues.",
                                "Developing": "Some organization is present but may be confusing.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors are present but do not impede understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            },
            "expository": {
                "informational article": {
                    "analytical": {
                        "name": "4th Grade Analytical Informational Article Rubric",
                        "description": "Evaluates the use of structure, content, and vocabulary in informational articles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Organization": {
                                "Excellent": "Introduces a clear topic and organizes information logically, using effective transitions and a strong conclusion.",
                                "Proficient": "Introduces a topic and organizes information, but transitions may be weak.",
                                "Developing": "Attempts to introduce a topic, but organization is unclear.",
                                "Beginning": "Fails to introduce a topic clearly or organize ideas logically."
                            },
                            "Content & Details": {
                                "Excellent": "Provides detailed and relevant information to explain the topic thoroughly, incorporating multiple sources when needed.",
                                "Proficient": "Provides relevant information but may lack depth or clarity.",
                                "Developing": "Includes limited or unclear information about the topic.",
                                "Beginning": "Provides few details or lacks information entirely."
                            },
                            "Use of Vocabulary": {
                                "Excellent": "Uses precise and topic-appropriate vocabulary, enhancing clarity and understanding.",
                                "Proficient": "Uses mostly accurate vocabulary relevant to the topic.",
                                "Developing": "Uses basic vocabulary with some inaccuracies or inconsistencies.",
                                "Beginning": "Lacks appropriate vocabulary for the topic."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "report": {
                    "analytical": {
                        "name": "4th Grade Analytical Report Rubric",
                        "description": "Evaluates the clarity of purpose, content, and structure in reports.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Clarity": {
                                "Excellent": "Clearly states the purpose of the report and maintains focus throughout, with consistent clarity.",
                                "Proficient": "States the purpose but may lack focus or consistency at times.",
                                "Developing": "Attempts to state the purpose but lacks clarity or focus.",
                                "Beginning": "Does not clearly state the purpose or maintain focus."
                            },
                            "Organization & Structure": {
                                "Excellent": "Organizes ideas logically with a clear structure, strong transitions, and well-developed paragraphs.",
                                "Proficient": "Organizes information clearly, but transitions may be weak.",
                                "Developing": "Attempts to organize ideas, but structure is unclear.",
                                "Beginning": "Lacks clear organization or structure, making content hard to follow."
                            },
                            "Content & Details": {
                                "Excellent": "Provides well-researched and relevant facts, thoroughly explaining ideas with clarity.",
                                "Proficient": "Includes relevant facts and details, but they may lack depth or be incomplete.",
                                "Developing": "Provides limited facts, with some unclear explanations.",
                                "Beginning": "Includes few relevant facts or explanations, lacking depth."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "book report": {
                    "analytical": {
                        "name": "4th Grade Analytical Book Report Rubric",
                        "description": "Evaluates the ability to summarize and reflect on the main events of a book with depth and clarity.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Summary of Events": {
                                "Excellent": "Provides a clear and concise summary of the main events, capturing key details.",
                                "Proficient": "Summarizes the main events with some key details but may lack clarity.",
                                "Developing": "Includes some main events but misses key details or is unclear.",
                                "Beginning": "Lacks a clear summary of the book's main events."
                            },
                            "Personal Response": {
                                "Excellent": "Shares thoughtful personal reflections and connects them to specific events in the book.",
                                "Proficient": "Shares personal reflections, with some connection to events in the book.",
                                "Developing": "Provides limited personal response with minimal connection to the book's events.",
                                "Beginning": "Provides little to no personal response or connection to the book."
                            },
                            "Organization": {
                                "Excellent": "The report is clearly organized with a logical flow.",
                                "Proficient": "The report is mostly organized, with minor flow issues.",
                                "Developing": "Some organization is present but may be confusing.",
                                "Beginning": "Lacks clear organization and structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors are present but do not impede understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "simple research project": {
                    "analytical": {
                        "name": "4th Grade Analytical Research Project Rubric",
                        "description": "Assesses the ability to conduct research and present information clearly and accurately.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Topic Introduction": {
                                "Excellent": "Clearly introduces the research topic and explains its relevance.",
                                "Proficient": "Introduces the topic but may lack an explanation of its relevance.",
                                "Developing": "Attempts to introduce the topic but lacks clarity.",
                                "Beginning": "Fails to introduce or explain the research topic."
                            },
                            "Accuracy of Information": {
                                "Excellent": "Provides accurate and relevant information, showing thorough research.",
                                "Proficient": "Provides mostly accurate information but may lack some relevance.",
                                "Developing": "Includes some information, but there are inaccuracies.",
                                "Beginning": "Provides little to no relevant or accurate information."
                            },
                            "Organization": {
                                "Excellent": "Organizes information logically with a clear beginning, middle, and end.",
                                "Proficient": "Information is mostly organized but may have minor flow issues.",
                                "Developing": "Some organization is present but may be confusing.",
                                "Beginning": "Lacks clear organization and logical structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors are present but do not impede understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "4th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates the ability to compare and contrast two subjects clearly and effectively.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Comparison & Contrast": {
                                "Excellent": "Effectively compares and contrasts the subjects, with clear, relevant, and detailed examples.",
                                "Proficient": "Compares and contrasts the subjects with some clarity and relevant examples.",
                                "Developing": "Attempts to compare and contrast the subjects but may lack clarity or depth.",
                                "Beginning": "Provides little to no effective comparison or contrast between the subjects."
                            },
                            "Organization": {
                                "Excellent": "Well-organized essay with clear introduction, body, and conclusion, using appropriate transitions.",
                                "Proficient": "Essay is mostly organized, but transitions or structure may be weak.",
                                "Developing": "Some organization is present, but the structure is unclear or confusing.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Details & Examples": {
                                "Excellent": "Uses vivid and well-chosen details and examples to enhance the comparison and contrast.",
                                "Proficient": "Includes relevant details and examples, but they may lack vividness.",
                                "Developing": "Details and examples are present but may not effectively support the comparison.",
                                "Beginning": "Provides few or unclear details and examples."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some minor errors are present but do not interfere with understanding.",
                                "Developing": "Several errors may affect clarity.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "4th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Evaluates the ability to clearly explain the cause and effect relationship of a situation or event.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Cause & Effect Explanation": {
                                "Excellent": "Clearly explains the cause and effect relationship with strong, relevant details and examples.",
                                "Proficient": "Explains the cause and effect relationship with some clarity and relevant examples.",
                                "Developing": "Attempts to explain the cause and effect relationship but may lack depth or clarity.",
                                "Beginning": "Provides little to no clear explanation of the cause and effect."
                            },
                            "Organization": {
                                "Excellent": "Essay is well-organized, with a clear sequence of ideas that enhance understanding.",
                                "Proficient": "Essay is mostly organized, though some sections may lack clear structure.",
                                "Developing": "Some attempt at organization is present, but structure may be confusing.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Supporting Details": {
                                "Excellent": "Uses vivid and well-chosen details to support the explanation of cause and effect.",
                                "Proficient": "Includes relevant supporting details but may lack vividness.",
                                "Developing": "Some supporting details are included but may not effectively support the explanation.",
                                "Beginning": "Few or unclear supporting details are provided."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some minor errors are present but do not interfere with understanding.",
                                "Developing": "Several errors may affect clarity.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "journal entry": {
                    "holistic": {
                        "name": "4th Grade Holistic Journal Entry Rubric",
                        "description": "Evaluates overall reflection, personal expression, and organization in journal entries.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The journal entry thoughtfully reflects on personal experiences or feelings, providing deep insights and vivid details. The writing is well-organized and flows smoothly, with few or no errors in conventions.",
                            "Proficient": "The journal entry reflects on personal experiences or feelings with some depth. Descriptions are clear, though they may lack some vividness. The organization is mostly logical, and errors in conventions do not interfere with understanding.",
                            "Developing": "The journal entry attempts to reflect on experiences or feelings but may lack depth or clarity. Descriptions are present but underdeveloped, and organization may be inconsistent. Several errors in conventions affect understanding.",
                            "Beginning": "The journal entry provides minimal or unclear reflection, with few details or descriptions. The organization is unclear or absent, and errors in conventions significantly hinder readability."
                        }
                    }
                },
                "reflective essay": {
                    "holistic": {
                        "name": "4th Grade Holistic Reflective Essay Rubric",
                        "description": "Evaluates the depth of reflection, organization, and clarity in reflective essays.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The reflective essay demonstrates deep reflection on experiences or ideas, with clear and vivid language. The structure is coherent and well-organized, allowing for a smooth flow of ideas. Conventions are used correctly with minimal errors.",
                            "Proficient": "The essay reflects on experiences or ideas with adequate detail. The structure is clear, and transitions are mostly smooth, though some elements may lack depth or vividness. Conventions are mostly correct.",
                            "Developing": "The essay attempts reflection but lacks depth or clear expression. Organization is present but may be inconsistent, and conventions contain errors that may interfere with understanding.",
                            "Beginning": "The reflective essay lacks clear reflection or depth. The organization is unclear, and the language does not effectively convey ideas. Errors in conventions are numerous and hinder readability."
                        }
                    }
                },
                "diary entry": {
                    "holistic": {
                        "name": "4th Grade Holistic Diary Entry Rubric",
                        "description": "Evaluates the overall personal reflection, expression of thoughts, and structure of diary entries.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The diary entry deeply reflects on personal experiences or thoughts with vivid language and emotional depth. The entry is well-organized and flows smoothly, with minimal errors in conventions.",
                            "Proficient": "The diary entry reflects on experiences or thoughts with some depth and detail. The writing is mostly well-organized, with few errors in conventions.",
                            "Developing": "The diary entry attempts reflection but may lack depth or clear expression. Organization may be inconsistent, and there are several errors in conventions.",
                            "Beginning": "The diary entry lacks clear reflection, detail, and organization. Errors in conventions hinder readability."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "4th Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates the clarity, organization, and vocabulary in how-to guides.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Steps": {
                                "Excellent": "Clearly explains each step in a logical sequence, considering audience needs and potential difficulties.",
                                "Proficient": "Explains steps in order, but some may lack clarity or detail.",
                                "Developing": "Includes steps, but they may be unclear, out of order, or insufficient.",
                                "Beginning": "Steps are not clearly explained or organized, lacking coherence."
                            },
                            "Detail & Explanation": {
                                "Excellent": "Provides detailed explanations for each step, enhancing understanding.",
                                "Proficient": "Explains steps, but detail may be lacking or inconsistent.",
                                "Developing": "Provides some explanations, but they may be unclear or insufficient.",
                                "Beginning": "Lacks detailed explanations for steps, making the process unclear."
                            },
                            "Use of Vocabulary": {
                                "Excellent": "Uses precise and task-appropriate vocabulary suitable for explaining tasks clearly.",
                                "Proficient": "Uses mostly accurate vocabulary, but may lack precision or variety.",
                                "Developing": "Uses basic vocabulary with limited specificity or clarity.",
                                "Beginning": "Lacks appropriate vocabulary to explain the topic effectively."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present and may hinder understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            }
        },
        "5th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "5th Grade Holistic Personal Narrative Rubric",
                        "description": "Evaluates the overall impact, emotional engagement, and expression of personal narratives.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative is deeply engaging, with a strong emotional impact and vivid, well-chosen details. The story is coherent, and conventions are mostly flawless, creating a smooth reading experience.",
                            "Proficient": "The narrative is engaging and clearly conveys emotions. The plot is well-developed, with relevant details and mostly correct conventions, though some areas may lack depth.",
                            "Developing": "The narrative includes a sequence of events and some details, but it may lack focus, emotional depth, or contain several errors that affect clarity and flow.",
                            "Beginning": "The narrative is unclear, lacks detail, and is difficult to follow. Frequent errors in conventions hinder readability and overall impact."
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "5th Grade Holistic Short Story Rubric",
                        "description": "Assesses creativity, structure, and overall development of short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story is highly imaginative, with a well-developed plot, vivid characters, and creative twists. The writing flows naturally, with few errors in conventions.",
                            "Proficient": "The short story is engaging, with a clear plot and character development. Creativity is evident, though the story may lack some depth or detailed descriptions.",
                            "Developing": "The short story has some plot and character elements but lacks depth and may be unclear. Organization is inconsistent, and errors in conventions may affect readability.",
                            "Beginning": "The story lacks clear plot and character development, with minimal creativity. Errors in conventions make the story difficult to understand."
                        }
                    }
                },
                "fictional narrative": {
                    "holistic": {
                        "name": "5th Grade Holistic Fictional Narrative Rubric",
                        "description": "Evaluates creativity, character development, plot structure, and engagement in fictional narratives.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The fictional narrative is highly creative, with a compelling plot, well-developed characters, and a captivating storyline. The writing flows smoothly, with few errors in conventions.",
                            "Proficient": "The narrative is creative, with a clear plot and developed characters. Some areas may lack depth, but overall, the story is engaging, and conventions are mostly correct.",
                            "Developing": "The narrative contains a basic plot and character elements but lacks depth, vividness, or has an unclear structure. There may be errors in conventions that affect readability.",
                            "Beginning": "The narrative lacks creativity, structure, or development of characters and plot. The story is difficult to follow, with numerous errors in conventions."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "5th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the clarity, sensory detail, and structure of descriptive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Structure": {
                                "Excellent": "The essay has a clear central idea with well-structured paragraphs, including a strong introduction, body, and conclusion.",
                                "Proficient": "The essay is structured around a central idea, but the introduction or conclusion may lack strength.",
                                "Developing": "Some structure is present, but the central idea may be unclear or underdeveloped.",
                                "Beginning": "Lacks a clear structure and central idea, making the essay hard to follow."
                            },
                            "Sensory Details & Imagery": {
                                "Excellent": "Uses vivid sensory details that paint a clear and engaging picture.",
                                "Proficient": "Uses sensory details, but they may lack vividness or may not be consistent throughout.",
                                "Developing": "Attempts to use sensory details, but they may be unclear or insufficient.",
                                "Beginning": "Few or no sensory details are included."
                            },
                            "Vocabulary & Language": {
                                "Excellent": "Employs a varied and precise vocabulary that enhances the description.",
                                "Proficient": "Uses appropriate vocabulary but may not vary it throughout the piece.",
                                "Developing": "Uses basic vocabulary with limited variation.",
                                "Beginning": "Uses repetitive vocabulary that does not enhance the description."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present, which may occasionally hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "character sketch": {
                    "analytical": {
                        "name": "5th Grade Analytical Character Sketch Rubric",
                        "description": "Evaluates the depiction and development of character traits.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Character Development": {
                                "Excellent": "Character traits are detailed and well-developed, with depth and personality.",
                                "Proficient": "Character traits are clearly described but may lack depth.",
                                "Developing": "Some character traits are mentioned but are not fully developed.",
                                "Beginning": "Character traits are unclear or minimally described."
                            },
                            "Organization & Clarity": {
                                "Excellent": "Details about the character are presented in a logical and engaging manner.",
                                "Proficient": "Character details are organized but may lack smooth transitions.",
                                "Developing": "Some organization is present, but details may be confusing.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Descriptive Language": {
                                "Excellent": "Uses vivid language to bring the character to life.",
                                "Proficient": "Uses descriptive language, but may not be vivid or varied.",
                                "Developing": "Uses simple language to describe the character.",
                                "Beginning": "Uses basic or repetitive language, providing limited character detail."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present, occasionally hindering understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "place description": {
                    "analytical": {
                        "name": "5th Grade Analytical Place Description Rubric",
                        "description": "Evaluates the use of vivid imagery, detail, and structure in descriptions of places with advanced depth.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Use of Imagery": {
                                "Excellent": "Creates a highly engaging picture of the place with vivid and immersive sensory details.",
                                "Proficient": "Includes sensory details that engage most senses, though they may lack consistency.",
                                "Developing": "Provides limited sensory details that may not clearly depict the place.",
                                "Beginning": "Provides few or unclear details about the place."
                            },
                            "Organization & Structure": {
                                "Excellent": "Description is logically organized with a sophisticated sense of space and order.",
                                "Proficient": "Mostly organized but may occasionally lack clarity.",
                                "Developing": "Some organization is present, but it may be confusing or unclear.",
                                "Beginning": "Lacks clear organization and structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors present but do not impede understanding.",
                                "Developing": "Several errors present that may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion paragraph": {
                    "analytical": {
                        "name": "5th Grade Analytical Opinion Paragraph Rubric",
                        "description": "Evaluates the ability to state a clear and compelling opinion within a single, well-developed paragraph.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion Statement": {
                                "Excellent": "Clearly states a strong and compelling opinion with a focused point of view.",
                                "Proficient": "States an opinion with some focus but may lack strength or clarity.",
                                "Developing": "Attempts to state an opinion, but it may be unclear or weak.",
                                "Beginning": "Does not clearly state an opinion."
                            },
                            "Supporting Details": {
                                "Excellent": "Provides well-chosen supporting details that clearly reinforce the opinion.",
                                "Proficient": "Provides supporting details that may lack variety or depth.",
                                "Developing": "Includes limited or unclear supporting details.",
                                "Beginning": "Provides little to no supporting details."
                            },
                            "Organization": {
                                "Excellent": "The paragraph is logically organized with a clear and concise structure.",
                                "Proficient": "The paragraph is mostly organized but may have flow or clarity issues.",
                                "Developing": "Some organization is present but may lack coherence.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors are present but do not impede understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "5th Grade Analytical Persuasive Essay Rubric",
                        "description": "Evaluates the clarity, structure, and use of persuasive techniques in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Argument & Support": {
                                "Excellent": "Presents a clear and compelling argument supported by strong, relevant reasons and evidence.",
                                "Proficient": "States a clear argument with support, though the reasons or evidence may lack depth.",
                                "Developing": "Attempts to state an argument, but the support is limited or unclear.",
                                "Beginning": "Does not clearly state an argument or provide adequate support."
                            },
                            "Organization & Transitions": {
                                "Excellent": "Ideas are well-organized with smooth transitions between points.",
                                "Proficient": "Ideas are organized, but transitions may not be smooth.",
                                "Developing": "Some organization is present, but the ideas may be unclear.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Persuasive Techniques": {
                                "Excellent": "Uses persuasive language and techniques effectively to influence the reader.",
                                "Proficient": "Uses some persuasive techniques but may not fully develop them.",
                                "Developing": "Attempts to use persuasive language, but techniques are weak or unclear.",
                                "Beginning": "Does not effectively use persuasive language or techniques."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present, which may occasionally hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "persuasive letter": {
                    "analytical": {
                        "name": "5th Grade Analytical Persuasive Letter Rubric",
                        "description": "Evaluates the structure, clarity, and persuasiveness of a persuasive letter.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion & Purpose": {
                                "Excellent": "Clearly states a strong opinion with a compelling purpose appropriate for a letter format, demonstrating a strong point of view.",
                                "Proficient": "States an opinion and purpose clearly, but some points may lack strength or clarity.",
                                "Developing": "Attempts to state an opinion, but it may lack clarity, purpose, or persuasive strength.",
                                "Beginning": "Does not clearly state an opinion or purpose, lacking adherence to the letter format."
                            },
                            "Supporting Evidence": {
                                "Excellent": "Provides strong supporting evidence and reasons that effectively persuade the letter’s audience.",
                                "Proficient": "Provides relevant supporting details, but they may lack depth or persuasiveness.",
                                "Developing": "Includes limited supporting details that are unclear or not compelling.",
                                "Beginning": "Provides little to no supporting details to support the opinion."
                            },
                            "Organization & Tone": {
                                "Excellent": "The letter is well-organized with a clear beginning, middle, and end, using a tone appropriate for the intended audience.",
                                "Proficient": "The letter is organized with some consistency, though tone or structure may lack clarity.",
                                "Developing": "Some organization is present, but structure or tone may be unclear or inconsistent.",
                                "Beginning": "Lacks clear organization and tone suitable for a persuasive letter."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not impede understanding.",
                                "Developing": "Several errors may affect readability.",
                                "Beginning": "Frequent errors make the letter difficult to understand."
                            }
                        }
                    }
                }
            },
            "expository": {
                "informational article": {
                    "analytical": {
                        "name": "5th Grade Analytical Informational Article Rubric",
                        "description": "Evaluates the clarity, organization, and detail of informational articles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Topic Focus": {
                                "Excellent": "Clearly introduces and maintains focus on a specific topic.",
                                "Proficient": "Introduces the topic clearly, but focus may waver.",
                                "Developing": "Attempts to introduce the topic, but lacks clarity.",
                                "Beginning": "Fails to clearly introduce or maintain focus on the topic."
                            },
                            "Content & Supporting Details": {
                                "Excellent": "Provides well-researched and relevant information with detailed examples.",
                                "Proficient": "Provides relevant information but may lack depth or detail.",
                                "Developing": "Includes some relevant information but lacks clarity or support.",
                                "Beginning": "Provides little to no relevant information."
                            },
                            "Use of Language & Vocabulary": {
                                "Excellent": "Uses domain-specific vocabulary appropriately and effectively.",
                                "Proficient": "Uses topic-appropriate vocabulary, but may lack variety.",
                                "Developing": "Uses simple vocabulary with limited precision.",
                                "Beginning": "Lacks appropriate vocabulary for the topic."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present, occasionally hindering understanding.",
                                "Beginning": "Many errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "book report": {
                    "analytical": {
                        "name": "5th Grade Analytical Book Report Rubric",
                        "description": "Evaluates the ability to critically analyze and reflect on the main events of a book.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Summary of Events": {
                                "Excellent": "Provides a thorough and insightful summary of the main events, capturing essential details.",
                                "Proficient": "Summarizes main events with relevant details but may lack some insight.",
                                "Developing": "Includes a basic summary but misses key events or clarity.",
                                "Beginning": "Lacks a clear summary of the book's main events."
                            },
                            "Personal Response": {
                                "Excellent": "Provides thoughtful and in-depth personal reflections connected to specific events in the book.",
                                "Proficient": "Shares personal reflections with some connection to book events.",
                                "Developing": "Limited personal response with minimal connection to the book.",
                                "Beginning": "Little to no personal response or connection to the book."
                            },
                            "Organization": {
                                "Excellent": "Clearly organized with a logical and cohesive structure.",
                                "Proficient": "Mostly organized with some clarity issues.",
                                "Developing": "Some organization present but may lack coherence.",
                                "Beginning": "Lacks clear organization and structure."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors present but do not impede understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "simple research project": {
                    "analytical": {
                        "name": "5th Grade Analytical Research Project Rubric",
                        "description": "Assesses advanced ability to conduct research and present information accurately.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Topic Introduction": {
                                "Excellent": "Clearly introduces the topic with a compelling explanation of its significance.",
                                "Proficient": "Introduces the topic but may lack a clear explanation of significance.",
                                "Developing": "Attempts to introduce the topic but may lack clarity or relevance.",
                                "Beginning": "Fails to introduce or explain the research topic."
                            },
                            "Accuracy of Information": {
                                "Excellent": "Provides highly accurate and relevant information with thorough research.",
                                "Proficient": "Provides mostly accurate information with some relevance.",
                                "Developing": "Some information included but may contain inaccuracies or irrelevance.",
                                "Beginning": "Little to no accurate or relevant information provided."
                            },
                            "Organization": {
                                "Excellent": "Presents information in a logical and well-structured format.",
                                "Proficient": "Information mostly organized but may have minor issues.",
                                "Developing": "Some organization present but may lack coherence.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors present but do not impede understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "5th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates the ability to compare and contrast two or more subjects in a clear and detailed manner.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Comparison & Contrast": {
                                "Excellent": "Effectively compares and contrasts the subjects with thorough and relevant examples and details.",
                                "Proficient": "Compares and contrasts the subjects clearly, but some examples may lack depth.",
                                "Developing": "Attempts to compare and contrast, but explanations may be unclear or lack detail.",
                                "Beginning": "Provides little to no effective comparison or contrast between subjects."
                            },
                            "Organization & Structure": {
                                "Excellent": "Well-organized essay with a clear introduction, body, and conclusion, using appropriate transitions.",
                                "Proficient": "Essay is mostly organized, but transitions or structure may be weak.",
                                "Developing": "Some organization is present, but the structure is unclear or inconsistent.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Supporting Details": {
                                "Excellent": "Uses vivid and well-chosen details and examples to effectively support the comparison and contrast.",
                                "Proficient": "Includes relevant details and examples but may lack vividness.",
                                "Developing": "Details and examples are present but may not fully support the comparison.",
                                "Beginning": "Provides few or unclear details and examples."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some minor errors are present but do not interfere with understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "5th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Evaluates the ability to clearly explain the cause and effect relationship of events, actions, or ideas.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Cause & Effect Explanation": {
                                "Excellent": "Clearly explains the cause and effect relationship with strong, relevant examples and in-depth details.",
                                "Proficient": "Explains the cause and effect with clarity, but some details may lack depth.",
                                "Developing": "Attempts to explain the cause and effect but may lack clarity or thoroughness.",
                                "Beginning": "Provides little to no clear explanation of the cause and effect relationship."
                            },
                            "Organization & Sequence": {
                                "Excellent": "Essay is well-organized with a clear sequence of ideas that effectively explain the cause and effect.",
                                "Proficient": "Essay is mostly organized, but some sections may lack clarity.",
                                "Developing": "Some organization is present, but structure may be confusing.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Supporting Details": {
                                "Excellent": "Uses vivid and well-chosen details to support the explanation of cause and effect.",
                                "Proficient": "Includes relevant supporting details but may lack vividness or variety.",
                                "Developing": "Provides limited supporting details that may not effectively support the explanation.",
                                "Beginning": "Few or unclear supporting details are provided."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some minor errors are present but do not impede understanding.",
                                "Developing": "Several errors may affect clarity.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "journal entry": {
                    "holistic": {
                        "name": "5th Grade Holistic Journal Entry Rubric",
                        "description": "Evaluates depth of reflection and clarity in journal entries.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The journal entry deeply reflects on experiences and emotions with clear and vivid language. The ideas flow logically, making the entry easy to understand.",
                            "Proficient": "The journal entry reflects on experiences and emotions, with mostly clear and coherent language. The organization is mostly logical, though some sections may lack depth.",
                            "Developing": "The journal entry attempts reflection but lacks depth or coherence. Ideas may be unclear or disorganized.",
                            "Beginning": "The entry lacks clear reflection, depth, and organization, making it difficult to understand."
                        }
                    }
                },
                "diary entry": {
                    "holistic": {
                        "name": "5th Grade Holistic Diary Entry Rubric",
                        "description": "Evaluates the depth of personal reflection, clarity of thoughts, and organization in diary entries.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The diary entry deeply reflects on personal experiences or thoughts with clear and vivid language, demonstrating strong emotional depth and insight.",
                            "Proficient": "The diary entry reflects on experiences or thoughts with adequate detail and organization, showing some emotional depth.",
                            "Developing": "The diary entry attempts reflection but may lack depth, coherence, or vivid language.",
                            "Beginning": "The diary entry lacks clear reflection, detail, and organization, making it difficult to follow."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "5th Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates the clarity, sequence, and detail of instructions provided.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Logical Sequence": {
                                "Excellent": "Presents steps in a logical and easy-to-follow sequence with clear instructions.",
                                "Proficient": "Steps are mostly clear, but some may lack detail or order.",
                                "Developing": "Steps are present but may be unclear or disorganized.",
                                "Beginning": "Steps are confusing or missing, making the guide hard to follow."
                            },
                            "Detail & Explanation": {
                                "Excellent": "Provides thorough explanations and necessary details for each step.",
                                "Proficient": "Includes details for most steps, but some may lack depth.",
                                "Developing": "Provides limited explanations for steps.",
                                "Beginning": "Lacks detailed explanations or clarity in steps."
                            },
                            "Vocabulary & Terminology": {
                                "Excellent": "Uses clear and specific terminology appropriate for instructions.",
                                "Proficient": "Uses mostly appropriate terminology but may lack specificity.",
                                "Developing": "Uses basic terminology that may not fully convey the steps.",
                                "Beginning": "Uses unclear terminology that makes the instructions hard to understand."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors are present but do not interfere with understanding.",
                                "Developing": "Several errors are present, which may occasionally hinder understanding.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                }
            },

        },
        "6th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "6th Grade Holistic Personal Narrative Rubric",
                        "description": "Evaluates depth of reflection, emotional engagement, and structure in personal narratives.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative is deeply reflective and engaging, with a strong emotional impact. Events unfold naturally with vivid descriptions, and the writing flows seamlessly, demonstrating mastery of conventions.",
                            "Proficient": "The narrative clearly reflects personal experiences, with emotional details and logical sequencing. The writing maintains a mostly smooth flow, with conventions that are generally correct.",
                            "Developing": "The narrative has a basic sequence of events with some personal reflection, but lacks depth or contains errors that affect readability.",
                            "Beginning": "The narrative lacks clear focus, details, or structure, with frequent errors in conventions that hinder understanding."
                        }
                    },
                    "analytical": {
                        "name": "6th Grade Analytical Personal Narrative Rubric",
                        "description": "Evaluates the organization, development, and reflection in personal narratives with attention to voice and insight.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Organization": {
                                "Excellent": "Narrative is well-organized with clear structure, using strong transitions and maintaining a consistent focus.",
                                "Proficient": "Narrative is mostly organized with some effective transitions, though focus may waver slightly.",
                                "Developing": "Narrative shows some organization but lacks clear focus or transitions.",
                                "Beginning": "Narrative lacks structure, focus, and clear transitions."
                            },
                            "Details & Reflection": {
                                "Excellent": "Uses vivid and relevant details that enhance the narrative, with deep reflection and insight.",
                                "Proficient": "Provides appropriate details and some reflection, but may lack depth or vividness.",
                                "Developing": "Includes some details and reflection, but they may be unclear or insufficient.",
                                "Beginning": "Provides minimal details or reflection, lacking clarity and depth."
                            },
                            "Voice & Style": {
                                "Excellent": "Demonstrates a strong, unique voice with a style that enhances the narrative.",
                                "Proficient": "Shows voice and style, but may not be consistent throughout.",
                                "Developing": "Attempts to use voice and style but lacks clarity or consistency.",
                                "Beginning": "Little to no sense of voice or style is present."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, enhancing readability.",
                                "Proficient": "Some minor errors that do not interfere with understanding.",
                                "Developing": "Several errors may hinder clarity at times.",
                                "Beginning": "Frequent errors significantly impede understanding."
                            }
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "6th Grade Holistic Short Story Rubric",
                        "description": "Assesses creativity, character development, and structure in short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story is highly imaginative, with a well-developed plot, vivid characters, and a compelling structure that enhances readability. Events flow logically and the conclusion is satisfying. Few or no errors in conventions.",
                            "Proficient": "The short story has a clear plot and developed characters. The structure is mostly clear, with some creative elements, though depth may be lacking in some areas. Conventions are mostly correct.",
                            "Developing": "The short story includes basic plot and character elements, but lacks depth and structure. Organization may be inconsistent, and several errors in conventions affect readability.",
                            "Beginning": "The short story lacks clear plot and character development, with minimal creativity. Errors in conventions significantly hinder readability."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "6th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the use of sensory details, structure, and language to create vivid descriptions.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Structure": {
                                "Excellent": "The essay has a clear focus with a well-organized structure, including an engaging introduction, body, and conclusion.",
                                "Proficient": "Essay maintains a central focus with a mostly clear structure, though some parts may lack coherence.",
                                "Developing": "Essay has a general theme but lacks clarity or organization, and structure may be inconsistent.",
                                "Beginning": "Essay lacks focus and structure, making it difficult to follow."
                            },
                            "Sensory Details & Imagery": {
                                "Excellent": "Uses detailed and vivid sensory language that enhances the description and engages the reader.",
                                "Proficient": "Uses sensory details effectively, though they may lack consistency or depth.",
                                "Developing": "Attempts to use sensory details but lacks vividness and clarity.",
                                "Beginning": "Few or unclear sensory details are present, affecting the overall description."
                            },
                            "Vocabulary & Language": {
                                "Excellent": "Employs varied and precise vocabulary that enhances the description and adds depth.",
                                "Proficient": "Uses appropriate vocabulary but may lack variety or specificity.",
                                "Developing": "Uses basic vocabulary with limited effectiveness; words may be repetitive.",
                                "Beginning": "Vocabulary is limited and impacts clarity, making the description less effective."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors that do not interfere with understanding.",
                                "Developing": "Several errors may affect readability and understanding.",
                                "Beginning": "Frequent errors impede understanding."
                            }
                        }
                    }
                },
                "character sketch": {
                    "analytical": {
                        "name": "6th Grade Analytical Character Sketch Rubric",
                        "description": "Evaluates depth of character portrayal, organization, and descriptive language.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Character Development": {
                                "Excellent": "Character is thoroughly developed with vivid traits, emotions, and motivations.",
                                "Proficient": "Character is well-developed with clear traits and some depth.",
                                "Developing": "Some character traits are mentioned but are not fully developed.",
                                "Beginning": "Character details are minimal or unclear."
                            },
                            "Organization & Clarity": {
                                "Excellent": "Details about the character are logically presented, enhancing understanding.",
                                "Proficient": "Character details are mostly organized but may have minor clarity issues.",
                                "Developing": "Details are present but may be confusing or lack coherence.",
                                "Beginning": "Lacks clear organization and logical structure."
                            },
                            "Descriptive Language": {
                                "Excellent": "Uses varied and vivid language that brings the character to life.",
                                "Proficient": "Uses descriptive language effectively but lacks variety.",
                                "Developing": "Uses basic descriptive language with limited effectiveness.",
                                "Beginning": "Language is minimal and does not clearly describe the character."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors that do not interfere with understanding.",
                                "Developing": "Several errors may hinder understanding.",
                                "Beginning": "Frequent errors make understanding difficult."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion essay": {
                    "analytical": {
                        "name": "6th Grade Analytical Opinion Essay Rubric",
                        "description": "Evaluates clarity of opinion, supporting evidence, and structure in opinion essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion Statement": {
                                "Excellent": "Clearly states a strong, well-defined opinion at the beginning of the essay.",
                                "Proficient": "States a clear opinion, but it may lack precision or strength.",
                                "Developing": "States an opinion, but it may be unclear or lack focus.",
                                "Beginning": "Opinion is vague or missing."
                            },
                            "Supporting Reasons & Evidence": {
                                "Excellent": "Provides strong, relevant reasons and specific evidence to support the opinion. Evidence is well-chosen and clearly explained.",
                                "Proficient": "Provides relevant reasons and evidence, though they may lack variety or depth.",
                                "Developing": "Includes some reasons or evidence, but they may be weak, unclear, or insufficient.",
                                "Beginning": "Little to no evidence is provided to support the opinion."
                            },
                            "Organization & Transitions": {
                                "Excellent": "Essay is logically organized with smooth transitions that clearly connect ideas.",
                                "Proficient": "Essay is mostly organized, though transitions may be repetitive or unclear.",
                                "Developing": "Essay has some organization, but lacks effective transitions or logical flow.",
                                "Beginning": "Essay is disorganized and lacks clear transitions."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some minor errors present but do not impede understanding.",
                                "Developing": "Several errors that may affect readability.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "6th Grade Analytical Persuasive Essay Rubric",
                        "description": "Evaluates clarity of argument, use of persuasive techniques, and evidence in persuasive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Argument & Focus": {
                                "Excellent": "Presents a clear and compelling argument, maintaining focus throughout the essay.",
                                "Proficient": "States a clear argument and maintains focus, though some parts may lack clarity.",
                                "Developing": "Attempts to present an argument, but focus may be inconsistent or unclear.",
                                "Beginning": "Argument is unclear or lacks focus, making it difficult to follow."
                            },
                            "Persuasive Techniques": {
                                "Excellent": "Uses persuasive techniques effectively, such as emotional appeal, facts, and logical reasoning.",
                                "Proficient": "Employs some persuasive techniques, though not all are fully developed.",
                                "Developing": "Attempts to use persuasive techniques, but they may be underdeveloped or unclear.",
                                "Beginning": "Little to no persuasive techniques are used to support the argument."
                            },
                            "Evidence & Support": {
                                "Excellent": "Provides strong, relevant evidence and examples that enhance the argument.",
                                "Proficient": "Provides appropriate evidence and examples, though some may lack depth or clarity.",
                                "Developing": "Includes some evidence, but it may be limited or insufficient to support the argument.",
                                "Beginning": "Little to no evidence is provided to support the argument."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, enhancing clarity.",
                                "Proficient": "Some minor errors present but do not impede understanding.",
                                "Developing": "Several errors may affect readability and flow.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                },
                "persuasive letter": {
                    "analytical": {
                        "name": "6th Grade Analytical Persuasive Letter Rubric",
                        "description": "Evaluates the structure, argument, and persuasiveness of a formal persuasive letter.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Argument & Audience Awareness": {
                                "Excellent": "Clearly states a strong argument tailored to the audience, using formal tone and persuasive techniques effectively.",
                                "Proficient": "States a clear argument suitable for the audience, though some points may lack depth.",
                                "Developing": "Attempts to state an argument but may lack audience awareness or persuasive techniques.",
                                "Beginning": "Argument is unclear or unsupported; lacks consideration of the audience."
                            },
                            "Organization & Tone": {
                                "Excellent": "Well-organized with a clear beginning, middle, and end, maintaining a formal and respectful tone.",
                                "Proficient": "Mostly organized, with appropriate tone and structure, though some sections may lack clarity.",
                                "Developing": "Some organization is present, but the tone or structure may be inconsistent.",
                                "Beginning": "Lacks clear organization and tone appropriate for a persuasive letter."
                            },
                            "Evidence & Support": {
                                "Excellent": "Provides compelling evidence and reasons tailored to the audience to support the argument effectively.",
                                "Proficient": "Provides relevant evidence and reasons, but some may lack detail or specificity.",
                                "Developing": "Includes some supporting details, but they may not clearly reinforce the argument.",
                                "Beginning": "Little to no supporting evidence is provided to back up the argument."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, enhancing readability.",
                                "Proficient": "Some minor errors present but do not impede understanding.",
                                "Developing": "Several errors may hinder readability.",
                                "Beginning": "Frequent errors make the letter difficult to understand."
                            }
                        }
                    }
                }
            },
            "argumentative": {
                "argumentative essay": {
                    "analytical": {
                        "name": "6th Grade Analytical Argumentative Essay Rubric",
                        "description": "Evaluates clarity of argument, logical reasoning, and use of evidence in argumentative essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Claim & Focus": {
                                "Excellent": "Presents a clear, well-defined claim and maintains focus on the argument throughout the essay.",
                                "Proficient": "States a clear claim and maintains focus, though some sections may waver slightly.",
                                "Developing": "Attempts to state a claim, but focus may be inconsistent or unclear.",
                                "Beginning": "Claim is unclear or missing, and focus is not maintained throughout the essay."
                            },
                            "Reasoning & Evidence": {
                                "Excellent": "Provides well-developed reasoning with relevant and detailed evidence to support the argument.",
                                "Proficient": "Provides appropriate reasoning and evidence to support the claim, though some may lack detail.",
                                "Developing": "Includes some reasoning and evidence, but they may be weak or unclear in supporting the argument.",
                                "Beginning": "Little to no reasoning or evidence is provided to support the argument."
                            },
                            "Organization & Structure": {
                                "Excellent": "Essay is logically organized with clear transitions that enhance the argument and flow.",
                                "Proficient": "Essay is mostly organized with some clear transitions, though organization may waver in places.",
                                "Developing": "Essay shows some structure but may lack clear transitions or logical organization.",
                                "Beginning": "Essay lacks organization and logical flow, making it difficult to follow the argument."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, enhancing readability.",
                                "Proficient": "Some minor errors present but do not impede understanding.",
                                "Developing": "Several errors may affect clarity and readability.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "expository": {
                "informational essay": {
                    "analytical": {
                        "name": "6th Grade Analytical Informational Essay Rubric",
                        "description": "Evaluates the clarity, organization, and depth of informational writing.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Topic Focus": {
                                "Excellent": "Introduces a specific topic clearly and maintains focus throughout with a logical flow of ideas.",
                                "Proficient": "Topic is clear, but focus may waver slightly; ideas are mostly organized.",
                                "Developing": "Topic is introduced, but clarity or focus is lacking; organization may be inconsistent.",
                                "Beginning": "Fails to clearly introduce or maintain focus on a specific topic."
                            },
                            "Content & Supporting Details": {
                                "Excellent": "Provides thorough, well-researched, and relevant information with detailed examples.",
                                "Proficient": "Provides relevant information but may lack depth or detailed examples.",
                                "Developing": "Includes some relevant information, but support may be limited or unclear.",
                                "Beginning": "Provides little to no relevant information or examples."
                            },
                            "Use of Vocabulary & Language": {
                                "Excellent": "Employs domain-specific vocabulary and language effectively to enhance clarity and engagement.",
                                "Proficient": "Uses appropriate vocabulary but may not vary language to enhance the writing.",
                                "Developing": "Uses simple vocabulary, with limited precision or engagement.",
                                "Beginning": "Lacks appropriate vocabulary, affecting clarity."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors that do not interfere with understanding.",
                                "Developing": "Several errors present that may affect readability.",
                                "Beginning": "Frequent errors make the writing difficult to understand."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "6th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates the ability to compare and contrast two or more subjects with clarity and depth.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Comparison & Contrast": {
                                "Excellent": "Effectively compares and contrasts subjects with clear examples and relevant details.",
                                "Proficient": "Compares and contrasts subjects, but some comparisons may lack depth.",
                                "Developing": "Attempts to compare and contrast but lacks clarity or depth.",
                                "Beginning": "Little to no effective comparison or contrast is present."
                            },
                            "Organization & Flow": {
                                "Excellent": "Well-organized essay with clear transitions and a logical structure that enhances understanding.",
                                "Proficient": "Essay is mostly organized with minor lapses in clarity.",
                                "Developing": "Some organization present, but structure may be unclear or confusing.",
                                "Beginning": "Lacks clear organization and flow."
                            },
                            "Supporting Details & Examples": {
                                "Excellent": "Uses vivid and well-chosen details to effectively support comparisons and contrasts.",
                                "Proficient": "Includes relevant details and examples but may lack vividness.",
                                "Developing": "Details and examples present but may not fully support comparisons.",
                                "Beginning": "Few or unclear details and examples are provided."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some minor errors that do not impede understanding.",
                                "Developing": "Several errors that may hinder clarity.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "6th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Evaluates the ability to clearly explain the cause and effect relationship with appropriate evidence and logical structure.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Cause & Effect Explanation": {
                                "Excellent": "Clearly explains the cause and effect relationship with strong, relevant examples, and detailed reasoning.",
                                "Proficient": "Explains the cause and effect relationship with some relevant examples and reasoning, though depth may vary.",
                                "Developing": "Attempts to explain the cause and effect relationship but lacks clarity or sufficient examples.",
                                "Beginning": "Provides little to no explanation of the cause and effect relationship; examples and reasoning are insufficient or absent."
                            },
                            "Organization & Sequence": {
                                "Excellent": "Essay is logically organized with a clear sequence that effectively explains the cause and effect.",
                                "Proficient": "Essay is mostly organized, though some sections may lack coherence or logical flow.",
                                "Developing": "Some organization is present, but sequence may be unclear or confusing.",
                                "Beginning": "Lacks clear organization and logical flow, making the essay difficult to follow."
                            },
                            "Supporting Details": {
                                "Excellent": "Uses vivid and well-chosen details to support the explanation of cause and effect, enhancing understanding.",
                                "Proficient": "Provides relevant details to support the cause and effect, but they may lack vividness or specificity.",
                                "Developing": "Includes some supporting details, but they may not clearly reinforce the cause and effect.",
                                "Beginning": "Provides little to no supporting details, hindering the explanation."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors, enhancing readability.",
                                "Proficient": "Some minor errors present but do not impede understanding.",
                                "Developing": "Several errors present that may affect readability.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "reflective essay": {
                    "holistic": {
                        "name": "6th Grade Holistic Reflective Essay Rubric",
                        "description": "Evaluates depth of personal reflection, clarity of expression, and overall structure in reflective essays.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The essay shows deep reflection on experiences or ideas, effectively expressing personal thoughts and feelings with a clear and logical structure. Conventions are followed accurately, and the writing is engaging.",
                            "Proficient": "The essay reflects on experiences or ideas with clear expression and adequate structure. Thoughts and feelings are conveyed thoughtfully, and conventions are mostly correct, with minor errors.",
                            "Developing": "The essay attempts reflection but lacks depth or organization. Thoughts may be inconsistently expressed, and errors in conventions may affect readability.",
                            "Beginning": "The essay lacks depth, clear reflection, and structure. Ideas are difficult to follow, and frequent errors in conventions hinder understanding."
                        }
                    }
                },
                "journal entry": {
                    "holistic": {
                        "name": "6th Grade Holistic Journal Entry Rubric",
                        "description": "Evaluates personal expression, organization, and insight in journal entries.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The journal entry provides deep reflection on experiences or ideas, demonstrating strong emotional insight and coherence.",
                            "Proficient": "The entry reflects on experiences with some insight and a mostly logical structure.",
                            "Developing": "Attempts to reflect but lacks depth; ideas may be unclear or disorganized.",
                            "Beginning": "Lacks clear reflection and structure, making ideas hard to follow."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "6th Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates clarity, sequencing of steps, and completeness in how-to guides.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Sequencing": {
                                "Excellent": "Steps are clearly written in a logical and easy-to-follow sequence, considering the audience’s needs.",
                                "Proficient": "Steps are mostly clear and follow a logical order, though some may lack detail.",
                                "Developing": "Steps are provided but lack clarity or logical sequence, making them difficult to follow.",
                                "Beginning": "Steps are unclear, disorganized, or missing, hindering the guide’s effectiveness."
                            },
                            "Detail & Explanation": {
                                "Excellent": "Provides thorough explanations and necessary details for each step, ensuring full understanding.",
                                "Proficient": "Provides adequate details for most steps, though some may lack depth.",
                                "Developing": "Attempts to explain steps but includes limited or unclear details.",
                                "Beginning": "Little to no explanation or detail is provided, making the guide hard to understand."
                            },
                            "Vocabulary & Language": {
                                "Excellent": "Uses clear and appropriate vocabulary to explain steps effectively, enhancing the guide's clarity.",
                                "Proficient": "Uses mostly appropriate vocabulary, but it may lack specificity or variation.",
                                "Developing": "Uses basic vocabulary that may not fully convey the instructions.",
                                "Beginning": "Vocabulary is unclear or insufficient for explaining the steps."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, enhancing clarity.",
                                "Proficient": "Some minor errors are present but do not impede understanding.",
                                "Developing": "Several errors may hinder readability.",
                                "Beginning": "Frequent errors make the instructions difficult to follow."
                            }
                        }
                    }
                }
            },
            "research": {
                "research paper": {
                    "analytical": {
                        "name": "6th Grade Analytical Research Paper Rubric",
                        "description": "Evaluates research skills, content organization, and citation accuracy in research papers.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Research Question & Focus": {
                                "Excellent": "Clearly defines a focused research question or topic with strong alignment to the paper's content.",
                                "Proficient": "Defines a research question or topic that is mostly clear and related to the content.",
                                "Developing": "Research question or topic is present but may be broad or not clearly aligned with the content.",
                                "Beginning": "Research question or topic is unclear, missing, or irrelevant to the content."
                            },
                            "Content & Supporting Details": {
                                "Excellent": "Provides well-researched content with relevant supporting details, showing a clear understanding of the topic.",
                                "Proficient": "Content is researched appropriately and provides some relevant supporting details.",
                                "Developing": "Content shows minimal research, and supporting details are limited or partially irrelevant.",
                                "Beginning": "Content lacks research, and supporting details are insufficient or irrelevant."
                            },
                            "Organization & Structure": {
                                "Excellent": "Organizes information in a logical manner, with clear introduction, body, and conclusion.",
                                "Proficient": "Information is mostly organized, with an introduction, body, and conclusion, but transitions may be unclear.",
                                "Developing": "Attempts to organize information, but structure is inconsistent or unclear.",
                                "Beginning": "Lacks clear organization and structure, making it difficult to follow."
                            },
                            "Use of Sources": {
                                "Excellent": "Incorporates multiple reliable sources that enhance the content and support claims effectively.",
                                "Proficient": "Uses reliable sources appropriately, though connections to content may lack depth.",
                                "Developing": "Includes sources, but they may be limited, unreliable, or not clearly connected to the content.",
                                "Beginning": "Few or no sources are used, and they are unreliable or irrelevant."
                            },
                            "Adherence to Citation Style": {
                                "Excellent": "Accurately follows the selected citation style for in-text citations and the bibliography, with few or no errors.",
                                "Proficient": "Generally follows the selected citation style, with some minor errors.",
                                "Developing": "Attempts to follow the citation style, but with multiple errors.",
                                "Beginning": "Does not adhere to the citation style, or citations are missing."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors, enhancing readability.",
                                "Proficient": "Some errors are present but do not significantly affect understanding.",
                                "Developing": "Several errors are present that may affect readability.",
                                "Beginning": "Frequent errors hinder understanding and readability."
                            }
                        }
                    }
                }
            }
        },
        "7th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "7th Grade Holistic Personal Narrative Rubric",
                        "description": "Evaluates depth of personal reflection, emotional engagement, and structure in personal narratives with a more complex narrative arc.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative is deeply reflective, with complex emotions and a well-developed narrative arc. Events are well-organized and unfold naturally, and vivid details enhance emotional engagement. Conventions are virtually flawless.",
                            "Proficient": "The narrative reflects on personal experiences with a clear structure and appropriate use of emotional details. Some complexity is present in the narrative arc, though not fully developed. Conventions are mostly correct.",
                            "Developing": "The narrative includes a sequence of events with some reflection, but it may lack depth, clarity, or contain errors affecting the flow.",
                            "Beginning": "The narrative lacks focus, detail, or structure. The absence of a clear narrative arc and frequent errors hinder understanding."
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "7th Grade Holistic Short Story Rubric",
                        "description": "Assesses creativity, complexity of plot and characters, and advanced structure in short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story demonstrates high creativity with a complex and engaging plot. Characters are multidimensional, and the structure enhances readability. Vivid details add depth to the setting, and conventions are used correctly.",
                            "Proficient": "The story has a clear and somewhat complex plot, with developed characters and creative elements. Structure and details support the story, though some areas may lack full development. Conventions are mostly correct.",
                            "Developing": "The story includes a basic plot and character development, but lacks complexity or depth. Details and organization are inconsistent, and errors in conventions affect readability.",
                            "Beginning": "The story has minimal plot and character development, with unclear events. Lack of creativity and structure, and frequent errors in conventions make the story difficult to understand."
                        }
                    }
                },
                "fictional narrative": {
                    "holistic": {
                        "name": "7th Grade Holistic Fictional Narrative Rubric",
                        "description": "Evaluates creativity, plot development, and use of dialogue in fictional narratives.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The fictional narrative is highly creative, with a compelling and well-structured plot, rich character development, and natural dialogue. Events and conflicts are skillfully woven together.",
                            "Proficient": "The narrative is creative with a clear plot and developed characters. Dialogue is appropriately used, though it may lack depth or natural flow.",
                            "Developing": "The narrative contains a basic plot and dialogue, but character and event development may be limited. Organization may be inconsistent.",
                            "Beginning": "The narrative lacks creativity, clear structure, or character development. The story may be difficult to follow."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "7th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the use of advanced sensory details, figurative language, and structured organization in descriptive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Structure": {
                                "Excellent": "The essay has a clear focus, with well-organized paragraphs and an effective use of an engaging introduction, body, and conclusion.",
                                "Proficient": "Essay maintains focus with mostly clear structure, though some parts may lack coherence.",
                                "Developing": "The essay presents a theme but lacks clear organization or detailed focus.",
                                "Beginning": "The essay lacks focus, clear structure, and coherent organization."
                            },
                            "Sensory Details & Imagery": {
                                "Excellent": "Uses detailed and vivid sensory language, along with figurative language (e.g., similes, metaphors), to create a strong visual and emotional impact.",
                                "Proficient": "Uses sensory details effectively, with occasional use of figurative language, though consistency may vary.",
                                "Developing": "Attempts to use sensory details and figurative language but lacks vividness and clarity.",
                                "Beginning": "Few or unclear sensory details are present, with little to no use of figurative language."
                            },
                            "Vocabulary & Language": {
                                "Excellent": "Employs a varied and sophisticated vocabulary that enhances the description and adds depth to the language.",
                                "Proficient": "Uses appropriate vocabulary, though it may lack sophistication or variety.",
                                "Developing": "Uses basic vocabulary with limited effectiveness; words may be repetitive or imprecise.",
                                "Beginning": "Vocabulary is limited and hinders clarity, affecting the description."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar.",
                                "Proficient": "Some errors present but they do not significantly interfere with understanding.",
                                "Developing": "Several errors present that may hinder readability.",
                                "Beginning": "Frequent errors impede understanding and affect the clarity of the description."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion essay": {
                    "analytical": {
                        "name": "7th Grade Analytical Opinion Essay Rubric",
                        "description": "Evaluates the depth of opinion, use of evidence, and structure in opinion essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion & Focus": {
                                "Excellent": "Clearly states a compelling, focused opinion. Maintains focus throughout the essay.",
                                "Proficient": "States a clear opinion and generally maintains focus, though it may waver slightly.",
                                "Developing": "States an opinion but lacks a clear focus or consistent argument.",
                                "Beginning": "Opinion is vague or the focus is unclear."
                            },
                            "Reasoning & Evidence": {
                                "Excellent": "Provides well-developed reasoning and diverse evidence that thoroughly supports the opinion.",
                                "Proficient": "Offers appropriate reasons and evidence, but some points may lack depth or development.",
                                "Developing": "Includes limited reasoning and evidence that may be insufficient or unclear.",
                                "Beginning": "Little to no reasoning or evidence to support the opinion."
                            },
                            "Structure & Flow": {
                                "Excellent": "Essay is well-organized with clear paragraphs, and transitions that create a smooth flow of ideas.",
                                "Proficient": "Essay is mostly organized with some clear transitions.",
                                "Developing": "Essay has some structure but may lack coherence or logical progression.",
                                "Beginning": "Essay lacks structure and flow."
                            },
                            "Language & Conventions": {
                                "Excellent": "Uses precise language and correct conventions to enhance understanding.",
                                "Proficient": "Uses appropriate language and mostly correct conventions.",
                                "Developing": "Language and conventions are basic, with errors that may affect clarity.",
                                "Beginning": "Frequent errors in language and conventions hinder understanding."
                            }
                        }
                    }
                }
            },
            "argumentative": {
                "argumentative essay": {
                    "analytical": {
                        "name": "7th Grade Analytical Argumentative Essay Rubric",
                        "description": "Assesses clarity of argument, logical structure, and support for claims in argumentative essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Claim & Focus": {
                                "Excellent": "Presents a strong, clearly defined claim and maintains focused argument throughout.",
                                "Proficient": "States a clear claim and mostly maintains focus, though some ideas may lack clarity.",
                                "Developing": "Attempts to present a claim, but it may be vague or not fully maintained.",
                                "Beginning": "Claim is unclear or not present, and focus is inconsistent or off-topic."
                            },
                            "Reasoning & Evidence": {
                                "Excellent": "Provides strong reasoning and multiple pieces of relevant evidence to thoroughly support the claim.",
                                "Proficient": "Provides sound reasoning and appropriate evidence, though support may lack depth or detail.",
                                "Developing": "Includes some reasoning and evidence, but they may not fully support the claim or lack depth.",
                                "Beginning": "Little to no reasoning or evidence is provided to support the claim."
                            },
                            "Organization & Structure": {
                                "Excellent": "Essay has a logical structure with well-crafted paragraphs and effective transitions.",
                                "Proficient": "Essay is organized with clear transitions, though some areas may lack coherence.",
                                "Developing": "Some structure is evident, but the organization may be unclear or inconsistent.",
                                "Beginning": "Lacks clear structure and logical organization, affecting the flow of the argument."
                            },
                            "Conventions": {
                                "Excellent": "Uses spelling, punctuation, and grammar correctly, enhancing the clarity of the writing.",
                                "Proficient": "Some errors in conventions are present but do not hinder understanding.",
                                "Developing": "Several errors in conventions may hinder readability.",
                                "Beginning": "Frequent errors impede understanding and clarity."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "7th Grade Analytical Persuasive Essay Rubric",
                        "description": "Assesses the strength of argument, use of persuasive language, and structure in persuasive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Argument & Position": {
                                "Excellent": "Presents a well-defined argument and consistently supports a strong position throughout the essay.",
                                "Proficient": "Presents a clear argument and position, with mostly consistent support.",
                                "Developing": "Attempts to state an argument and position, but lacks clarity or consistency.",
                                "Beginning": "Argument is unclear or weak, and position is not well-supported."
                            },
                            "Persuasive Language & Techniques": {
                                "Excellent": "Uses persuasive language and varied techniques effectively, enhancing the strength of the argument.",
                                "Proficient": "Uses some persuasive language and techniques effectively, but may lack variety or depth.",
                                "Developing": "Attempts to use persuasive language and techniques, but they may be underdeveloped.",
                                "Beginning": "Little to no use of persuasive language or techniques to support the argument."
                            },
                            "Evidence & Reasoning": {
                                "Excellent": "Provides well-reasoned evidence and examples to convincingly support the argument.",
                                "Proficient": "Provides appropriate evidence and reasoning, though some may lack depth.",
                                "Developing": "Includes some evidence and reasoning, but connections to the argument may be unclear.",
                                "Beginning": "Little to no evidence or reasoning is provided to support the argument."
                            },
                            "Conventions": {
                                "Excellent": "Accurate use of spelling, punctuation, and grammar, enhancing the readability of the essay.",
                                "Proficient": "Some errors in conventions are present but do not hinder understanding.",
                                "Developing": "Several errors may affect clarity or flow.",
                                "Beginning": "Frequent errors make the essay difficult to follow."
                            }
                        }
                    }
                }
            },
            "expository": {
                "informational article": {
                    "analytical": {
                        "name": "7th Grade Analytical Informational Article Rubric",
                        "description": "Evaluates depth of content, logical structure, and clarity of language in informational articles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Topic & Clarity": {
                                "Excellent": "Clearly introduces a specific and focused topic, maintaining clarity throughout the article.",
                                "Proficient": "Introduces a clear topic, though some parts may lack focus or precision.",
                                "Developing": "Attempts to state a topic, but it may be unclear or too broad.",
                                "Beginning": "Topic is unclear or missing."
                            },
                            "Supporting Information & Details": {
                                "Excellent": "Provides a variety of detailed facts, statistics, and examples to support the topic.",
                                "Proficient": "Provides relevant information and details, but some may lack variety or depth.",
                                "Developing": "Includes limited information or details that may not fully support the topic.",
                                "Beginning": "Little to no supporting information is provided."
                            },
                            "Logical Organization & Transitions": {
                                "Excellent": "Logically organizes information with smooth transitions that enhance clarity.",
                                "Proficient": "Mostly organizes information logically, with some effective transitions.",
                                "Developing": "Some structure is present, but transitions may be unclear or inconsistent.",
                                "Beginning": "Lacks clear organization and logical flow."
                            },
                            "Conventions & Language Use": {
                                "Excellent": "Uses clear language and correct conventions that enhance readability.",
                                "Proficient": "Uses appropriate language and mostly correct conventions.",
                                "Developing": "Basic language and conventions with errors that may affect clarity.",
                                "Beginning": "Frequent errors in language and conventions impede understanding."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "7th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates the analysis of similarities and differences, structure, and clarity in compare and contrast essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Comparison & Contrast": {
                                "Excellent": "Thoroughly analyzes both similarities and differences with relevant, well-chosen examples and insightful analysis.",
                                "Proficient": "Adequately compares and contrasts subjects with clear examples, though depth of analysis may vary.",
                                "Developing": "Attempts to compare and contrast, but lacks depth or uses unclear examples.",
                                "Beginning": "Little to no clear comparison or contrast is present."
                            },
                            "Organization & Structure": {
                                "Excellent": "Organizes ideas in a logical structure, using point-by-point or block format effectively.",
                                "Proficient": "Maintains mostly logical structure with minor inconsistencies in organization.",
                                "Developing": "Some organization is present, but structure may be unclear or lack coherence.",
                                "Beginning": "Lacks clear organization, making comparison and contrast difficult to follow."
                            },
                            "Details & Examples": {
                                "Excellent": "Uses vivid, well-chosen details and examples that enhance the comparison and contrast.",
                                "Proficient": "Includes relevant details and examples, but they may lack vividness.",
                                "Developing": "Details and examples are present but may not fully support the comparison.",
                                "Beginning": "Provides few or unclear details and examples."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some minor errors are present but do not interfere with understanding.",
                                "Developing": "Several errors may affect clarity.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "7th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Evaluates clarity of cause-effect relationships, depth of reasoning, and structure in cause and effect essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Cause & Effect Explanation": {
                                "Excellent": "Clearly and thoroughly explains the cause and effect relationship with well-developed reasoning and examples.",
                                "Proficient": "Explains the cause and effect relationship clearly, though reasoning may lack depth.",
                                "Developing": "Attempts to explain cause and effect, but lacks clarity or sufficient detail.",
                                "Beginning": "Provides little to no explanation of the cause and effect relationship."
                            },
                            "Organization & Sequence": {
                                "Excellent": "Essay is logically organized with clear sequence and connections between causes and effects.",
                                "Proficient": "Essay is mostly organized, but some areas may lack clarity in sequencing.",
                                "Developing": "Some organization is present but may lack coherence or logical flow.",
                                "Beginning": "Lacks clear organization and logical connections between causes and effects."
                            },
                            "Supporting Details & Examples": {
                                "Excellent": "Uses vivid details and examples to effectively support the cause and effect relationship.",
                                "Proficient": "Provides relevant supporting details, though they may lack vividness or depth.",
                                "Developing": "Includes limited supporting details, which may be unclear or insufficient.",
                                "Beginning": "Few or unclear supporting details are provided."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors.",
                                "Proficient": "Some errors present but do not significantly interfere with understanding.",
                                "Developing": "Several errors present that may hinder clarity.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "reflective essay": {
                    "holistic": {
                        "name": "7th Grade Holistic Reflective Essay Rubric",
                        "description": "Evaluates depth of personal insight, clarity of ideas, and organizational structure in reflective essays.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The essay demonstrates insightful reflection on experiences or ideas, with clear, engaging expression and logical structure. Thoughts are well-developed and supported by vivid details. Conventions are correct and enhance readability.",
                            "Proficient": "Reflects on experiences or ideas thoughtfully, with clear expression and adequate organization. Details support the reflection, and conventions are mostly correct, with minor errors that do not impede understanding.",
                            "Developing": "The essay shows an attempt at reflection but lacks depth or clarity. Organization is inconsistent, and conventions may contain errors that affect readability.",
                            "Beginning": "The essay lacks clear reflection and structure, with ideas that are poorly developed and frequent errors that hinder understanding."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "7th Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates clarity, logical order, and completeness of instructions in how-to guides.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Logical Order": {
                                "Excellent": "Steps are presented in a clear and logical order with thorough explanations, considering potential challenges for the audience.",
                                "Proficient": "Steps are mostly clear and logically ordered, though some may lack detail or consideration of the audience.",
                                "Developing": "Steps are provided but lack clarity or logical order, making the guide somewhat hard to follow.",
                                "Beginning": "Steps are disorganized or unclear, hindering the guide’s effectiveness."
                            },
                            "Detail & Depth": {
                                "Excellent": "Provides thorough, well-chosen details that enable the audience to follow the instructions easily.",
                                "Proficient": "Provides adequate details for most steps, though some may lack depth or thoroughness.",
                                "Developing": "Attempts to provide details but lacks sufficient explanation for some steps.",
                                "Beginning": "Little to no detail is provided, making the guide difficult to understand."
                            },
                            "Vocabulary & Terminology": {
                                "Excellent": "Uses appropriate and clear terminology that enhances understanding for the intended audience.",
                                "Proficient": "Uses mostly appropriate terminology, but some terms may be unclear or lack specificity.",
                                "Developing": "Uses basic terminology that may not fully support understanding.",
                                "Beginning": "Terminology is unclear, affecting the guide’s clarity and effectiveness."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, ensuring clarity and comprehension.",
                                "Proficient": "Some minor errors are present but do not impede understanding.",
                                "Developing": "Several errors may affect clarity.",
                                "Beginning": "Frequent errors make the instructions difficult to understand."
                            }
                        }
                    }
                }
            },
            "research": {
                "research paper": {
                    "analytical": {
                        "name": "7th Grade Analytical Research Paper Rubric",
                        "description": "Evaluates focus, depth of research, organization, and citation accuracy in research papers.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Research Question & Thesis": {
                                "Excellent": "Clearly defines a focused research question and thesis that aligns well with the paper's purpose.",
                                "Proficient": "Defines a research question and thesis that are mostly clear and related to the content.",
                                "Developing": "Research question and thesis are present but may be broad or not clearly aligned with the content.",
                                "Beginning": "Research question and thesis are unclear, missing, or irrelevant to the content."
                            },
                            "Content & Analysis": {
                                "Excellent": "Provides in-depth research with relevant analysis and strong supporting details.",
                                "Proficient": "Content is researched thoroughly with relevant supporting details, though analysis may lack depth.",
                                "Developing": "Content is minimally researched with limited or partially irrelevant supporting details.",
                                "Beginning": "Content lacks research and supporting details, with minimal analysis."
                            },
                            "Organization & Structure": {
                                "Excellent": "Organizes information logically, with clear transitions and cohesive paragraphs.",
                                "Proficient": "Information is mostly organized, with some transitions and paragraph coherence.",
                                "Developing": "Attempts to organize information, but structure is inconsistent, with unclear transitions.",
                                "Beginning": "Lacks clear organization, making the paper difficult to follow."
                            },
                            "Use of Sources": {
                                "Excellent": "Incorporates multiple reliable sources effectively, integrating them to support claims.",
                                "Proficient": "Uses reliable sources appropriately, with some integration into the content.",
                                "Developing": "Includes sources, but they may be unreliable or not well-integrated.",
                                "Beginning": "Few or no sources are used, or they are unreliable."
                            },
                            "Adherence to Citation Style": {
                                "Excellent": "Follows the selected citation style accurately for both in-text citations and bibliography, with minor or no errors.",
                                "Proficient": "Mostly follows the citation style, with some errors.",
                                "Developing": "Attempts to follow the citation style, but many errors are present.",
                                "Beginning": "Does not adhere to the citation style, or citations are missing."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, supporting readability.",
                                "Proficient": "Some errors present, but they do not significantly impede understanding.",
                                "Developing": "Several errors present, affecting clarity.",
                                "Beginning": "Frequent errors hinder readability."
                            }
                        }
                    }
                }
            },
        },
        "8th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "8th Grade Holistic Personal Narrative Rubric",
                        "description": "Evaluates complexity of reflection, depth of emotional engagement, and narrative structure in personal narratives.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative shows a sophisticated reflection on experiences with a well-developed and compelling storyline. Use of vivid imagery and complex emotions enhances engagement, and conventions are used accurately.",
                            "Proficient": "The narrative is reflective and mostly cohesive, with an emerging complexity in the storyline. Details enhance emotional depth, and conventions are mostly correct, though minor errors may occur.",
                            "Developing": "The narrative attempts reflection but lacks coherence or depth. Organization and emotional engagement are inconsistent, and several errors in conventions affect clarity.",
                            "Beginning": "The narrative is underdeveloped, lacking clear events, emotional reflection, or depth. Errors in conventions significantly impede understanding."
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "8th Grade Holistic Short Story Rubric",
                        "description": "Evaluates creative use of literary devices, character development, and plot complexity in short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story displays high creativity with complex characters and a well-developed plot. Use of literary devices (e.g., foreshadowing, irony) enhances the narrative, and vivid details build atmosphere. Conventions are flawless.",
                            "Proficient": "The story is creative with a clear plot and character development. Literary devices and vivid details are used effectively, though some areas may lack depth. Conventions are mostly correct.",
                            "Developing": "The story includes some creative elements and character development, but lacks consistent use of literary devices. Plot may be underdeveloped or unclear. Conventions errors affect readability.",
                            "Beginning": "The story lacks creativity, plot clarity, and character depth. Little use of literary devices, and frequent errors in conventions hinder understanding."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "8th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the use of advanced descriptive techniques, such as figurative language, to enhance vividness and reader engagement.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Structure": {
                                "Excellent": "Essay has a strong focus, with clearly organized ideas and smooth transitions that enhance readability and engagement.",
                                "Proficient": "Focus is maintained, with mostly clear structure and transitions that support understanding.",
                                "Developing": "Essay has a focus but lacks consistent structure and logical flow.",
                                "Beginning": "Essay lacks focus and logical structure, making it difficult to follow."
                            },
                            "Sensory Details & Figurative Language": {
                                "Excellent": "Uses advanced sensory details and varied figurative language (e.g., personification, hyperbole) to create a vivid description.",
                                "Proficient": "Sensory details and figurative language are effectively used, but may lack consistency.",
                                "Developing": "Attempts to use sensory details and figurative language, but they are not fully developed.",
                                "Beginning": "Limited sensory details or figurative language, with minimal impact on the description."
                            },
                            "Word Choice & Tone": {
                                "Excellent": "Carefully chosen vocabulary and tone enhance the essay’s mood and reader's experience.",
                                "Proficient": "Vocabulary and tone are appropriate, but may lack variety or full enhancement of the mood.",
                                "Developing": "Basic vocabulary and tone, with limited enhancement of the descriptive elements.",
                                "Beginning": "Vocabulary is simple and tone may be unclear, affecting the effectiveness of the description."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, ensuring clarity.",
                                "Proficient": "Some errors in conventions, but they do not significantly hinder understanding.",
                                "Developing": "Several errors present, which may affect readability.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "argumentative": {
                "argumentative essay": {
                    "analytical": {
                        "name": "8th Grade Analytical Argumentative Essay Rubric",
                        "description": "Evaluates argument development, thoroughness of evidence, and logical organization in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Claim & Argument": {
                                "Excellent": "Presents a compelling claim with a well-developed argument, maintaining clarity and focus throughout.",
                                "Proficient": "Presents a clear claim with logical argument, though some sections may lack development.",
                                "Developing": "Attempts to present a claim and argument, but clarity and depth may be lacking.",
                                "Beginning": "Claim is unclear or not fully developed, and argument lacks focus."
                            },
                            "Evidence & Analysis": {
                                "Excellent": "Provides substantial and relevant evidence, analyzing how it supports the argument effectively.",
                                "Proficient": "Provides appropriate evidence, but analysis may be underdeveloped or lack depth.",
                                "Developing": "Includes some evidence, but analysis is limited or not fully connected to the argument.",
                                "Beginning": "Little to no evidence or analysis is provided to support the argument."
                            },
                            "Organization & Coherence": {
                                "Excellent": "Essay is logically organized, with strong paragraph structure and smooth transitions.",
                                "Proficient": "Essay has clear organization with some effective transitions, though coherence may vary.",
                                "Developing": "Some organizational structure is evident, but coherence and transitions may be lacking.",
                                "Beginning": "Lacks clear organization and logical flow, making it difficult to follow the argument."
                            },
                            "Conventions": {
                                "Excellent": "Demonstrates mastery of spelling, punctuation, and grammar, contributing to readability.",
                                "Proficient": "Some minor errors present but do not significantly impact understanding.",
                                "Developing": "Errors in conventions may affect clarity or hinder readability.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion essay": {
                    "analytical": {
                        "name": "8th Grade Analytical Opinion Essay Rubric",
                        "description": "Evaluates the strength of opinion, quality of evidence, and clarity of structure in opinion essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion & Argument": {
                                "Excellent": "Clearly presents a well-defined opinion with a sophisticated argument that engages the reader.",
                                "Proficient": "Presents a clear opinion and logical argument, though may lack sophistication.",
                                "Developing": "Presents an opinion with an emerging argument, but may lack clarity or depth.",
                                "Beginning": "Opinion is unclear or unsupported by a coherent argument."
                            },
                            "Evidence & Elaboration": {
                                "Excellent": "Uses strong, relevant evidence and elaborates effectively to support the opinion.",
                                "Proficient": "Provides relevant evidence and some elaboration, though not consistently developed.",
                                "Developing": "Includes some evidence, but elaboration is weak or insufficient.",
                                "Beginning": "Provides little to no evidence or elaboration to support the opinion."
                            },
                            "Coherence & Transitions": {
                                "Excellent": "Ideas are organized in a logical sequence with clear, varied transitions.",
                                "Proficient": "Mostly organized with appropriate transitions, though some connections may be unclear.",
                                "Developing": "Organization is inconsistent and transitions may be awkward or unclear.",
                                "Beginning": "Essay lacks logical organization and transitions."
                            },
                            "Conventions & Style": {
                                "Excellent": "Uses proper conventions with sophisticated language to enhance the style of the essay.",
                                "Proficient": "Uses mostly correct conventions and appropriate language.",
                                "Developing": "Some errors in conventions and language that may affect readability.",
                                "Beginning": "Frequent errors in conventions and language impede understanding."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "8th Grade Analytical Persuasive Essay Rubric",
                        "description": "Evaluates strength of argument, depth of persuasive techniques, and logical organization in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Argument & Persuasiveness": {
                                "Excellent": "Presents a compelling and sophisticated argument, effectively persuading the reader.",
                                "Proficient": "Presents a clear and persuasive argument, though depth and complexity may vary.",
                                "Developing": "Attempts to present a persuasive argument, but it may lack clarity or full development.",
                                "Beginning": "Argument is unclear or lacks persuasive strength."
                            },
                            "Use of Persuasive Techniques": {
                                "Excellent": "Uses a range of persuasive techniques effectively, enhancing the argument's persuasiveness.",
                                "Proficient": "Uses some persuasive techniques effectively, but may lack variety or full development.",
                                "Developing": "Attempts to use persuasive techniques, but they may not fully support the argument.",
                                "Beginning": "Little to no use of persuasive techniques, weakening the argument."
                            },
                            "Evidence & Development": {
                                "Excellent": "Provides relevant and well-chosen evidence, with thorough development to support the argument.",
                                "Proficient": "Provides appropriate evidence and development, though some areas may lack detail.",
                                "Developing": "Includes some evidence, but connections to the argument may be unclear or insufficient.",
                                "Beginning": "Little to no evidence is provided, and development of ideas is limited."
                            },
                            "Conventions": {
                                "Excellent": "Correct use of conventions, enhancing clarity and persuasiveness of the essay.",
                                "Proficient": "Minor errors in conventions, but do not significantly impede understanding.",
                                "Developing": "Errors in conventions may affect readability.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                }
            },
            "expository": {
                "informational article": {
                    "analytical": {
                        "name": "8th Grade Analytical Informational Article Rubric",
                        "description": "Evaluates depth of content, logical structure, and sophisticated language in informational articles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clear Topic & Purpose": {
                                "Excellent": "Clearly introduces a topic and maintains a focused purpose throughout the article.",
                                "Proficient": "Introduces a clear topic, but purpose may not be fully maintained.",
                                "Developing": "States a topic, but focus or purpose may be unclear.",
                                "Beginning": "Topic is unclear or not maintained."
                            },
                            "Comprehensive Support & Evidence": {
                                "Excellent": "Uses well-researched facts, examples, and explanations to thoroughly support the topic.",
                                "Proficient": "Provides relevant support and evidence, but may lack thoroughness.",
                                "Developing": "Includes some support or evidence, but lacks clarity or depth.",
                                "Beginning": "Provides little to no support or evidence for the topic."
                            },
                            "Structure & Transitions": {
                                "Excellent": "Information is organized logically with clear transitions that connect ideas.",
                                "Proficient": "Organizes information with some clear transitions, but logical flow may be inconsistent.",
                                "Developing": "Some structure is present, but lacks clear transitions or logical progression.",
                                "Beginning": "Lacks clear structure and transitions."
                            },
                            "Conventions & Vocabulary": {
                                "Excellent": "Uses correct conventions and topic-appropriate vocabulary to enhance clarity.",
                                "Proficient": "Uses mostly correct conventions and appropriate vocabulary.",
                                "Developing": "Basic vocabulary and conventions, with errors that affect understanding.",
                                "Beginning": "Frequent errors in vocabulary and conventions hinder understanding."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "8th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates depth of comparison and contrast, logical structure, and use of evidence.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focused Introduction & Thesis": {
                                "Excellent": "Presents a clear thesis that establishes the significance of the comparison and contrast.",
                                "Proficient": "States a thesis that compares and contrasts, though focus may vary.",
                                "Developing": "Attempts to state a thesis, but focus on comparison may be unclear.",
                                "Beginning": "Lacks a clear thesis or purpose for comparison."
                            },
                            "Relevant Evidence & Details": {
                                "Excellent": "Provides thorough and relevant evidence to support both the comparison and contrast of the topics.",
                                "Proficient": "Provides relevant evidence, though some details may lack depth.",
                                "Developing": "Includes some evidence, but it may be unclear or not fully relevant.",
                                "Beginning": "Little to no evidence is provided to support the comparison."
                            },
                            "Organizational Structure & Flow": {
                                "Excellent": "Essay is well-organized with logical flow and smooth transitions between ideas.",
                                "Proficient": "Mostly organized with logical structure, though transitions may be less effective.",
                                "Developing": "Attempts organization, but lacks clear flow and structure.",
                                "Beginning": "Disorganized structure makes comparison difficult to follow."
                            },
                            "Conventions & Language Use": {
                                "Excellent": "Uses appropriate language and conventions accurately, enhancing clarity.",
                                "Proficient": "Mostly correct language and conventions with minor errors.",
                                "Developing": "Errors in conventions and language may affect readability.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "8th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Evaluates depth of analysis of cause-effect relationships, use of logical evidence, and structure.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Focus": {
                                "Excellent": "Presents a clear thesis that effectively establishes the cause and effect relationship.",
                                "Proficient": "States a thesis that outlines the cause and effect relationship, though clarity may vary.",
                                "Developing": "Attempts to state a thesis, but the cause and effect relationship may be unclear.",
                                "Beginning": "No clear thesis or focus on cause and effect."
                            },
                            "Evidence & Analysis": {
                                "Excellent": "Provides thorough evidence and analysis that clearly supports the cause and effect.",
                                "Proficient": "Offers evidence and analysis that supports the cause and effect, though depth may be inconsistent.",
                                "Developing": "Includes some evidence, but it may not fully support the cause and effect relationship.",
                                "Beginning": "Little to no evidence or analysis is provided."
                            },
                            "Organizational Structure & Flow": {
                                "Excellent": "Essay is well-organized with logical flow and smooth transitions.",
                                "Proficient": "Mostly organized with logical structure, though transitions may be less effective.",
                                "Developing": "Attempts organization, but lacks consistent flow and clear transitions.",
                                "Beginning": "Disorganized structure makes the essay difficult to follow."
                            },
                            "Conventions & Language Use": {
                                "Excellent": "Uses accurate conventions and appropriate language, enhancing clarity.",
                                "Proficient": "Mostly correct conventions and appropriate language, with minor errors.",
                                "Developing": "Errors in conventions and language may affect readability.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "reflective essay": {
                    "holistic": {
                        "name": "8th Grade Holistic Reflective Essay Rubric",
                        "description": "Evaluates thoughtful reflection, clarity of expression, and coherence in reflective essays.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The essay provides thoughtful and insightful reflection, with well-developed ideas and coherent structure. The expression of thoughts is clear, and vivid details add depth. Conventions are correct, enhancing clarity.",
                            "Proficient": "Reflects thoughtfully on experiences or ideas, with mostly clear expression and appropriate organization. Conventions are followed accurately, though minor errors may be present.",
                            "Developing": "Attempts reflection but lacks depth or coherence. The organization may be unclear, and errors in conventions affect the readability of the essay.",
                            "Beginning": "The essay lacks clear reflection, depth, and structure. Ideas are underdeveloped, and frequent errors in conventions hinder understanding."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "8th Grade Analytical How-To Guide Rubric",
                        "description": "Assesses logical sequencing, clarity, and completeness in providing step-by-step instructions.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Logical Sequencing": {
                                "Excellent": "Instructions are organized logically and presented in a manner that anticipates the audience's needs, providing clear guidance.",
                                "Proficient": "Steps are mostly logical and clear, though there may be minor gaps in anticipating audience needs.",
                                "Developing": "Steps may lack logical order or clarity, leading to difficulty in following instructions.",
                                "Beginning": "Instructions lack clear order, making it difficult to follow the steps effectively."
                            },
                            "Detail & Explanation": {
                                "Excellent": "Each step is explained in detail with necessary clarifications, ensuring audience understanding.",
                                "Proficient": "Most steps include sufficient detail, though some explanations may be less thorough.",
                                "Developing": "Some steps lack sufficient detail, leading to unclear instructions.",
                                "Beginning": "Minimal explanation is provided, affecting the overall clarity of the instructions."
                            },
                            "Vocabulary & Clarity": {
                                "Excellent": "Uses precise and clear vocabulary suitable for the audience, enhancing the guide’s effectiveness.",
                                "Proficient": "Vocabulary is mostly appropriate, with some terms lacking specificity or precision.",
                                "Developing": "Uses basic vocabulary that may not clearly support instructions.",
                                "Beginning": "Vocabulary is insufficient and impedes understanding of the guide."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, contributing to clarity and comprehension.",
                                "Proficient": "Some errors are present but they do not significantly impede understanding.",
                                "Developing": "Several errors are present and may affect readability.",
                                "Beginning": "Frequent errors make the guide difficult to follow."
                            }
                        }
                    }
                }
            },
            "research": {
                "research paper": {
                    "analytical": {
                        "name": "8th Grade Analytical Research Paper Rubric",
                        "description": "Assesses development of a research question, depth of content, organization, and adherence to a citation style.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Research Question & Argument": {
                                "Excellent": "Clearly defines a focused research question and presents a well-supported argument.",
                                "Proficient": "Defines a research question and presents an argument, though clarity and depth may vary.",
                                "Developing": "Research question and argument are present but lack clear focus or depth.",
                                "Beginning": "Research question and argument are unclear, missing, or poorly developed."
                            },
                            "Content & Critical Analysis": {
                                "Excellent": "Provides in-depth research and analysis, supporting arguments with detailed evidence.",
                                "Proficient": "Content is well-researched and supported by relevant evidence, though analysis may lack complexity.",
                                "Developing": "Content includes some research and supporting details but lacks depth.",
                                "Beginning": "Content lacks sufficient research and analysis, with minimal supporting details."
                            },
                            "Logical Organization & Structure": {
                                "Excellent": "Organizes information logically, with smooth transitions and cohesive paragraph structure.",
                                "Proficient": "Information is mostly organized, with clear paragraphs and transitions.",
                                "Developing": "Attempts to organize information, but structure is inconsistent or unclear.",
                                "Beginning": "Lacks organization, making the paper difficult to follow."
                            },
                            "Integration & Evaluation of Sources": {
                                "Excellent": "Incorporates a variety of credible sources effectively, integrating them seamlessly into the argument.",
                                "Proficient": "Uses credible sources appropriately, with some effective integration into the content.",
                                "Developing": "Uses sources that are minimally integrated or lack credibility.",
                                "Beginning": "Few or unreliable sources are used, with poor integration."
                            },
                            "Adherence to Citation Style": {
                                "Excellent": "Accurately follows the selected citation style with well-formatted in-text citations and a bibliography.",
                                "Proficient": "Mostly follows the citation style, with some minor errors.",
                                "Developing": "Attempts to follow the citation style, but errors are present.",
                                "Beginning": "Does not follow the citation style or lacks citations."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors, ensuring clear readability.",
                                "Proficient": "Some minor errors present, but they do not significantly affect understanding.",
                                "Developing": "Several errors present that may affect readability.",
                                "Beginning": "Frequent errors impede understanding."
                            }
                        }
                    }
                }
            }
        },
        "9th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "9th Grade Holistic Personal Narrative Rubric",
                        "description": "Assesses depth of introspection, emotional impact, and complexity of narrative structure in personal narratives.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative is compelling, deeply reflective, and employs a sophisticated storyline. Characters and events are developed with vivid details and complex emotions, maintaining clear focus and fluency. Conventions are used correctly, enhancing readability.",
                            "Proficient": "The narrative includes thoughtful reflection and complex character or event development. Structure is logical, and details effectively enhance engagement. Few errors in conventions are present, not hindering understanding.",
                            "Developing": "The narrative demonstrates some reflection, but may lack depth or coherent structure. Emotional impact is attempted but may not be fully realized. Errors in conventions somewhat hinder the flow.",
                            "Beginning": "The narrative lacks depth, with underdeveloped reflection or characters. Structure is unclear, and frequent errors in conventions make the narrative difficult to follow."
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "9th Grade Holistic Short Story Rubric",
                        "description": "Evaluates creativity, theme development, and narrative complexity in short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story is highly creative, with complex themes, well-developed characters, and a sophisticated plot. Narrative techniques (e.g., dialogue, pacing) enhance the story, and conventions are used effectively to support style and tone.",
                            "Proficient": "The story contains a developed theme, with clear character development and plot. Some narrative techniques are effectively used, though depth and complexity may be inconsistent. Conventions are mostly accurate.",
                            "Developing": "The story includes a basic theme and some character development, but lacks complexity or clear plot progression. Limited use of narrative techniques, and errors in conventions affect readability.",
                            "Beginning": "The story has minimal theme, character development, and plot. Lack of narrative techniques and numerous errors in conventions impede understanding."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "9th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the use of advanced descriptive techniques, organization, and sophisticated vocabulary to create a vivid and immersive description.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Structure": {
                                "Excellent": "Essay maintains a strong and clear focus throughout, with seamless organization and transitions that enhance the descriptive elements.",
                                "Proficient": "Essay maintains focus and is mostly organized with clear transitions.",
                                "Developing": "Essay has a central focus but may lack structure or consistent organization.",
                                "Beginning": "Essay lacks clear focus, structure, and transitions, impacting readability."
                            },
                            "Imagery & Figurative Language": {
                                "Excellent": "Uses sophisticated imagery and varied figurative language to create vivid and engaging descriptions.",
                                "Proficient": "Employs effective imagery and figurative language, but may lack depth or complexity.",
                                "Developing": "Attempts to use imagery and figurative language but lacks vividness.",
                                "Beginning": "Limited use of imagery and figurative language, leading to a lack of vivid description."
                            },
                            "Vocabulary & Style": {
                                "Excellent": "Employs advanced vocabulary and a distinct style that enhances the description and engages the reader.",
                                "Proficient": "Vocabulary is mostly advanced, with some stylistic choices that enhance the writing.",
                                "Developing": "Vocabulary is functional but lacks sophistication; style is basic.",
                                "Beginning": "Vocabulary is simple and style is underdeveloped, affecting the effectiveness of the description."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors, supporting clarity and engagement.",
                                "Proficient": "Some errors are present but do not significantly impede understanding.",
                                "Developing": "Several errors may hinder clarity and readability.",
                                "Beginning": "Frequent errors make the essay difficult to follow and understand."
                            }
                        }
                    }
                }
            },
            "argumentative": {
                "argumentative essay": {
                    "analytical": {
                        "name": "9th Grade Analytical Argumentative Essay Rubric",
                        "description": "Assesses the depth of argumentation, use of evidence, and logical structure in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Argument": {
                                "Excellent": "Presents a clear and persuasive thesis with a well-developed argument that addresses multiple perspectives.",
                                "Proficient": "Presents a clear thesis and argument, though some perspectives may not be fully explored.",
                                "Developing": "Attempts to present a thesis and argument, but they may lack depth or clarity.",
                                "Beginning": "Thesis is unclear or absent, and the argument lacks development or depth."
                            },
                            "Evidence & Reasoning": {
                                "Excellent": "Provides strong, relevant evidence with clear reasoning and thorough analysis that supports the thesis.",
                                "Proficient": "Provides appropriate evidence and reasoning, though some analysis may lack depth.",
                                "Developing": "Includes some evidence and reasoning, but connections to the thesis may be unclear.",
                                "Beginning": "Little to no evidence or reasoning is provided to support the thesis."
                            },
                            "Counterclaims & Rebuttals": {
                                "Excellent": "Effectively addresses counterclaims with logical rebuttals that enhance the argument.",
                                "Proficient": "Addresses counterclaims with appropriate rebuttals, though some may lack development.",
                                "Developing": "Attempts to address counterclaims, but rebuttals may be unclear or insufficient.",
                                "Beginning": "Counterclaims are not addressed or rebutted effectively."
                            },
                            "Organization & Flow": {
                                "Excellent": "Essay is well-organized with coherent flow and smooth transitions between ideas.",
                                "Proficient": "Essay has a clear organization and transitions, though flow may occasionally be disjointed.",
                                "Developing": "Some organizational structure is evident, but transitions may be weak or inconsistent.",
                                "Beginning": "Lacks clear organization and transitions, making the argument difficult to follow."
                            },
                            "Conventions": {
                                "Excellent": "Demonstrates accurate use of spelling, punctuation, and grammar, contributing to readability and style.",
                                "Proficient": "Some errors in conventions present but do not hinder understanding.",
                                "Developing": "Errors in conventions may affect clarity or flow.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion essay": {
                    "analytical": {
                        "name": "9th Grade Analytical Opinion Essay Rubric",
                        "description": "Evaluates clarity of opinion, logical argument, and use of detailed evidence in opinion essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion & Thesis": {
                                "Excellent": "Clearly articulates a strong opinion and thesis statement that guides the argument.",
                                "Proficient": "Articulates a clear opinion and thesis, though may lack precision.",
                                "Developing": "States an opinion and thesis but lacks clarity or focus.",
                                "Beginning": "Opinion and thesis are unclear or missing."
                            },
                            "Evidence & Analysis": {
                                "Excellent": "Provides in-depth analysis and uses well-chosen evidence to thoroughly support the argument.",
                                "Proficient": "Offers relevant evidence and analysis, but some points may lack development.",
                                "Developing": "Includes some evidence and analysis, but they may be unclear or insufficient.",
                                "Beginning": "Little to no evidence or analysis is provided to support the argument."
                            },
                            "Organization & Logical Flow": {
                                "Excellent": "Essay is coherently structured with a logical progression of ideas and effective transitions.",
                                "Proficient": "Mostly organized with a clear progression, though transitions may be repetitive.",
                                "Developing": "Some structure is present, but logical flow and transitions are inconsistent.",
                                "Beginning": "Essay is disorganized and lacks logical progression."
                            },
                            "Conventions & Style": {
                                "Excellent": "Uses formal conventions and a polished style that enhances the argument.",
                                "Proficient": "Uses mostly correct conventions and a consistent style.",
                                "Developing": "Conventions and style are basic, with errors that affect readability.",
                                "Beginning": "Frequent errors in conventions and style impede understanding."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "9th Grade Analytical Persuasive Essay Rubric",
                        "description": "Assesses complexity of argument, effectiveness of persuasive strategies, and logical organization.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Argument": {
                                "Excellent": "Presents a clear and nuanced thesis, with a well-developed argument throughout.",
                                "Proficient": "Presents a clear thesis and argument, though complexity may be emerging.",
                                "Developing": "Attempts to state a thesis and argument, but they may be simplistic or underdeveloped.",
                                "Beginning": "Thesis is unclear or absent, and the argument lacks development."
                            },
                            "Persuasive Techniques & Appeals": {
                                "Excellent": "Uses persuasive techniques and rhetorical appeals (ethos, pathos, logos) effectively to enhance the argument.",
                                "Proficient": "Uses persuasive techniques and appeals, but may lack variety or full development.",
                                "Developing": "Attempts to use persuasive techniques and appeals, but they may not be fully effective.",
                                "Beginning": "Little to no use of persuasive techniques, weakening the argument."
                            },
                            "Evidence & Support": {
                                "Excellent": "Provides well-reasoned evidence and logical support that thoroughly bolsters the argument.",
                                "Proficient": "Provides appropriate evidence and support, though some areas may lack detail.",
                                "Developing": "Includes some evidence and support, but they may not fully connect to the argument.",
                                "Beginning": "Little to no evidence or support is provided, weakening the argument."
                            },
                            "Conventions": {
                                "Excellent": "Accurate use of conventions that enhances readability and clarity.",
                                "Proficient": "Minor errors present in conventions, but they do not hinder understanding.",
                                "Developing": "Errors in conventions may affect the clarity and flow of the essay.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "expository": {
                "research paper": {
                    "analytical": {
                        "name": "9th Grade Analytical Research Paper Rubric",
                        "description": "Evaluates development of thesis, thorough research, logical argumentation, and adherence to citation style.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Focus": {
                                "Excellent": "Develops a clear, compelling thesis that thoroughly guides the paper’s research and analysis.",
                                "Proficient": "Thesis is clear and appropriately focused, guiding the paper effectively.",
                                "Developing": "Thesis is present but lacks clarity or fails to effectively guide the paper.",
                                "Beginning": "Thesis is absent, unclear, or does not guide the paper effectively."
                            },
                            "Organization & Argumentation": {
                                "Excellent": "Paper is well-organized, presenting arguments logically with strong transitions and clear paragraph structure.",
                                "Proficient": "Organization is mostly logical, with appropriate transitions, but some areas may lack coherence.",
                                "Developing": "Structure is present but lacks clear logic or flow, affecting argumentation.",
                                "Beginning": "Poor organization, making it difficult to follow the arguments presented."
                            },
                            "Research & Depth of Evidence": {
                                "Excellent": "Provides in-depth research with relevant, credible sources and well-developed analysis to support the thesis.",
                                "Proficient": "Provides appropriate evidence, but some sources may lack depth or analysis may be less developed.",
                                "Developing": "Evidence is present but may lack relevance, depth, or thorough analysis.",
                                "Beginning": "Little to no relevant evidence is provided to support the thesis."
                            },
                            "Citation & Style Adherence": {
                                "Excellent": "Adheres consistently to the chosen citation style, with accurate source attribution.",
                                "Proficient": "Follows the chosen citation style, with minor errors or inconsistencies.",
                                "Developing": "Attempts to follow citation style, but includes multiple errors or omissions.",
                                "Beginning": "Little to no adherence to citation style or source attribution."
                            }
                        }
                    }
                },
                "informational article": {
                    "analytical": {
                        "name": "9th Grade Analytical Informational Article Rubric",
                        "description": "Evaluates clarity of topic, depth of information, and organization in informational articles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focused Topic & Thesis": {
                                "Excellent": "Clearly states a focused topic and thesis that provides direction for the article.",
                                "Proficient": "States a clear topic and thesis, but may lack precision.",
                                "Developing": "Presents a topic, but thesis may be unclear or unfocused.",
                                "Beginning": "Topic and thesis are unclear or missing."
                            },
                            "Evidence & Depth of Information": {
                                "Excellent": "Provides thorough and well-researched evidence, facts, and examples that support the topic.",
                                "Proficient": "Offers relevant evidence and information, but depth may be inconsistent.",
                                "Developing": "Includes some evidence and information, but lacks depth and variety.",
                                "Beginning": "Little to no evidence is provided to support the topic."
                            },
                            "Organizational Structure & Coherence": {
                                "Excellent": "Information is organized in a coherent structure, with clear headings and logical progression.",
                                "Proficient": "Information is mostly organized, but some sections may lack coherence.",
                                "Developing": "Attempts organization, but lacks clear logical structure.",
                                "Beginning": "Information is disorganized and lacks coherence."
                            },
                            "Language Use & Conventions": {
                                "Excellent": "Uses precise language and correct conventions, enhancing clarity and sophistication.",
                                "Proficient": "Uses mostly appropriate language and conventions.",
                                "Developing": "Basic language and conventions, with errors that may affect clarity.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "9th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates depth of comparison, thorough evidence, and sophisticated organization.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clear & Analytical Thesis": {
                                "Excellent": "Presents a clear, analytical thesis that explores meaningful similarities and differences.",
                                "Proficient": "States a clear thesis that compares and contrasts topics, but may lack depth.",
                                "Developing": "Attempts to state a thesis, but it may be unclear or lack analytical focus.",
                                "Beginning": "Lacks a clear thesis or analytical approach to comparison."
                            },
                            "Detailed Evidence & Analysis": {
                                "Excellent": "Provides detailed evidence and analysis that effectively supports the comparison and contrast.",
                                "Proficient": "Offers relevant evidence and analysis, though depth may vary.",
                                "Developing": "Includes limited evidence and analysis, making comparison unclear.",
                                "Beginning": "Provides little to no evidence or analysis to support the comparison."
                            },
                            "Cohesive Structure & Transitions": {
                                "Excellent": "Essay is cohesively structured with logical flow and effective use of transitions.",
                                "Proficient": "Mostly cohesive structure with some logical flow, though transitions may be less smooth.",
                                "Developing": "Attempts organization but lacks consistent flow and clear transitions.",
                                "Beginning": "Disorganized structure makes the essay difficult to follow."
                            },
                            "Language Use & Conventions": {
                                "Excellent": "Uses precise language and correct conventions, enhancing the clarity and sophistication of the essay.",
                                "Proficient": "Mostly correct language and conventions, with minor errors.",
                                "Developing": "Errors in conventions and language may affect clarity and readability.",
                                "Beginning": "Frequent errors impede understanding and clarity."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "9th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Evaluates depth of cause-effect analysis, evidence use, and logical organization.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Analytical Thesis & Focus": {
                                "Excellent": "Presents a clear, analytical thesis that explores a meaningful cause and effect relationship.",
                                "Proficient": "States a thesis that addresses the cause and effect relationship, but may lack depth.",
                                "Developing": "Attempts to state a thesis, but focus may be unclear or lack analysis.",
                                "Beginning": "No clear thesis or analytical focus on cause and effect."
                            },
                            "Comprehensive Evidence & Reasoning": {
                                "Excellent": "Provides comprehensive evidence and well-reasoned analysis to support the cause and effect.",
                                "Proficient": "Uses relevant evidence and reasoning, though depth may vary.",
                                "Developing": "Includes limited evidence and reasoning, affecting the clarity of the cause and effect.",
                                "Beginning": "Little to no evidence or reasoning is provided."
                            },
                            "Coherent Structure & Transitions": {
                                "Excellent": "Essay is cohesively structured with logical flow and effective use of transitions.",
                                "Proficient": "Mostly cohesive structure with some logical flow, though transitions may be less smooth.",
                                "Developing": "Attempts organization but lacks consistent structure and clear transitions.",
                                "Beginning": "Disorganized structure makes it difficult to follow the essay."
                            },
                            "Language Use & Conventions": {
                                "Excellent": "Uses precise language and correct conventions to enhance clarity.",
                                "Proficient": "Employs appropriate language and conventions, with minor errors.",
                                "Developing": "Errors in conventions and language may affect clarity and readability.",
                                "Beginning": "Frequent errors impede understanding."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "reflective essay": {
                    "holistic": {
                        "name": "9th Grade Holistic Reflective Essay Rubric",
                        "description": "Assesses depth of reflection, insight into experiences, and fluid expression of ideas.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The essay provides deep and meaningful reflection with well-developed insights and a coherent structure. Ideas are clearly and vividly expressed, enhancing engagement and understanding. Conventions are followed flawlessly.",
                            "Proficient": "Reflects thoughtfully with emerging depth and logical structure. Ideas are clearly expressed, and conventions are mostly accurate, though minor lapses may occur.",
                            "Developing": "The essay attempts reflection but lacks depth or focus. Expression may be unclear, and organization is inconsistent. Errors in conventions affect the clarity and readability.",
                            "Beginning": "The essay lacks a clear reflective focus and organization. Ideas are not well-developed, and frequent errors in conventions make the essay difficult to understand."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "9th Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates clarity, thoroughness, and audience awareness in how-to guides.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Logical Flow": {
                                "Excellent": "The guide provides clear, logically sequenced steps that are easy to follow, anticipating potential audience questions.",
                                "Proficient": "The guide’s steps are mostly clear and logical, though minor lapses in flow may occur.",
                                "Developing": "Steps may lack clarity or logical order, affecting the guide's overall flow.",
                                "Beginning": "Instructions are unclear or poorly ordered, making them difficult to follow."
                            },
                            "Detail & Completeness": {
                                "Excellent": "Steps are thoroughly explained with all necessary details, ensuring the audience can easily complete the task.",
                                "Proficient": "Provides adequate details for most steps, though some may lack thoroughness or completeness.",
                                "Developing": "Attempts to provide detail, but some steps are unclear or lack necessary information.",
                                "Beginning": "Little to no detail is provided, making the guide incomplete."
                            },
                            "Language & Audience Awareness": {
                                "Excellent": "Uses language effectively to guide the audience, with terminology appropriate for their level of understanding.",
                                "Proficient": "Uses mostly appropriate language and terminology for the audience, though some terms may lack precision.",
                                "Developing": "Uses basic or unclear language that may not fully support audience understanding.",
                                "Beginning": "Language is insufficient, impeding the audience’s ability to follow the guide."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors, enhancing readability.",
                                "Proficient": "Some errors in conventions are present but do not impede understanding.",
                                "Developing": "Several errors affect clarity and flow.",
                                "Beginning": "Frequent errors make the instructions hard to understand."
                            }
                        }
                    }
                }
            },
            "research": {
                "research paper": {
                    "analytical": {
                        "name": "9th Grade Analytical Research Paper Rubric",
                        "description": "Evaluates research depth, argumentative clarity, structure, and proper citation in research papers.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Research Question & Thesis Development": {
                                "Excellent": "Defines a well-focused research question and develops a clear, insightful thesis.",
                                "Proficient": "Defines a research question and develops a thesis, though focus or insight may vary.",
                                "Developing": "Research question and thesis are present but lack focus or clear development.",
                                "Beginning": "Research question and thesis are unclear or underdeveloped."
                            },
                            "Content Depth & Analysis": {
                                "Excellent": "Presents in-depth research and critical analysis, offering strong support and evidence for arguments.",
                                "Proficient": "Content is well-researched, with relevant analysis and evidence, though depth may vary.",
                                "Developing": "Presents content with some research and analysis, but lacks depth or strong evidence.",
                                "Beginning": "Content is minimal, with limited research and weak analysis."
                            },
                            "Organization & Logical Flow": {
                                "Excellent": "Information is logically organized with clear structure and smooth transitions.",
                                "Proficient": "Information is organized with effective transitions and paragraph structure.",
                                "Developing": "Attempts to organize information, but transitions and flow may be inconsistent.",
                                "Beginning": "Lacks clear organization, impacting the paper’s readability."
                            },
                            "Integration of Sources & Evidence": {
                                "Excellent": "Effectively integrates credible sources, using evidence to support the thesis and argument.",
                                "Proficient": "Uses credible sources appropriately, with mostly effective integration.",
                                "Developing": "Uses sources that may lack credibility or proper integration.",
                                "Beginning": "Sources are not effectively used or integrated, impacting the argument."
                            },
                            "Citation Style & Formatting": {
                                "Excellent": "Adheres to the selected citation style accurately, with a properly formatted bibliography and in-text citations.",
                                "Proficient": "Follows the citation style, with some minor formatting errors.",
                                "Developing": "Attempts to use the citation style, but with multiple errors.",
                                "Beginning": "Does not follow the citation style, or citations are missing."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in spelling, punctuation, or grammar, enhancing readability.",
                                "Proficient": "Some errors present, but do not significantly hinder understanding.",
                                "Developing": "Several errors may affect clarity and readability.",
                                "Beginning": "Frequent errors hinder readability."
                            }
                        }
                    }
                }
            }
        },
        "10th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "10th Grade Holistic Personal Narrative Rubric",
                        "description": "Evaluates depth of personal insight, emotional depth, and narrative complexity.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative shows a mature reflection on experiences with insightful connections and a strong personal voice. A well-crafted plot and vivid descriptions enhance the reader's experience, with flawless use of conventions.",
                            "Proficient": "The narrative effectively reflects on experiences with developed characters and events. Use of voice and detailed descriptions create a mostly smooth narrative, with conventions that are generally correct.",
                            "Developing": "The narrative shows an attempt at reflection, but lacks consistency in voice, details, or structure. Errors in conventions affect the narrative’s readability.",
                            "Beginning": "The narrative is unclear or lacks reflection, depth, or character development. The structure is disjointed, and errors in conventions significantly hinder understanding."
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "10th Grade Holistic Short Story Rubric",
                        "description": "Evaluates theme complexity, character arc, and advanced use of literary techniques in short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story explores complex themes with a sophisticated character arc and plot structure. Advanced literary techniques (e.g., symbolism, metaphor) enhance the story's meaning, and conventions are flawless, supporting the narrative voice.",
                            "Proficient": "The story demonstrates thoughtful theme development and character progression. Use of literary techniques is present, but may not consistently enhance the story. Conventions are mostly correct, supporting readability.",
                            "Developing": "The story attempts to explore themes and character arcs, but lacks depth or complexity. Limited use of literary techniques, and errors in conventions affect clarity and flow.",
                            "Beginning": "The story lacks theme complexity, character development, and plot structure. Minimal use of literary techniques, with frequent errors in conventions that hinder understanding."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "10th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates the advanced use of description, word choice, and organization to create vivid, detailed, and engaging essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Coherence": {
                                "Excellent": "The essay maintains clear focus and coherence, with sophisticated transitions and logical flow of ideas.",
                                "Proficient": "The essay maintains focus with appropriate coherence and flow, though some transitions may lack sophistication.",
                                "Developing": "Focus is present but coherence and organization are inconsistent.",
                                "Beginning": "The essay lacks focus and coherence, impacting readability."
                            },
                            "Imagery & Depth": {
                                "Excellent": "Uses rich imagery and sensory language to create a detailed, immersive experience. Figurative language effectively enhances the description.",
                                "Proficient": "Employs imagery and sensory language effectively, but may lack depth or full immersion.",
                                "Developing": "Attempts to use imagery but lacks consistency and depth.",
                                "Beginning": "Limited use of imagery or sensory language, resulting in a flat description."
                            },
                            "Language & Tone": {
                                "Excellent": "Language is varied, precise, and sophisticated, with a tone that enhances the description and overall mood.",
                                "Proficient": "Uses varied language and appropriate tone, but may lack sophistication.",
                                "Developing": "Language is simple and tone may be inconsistent, affecting the mood of the description.",
                                "Beginning": "Basic language and tone do not effectively support the description."
                            },
                            "Conventions": {
                                "Excellent": "Conventions are correct and enhance the clarity and style of the writing.",
                                "Proficient": "Minor errors in conventions, but do not impede understanding.",
                                "Developing": "Several errors may affect readability and clarity.",
                                "Beginning": "Frequent errors hinder readability and comprehension."
                            }
                        }
                    }
                }
            },
            "argumentative": {
                "argumentative essay": {
                    "analytical": {
                        "name": "10th Grade Analytical Argumentative Essay Rubric",
                        "description": "Evaluates the depth of argumentation, thoroughness of evidence, and logical coherence in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Complexity": {
                                "Excellent": "Presents a sophisticated thesis and explores complex aspects of the argument thoroughly.",
                                "Proficient": "Presents a clear thesis with some exploration of complex ideas, though depth may vary.",
                                "Developing": "Attempts to state a thesis and address complexity, but lacks full exploration or depth.",
                                "Beginning": "Thesis is unclear or missing, and complexity of argument is not addressed."
                            },
                            "Evidence & Analysis": {
                                "Excellent": "Provides strong, well-researched evidence and thorough analysis to support the thesis and argument.",
                                "Proficient": "Provides appropriate evidence and analysis, though some may lack depth or thoroughness.",
                                "Developing": "Includes some evidence and analysis, but they may not fully support the argument.",
                                "Beginning": "Little to no evidence or analysis is provided, weakening the argument."
                            },
                            "Counterclaims & Refutation": {
                                "Excellent": "Addresses multiple counterclaims with insightful refutations that enhance the overall argument.",
                                "Proficient": "Addresses counterclaims with reasonable refutations, though some lack depth.",
                                "Developing": "Attempts to address counterclaims, but refutations may be limited or unclear.",
                                "Beginning": "Counterclaims are not effectively addressed or refuted."
                            },
                            "Organization & Transitions": {
                                "Excellent": "Essay is logically organized with seamless transitions that enhance the flow of the argument.",
                                "Proficient": "Essay is organized with mostly effective transitions, though some areas may lack coherence.",
                                "Developing": "Some organization is present, but transitions may be weak or inconsistent.",
                                "Beginning": "Lacks clear organization and transitions, affecting the flow of the argument."
                            },
                            "Conventions": {
                                "Excellent": "Accurate use of spelling, punctuation, and grammar, enhancing readability and style.",
                                "Proficient": "Minor errors in conventions, but do not significantly impede understanding.",
                                "Developing": "Several errors in conventions may affect readability.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion essay": {
                    "analytical": {
                        "name": "10th Grade Analytical Opinion Essay Rubric",
                        "description": "Evaluates sophistication of opinion, depth of reasoning, and structured organization in opinion essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Sophisticated Opinion & Argument": {
                                "Excellent": "States a nuanced opinion with a sophisticated argument that is well-developed and insightful.",
                                "Proficient": "States a clear opinion with a developed argument, but may lack full sophistication.",
                                "Developing": "Presents an opinion and basic argument, but lacks complexity or depth.",
                                "Beginning": "Opinion is unclear and argument is underdeveloped or missing."
                            },
                            "Evidence & Logical Reasoning": {
                                "Excellent": "Supports the argument with logical reasoning, detailed analysis, and a range of well-chosen evidence.",
                                "Proficient": "Provides relevant evidence and logical reasoning, though some points may need more development.",
                                "Developing": "Includes some evidence and reasoning, but they are unclear or lack depth.",
                                "Beginning": "Little to no evidence or reasoning is provided to support the argument."
                            },
                            "Structure & Coherence": {
                                "Excellent": "Essay is cohesively organized with clear and varied transitions that enhance argument coherence.",
                                "Proficient": "Essay is mostly organized, with appropriate transitions and coherence.",
                                "Developing": "Some structure is present, but organization is inconsistent.",
                                "Beginning": "Essay lacks structure and coherence."
                            },
                            "Language Use & Conventions": {
                                "Excellent": "Uses precise and sophisticated language with few or no errors in conventions.",
                                "Proficient": "Uses appropriate language and mostly correct conventions.",
                                "Developing": "Language is basic and conventions contain several errors.",
                                "Beginning": "Frequent errors in conventions and language use hinder readability."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "10th Grade Analytical Persuasive Essay Rubric",
                        "description": "Evaluates depth of argument, sophistication of persuasive techniques, and evidence in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Argument Development": {
                                "Excellent": "Presents a sophisticated thesis with a fully developed argument that demonstrates clear and compelling persuasion.",
                                "Proficient": "Presents a clear thesis and develops an argument with some sophistication.",
                                "Developing": "Attempts to develop a thesis and argument, but lacks full clarity or depth.",
                                "Beginning": "Thesis is unclear or not fully developed, and argument is weak."
                            },
                            "Persuasive Techniques & Style": {
                                "Excellent": "Uses a wide range of persuasive techniques and a sophisticated style to effectively engage and persuade the reader.",
                                "Proficient": "Uses persuasive techniques effectively, though sophistication and variety may be limited.",
                                "Developing": "Attempts to use persuasive techniques, but style may be basic or inconsistent.",
                                "Beginning": "Little to no use of persuasive techniques, affecting the argument’s persuasiveness."
                            },
                            "Evidence & Analysis": {
                                "Excellent": "Provides well-analyzed evidence that thoroughly supports and enhances the argument.",
                                "Proficient": "Provides appropriate evidence and analysis, though some areas may lack depth.",
                                "Developing": "Includes some evidence and analysis, but connections to the argument may be weak.",
                                "Beginning": "Little to no evidence or analysis is provided to support the argument."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in conventions, enhancing the essay's style and readability.",
                                "Proficient": "Minor errors present but do not significantly impede understanding.",
                                "Developing": "Errors may affect clarity and flow of the essay.",
                                "Beginning": "Frequent errors hinder readability and understanding."
                            }
                        }
                    }
                }
            },
            "expository": {
                "informational article": {
                    "analytical": {
                        "name": "10th Grade Analytical Informational Article Rubric",
                        "description": "Evaluates depth of analysis, clarity of thesis, and cohesive structure in informational articles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Topic Focus": {
                                "Excellent": "Presents a clear, specific thesis and maintains focused analysis throughout.",
                                "Proficient": "States a clear thesis and generally maintains focus, but may lack specificity.",
                                "Developing": "Presents a topic, but thesis and focus may be unclear.",
                                "Beginning": "Thesis is unclear or not maintained throughout the article."
                            },
                            "Depth & Quality of Information": {
                                "Excellent": "Provides detailed, relevant evidence and examples to thoroughly support the thesis.",
                                "Proficient": "Provides relevant evidence, though depth and variety may be lacking.",
                                "Developing": "Includes some evidence and examples, but they are not fully developed or connected.",
                                "Beginning": "Little to no evidence is provided to support the thesis."
                            },
                            "Structure & Logical Flow": {
                                "Excellent": "Article is cohesively structured with logical flow and smooth transitions between ideas.",
                                "Proficient": "Mostly organized with some logical flow and effective transitions.",
                                "Developing": "Attempts to organize, but lacks clear flow and logical structure.",
                                "Beginning": "Lacks organization and logical flow, making the article difficult to follow."
                            },
                            "Conventions & Language Style": {
                                "Excellent": "Uses precise language and follows conventions accurately, enhancing readability.",
                                "Proficient": "Mostly correct language and conventions, with minor errors.",
                                "Developing": "Basic language and conventions, with several errors.",
                                "Beginning": "Frequent errors in conventions impede readability."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "10th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates complex comparison, depth of analysis, and logical organization in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Sophisticated Thesis & Focus": {
                                "Excellent": "Presents a clear, sophisticated thesis with nuanced analysis of both similarities and differences.",
                                "Proficient": "States a clear thesis, though depth of analysis may vary.",
                                "Developing": "Attempts a thesis, but focus and depth of analysis may be unclear.",
                                "Beginning": "Thesis is unclear or lacks analytical focus."
                            },
                            "Comprehensive Evidence & Insight": {
                                "Excellent": "Provides comprehensive evidence and insightful analysis to support both the comparison and contrast.",
                                "Proficient": "Uses appropriate evidence and analysis, though depth may be inconsistent.",
                                "Developing": "Includes some evidence and analysis, but lacks thoroughness and depth.",
                                "Beginning": "Little to no evidence or analysis is provided."
                            },
                            "Logical Structure & Coherent Flow": {
                                "Excellent": "Essay is logically structured with coherent flow and smooth, effective transitions.",
                                "Proficient": "Mostly logical structure with some coherent flow, though transitions may be less effective.",
                                "Developing": "Attempts to organize, but lacks consistent flow and clear structure.",
                                "Beginning": "Disorganized structure makes it difficult to follow the comparison."
                            },
                            "Conventions & Language Sophistication": {
                                "Excellent": "Uses sophisticated language and correct conventions that enhance the essay’s clarity.",
                                "Proficient": "Employs appropriate language and mostly correct conventions.",
                                "Developing": "Errors in conventions and language may affect clarity.",
                                "Beginning": "Frequent errors in conventions and language hinder understanding."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "10th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Evaluates complex analysis, depth of reasoning, and cohesive structure in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Sophisticated Thesis & Analysis": {
                                "Excellent": "Presents a sophisticated thesis with in-depth analysis of the cause and effect relationship.",
                                "Proficient": "States a clear thesis, though analysis of cause and effect may lack sophistication.",
                                "Developing": "Attempts to state a thesis, but analysis is unclear or underdeveloped.",
                                "Beginning": "No clear thesis or depth of analysis."
                            },
                            "Thorough Evidence & Insight": {
                                "Excellent": "Provides thorough evidence and insightful analysis that enhances understanding of the cause and effect.",
                                "Proficient": "Offers appropriate evidence and insight, though depth may vary.",
                                "Developing": "Includes some evidence and insight, but lacks thoroughness.",
                                "Beginning": "Little to no evidence or insight is provided."
                            },
                            "Logical Structure & Flow": {
                                "Excellent": "Essay is logically structured with coherent flow and effective use of transitions.",
                                "Proficient": "Mostly logical structure with some clear flow, though transitions may need refinement.",
                                "Developing": "Attempts organization but lacks consistency in flow and structure.",
                                "Beginning": "Disorganized structure makes the essay difficult to follow."
                            },
                            "Conventions & Language Sophistication": {
                                "Excellent": "Uses sophisticated language and follows conventions accurately.",
                                "Proficient": "Employs appropriate language and mostly correct conventions.",
                                "Developing": "Errors in conventions and language affect clarity.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "reflective essay": {
                    "holistic": {
                        "name": "10th Grade Holistic Reflective Essay Rubric",
                        "description": "Evaluates the depth of reflective insight, complexity of thought, and coherent structure in essays.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The essay demonstrates deep reflection and insight, with complex thoughts presented in a coherent, fluid structure. Personal voice is strong and engaging, with correct use of conventions.",
                            "Proficient": "Reflects on experiences or ideas with clarity and emerging complexity. Organization supports the reflection, and conventions are mostly correct, enhancing readability.",
                            "Developing": "The essay shows an attempt at reflective thought but lacks depth and focus. Organization is inconsistent, and errors in conventions affect readability.",
                            "Beginning": "The essay lacks depth of reflection and coherent organization. Ideas are underdeveloped, and frequent errors in conventions hinder understanding."
                        }
                    }
                }
            },
            "research": {
                "research paper": {
                    "analytical": {
                        "name": "10th Grade Analytical Research Paper Rubric",
                        "description": "Assesses focus, research depth, argument development, and correct application of citation styles.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Research Question & Thesis Clarity": {
                                "Excellent": "Presents a clear, focused research question and a compelling thesis that guides the paper.",
                                "Proficient": "Research question and thesis are present, providing a guiding focus.",
                                "Developing": "Research question and thesis are somewhat unclear or underdeveloped.",
                                "Beginning": "Research question and thesis are vague or missing."
                            },
                            "Content Development & Argumentation": {
                                "Excellent": "Provides detailed research, well-supported arguments, and insightful analysis, enhancing the depth of the paper.",
                                "Proficient": "Content is well-researched, with clear arguments and relevant analysis.",
                                "Developing": "Content presents basic research and arguments, but lacks depth or thorough analysis.",
                                "Beginning": "Content lacks research and clear arguments, with little analysis."
                            },
                            "Cohesive Structure & Flow": {
                                "Excellent": "Information is well-organized, with cohesive paragraphs, logical structure, and smooth transitions.",
                                "Proficient": "Organizes content with logical flow and mostly clear transitions.",
                                "Developing": "Attempts to organize content, but transitions may be unclear or structure inconsistent.",
                                "Beginning": "Lacks organization and logical structure, affecting readability."
                            },
                            "Source Evaluation & Integration": {
                                "Excellent": "Critically evaluates and effectively integrates credible sources to strengthen arguments.",
                                "Proficient": "Uses and integrates sources appropriately to support arguments.",
                                "Developing": "Includes sources, but lacks effective integration or evaluation.",
                                "Beginning": "Sources are insufficient, poorly integrated, or lack credibility."
                            },
                            "Accuracy of Citation Style": {
                                "Excellent": "Accurately follows the selected citation style for all citations and bibliography.",
                                "Proficient": "Generally follows the citation style, with minor errors.",
                                "Developing": "Attempts to follow the citation style, but with multiple errors.",
                                "Beginning": "Citation style is not followed, or citations are missing."
                            },
                            "Conventions": {
                                "Excellent": "Uses conventions correctly, with few or no errors that enhance readability.",
                                "Proficient": "Some errors present, but they do not impede understanding.",
                                "Developing": "Several errors affect clarity and readability.",
                                "Beginning": "Frequent errors hinder understanding."
                            }
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "10th Grade Analytical How-To Guide Rubric",
                        "description": "Assesses thoroughness, clarity, and logical presentation of steps in how-to guides.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thoroughness & Clarity": {
                                "Excellent": "Steps are thoroughly detailed, clearly presented, and anticipate possible misunderstandings, providing a comprehensive guide.",
                                "Proficient": "Steps are mostly clear and detailed, though some explanations may lack depth.",
                                "Developing": "Some steps lack clarity and detail, affecting the audience's ability to follow the guide.",
                                "Beginning": "Steps are unclear, incomplete, or lack necessary detail, making the guide ineffective."
                            },
                            "Logical Structure & Flow": {
                                "Excellent": "Instructions follow a logical structure, ensuring a smooth and easy-to-follow process from beginning to end.",
                                "Proficient": "The guide is mostly logical and follows a structured flow, though some steps may lack coherence.",
                                "Developing": "The structure is inconsistent, leading to unclear progression of steps.",
                                "Beginning": "The structure is unclear and lacks logical progression, making the guide hard to follow."
                            },
                            "Vocabulary & Audience Engagement": {
                                "Excellent": "Employs precise vocabulary suitable for the audience, with engaging language that enhances understanding.",
                                "Proficient": "Uses appropriate vocabulary and engaging language, though some terms may be less effective.",
                                "Developing": "Language is functional but lacks engagement, and some terminology may be unclear.",
                                "Beginning": "Vocabulary is insufficient or inappropriate, affecting clarity and engagement."
                            },
                            "Conventions": {
                                "Excellent": "Conventions are correct, supporting the clarity and effectiveness of the guide.",
                                "Proficient": "Some errors in conventions are present but do not significantly impede understanding.",
                                "Developing": "Several errors in conventions affect readability.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                }
            }
        },
        "11th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "11th Grade Holistic Personal Narrative Rubric",
                        "description": "Evaluates depth of self-reflection, emotional complexity, and sophisticated narrative structure.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative is insightful, with complex themes and reflections that connect personal experiences to broader ideas. The storyline is skillfully crafted with rich, vivid details, emotional depth, and a distinctive voice. Conventions enhance readability and style.",
                            "Proficient": "The narrative includes thoughtful reflection and connects personal experiences to more complex themes. Characters and events are well-developed, and conventions are mostly accurate, enhancing readability.",
                            "Developing": "The narrative provides some reflection, but lacks deeper thematic connections or clear development of characters and events. Errors in conventions may affect style and flow.",
                            "Beginning": "The narrative lacks depth, complexity, and thematic connections. Characters, events, and reflections are underdeveloped, and errors in conventions hinder understanding."
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "11th Grade Holistic Short Story Rubric",
                        "description": "Evaluates sophisticated themes, character development, and narrative voice in short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story explores sophisticated themes, with a well-developed narrative voice and multidimensional characters. Complex plot structures and literary devices (e.g., symbolism, allusion) are used effectively. Conventions are skillfully applied.",
                            "Proficient": "The story addresses complex themes with an emerging narrative voice. Characters and plot are developed, with use of literary devices that enhance the story. Conventions are mostly accurate, supporting the narrative.",
                            "Developing": "The story attempts to explore complex themes but lacks depth. Character and plot development may be inconsistent, with limited use of literary devices. Conventions errors affect readability.",
                            "Beginning": "The story lacks clear themes, developed characters, and narrative voice. Little use of literary devices, and numerous errors in conventions make the story hard to understand."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "11th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates depth of descriptive content, stylistic language, and cohesive organization in detailed essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Cohesion": {
                                "Excellent": "Essay maintains a clear focus and cohesion, with sophisticated structure and seamless transitions.",
                                "Proficient": "Maintains focus with mostly clear cohesion and transitions that support the description.",
                                "Developing": "Focus is evident but may lack cohesion and fluid structure.",
                                "Beginning": "Essay lacks clear focus and cohesion, affecting readability."
                            },
                            "Sensory Detail & Imagery": {
                                "Excellent": "Uses sensory details and imagery with precision and sophistication to evoke vivid and compelling descriptions.",
                                "Proficient": "Employs sensory details effectively, though sophistication may vary.",
                                "Developing": "Uses basic sensory details and imagery, but lacks sophistication.",
                                "Beginning": "Limited use of sensory details and imagery, affecting vividness."
                            },
                            "Advanced Vocabulary & Style": {
                                "Excellent": "Employs advanced vocabulary and stylistic choices that contribute to a vivid, engaging, and immersive description.",
                                "Proficient": "Uses appropriate vocabulary and style, though may not fully enhance the description.",
                                "Developing": "Vocabulary is basic and lacks stylistic sophistication.",
                                "Beginning": "Limited vocabulary and style do not contribute effectively to the description."
                            },
                            "Conventions": {
                                "Excellent": "Correct use of conventions enhances the writing style and clarity.",
                                "Proficient": "Some minor errors in conventions, which do not impede understanding.",
                                "Developing": "Errors in conventions may affect clarity and flow.",
                                "Beginning": "Frequent errors make the description difficult to follow."
                            }
                        }
                    }
                }
            },
            "argumentative": {
                "argumentative essay": {
                    "analytical": {
                        "name": "11th Grade Analytical Argumentative Essay Rubric",
                        "description": "Assesses the development of complex arguments, nuanced reasoning, and thorough evidence in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Nuance": {
                                "Excellent": "Presents a nuanced and sophisticated thesis, exploring multiple layers and complexities of the argument.",
                                "Proficient": "States a clear thesis with exploration of complex ideas, though some aspects may lack depth.",
                                "Developing": "Attempts to address a thesis and complexity, but exploration is limited or underdeveloped.",
                                "Beginning": "Thesis is unclear or overly simplistic, and complexities of the argument are not addressed."
                            },
                            "Evidence & Reasoning": {
                                "Excellent": "Provides in-depth evidence and logical reasoning that thoroughly supports the thesis and argument.",
                                "Proficient": "Evidence and reasoning are appropriate but may lack in-depth analysis or detail.",
                                "Developing": "Includes some evidence and reasoning, but connections to the thesis are weak.",
                                "Beginning": "Little to no evidence or reasoning is present to support the argument."
                            },
                            "Counterclaims & Rebuttals": {
                                "Excellent": "Effectively addresses counterclaims with well-developed and logical rebuttals, enhancing the argument.",
                                "Proficient": "Addresses counterclaims and provides rebuttals, though some may lack complexity.",
                                "Developing": "Attempts to address counterclaims, but rebuttals are unclear or insufficient.",
                                "Beginning": "Counterclaims are not effectively addressed or rebutted."
                            },
                            "Organization & Flow": {
                                "Excellent": "Essay is organized with a clear and logical flow, using smooth transitions to enhance argument coherence.",
                                "Proficient": "Essay has a mostly clear organization, with some effective transitions.",
                                "Developing": "Some organization is present, but flow may be disjointed or inconsistent.",
                                "Beginning": "Lacks clear organization, logical flow, and transitions."
                            },
                            "Conventions": {
                                "Excellent": "Demonstrates mastery of conventions, with few to no errors enhancing readability and style.",
                                "Proficient": "Minor errors are present but do not impede understanding.",
                                "Developing": "Errors in conventions may affect readability and flow.",
                                "Beginning": "Frequent errors hinder readability and understanding."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion essay": {
                    "analytical": {
                        "name": "11th Grade Analytical Opinion Essay Rubric",
                        "description": "Evaluates the complexity of opinion, depth of argumentation, and cohesiveness in opinion essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Opinion & Insight": {
                                "Excellent": "Presents a nuanced, insightful opinion that is thoroughly developed throughout the essay.",
                                "Proficient": "States a clear and insightful opinion, though depth of development may vary.",
                                "Developing": "States an opinion, but lacks insight or full development.",
                                "Beginning": "Opinion is unclear or lacks depth and focus."
                            },
                            "Evidence & Complex Reasoning": {
                                "Excellent": "Uses diverse evidence and detailed reasoning to effectively support and analyze the opinion.",
                                "Proficient": "Provides appropriate evidence and reasoning, but lacks some depth or sophistication.",
                                "Developing": "Includes evidence and reasoning, but lacks clarity or is insufficient.",
                                "Beginning": "Little to no evidence or reasoning is provided to support the opinion."
                            },
                            "Logical Structure & Flow": {
                                "Excellent": "Essay is well-organized with a clear, logical structure and seamless transitions.",
                                "Proficient": "Essay is mostly organized with logical structure, though transitions may need refinement.",
                                "Developing": "Some organization is present, but lacks logical flow.",
                                "Beginning": "Essay lacks clear structure and logical progression."
                            },
                            "Style & Conventions": {
                                "Excellent": "Uses an engaging style with precise language and correct conventions that enhance readability.",
                                "Proficient": "Employs appropriate style and language with mostly correct conventions.",
                                "Developing": "Style is basic and conventions contain errors affecting clarity.",
                                "Beginning": "Frequent errors in conventions and style impede understanding."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "11th Grade Analytical Persuasive Essay Rubric",
                        "description": "Assesses depth of argument, skillful use of rhetoric, and evidence in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Argumentation": {
                                "Excellent": "Presents a nuanced thesis with a sophisticated and fully developed argument that convincingly persuades the reader.",
                                "Proficient": "States a clear thesis and develops a persuasive argument, though nuance may vary.",
                                "Developing": "Attempts to develop a thesis and argument, but lacks full complexity or coherence.",
                                "Beginning": "Thesis is unclear or not fully developed, and argument lacks persuasion."
                            },
                            "Rhetorical Techniques & Appeals": {
                                "Excellent": "Employs a range of rhetorical techniques and persuasive appeals skillfully, enhancing the persuasiveness of the essay.",
                                "Proficient": "Uses rhetorical techniques effectively, though variety and sophistication may vary.",
                                "Developing": "Attempts to use rhetorical techniques, but they may not fully enhance the argument.",
                                "Beginning": "Little to no use of rhetorical techniques, affecting the argument's persuasiveness."
                            },
                            "Evidence & Logical Support": {
                                "Excellent": "Provides thorough evidence and logical support, analyzing sources to enhance the argument's credibility.",
                                "Proficient": "Provides appropriate evidence and support, with logical reasoning, though depth may vary.",
                                "Developing": "Includes some evidence and reasoning, but support may not fully connect to the argument.",
                                "Beginning": "Little to no evidence or reasoning is provided, weakening the argument."
                            },
                            "Conventions": {
                                "Excellent": "Mastery of conventions enhances clarity, style, and persuasiveness of the essay.",
                                "Proficient": "Minor errors are present but do not significantly affect readability.",
                                "Developing": "Errors in conventions may affect clarity and flow.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                }
            },
            "expository": {
                "research paper": {
                    "analytical": {
                        "name": "11th Grade Analytical Research Paper Rubric",
                        "description": "Evaluates the depth of research, sophistication of argument, and mastery of citation in research papers.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Research Question & Sophistication": {
                                "Excellent": "Defines a complex research question and develops a nuanced thesis, guiding a sophisticated exploration of the topic.",
                                "Proficient": "Defines a research question and develops a thesis that guides the paper effectively.",
                                "Developing": "Research question and thesis are present but lack depth or complexity.",
                                "Beginning": "Research question and thesis are unclear, underdeveloped, or missing."
                            },
                            "Content Insight & Argument Complexity": {
                                "Excellent": "Provides in-depth research, thoughtful analysis, and well-supported arguments, demonstrating insight into the topic.",
                                "Proficient": "Content is well-researched, with relevant analysis and argumentation.",
                                "Developing": "Presents basic research and arguments, but lacks thorough analysis or insight.",
                                "Beginning": "Content lacks depth, research, and clear arguments."
                            },
                            "Organization & Coherent Development": {
                                "Excellent": "Logically organizes information, with clear paragraph development, smooth transitions, and a coherent structure.",
                                "Proficient": "Organizes content effectively, with some clear transitions and paragraph structure.",
                                "Developing": "Attempts to organize information, but structure and flow may be inconsistent.",
                                "Beginning": "Lacks organization and logical flow, impacting readability."
                            },
                            "Source Credibility & Synthesis": {
                                "Excellent": "Integrates credible sources critically, synthesizing information to enhance arguments.",
                                "Proficient": "Uses credible sources to support arguments, with some synthesis.",
                                "Developing": "Sources are used but lack effective synthesis or critical integration.",
                                "Beginning": "Sources are insufficient, unreliable, or poorly integrated."
                            },
                            "Citation Style Mastery": {
                                "Excellent": "Demonstrates mastery of the selected citation style, with accurate formatting for all citations.",
                                "Proficient": "Mostly follows the citation style, with minor errors in formatting.",
                                "Developing": "Attempts to use the citation style, but errors are present.",
                                "Beginning": "Does not follow the citation style, or citations are absent."
                            },
                            "Conventions": {
                                "Excellent": "Uses conventions skillfully, with few or no errors, enhancing the paper's clarity.",
                                "Proficient": "Minor errors present, but do not affect overall clarity.",
                                "Developing": "Several errors are present, affecting readability.",
                                "Beginning": "Frequent errors hinder understanding."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "11th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Evaluates depth of comparison, critical analysis, and cohesive organization in complex essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Nuanced Thesis & Analytical Depth": {
                                "Excellent": "Presents a nuanced thesis with in-depth analysis of complex similarities and differences.",
                                "Proficient": "Thesis provides a clear comparison and contrast with analytical focus, though depth may vary.",
                                "Developing": "Attempts to state a thesis, but lacks clarity or depth in analysis.",
                                "Beginning": "Thesis is unclear or lacks analytical depth."
                            },
                            "Sophisticated Evidence & Critical Insight": {
                                "Excellent": "Incorporates sophisticated evidence and critical analysis to thoroughly support the comparison and contrast.",
                                "Proficient": "Uses appropriate evidence and critical analysis, but may lack depth or complexity.",
                                "Developing": "Provides limited evidence and basic analysis, with gaps in critical thinking.",
                                "Beginning": "Lacks evidence and critical analysis to effectively compare and contrast."
                            },
                            "Logical Organization & Effective Transitions": {
                                "Excellent": "Essay is cohesively organized with clear progression, logical structure, and seamless transitions.",
                                "Proficient": "Mostly well-organized with logical structure and effective use of transitions.",
                                "Developing": "Attempts organization but lacks consistent flow and clear structure.",
                                "Beginning": "Disorganized structure impedes comparison and understanding."
                            },
                            "Sophisticated Language & Accurate Conventions": {
                                "Excellent": "Employs sophisticated language and follows conventions accurately, enhancing clarity and sophistication.",
                                "Proficient": "Uses appropriate language and mostly correct conventions.",
                                "Developing": "Errors in conventions and language may affect clarity and flow.",
                                "Beginning": "Frequent errors in conventions and language make the essay difficult to understand."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "11th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Assesses nuanced cause-effect analysis, critical thinking, and polished organization.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Nuanced Thesis & Depth of Analysis": {
                                "Excellent": "Presents a nuanced thesis with in-depth analysis of complex cause and effect relationships.",
                                "Proficient": "Thesis provides a clear analysis of the cause and effect relationship, though depth may vary.",
                                "Developing": "Attempts to state a thesis, but analysis lacks depth or clarity.",
                                "Beginning": "Thesis is unclear or lacks depth of analysis."
                            },
                            "Sophisticated Evidence & Critical Insight": {
                                "Excellent": "Incorporates sophisticated evidence and critical insight to thoroughly support the cause and effect.",
                                "Proficient": "Uses appropriate evidence and critical analysis, but may lack depth.",
                                "Developing": "Provides limited evidence and analysis, with gaps in critical thinking.",
                                "Beginning": "Lacks evidence and critical analysis to effectively explain cause and effect."
                            },
                            "Cohesive Organization & Logical Flow": {
                                "Excellent": "Essay is cohesively organized with clear progression, logical structure, and seamless transitions.",
                                "Proficient": "Mostly well-organized with logical structure and effective use of transitions.",
                                "Developing": "Attempts organization but lacks consistent flow and clear structure.",
                                "Beginning": "Disorganized structure impedes understanding."
                            },
                            "Language Sophistication & Conventions": {
                                "Excellent": "Employs sophisticated language and follows conventions accurately, enhancing clarity.",
                                "Proficient": "Uses appropriate language and mostly correct conventions.",
                                "Developing": "Errors in conventions and language may affect clarity.",
                                "Beginning": "Frequent errors in conventions and language make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "reflective essay": {
                    "holistic": {
                        "name": "11th Grade Holistic Reflective Essay Rubric",
                        "description": "Assesses depth of introspection, coherence of thought, and sophisticated expression in reflective essays.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The essay reflects profound introspection, connecting personal experiences to broader ideas. The structure is coherent and fluid, with clear, sophisticated expression. Conventions are flawless, supporting the writing's impact.",
                            "Proficient": "Reflects on experiences thoughtfully, with emerging connections to broader themes. The structure supports reflection, and conventions are mostly accurate, with minor lapses that do not impede understanding.",
                            "Developing": "The essay attempts reflection but lacks depth and coherence. Thoughts are unclear or inconsistently organized, with errors in conventions affecting the flow.",
                            "Beginning": "The essay lacks clear introspection, depth, and structure. Ideas are poorly developed, and frequent errors in conventions hinder understanding."
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "11th Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates clarity, thorough explanation, and audience engagement in complex how-to guides.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Clarity & Detailed Explanations": {
                                "Excellent": "Provides clear, comprehensive steps with detailed explanations that anticipate audience needs and potential difficulties.",
                                "Proficient": "Steps are clear and mostly thorough, though some details may lack depth or fail to address potential audience difficulties.",
                                "Developing": "Instructions are provided but lack clarity or depth, affecting the audience’s ability to understand.",
                                "Beginning": "Steps are unclear or insufficiently detailed, leading to confusion."
                            },
                            "Logical Sequence & Organization": {
                                "Excellent": "Instructions are logically sequenced with smooth transitions that guide the audience through the process seamlessly.",
                                "Proficient": "Instructions are mostly organized logically, though some transitions may be abrupt.",
                                "Developing": "Steps may lack logical order, affecting the guide’s overall coherence.",
                                "Beginning": "Instructions are poorly organized and difficult to follow."
                            },
                            "Engaging Language & Vocabulary": {
                                "Excellent": "Uses sophisticated vocabulary and language that enhances audience engagement and understanding.",
                                "Proficient": "Employs appropriate vocabulary and language, with some engagement but lacking sophistication.",
                                "Developing": "Language is basic and does not enhance engagement or clarity effectively.",
                                "Beginning": "Language is unclear, affecting audience understanding and engagement."
                            },
                            "Conventions": {
                                "Excellent": "Few or no errors in conventions, enhancing the guide's clarity and effectiveness.",
                                "Proficient": "Some errors in spelling, punctuation, or grammar are present but do not impede understanding.",
                                "Developing": "Several errors are present that affect readability.",
                                "Beginning": "Frequent errors make the guide hard to understand."
                            }
                        }
                    }
                }
            }
        },
        "12th grade": {
            "narrative": {
                "personal narrative": {
                    "holistic": {
                        "name": "12th Grade Holistic Personal Narrative Rubric",
                        "description": "Assesses complex self-reflection, emotional depth, and advanced narrative techniques.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The narrative is highly engaging, with profound and thoughtful reflection on experiences, deep insight, and sophisticated thematic connections. Complex characters and events are woven together skillfully, enhancing emotional depth and engagement. Flawless use of conventions supports a strong and unique narrative voice.",
                            "Proficient": "The narrative is well-crafted, with insightful reflections and connections to broader themes. Characters and events are clearly developed, and a unique voice is evident. Conventions are mostly accurate, supporting the narrative’s effectiveness.",
                            "Developing": "The narrative attempts deeper reflection and theme exploration but may lack consistency in voice, character development, or structure. Errors in conventions may disrupt the flow and readability.",
                            "Beginning": "The narrative shows limited reflection, lacks depth, and has minimal development of themes or characters. Structure is disorganized, and frequent errors in conventions make the narrative difficult to follow."
                        }
                    }
                },
                "short story": {
                    "holistic": {
                        "name": "12th Grade Holistic Short Story Rubric",
                        "description": "Evaluates complex themes, mature character development, and unique narrative voice in short stories.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The short story masterfully explores complex themes and character development, demonstrating a unique and mature narrative voice. Plot is complex and engaging, with effective use of advanced literary devices. Conventions enhance the story’s style and meaning.",
                            "Proficient": "The story explores complex themes and shows clear character development. A strong narrative voice is present, with effective use of plot and literary devices. Conventions are mostly correct, supporting readability and style.",
                            "Developing": "The story addresses themes and character arcs but lacks full development. Narrative voice is emerging but may not be consistent. Errors in conventions and limited use of literary devices affect clarity.",
                            "Beginning": "The story lacks theme depth, character development, and narrative voice. Minimal use of plot structure or literary devices, and frequent errors in conventions hinder understanding."
                        }
                    }
                }
            },
            "descriptive": {
                "descriptive essay": {
                    "analytical": {
                        "name": "12th Grade Analytical Descriptive Essay Rubric",
                        "description": "Evaluates depth of content, advanced vocabulary, and stylistic choices in descriptive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Focus & Organization": {
                                "Excellent": "Essay has a sophisticated focus and a highly effective organization that enhances the vividness and engagement of the description.",
                                "Proficient": "Maintains a clear focus and organized structure, with effective transitions.",
                                "Developing": "Attempts to maintain focus but lacks a fully developed structure and clear organization.",
                                "Beginning": "Lacks clear focus and structure, making the description hard to follow."
                            },
                            "Imagery & Figurative Language": {
                                "Excellent": "Uses sophisticated imagery and figurative language to enhance the depth and vividness of the description, evoking strong sensory experiences.",
                                "Proficient": "Employs imagery and figurative language effectively, with minor lapses in depth.",
                                "Developing": "Includes basic imagery and figurative language but lacks depth and sophistication.",
                                "Beginning": "Minimal use of imagery and figurative language, affecting the richness of the description."
                            },
                            "Advanced Vocabulary & Syntax": {
                                "Excellent": "Employs advanced vocabulary and complex syntax that enhance the essay’s style, mood, and depth of description.",
                                "Proficient": "Uses varied vocabulary and syntax effectively, though may not consistently enhance the description.",
                                "Developing": "Vocabulary and syntax are basic and do not significantly enhance the description.",
                                "Beginning": "Limited vocabulary and syntax affect clarity and engagement."
                            },
                            "Conventions": {
                                "Excellent": "Few or no spelling, punctuation, or grammar errors, enhancing the descriptive quality and readability.",
                                "Proficient": "Some errors in conventions, but they do not significantly affect understanding.",
                                "Developing": "Several errors may hinder readability and flow.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "argumentative": {
                "argumentative essay": {
                    "analytical": {
                        "name": "12th Grade Analytical Argumentative Essay Rubric",
                        "description": "Evaluates depth of argumentation, sophisticated use of evidence, and logical organization in essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Insight": {
                                "Excellent": "Presents a sophisticated and insightful thesis that thoroughly explores complex arguments and perspectives.",
                                "Proficient": "States a clear thesis and addresses complex ideas with emerging insight.",
                                "Developing": "Attempts to address a thesis, but lacks depth and full exploration of perspectives.",
                                "Beginning": "Thesis is unclear or not fully developed, and perspectives are not thoroughly explored."
                            },
                            "Evidence & Analysis": {
                                "Excellent": "Provides well-researched, relevant, and thorough evidence, with insightful analysis that supports and enhances the argument.",
                                "Proficient": "Provides appropriate evidence and analysis, though some may lack depth or thoroughness.",
                                "Developing": "Includes evidence and analysis, but they may not fully support or enhance the argument.",
                                "Beginning": "Little to no evidence or analysis is provided, weakening the argument."
                            },
                            "Counterclaims & Rebuttals": {
                                "Excellent": "Addresses counterclaims with complex and logical rebuttals that strengthen the overall argument.",
                                "Proficient": "Addresses counterclaims with reasonable rebuttals, though depth may vary.",
                                "Developing": "Attempts to address counterclaims, but rebuttals are limited or unclear.",
                                "Beginning": "Counterclaims are not effectively addressed or rebutted."
                            },
                            "Organization & Coherence": {
                                "Excellent": "Essay demonstrates advanced organization and coherence, with sophisticated transitions enhancing the argument's flow.",
                                "Proficient": "Essay is clearly organized with effective transitions, though some areas may lack coherence.",
                                "Developing": "Some organization is present, but coherence and logical flow may be inconsistent.",
                                "Beginning": "Lacks clear organization, logical flow, and transitions."
                            },
                            "Conventions": {
                                "Excellent": "Flawless use of conventions enhances the sophistication and clarity of the argument.",
                                "Proficient": "Minor errors in conventions are present but do not impede understanding.",
                                "Developing": "Errors in conventions may affect clarity and readability.",
                                "Beginning": "Frequent errors make the essay difficult to understand."
                            }
                        }
                    }
                }
            },
            "opinion": {
                "opinion essay": {
                    "analytical": {
                        "name": "12th Grade Analytical Opinion Essay Rubric",
                        "description": "Evaluates depth of thought, sophistication of argument, and use of evidence in opinion essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Insightful Opinion & Thesis": {
                                "Excellent": "Presents a nuanced, compelling opinion with a clear thesis that guides a sophisticated argument.",
                                "Proficient": "States a clear opinion with a developed argument, though sophistication may vary.",
                                "Developing": "States an opinion with an emerging argument, but lacks depth.",
                                "Beginning": "Opinion is unclear or lacks a guiding thesis."
                            },
                            "Evidence & Analytical Depth": {
                                "Excellent": "Provides in-depth analysis and uses diverse evidence to thoroughly support the argument.",
                                "Proficient": "Uses relevant evidence and analysis, though depth may vary.",
                                "Developing": "Includes evidence and analysis, but lacks clarity or depth.",
                                "Beginning": "Little to no evidence or analysis to support the argument."
                            },
                            "Cohesive Organization & Style": {
                                "Excellent": "Essay is cohesively organized with logical flow and sophisticated transitions that enhance the argument.",
                                "Proficient": "Essay is mostly organized with a logical structure, though transitions may be less varied.",
                                "Developing": "Essay has basic organization, but lacks logical flow or clear transitions.",
                                "Beginning": "Essay lacks organization and logical structure."
                            },
                            "Conventions & Academic Language": {
                                "Excellent": "Uses polished, precise academic language and follows conventions accurately, enhancing readability.",
                                "Proficient": "Employs appropriate academic language and follows conventions with minor errors.",
                                "Developing": "Language is basic and conventions contain errors that may affect readability.",
                                "Beginning": "Frequent errors in language and conventions impede understanding."
                            }
                        }
                    }
                }
            },
            "persuasive": {
                "persuasive essay": {
                    "analytical": {
                        "name": "12th Grade Analytical Persuasive Essay Rubric",
                        "description": "Evaluates advanced argumentation, depth of rhetoric, and evidence in sophisticated persuasive essays.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Complex Argument": {
                                "Excellent": "Presents a sophisticated and nuanced thesis, developing a compelling and fully realized argument that demonstrates advanced persuasion.",
                                "Proficient": "States a clear and persuasive thesis, with a well-developed argument.",
                                "Developing": "Attempts to develop a thesis and argument, but lacks complexity or full coherence.",
                                "Beginning": "Thesis is unclear or weak, and argument is not effectively developed."
                            },
                            "Rhetorical Mastery & Persuasion": {
                                "Excellent": "Uses advanced rhetorical strategies and persuasive techniques masterfully to craft a compelling and convincing argument.",
                                "Proficient": "Uses rhetorical strategies effectively, but may lack sophistication or full range.",
                                "Developing": "Attempts to use rhetorical strategies, but they may not fully support or enhance the argument.",
                                "Beginning": "Little to no use of rhetorical strategies, affecting the persuasiveness of the argument."
                            },
                            "Evidence & Depth of Analysis": {
                                "Excellent": "Provides rich evidence and insightful analysis, effectively bolstering the argument with logical reasoning and depth.",
                                "Proficient": "Provides evidence and analysis that appropriately support the argument, though depth may vary.",
                                "Developing": "Includes evidence and analysis, but they may not fully connect or support the argument.",
                                "Beginning": "Little to no evidence or analysis is provided, weakening the argument."
                            },
                            "Conventions": {
                                "Excellent": "Flawless use of conventions enhances the sophistication and clarity of the argument.",
                                "Proficient": "Minor errors in conventions, but do not impede understanding.",
                                "Developing": "Errors may affect the clarity and flow of the essay.",
                                "Beginning": "Frequent errors hinder readability and understanding."
                            }
                        }
                    }
                }
            },
            "expository": {
                "analytical essay": {
                    "analytical": {
                        "name": "12th Grade Analytical Essay Rubric",
                        "description": "Evaluates depth of analysis, clarity of argument, logical structure, use of evidence, and academic writing conventions.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Thesis & Argument": {
                                "Excellent": "Presents a sophisticated, insightful thesis that guides the essay effectively. Argument is clearly articulated, focused, and maintained throughout.",
                                "Proficient": "Thesis is clear and guides the essay, though it may lack depth or nuance. Argument is mostly focused and consistent.",
                                "Developing": "Thesis is present but lacks clarity or depth. Argument may be inconsistent or lack focus in parts.",
                                "Beginning": "Thesis is unclear or absent, leading to a lack of direction in the essay. Argument is vague or poorly developed."
                            },
                            "Analysis & Depth of Insight": {
                                "Excellent": "Provides deep, insightful analysis of the topic, demonstrating thorough understanding. Clearly explains the significance of the evidence in relation to the thesis.",
                                "Proficient": "Analysis is clear and demonstrates understanding, though it may lack depth or insight. Explains most evidence in relation to the thesis.",
                                "Developing": "Provides basic analysis, but may be superficial or lack a clear connection to the thesis. Evidence is not consistently explained.",
                                "Beginning": "Analysis is limited, unclear, or unrelated to the thesis. Little to no explanation of how evidence supports the thesis."
                            },
                            "Organization & Logical Flow": {
                                "Excellent": "Essay is clearly organized with a logical structure, including a compelling introduction, well-developed body paragraphs, and a strong conclusion. Transitions are seamless and enhance coherence.",
                                "Proficient": "Essay is organized with a clear introduction, body, and conclusion. Transitions are present but may be basic or not fully enhance coherence.",
                                "Developing": "Essay shows some organization, but structure may be inconsistent. Transitions are present but may not contribute to logical flow.",
                                "Beginning": "Lacks clear structure or logical flow, making the essay difficult to follow. Transitions are absent or ineffective."
                            },
                            "Evidence & Supporting Details": {
                                "Excellent": "Uses strong, relevant evidence from credible sources to support the thesis. Evidence is well-integrated and effectively enhances the argument.",
                                "Proficient": "Uses appropriate evidence that supports the thesis, though some sources may be less relevant or credible. Evidence integration is mostly clear.",
                                "Developing": "Uses some evidence, but it may not be consistently relevant or effectively support the argument. Integration of evidence is inconsistent.",
                                "Beginning": "Little to no relevant evidence is used to support the thesis. Evidence is poorly integrated or absent."
                            },
                            "Academic Style & Conventions": {
                                "Excellent": "Demonstrates strong academic style, including formal tone, precise vocabulary, and varied sentence structure. Adheres to grammar, spelling, punctuation, and citation conventions with few or no errors.",
                                "Proficient": "Maintains appropriate academic style, with minor lapses in tone or vocabulary. Adheres to most conventions, though minor errors may be present.",
                                "Developing": "Demonstrates inconsistent academic style, with errors in tone or vocabulary. Contains several errors in conventions that may hinder readability.",
                                "Beginning": "Lacks academic style, with informal tone, limited vocabulary, or unclear sentence structure. Frequent errors in conventions make the essay difficult to understand."
                            }
                        }
                    }
                },
                "compare and contrast essay": {
                    "analytical": {
                        "name": "12th Grade Analytical Compare and Contrast Essay Rubric",
                        "description": "Assesses depth of analysis, advanced comparison techniques, and polished organization.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Advanced Thesis & Analytical Depth": {
                                "Excellent": "Presents an advanced thesis with sophisticated analysis of complex similarities and differences.",
                                "Proficient": "Provides a clear thesis with analysis, though sophistication may vary.",
                                "Developing": "Attempts to state a thesis, but lacks depth or clarity.",
                                "Beginning": "Thesis is unclear or lacks sustained focus."
                            },
                            "Comprehensive Evidence & Deep Insight": {
                                "Excellent": "Incorporates comprehensive evidence and deep insight to enhance the comparison and contrast.",
                                "Proficient": "Uses appropriate evidence and analysis, though depth may be inconsistent.",
                                "Developing": "Provides some evidence and analysis, but lacks thoroughness.",
                                "Beginning": "Little to no evidence or analysis is provided."
                            },
                            "Cohesive Structure & Logical Flow": {
                                "Excellent": "Essay is cohesively organized with logical progression, clear headings, and smooth transitions.",
                                "Proficient": "Mostly organized with logical flow, though some sections may need clearer transitions.",
                                "Developing": "Attempts organization, but lacks consistent flow and clear structure.",
                                "Beginning": "Disorganized structure and lack of transitions make the comparison difficult to follow."
                            },
                            "Language Sophistication & Conventions": {
                                "Excellent": "Uses advanced language and accurate conventions to enhance clarity and sophistication.",
                                "Proficient": "Employs appropriate language and conventions with minor errors.",
                                "Developing": "Basic language and conventions, with errors affecting clarity.",
                                "Beginning": "Frequent errors in conventions and language hinder understanding."
                            }
                        }
                    }
                },
                "cause and effect essay": {
                    "analytical": {
                        "name": "12th Grade Analytical Cause and Effect Essay Rubric",
                        "description": "Assesses depth of analysis, advanced reasoning, and polished organization.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Advanced Thesis & Depth of Analysis": {
                                "Excellent": "Presents an advanced thesis with sophisticated analysis of complex cause and effect relationships.",
                                "Proficient": "Provides a clear thesis with analysis, though sophistication may vary.",
                                "Developing": "Attempts to state a thesis, but lacks depth or clarity.",
                                "Beginning": "Thesis is unclear or lacks sustained focus."
                            },
                            "Comprehensive Evidence & Deep Insight": {
                                "Excellent": "Incorporates comprehensive evidence and deep insight to enhance understanding of cause and effect.",
                                "Proficient": "Uses appropriate evidence and analysis, though depth may be inconsistent.",
                                "Developing": "Provides some evidence and analysis, but lacks thoroughness.",
                                "Beginning": "Little to no evidence or analysis is provided."
                            },
                            "Cohesive Structure & Logical Flow": {
                                "Excellent": "Essay is cohesively organized with logical progression, clear headings, and smooth transitions.",
                                "Proficient": "Mostly organized with logical flow, though some sections may need clearer transitions.",
                                "Developing": "Attempts organization, but lacks consistent flow and clear structure.",
                                "Beginning": "Disorganized structure and lack of transitions make the cause and effect difficult to follow."
                            },
                            "Language Sophistication & Conventions": {
                                "Excellent": "Uses advanced language and accurate conventions to enhance clarity and sophistication.",
                                "Proficient": "Employs appropriate language and conventions with minor errors.",
                                "Developing": "Basic language and conventions, with errors affecting clarity.",
                                "Beginning": "Frequent errors in conventions and language hinder understanding."
                            }
                        }
                    }
                }
            },
            "reflective": {
                "reflective essay": {
                    "holistic": {
                        "name": "12th Grade Holistic Reflective Essay Rubric",
                        "description": "Assesses depth of personal insight, mature reflection, and sophisticated language in reflective essays.",
                        type: RubricType.Holistic,
                        "criteria": {
                            "Excellent": "The essay shows mature reflection and deep personal insight, exploring experiences with clarity and complexity. Ideas are presented with sophisticated expression, and conventions are used accurately to enhance the essay's meaning and style.",
                            "Proficient": "Reflects thoughtfully on experiences, with developing complexity and clear organization. Language is sophisticated, and conventions are mostly correct, contributing to clarity.",
                            "Developing": "The essay shows an attempt at reflection but lacks depth and mature insight. Expression is basic, and organizational structure is unclear. Errors in conventions affect readability.",
                            "Beginning": "The essay lacks reflective depth, personal insight, and structure. Ideas are undeveloped, and frequent errors in conventions make the essay difficult to understand."
                        }
                    }
                }
            },
            "research": {
                "research paper": {
                    "analytical": {
                        "name": "12th Grade Analytical Research Paper Rubric",
                        "description": "Assesses advanced research, argumentation, source synthesis, and command of a citation style.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Research Question & Thesis Maturity": {
                                "Excellent": "Presents a well-crafted, mature research question and thesis that explore complex, nuanced ideas.",
                                "Proficient": "Defines a clear research question and thesis that guide the paper effectively.",
                                "Developing": "Research question and thesis are present but may lack depth or sophistication.",
                                "Beginning": "Research question and thesis are unclear, underdeveloped, or missing."
                            },
                            "Content Mastery & Argument Development": {
                                "Excellent": "Demonstrates mastery of the topic through advanced research, critical analysis, and well-developed arguments.",
                                "Proficient": "Content is researched thoroughly with appropriate analysis and argumentation.",
                                "Developing": "Presents basic research and arguments, but lacks thorough analysis or depth.",
                                "Beginning": "Content lacks in-depth research and well-developed arguments."
                            },
                            "Organizational Sophistication & Flow": {
                                "Excellent": "Exhibits sophisticated organization, with logical progression, fluid transitions, and well-developed paragraphs.",
                                "Proficient": "Information is organized clearly, with effective transitions and structure.",
                                "Developing": "Attempts to organize information, but structure and transitions may be inconsistent.",
                                "Beginning": "Lacks clear organization, making the paper difficult to follow."
                            },
                            "Advanced Source Integration & Synthesis": {
                                "Excellent": "Seamlessly integrates and synthesizes credible sources, providing critical insight and strengthening arguments.",
                                "Proficient": "Effectively uses credible sources, with some synthesis to support arguments.",
                                "Developing": "Includes sources, but integration and synthesis are limited or unclear.",
                                "Beginning": "Sources are poorly integrated, unreliable, or lack synthesis."
                            },
                            "Citation Style Mastery & Adherence": {
                                "Excellent": "Adheres flawlessly to the selected citation style, demonstrating command of proper formatting.",
                                "Proficient": "Follows the citation style with minor errors in formatting.",
                                "Developing": "Attempts to use the citation style, but with multiple errors.",
                                "Beginning": "Does not adhere to the citation style, or citations are absent."
                            },
                            "Conventions": {
                                "Excellent": "Employs conventions with accuracy, enhancing clarity and sophistication of the writing.",
                                "Proficient": "Conventions are mostly correct, with minor errors.",
                                "Developing": "Several errors present, which may affect readability.",
                                "Beginning": "Frequent errors hinder understanding and clarity."
                            }
                        }
                    }
                }
            },
            "instructional": {
                "how-to guide": {
                    "analytical": {
                        "name": "12th Grade Analytical How-To Guide Rubric",
                        "description": "Evaluates thoroughness, sophistication, and audience-centered presentation in complex how-to guides.",
                        type: RubricType.Analytical,
                        "criteria": {
                            "Comprehensive Clarity": {
                                "Excellent": "Instructions are thorough and sophisticated, providing clear, step-by-step guidance that considers all potential audience needs and challenges.",
                                "Proficient": "Instructions are mostly comprehensive and clear, with minor lapses in anticipating audience needs.",
                                "Developing": "Instructions lack thoroughness, leading to gaps in audience understanding.",
                                "Beginning": "Instructions are unclear or insufficient, affecting the guide's purpose and effectiveness."
                            },
                            "Logical Flow & Coherence": {
                                "Excellent": "Steps are organized in a highly logical and coherent manner, ensuring smooth navigation and understanding.",
                                "Proficient": "Instructions are mostly logical and coherent, though some steps may lack fluidity.",
                                "Developing": "The structure is inconsistent or unclear, affecting the audience's ability to follow the guide.",
                                "Beginning": "Lacks logical organization, making the instructions difficult to follow."
                            },
                            "Advanced Vocabulary & Audience Adaptation": {
                                "Excellent": "Employs advanced vocabulary and sophisticated language that is tailored to the audience, enhancing clarity and engagement.",
                                "Proficient": "Uses appropriate vocabulary and language, though it may lack full sophistication or audience adaptation.",
                                "Developing": "Uses basic vocabulary, with limited adaptation to audience needs.",
                                "Beginning": "Vocabulary is unclear or inappropriate for the audience, affecting the guide’s effectiveness."
                            },
                            "Conventions": {
                                "Excellent": "Conventions are flawless, enhancing readability and clarity.",
                                "Proficient": "Some errors are present but they do not significantly affect comprehension.",
                                "Developing": "Several errors in spelling, punctuation, or grammar affect readability.",
                                "Beginning": "Frequent errors hinder understanding and clarity of the guide."
                            }
                        }
                    }
                }
            }
        }
    }
};

/**
 * Get an array of rubrics based on the provided criteria.
 * @param identity - The type of identity (e.g., "student").
 * @param identityLevel - The specific grade or level (e.g., "3rd grade").
 * @param textType - The type of text being analyzed (e.g., "narrative").
 * @param prose - The specific prose type (e.g., "personal narrative").
 * @returns An array of rubrics, with the first item being the default rubric for display.
 */
export function getRubricsByCriteria(
    identity: string,
    identityLevel: string,
    textType: string,
    prose: string
): RubricState[] {
    console.log('identity', identity);
    console.log('identityLevel', identityLevel);
    console.log('textType', textType);
    console.log('prose', prose);

    // Ensure all criteria are valid before accessing the structure.
    if (
        rubrics[identity] &&
        rubrics[identity][identityLevel] &&
        rubrics[identity][identityLevel][textType] &&
        rubrics[identity][identityLevel][textType][prose]
    ) {
        const proseRubrics = rubrics[identity][identityLevel][textType][prose];
        console.log('proseRubrics', proseRubrics);

        // Convert the rubric object into an array and ensure each rubric is cast to `RubricState`.
        const rubricArray: RubricState[] = Object.entries(proseRubrics)
            .map(([rubricTypeKey, rubricDetail]) => {
                // Ensure proper casting based on rubric type.
                let rubricType: RubricType;

                switch (rubricTypeKey) {
                    case "holistic":
                        rubricType = RubricType.Holistic;
                        break;
                    case "analytical":
                        rubricType = RubricType.Analytical;
                        break;
                    case "contentSpecific":
                        rubricType = RubricType.ContentSpecific;
                        break;
                    case "skillFocused":
                        rubricType = RubricType.SkillFocused;
                        break;
                    case "developmental":
                        rubricType = RubricType.Developmental;
                        break;
                    default:
                        throw new Error(`Unknown rubric type: ${rubricTypeKey}`);
                }

                return {
                    ...rubricDetail,
                    type: rubricType, // Use the correct `RubricType`.
                } as RubricState; // Explicitly cast to `RubricState`.
            })
            .sort((a, b) => {
                // Custom logic for sorting based on text type tendencies.
                if (['narrative', 'reflective'].includes(textType)) {
                    // Prefer holistic rubrics for "narrative" and "reflective" text types.
                    if (a.type === RubricType.Holistic) return -1;
                    if (b.type === RubricType.Holistic) return 1;
                } else {
                    // Prefer analytical rubrics for other text types.
                    if (a.type === RubricType.Analytical) return -1;
                    if (b.type === RubricType.Analytical) return 1;
                }
                return 0; // No preference between remaining rubrics.
            });

        return rubricArray;
    }

    // If criteria do not match, return an empty array.
    return [];
}


export function getRubricNamesByCriteria(
    identity: string,
    identityLevel: string,
    textType: string,
    prose: string
): string[] {
    const rubricArray = getRubricsByCriteria(identity, identityLevel, textType, prose);
    return rubricArray.map((rubric) => rubric.name); // Extract only the names
}
