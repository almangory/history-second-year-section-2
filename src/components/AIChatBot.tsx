import React from 'react';
import { AiHistoryTutor } from './AiHistoryTutor';

export interface AIChatBotProps {
  currentUser?: any;
  onSignInWithGoogle?: () => Promise<void>;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ currentUser, onSignInWithGoogle }) => {
  return <AiHistoryTutor currentUser={currentUser} onSignInWithGoogle={onSignInWithGoogle} />;
};

export default AIChatBot;
