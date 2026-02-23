
export enum View {
  LOGIN = 'login',
  HOME = 'home',
  PRE_TEST = 'pre_test',
  LESSONS = 'lessons',
  GAMES = 'games',
  GAME_SNIPER = 'game_sniper',
  GAME_GARDEN = 'game_garden',
  GAME_MACHINE = 'game_machine',
  GAME_QUEST = 'game_quest',
  GAME_MATCH = 'game_match',
  GAME_SCRAMBLE = 'game_scramble',
  GAME_RUNNER = 'game_runner',
  POST_TEST = 'post_test',
  CHAT = 'chat',
  CHAT_SUPPORT = 'chat_support',
  CONTACT = 'contact',
  RANKING = 'ranking'
}

export interface TenseData {
  id: string;
  name: string;
  description: string;
  signalWords: string[]; 
  formula: {
    subject: string;
    verb: string;
    note: string;
  };
  usages: string[];
  examples: {
    text: string;
    verb: string;
    category: string;
  }[];
}

export interface Question {
  id: number;
  sentence: string;
  correct: string;
  options?: string[];
  tense: string;
  wrongPart?: string;
  transformation?: string;
  targetTense?: string;
  scrambledWords?: string[]; 
  explanation?: string; 
}

export interface ScoreEntry {
  name: string;
  preScore: number;
  postScore: number;
  average: number;
  date: string;
}

export interface UserStats {
  userName: string;
  xp: number;
  level: number;
  streak: number;
  lastPlayed: string;
  badges: string[];
}
