
export enum StatTopic {
  // Statistics 1 (S1)
  S1_DATA_REPRESENTATION = 'S1: Representation of Data',
  S1_PERMUTATIONS_COMBINATIONS = 'S1: Permutations & Combinations',
  S1_PROBABILITY = 'S1: Probability',
  S1_DISCRETE_VARIABLES = 'S1: Discrete Random Variables',
  S1_NORMAL_DISTRIBUTION = 'S1: The Normal Distribution',
  
  // Statistics 2 (S2)
  S2_POISSON_DISTRIBUTION = 'S2: The Poisson Distribution',
  S2_LINEAR_COMBINATIONS = 'S2: Linear Combinations of RVs',
  S2_CONTINUOUS_VARIABLES = 'S2: Continuous Random Variables',
  S2_SAMPLING_ESTIMATION = 'S2: Sampling and Estimation',
  S2_HYPOTHESIS_TESTING = 'S2: Hypothesis Testing'
}

export interface BlueprintOutput {
  questionTemplate: string;
  narrativeLibrary: string[];
  sympyCode: string;
  stackPrtLogic: string;
}

export interface SolutionStep {
  label: string;
  math: string;
  explanation?: string; // New field for conceptual/simple language explanation
}

export interface SubQuestion {
  id: string;
  part: 'a' | 'b' | 'c' | 'd';
  text: string;
  marks: number;
  stepByStepSolution: SolutionStep[];
  finalAnswer: string;
}

export interface SampleQuestion {
  id: string;
  context: string;
  questionHeader: string; // The main narrative context
  subQuestions: SubQuestion[];
  simplifiedExplanation: string; 
  distParams?: { 
    type: 'normal' | 'binomial' | 'poisson';
    mu?: number;
    sigma?: number;
    n?: number;
    p?: number;
    lambda?: number;
    threshold?: number;
    comparison?: 'greater' | 'less';
  };
}

export interface TopicConfig {
  id: StatTopic;
  paper: 'S1' | 'S2';
  icon: string;
  description: string;
  syllabusObjectives: string[];
}

export type MasteryStatus = 'unstarted' | 'practicing' | 'mastered';
