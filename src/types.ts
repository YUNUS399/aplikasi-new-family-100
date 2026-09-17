export interface SurveyAnswer {
  id: number;
  rank: number;
  answer: string;
  points: number;
  aliases: string[];
  isRevealed: boolean;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  category: string;
  answers: SurveyAnswer[];
  multiplier?: 1 | 2 | 3;
}

export interface BonusAnswerOption {
  text: string;
  points: number;
  aliases?: string[];
}

export interface BonusQuestion {
  id: string;
  question: string;
  options: BonusAnswerOption[];
}

export interface BonusQuestionSet {
  id: string;
  title: string;
  questions: BonusQuestion[];
}

export interface Team {
  id: 'A' | 'B';
  name: string;
  score: number;
  color: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple';
  strikes: number;
}

export type GameMode = 'party_host' | 'team_battle' | 'solo_bot';

export type GamePhase =
  | 'setup'
  | 'faceoff'
  | 'main_round'
  | 'steal'
  | 'round_end'
  | 'bonus_intro'
  | 'bonus_player1'
  | 'bonus_player2'
  | 'bonus_reveal'
  | 'game_over';
