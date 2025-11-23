const WILL_TEMPLATE_FIELDS = {
  article_1_declarations: {
    marital_status: {
      required: true,
      description: "Current marital status",
      pdf_location: "Article 1.1",
      values: ["married", "single", "divorced", "widowed", "common-law", "separated"]
    },
    spouse_name: {
      required: false,
      description: "Full legal name of spouse (if married/common-law)",
      pdf_location: "Article 1.2",
      condition: "if marital_status is married or common-law"
    },
    common_law_duration: {
      required: false,
      description: "Length of common-law relationship or interdependence details",
      pdf_location: "Article 1.2 (sub-item)",
      condition: "if marital_status is common-law"
    },
    children_details: {
      required: false,
      description: "Names and ages of all children (biological, adopted, step-children)",
      pdf_location: "Article 1.3",
      format: "Text description of children"
    }
  },

  article_2_executor: {
    executor_details: {
      required: true,
      description: "Primary Personal Representative (Executor)",
      pdf_location: "Article 2.1",
      format: "person object {name, age, address, relationship}"
    },
    executor_compensation: {
      required: false,
      description: "Executor compensation arrangement",
      pdf_location: "Article 2.2",
      values: ["as per statute", "no compensation", "specific amount", "percentage"]
    },
    alternate_executor: {
      required: false,
      description: "Alternate Personal Representative if primary cannot serve",
      pdf_location: "Article 2.3",
      format: "person object {name, age, address, relationship}"
    }
  },

  article_3_guardians: {
    guardian_for_minors: {
      required: false,
      description: "Guardian for minor children (under 18)",
      pdf_location: "Article 3.1",
      condition: "if user has children under 18",
      format: "person object {name, age, address, relationship}"
    },
    alternate_guardian: {
      required: false,
      description: "Alternate guardian if primary cannot serve",
      pdf_location: "Article 3.2",
      condition: "if guardian_for_minors is specified",
      format: "person object {name, age, address, relationship}"
    }
  },

  article_5_specific_bequests: {
    specific_bequests: {
      required: false,
      description: "Specific items to be gifted to named individuals before residue distribution",
      pdf_location: "Article 5.1",
      format: "Text list: 'My car to John Doe, my jewelry to Jane Smith'",
      examples: ["My wedding ring to my daughter", "My coin collection to my son", "My piano to my niece"]
    }
  },

  article_6_residue_distribution: {
    beneficiary_distribution: {
      required: true,
      description: "How the remainder of the estate (residue) is distributed",
      pdf_location: "Article 6.1",
      format: "Clear statement with percentages totaling 100%",
      examples: ["100% to my spouse", "50% to each of my two children", "25% to each of my four siblings"]
    },
    contingent_beneficiaries: {
      required: true,
      description: "Backup distribution plan if primary beneficiaries predecease testator",
      pdf_location: "Article 6.2",
      format: "Text describing contingent plan",
      examples: ["100% to my children equally", "To my siblings equally", "To [charity name]"]
    }
  },

  article_7_additional_provisions: {
    digital_assets: {
      required: false,
      description: "Instructions for digital assets (social media, crypto, online accounts, cloud storage)",
      pdf_location: "Article 7.1",
      format: "Text description of wishes"
    },
    funeral_preferences: {
      required: false,
      description: "Burial, cremation, or other funeral preferences",
      pdf_location: "Article 7.2",
      format: "Text description of preferences"
    }
  }
};

