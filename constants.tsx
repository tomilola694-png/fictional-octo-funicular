
import { StatTopic, TopicConfig } from './types';

export const TOPICS: TopicConfig[] = [
  // Statistics 1
  {
    id: StatTopic.S1_DATA_REPRESENTATION,
    paper: 'S1',
    icon: '📊',
    description: 'Stem-and-leaf, box-and-whisker, histograms, and standard deviation.',
    syllabusObjectives: ['Calculation of Mean/Variance', 'Standard Deviation', 'Coding', 'Box-and-whisker plots', 'Cumulative frequency']
  },
  {
    id: StatTopic.S1_PERMUTATIONS_COMBINATIONS,
    paper: 'S1',
    icon: '🧩',
    description: 'Arrangements, selections, and circular permutations with constraints.',
    syllabusObjectives: ['Factorial notation', 'Permutations (nPr)', 'Combinations (nCr)', 'Restrictions on arrangements', 'Selections from multiple groups']
  },
  {
    id: StatTopic.S1_PROBABILITY,
    paper: 'S1',
    icon: '🎲',
    description: 'Conditional probability, independent events, and Venn diagrams.',
    syllabusObjectives: ['Addition/Multiplication rules', 'Mutually exclusive events', 'Independent events', 'Conditional Probability P(A|B)', 'Tree diagrams']
  },
  {
    id: StatTopic.S1_DISCRETE_VARIABLES,
    paper: 'S1',
    icon: '🔢',
    description: 'Expected value E(X), Variance Var(X), and the Binomial Distribution.',
    syllabusObjectives: ['Probability distribution tables', 'E(X) and Var(X)', 'Binomial Distribution properties', 'Binomial formula application']
  },
  {
    id: StatTopic.S1_NORMAL_DISTRIBUTION,
    paper: 'S1',
    icon: '📉',
    description: 'Standardization, inverse normal lookup, and continuity corrections.',
    syllabusObjectives: ['Standard Normal Z', 'Standardization formula', 'Finding probabilities', 'Inverse normal lookup', 'Continuity correction for Binomial approximation']
  },
  // Statistics 2
  {
    id: StatTopic.S2_POISSON_DISTRIBUTION,
    icon: '⏱️',
    paper: 'S2',
    description: 'Modeling rare events and the Poisson approximation to the Binomial.',
    syllabusObjectives: ['Poisson properties', 'E(X)=Var(X)=λ', 'Sums of independent Poisson RVs', 'Poisson approximation to Binomial']
  },
  {
    id: StatTopic.S2_LINEAR_COMBINATIONS,
    paper: 'S2',
    icon: '🔗',
    description: 'Expectation and Variance of E(aX + bY) for independent variables.',
    syllabusObjectives: ['Expectation of linear combinations', 'Variance of linear combinations', 'Sum of independent Normal variables', 'Difference of means']
  },
  {
    id: StatTopic.S2_CONTINUOUS_VARIABLES,
    paper: 'S2',
    icon: '♾️',
    description: 'Probability Density Functions (PDF) and Cumulative Distribution (CDF).',
    syllabusObjectives: ['PDF properties', 'Calculating probabilities via integration', 'Finding E(X) and Var(X) from PDF', 'Mode and Median', 'Finding CDF from PDF']
  },
  {
    id: StatTopic.S2_SAMPLING_ESTIMATION,
    paper: 'S2',
    icon: '🏗️',
    description: 'Central Limit Theorem, unbiased estimators, and Confidence Intervals.',
    syllabusObjectives: ['Unbiased estimates of mean/variance', 'Central Limit Theorem (CLT)', 'Confidence Intervals for mean', 'Width of intervals']
  },
  {
    id: StatTopic.S2_HYPOTHESIS_TESTING,
    paper: 'S2',
    icon: '⚖️',
    description: 'Type I and Type II errors, and tests for population means and proportions.',
    syllabusObjectives: ['Null and Alternative hypotheses', 'Significance levels', 'Critical values vs p-values', 'Type I and Type II errors', 'Tests for Normal mean', 'Tests for Poisson mean']
  }
];

export const SYSTEM_INSTRUCTION = `You are an expert Cambridge A-Level Statistics EdTech Architect. 
Your goal is to generate a procedural question blueprint that follows the Cambridge/UK A-Level syllabus (9709 S1 and S2).

Strictly adhere to these requirements:
1. QUESTION TEMPLATE: Provide a LaTeX question with placeholders like {{mu}}, {{sigma}}, {{n}}, {{context}}.
2. NARRATIVE LIBRARY: Provide 5 distinct professional/educational contexts.
3. SYMPY BACKEND: Python code using 'sympy.stats' for exact results.
4. STACK PRT LOGIC: Maxima code for the Potential Response Tree.

Response MUST be in the following JSON format:
{
  "questionTemplate": "LaTeX string...",
  "narrativeLibrary": ["Context 1", "Context 2", ...],
  "sympyCode": "Python code block...",
  "stackPrtLogic": "Maxima code block..."
}`;
