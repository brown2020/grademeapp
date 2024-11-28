interface UserInputs {
  identity: {
    options: string[];
    identityLevels: {
      [identityKey: string]: string[];
    };
  };
  assigner: {
    options: {
      [identityKey: string]: string[];
    };
  };
  textType: {
    value: string;
    verbs: string[];
  }[];
  prose: {
    options: string[];
    details: {
      [textTypeKey: string]: {
        verbs: string[];
        options: string[];
      };
    };
  };
  audience: {
    options: string[];
    contextBasedAudiences: {
      [audienceKey: string]: string[];
    };
  };
  wordCount: {
    comparisonType: string[];
    wordRanges: {
      options: {
        label: string;
        range: {
          min: number;
          max?: number;
        };
      }[];
      customRange: {
        min: string;
        max: string;
      };
    };
  };
}

// Function to get the verb from a given value
export function getVerbsByValue(value: string) {
  const foundItem = userInputs.textType.find(item => item.value === value);
  return foundItem ? foundItem.verbs : []; // Return the array of verbs or an empty array if not found
}

export function getValuebyVerb(verb: string) {
  const foundItem = userInputs.textType.find(item => item.verbs.includes(verb));
  return foundItem ? foundItem.value : ""; // Return the value or an empty string if not found
}

export const userInputs: UserInputs = {
  // Identity selection
  identity: {
    options: [
      "person",
      "student",
      "professional",
      "researcher",
      "journalist",
      "author",
      "creative writer",
      "other"
    ],
    identityLevels: {
      // Nested levels based on identity
      person: ["normal"],
      student: [
        "3rd grade", "4th grade", "5th grade", "6th grade",
        "7th grade", "8th grade", "9th grade", "10th grade",
        "11th grade", "12th grade", "undergraduate", "graduate",
        "postgraduate", "doctoral",
        // "law school", "medical school", "nursing school", "business school", "other"
      ],
      professional: [
        "new", "mid-level", "senior",
      ],
      researcher: [
        "assistant", "undergraduate",
        "graduate", "postdoc",
        "principal investigator", "senior"
      ],
      journalist: [
        "freelance", "staff", "senior",
      ],
      author: [
        "new", "self-published", "established", "bestselling author",
      ],
      "creative writer": [
        "aspiring", "poet", "short story",
        "novelist", "playwright", "screenwriter"
      ],
      other: [
        "individual contributor", "team leader", "specialist"
      ]
    }
  },

  // Assigner selection based on identity
  assigner: {
    options: {
      person: ["self"],
      student: [
        "teacher", "professor", "tutor", "coach", "advisor"
      ],
      professional: [
        "boss", "supervisor", "colleague", "interviewer",
        "client", "team lead", "mentor"
      ],
      researcher: [
        "supervisor", "mentor", "research advisor", "principal investigator",
        "collaborator", "lab director", "funding agency"
      ],
      journalist: [
        "editor", "publisher", "producer", "client",
        "media outlet", "co-writer", "agency"
      ],
      author: [
        "editor", "literary agent", "publisher", "writing group",
        "book coach", "self (self-assigned)"
      ],
      creativeWriter: [
        "writing group", "editor", "publisher", "literary agent",
        "mentor", "collaborator", "self"
      ],
      other: [
        "client", "manager", "mentor", "peer", "self"
      ]
    }
  },

  // Type of text (Purpose/Goal of writing)
  textType: [
    { value: "persuasive", verbs: ["argue", "persuade"] },
    { value: "narrative", verbs: ["tell a story about", "narrate"] },
    { value: "descriptive", verbs: ["describe", "depict"] },
    { value: "expository", verbs: ["explain", "inform"] },
    { value: "reflective", verbs: ["reflect on", "contemplate"] },
    { value: "critical analysis", verbs: ["analyze", "critique", "evaluate"] },
    { value: "review", verbs: ["review", "assess"] },
    { value: "instructional", verbs: ["guide", "teach"] },
    { value: "procedural", verbs: ["provide a procedure for"] },
    { value: "report", verbs: ["report on", "summarize"] },
  ],

  // Type of prose (Form/structure of the piece)
  prose: {
    options: [
      "essay", "short story", "poem", "research paper", "article", "editorial", "novel", "biography", "autobiography",
      "journal entry", "memoir", "report", "case study", "speech", "script", "press release", "letter", "email", "blog post",
      "product review", "performance review", "book review", "film review", "art critique", "literary analysis", "how-to guide",
      "instructional manual", "tutorial", "procedure write-up", "workflow explanation", "experiment protocol", "vignette",
      "character sketch", "place description", "sensory description", "argumentative essay", "opinion paragraph", "sales letter",
      "personal reflection", "critical essay", "personal essay", "lab report", "research summary", "progress report",
      "step-by-step guide", "informational article", "simple research project", "op-ed", "literary critique", "book report",
      "technical document", "scientific paper", "business proposal", "grant proposal", "thesis", "dissertation", "resume",
      "cover letter", "application essay", "statement of purpose", "bio", "profile", "interview transcript", "meeting minutes",
      "policy brief", "white paper", "news article", "feature article", "investigative report", "press kit", "media kit",
      "social media post", "content marketing copy", "ad copy", "landing page copy", "sales page copy", "product description",
      "about page", "contact page", "privacy policy", "terms of service", "disclaimer", "copyright notice",
      "instructional article", "research proposal", "literature review", "annotated bibliography", "abstract", "executive summary",
      "business plan", "marketing plan", "strategic plan", "project plan", "action plan", "implementation plan", "evaluation plan",
      "communication plan", "crisis communication plan", "risk management plan", "disaster recovery plan", "business continuity plan",
      "training plan", "professional development plan", "career development plan", "performance improvement plan", "succession plan",
      "recruitment plan", "onboarding plan", "offboarding plan", "employee handbook", "policy manual", "procedure manual",
      "training manual", "operations manual", "user manual", "technical manual", "service manual", "maintenance manual",
      "installation manual", "repair manual", "troubleshooting guide", "user guide", "quick start guide", "reference guide",
      "help guide", "FAQ", "knowledge base article", "support article", "troubleshooting article", "best practices article",
      "case study article", "success story article", "customer testimonial", "product comparison", "buying guide", "product guide",
      "product roadmap", "product roadmap", "product launch plan", "product marketing plan", "product positioning plan",
      "product differentiation plan", "product pricing strategy", "product distribution strategy", "product promotion strategy",
      "product sales strategy", "product lifecycle management plan", "product development plan", "product design plan",
      "product testing plan", "product quality assurance plan", "product safety plan", "product compliance plan", "product sustainability plan",
    ],
    // Nested prose options for some specific text types with aligned action verbs
    "details": {
      "persuasive": {
        "verbs": ["argue", "persuade"],
        "options": [
          "persuasive essay", "debate speech", "op-ed", "editorial", "argumentative essay", "opinion paragraph", "blog post", "sales letter", "email"
        ]
      },
      "narrative": {
        "verbs": ["tell a story about", "narrate", "recount"],
        "options": [
          "personal narrative", "short story", "novel excerpt", "memoir", "vignette"
        ]
      },
      "descriptive": {
        "verbs": ["describe", "depict"],
        "options": [
          "descriptive essay", "character sketch", "place description", "sensory description"
        ]
      },
      "expository": {
        "verbs": ["explain", "inform"],
        "options": [
          "research paper", "informational article", "report", "book report", "simple research project", "cause and effect essay", "compare and contrast essay",
          "email", "technical document", "white paper"
        ]
      },
      "reflective": {
        "verbs": ["reflect on", "contemplate", "ponder"],
        "options": [
          "personal reflection", "journal entry", "memoir", "reflective essay", "personal essay"
        ]
      },
      "critical analysis": {
        "verbs": ["analyze", "critique", "evaluate"],
        "options": [
          "literary analysis", "art critique", "film review", "book review", "critical essay"
        ]
      },
      "review": {
        "verbs": ["review", "assess"],
        "options": [
          "book review", "film review", "product review", "performance review"
        ]
      },
      "instructional": {
        "verbs": ["instruct on how to", "guide", "teach"],
        "options": [
          "how-to guide", "instructional manual", "tutorial", "instructional article"
        ]
      },
      "procedural": {
        "verbs": ["provide a procedure for", "outline a procedure", "detail a process"],
        "options": [
          "step-by-step guide", "procedure write-up", "workflow explanation", "experiment protocol"
        ]
      },
      "report": {
        "verbs": ["report on", "summarize"],
        "options": [
          "lab report", "research summary", "progress report", "case study"
        ]
      }
    }
  },

  // Audience selection based on who will read the piece
  audience: {
    options: [
      "teacher", "professor", "peers/classmates", "general public",
      "colleagues", "boss", "interviewer", "team", "client",
      "editor", "research community", "specific group (custom)"
    ],
    // Different audiences based on identity
    contextBasedAudiences: {
      person: ["general public"],
      student: [
        "my teacher", "my professor", "my classmates", "my school"
      ],
      professional: [
        "my boss", "my team", "a colleague", "a client", "stakeholders"
      ],
      researcher: [
        "a research community", "academic journal reviewers",
        "conference attendees", "lab members"
      ],
      journalist: [
        "the editor", "general readers", "subscribers", "the audience of a media outlet"
      ],
      author: [
        "readers", "literary critics", "book club members", "editor"
      ],
      creativeWriter: [
        "readers", "fellow writers", "critique group", "potential publishers"
      ],
      other: [
        "general public", "specific group (custom)", "peer group"
      ]
    }
  },

  // Length constraints on the writing
  wordCount: {
    comparisonType: [
      "more than", "less than", "between"
    ],
    wordRanges: {
      options: [
        { label: "less than 500 words", range: { min: 0, max: 500 } },
        { label: "500-1000 words", range: { min: 500, max: 1000 } },
        { label: "1000-1500 words", range: { min: 1000, max: 1500 } },
        { label: "1500-2000 words", range: { min: 1500, max: 2000 } },
        { label: "more than 2000 words", range: { min: 2000 } }
      ],
      customRange: {
        min: "Minimum word count", // User input field
        max: "Maximum word count" // User input field
      }
    }
  }
};

export default userInputs;