const CONTEXTUAL_INFORMATION = {
  estate_planning_context: {
    description: "Information that helps provide comprehensive legal guidance but may not appear in the will template",
    categories: {
      non_probate_assets: {
        description: "Assets that pass outside the will (should be discussed in assessment)",
        items: [
          {
            field: "life_insurance_policies",
            question_guide: "Do you have life insurance policies? If yes, who is the named beneficiary?",
            assessment_guidance: "Explain that named beneficiaries receive proceeds directly, outside the will"
          },
          {
            field: "retirement_accounts",
            question_guide: "Do you have retirement accounts (RRSP, RRIF, 401k, pension)? Who is the beneficiary?",
            assessment_guidance: "Explain beneficiary designations override will provisions"
          },
          {
            field: "jointly_owned_property",
            question_guide: "Do you own property jointly with right of survivorship?",
            assessment_guidance: "Explain joint tenancy passes to surviving owner, not through will"
          },
          {
            field: "payable_on_death_accounts",
            question_guide: "Do you have POD/TOD (Payable on Death/Transfer on Death) designations?",
            assessment_guidance: "Explain these accounts bypass probate"
          }
        ]
      },
      
      complex_estate_matters: {
        description: "Situations requiring special legal attention",
        items: [
          {
            field: "business_interests",
            question_guide: "Do you own a business or partnership interests?",
            assessment_guidance: "Recommend business succession planning and buy-sell agreements"
          },
          {
            field: "trust_arrangements",
            question_guide: "Do you have existing trusts or plan to create trusts?",
            assessment_guidance: "Explain coordination between will and trust documents"
          },
          {
            field: "foreign_assets",
            question_guide: "Do you own property or assets outside of [jurisdiction]?",
            assessment_guidance: "Recommend consulting attorney in that jurisdiction for separate will"
          },
          {
            field: "dependent_adults",
            question_guide: "Do you support any adults with disabilities or special needs?",
            assessment_guidance: "Recommend special needs trust to preserve government benefits"
          }
        ]
      },

      family_complexity: {
        description: "Family situations that may affect estate planning",
        items: [
          {
            field: "previous_marriages",
            question_guide: "Have you been previously married? Any obligations to former spouses?",
            assessment_guidance: "Discuss potential claims and importance of updating beneficiary designations"
          },
          {
            field: "blended_family",
            question_guide: "Do you have children from previous relationships or step-children?",
            assessment_guidance: "Explain considerations for fair distribution in blended families"
          },
          {
            field: "estranged_family",
            question_guide: "Are there family members you wish to explicitly exclude?",
            assessment_guidance: "Discuss proper disinheritance language and potential contests"
          }
        ]
      },

      jurisdiction_specific: {
        description: "Regional requirements that vary by location",
        items: [
          {
            field: "community_property_state",
            question_guide: "In community property jurisdictions, confirm understanding of spouse's rights",
            assessment_guidance: "Explain community vs separate property rules",
            condition: "if jurisdiction has community property laws"
          },
          {
            field: "forced_heirship",
            question_guide: "In Louisiana or Quebec, confirm understanding of forced heirship rules",
            assessment_guidance: "Explain limitations on testamentary freedom",
            condition: "if jurisdiction is Louisiana or Quebec"
          },
          {
            field: "homestead_rights",
            question_guide: "Do you own a primary residence?",
            assessment_guidance: "Explain homestead exemptions and spouse's rights",
            condition: "if jurisdiction has homestead protections"
          }
        ]
      }
    }
  }
};

const QUESTION_GENERATION_RULES = {
  template_field_questions: {
    rule: "MUST use exact field names from WILL_TEMPLATE_FIELDS",
    output_format: "question_id must match the field name exactly",
    example: {
      id: "executor_details",
      question: "Who would you like to appoint as your Personal Representative (Executor)?",
      type: "person",
      fields: ["name", "relationship", "age", "address"]
    }
  },
  
  contextual_questions: {
    rule: "MAY ask about contextual items from CONTEXTUAL_INFORMATION",
    output_format: "use descriptive question_id based on the field guide",
    flexibility: "Can ask if legally relevant, but respect user's 'None' or 'N/A' responses",
    example: {
      id: "life_insurance_beneficiary",
      question: "Do you have any life insurance policies? If yes, who is the named beneficiary?",
      type: "textarea"
    }
  },

  anti_hallucination: {
    rule: "NEVER ask about assets/situations user hasn't mentioned",
    enforcement: "If user said 'None' or didn't mention an asset type, do NOT ask follow-up questions about it",
    exception: "Common items (life insurance, retirement accounts) can be asked ONCE in Round 2, but accept 'None' answers"
  }
};

function getSchemaPromptText() {
  const templateFieldsList = Object.entries(WILL_TEMPLATE_FIELDS)
    .map(([article, fields]) => {
      const fieldList = Object.entries(fields)
        .map(([fieldName, config]) => {
          const req = config.required ? 'REQUIRED' : 'optional';
          const cond = config.condition ? ` (${config.condition})` : '';
          return `  - ${fieldName} [${req}]${cond}: ${config.description}`;
        })
        .join('\n');
      return `${article.toUpperCase().replace(/_/g, ' ')}:\n${fieldList}`;
    })
    .join('\n\n');

  const contextualCategories = Object.entries(CONTEXTUAL_INFORMATION.estate_planning_context.categories)
    .map(([category, details]) => {
      const items = details.items
        .map(item => `  - ${item.field}: ${item.question_guide}`)
        .join('\n');
      return `${category.replace(/_/g, ' ').toUpperCase()}:\n${items}`;
    })
    .join('\n\n');

  return {
    templateFields: templateFieldsList,
    contextualInfo: contextualCategories
  };
}

module.exports = {
  WILL_TEMPLATE_FIELDS,
  CONTEXTUAL_INFORMATION,
  QUESTION_GENERATION_RULES,
  getSchemaPromptText
};
