import { SurveyAnswer } from '../types';

/**
 * Normalizes an Indonesian string for comparison
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ') // replace punctuation with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Levenshtein edit distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b[j - 1] === a[i - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Checks if a candidate phrase matches an answer target string
 */
function isStringMatch(candidate: string, target: string): boolean {
  const c = normalizeText(candidate);
  const t = normalizeText(target);

  if (!c || !t) return false;
  if (c === t) return true;

  // Substring / containment checks
  if (c.length >= 3 && (t.includes(c) || c.includes(t))) {
    // If one is fully contained in another and represents a significant portion
    const minLen = Math.min(c.length, t.length);
    const maxLen = Math.max(c.length, t.length);
    if (minLen / maxLen > 0.45) return true;
  }

  // Edit distance tolerance
  const dist = levenshteinDistance(c, t);
  if (t.length <= 4) {
    return dist === 0;
  } else if (t.length <= 7) {
    return dist <= 1;
  } else {
    return dist <= 2;
  }
}

/**
 * Finds if a user input matches any answer in the survey question
 */
export function findMatchingAnswer(
  input: string,
  answers: SurveyAnswer[]
): SurveyAnswer | null {
  const normInput = normalizeText(input);
  if (!normInput) return null;

  for (const item of answers) {
    // Check main answer text
    if (isStringMatch(normInput, item.answer)) {
      return item;
    }

    // Check aliases
    if (item.aliases && item.aliases.length > 0) {
      for (const alias of item.aliases) {
        if (isStringMatch(normInput, alias)) {
          return item;
        }
      }
    }
  }

  return null;
}
