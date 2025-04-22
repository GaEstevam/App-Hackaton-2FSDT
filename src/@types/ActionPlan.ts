export interface Step {
  step: number;
  description: string;
  context: string;
  deadline: string;
  responsible: string;
  success_indicator: string;
}

export interface Planning {
  objective?: string;
  steps?: Step[];
  resources?: string[];
  savings_tips?: string[];
  contingency_plan?: string[];
  additional_income_sources?: string[];
  monitoring_adjustments?: string[];
  current_situation?: {
    expenses?: string;
    income: string;
    savings?: string;
  };
}

export interface Goal {
  id: string;
  name: string;
  patrimony: string;
  my_patrimony: string;
  monthly_aport: string;
  dividends: string;
  rate: string;
  status: boolean;
  planning?: Planning;
}
