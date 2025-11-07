import { ModelResponse } from "./multiModelChat";

export interface SessionMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  timestamp: string;
  messages: SessionMessage[];
  selectedProviders: ("openai" | "anthropic" | "google")[];
  modelResponses?: Record<string, ModelResponse>;
  consolidatedResponse?: string;
}

const SESSIONS_KEY = "blend_speak_sessions";
const ACTIVE_SESSION_KEY = "blend_speak_active_session";

export const loadSessions = (): ConversationSession[] => {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveSessions = (sessions: ConversationSession[]): void => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getActiveSessionId = (): string | null => {
  return localStorage.getItem(ACTIVE_SESSION_KEY);
};

export const setActiveSessionId = (id: string): void => {
  localStorage.setItem(ACTIVE_SESSION_KEY, id);
};

export const createNewSession = (): ConversationSession => {
  return {
    id: Date.now().toString(),
    title: "New Conversation",
    timestamp: new Date().toISOString(),
    messages: [],
    selectedProviders: [],
  };
};

export const updateSession = (session: ConversationSession): void => {
  const sessions = loadSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  
  if (index !== -1) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  
  saveSessions(sessions);
};

export const deleteSession = (sessionId: string): void => {
  const sessions = loadSessions().filter((s) => s.id !== sessionId);
  saveSessions(sessions);
};

export const renameSession = (sessionId: string, newTitle: string): void => {
  const sessions = loadSessions();
  const session = sessions.find((s) => s.id === sessionId);
  
  if (session) {
    session.title = newTitle;
    saveSessions(sessions);
  }
};

export const exportSession = (sessionId: string): void => {
  const sessions = loadSessions();
  const session = sessions.find((s) => s.id === sessionId);
  
  if (session) {
    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `conversation-${session.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export const generateSessionTitle = (firstMessage: string): string => {
  const maxLength = 40;
  return firstMessage.length > maxLength
    ? firstMessage.substring(0, maxLength) + "..."
    : firstMessage;
};
