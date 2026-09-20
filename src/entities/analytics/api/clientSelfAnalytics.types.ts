import type { AnalyticsActivity, AnalyticsAssignment, ClientCompletionItem } from './clientAnalytics.types';

export type ClientSelfInfo = {
  clientUserId: string;
  displayName: string;
};

export type ClientSelfTrainer = {
  trainerId: string;
  displayName: string;
};

export type ClientSelfAnalytics = {
  client: ClientSelfInfo;
  trainer: ClientSelfTrainer;
  currentAssignment: AnalyticsAssignment | null;
  activity: AnalyticsActivity;
  recentCompletions: ClientCompletionItem[];
  expiresAt: string;
};

export type ClientSelfAnalyticsParams = {
  clientUserId: string;
  trainerId: string;
  exp: string;
  sig: string;
};
