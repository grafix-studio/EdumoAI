
// This utility helps fix common issues with mind activities

export interface GameState {
  score: number;
  level: number;
  timeLeft: number;
  isPlaying: boolean;
  isComplete: boolean;
}

export function debugGameState(gameState: GameState, gameName: string): GameState {
  // Fix common issues with game states
  
  // 1. Negative time or score
  if (gameState.timeLeft < 0) {
    console.log(`${gameName}: Fixed negative time`);
    gameState.timeLeft = 0;
  }
  
  if (gameState.score < 0) {
    console.log(`${gameName}: Fixed negative score`);
    gameState.score = 0;
  }
  
  // 2. Inconsistent game state (complete but still playing)
  if (gameState.isComplete && gameState.isPlaying) {
    console.log(`${gameName}: Fixed inconsistent playing/complete state`);
    gameState.isPlaying = false;
  }
  
  // 3. Level out of bounds
  if (gameState.level < 1) {
    console.log(`${gameName}: Fixed level out of bounds`);
    gameState.level = 1;
  }
  
  return gameState;
}

export function fixExerciseDataStructure(exerciseData: any): any {
  // Fix common issues with exercise data structures
  
  if (!exerciseData) {
    console.log("Exercise data was null, providing default structure");
    return {
      questions: [],
      currentIndex: 0,
      score: 0,
      isComplete: false
    };
  }
  
  // Ensure questions array exists
  if (!exerciseData.questions || !Array.isArray(exerciseData.questions)) {
    console.log("Fixed missing questions array");
    exerciseData.questions = [];
  }
  
  // Ensure current index is valid
  if (typeof exerciseData.currentIndex !== 'number' || 
      exerciseData.currentIndex < 0 || 
      (exerciseData.questions.length > 0 && exerciseData.currentIndex >= exerciseData.questions.length)) {
    console.log("Fixed invalid currentIndex");
    exerciseData.currentIndex = 0;
  }
  
  // Ensure score is valid
  if (typeof exerciseData.score !== 'number') {
    console.log("Fixed invalid score");
    exerciseData.score = 0;
  }
  
  // Ensure isComplete flag exists
  if (typeof exerciseData.isComplete !== 'boolean') {
    console.log("Fixed missing isComplete flag");
    exerciseData.isComplete = false;
  }
  
  return exerciseData;
}

export function fixDailyChallengeData(challengeData: any): any {
  // Fix common issues with daily challenge data
  
  if (!challengeData) {
    console.log("Challenge data was null, providing default structure");
    return {
      challenges: [],
      currentDay: 1,
      progress: 0,
      isComplete: false,
      lastUpdated: new Date().toISOString()
    };
  }
  
  // Ensure challenges array exists
  if (!challengeData.challenges || !Array.isArray(challengeData.challenges)) {
    console.log("Fixed missing challenges array");
    challengeData.challenges = [];
  }
  
  // Ensure currentDay is valid
  if (typeof challengeData.currentDay !== 'number' || challengeData.currentDay < 1) {
    console.log("Fixed invalid currentDay");
    challengeData.currentDay = 1;
  }
  
  // Ensure progress is valid
  if (typeof challengeData.progress !== 'number' || challengeData.progress < 0 || challengeData.progress > 100) {
    console.log("Fixed invalid progress");
    challengeData.progress = 0;
  }
  
  // Ensure isComplete flag exists
  if (typeof challengeData.isComplete !== 'boolean') {
    console.log("Fixed missing isComplete flag");
    challengeData.isComplete = false;
  }
  
  // Ensure lastUpdated exists and is valid
  if (!challengeData.lastUpdated) {
    console.log("Fixed missing lastUpdated");
    challengeData.lastUpdated = new Date().toISOString();
  }
  
  return challengeData;
}

// Add this hook to component lifecycle to fix game issues
export function useGameDebugger(gameState: any, setGameState: Function, gameName: string) {
  // This would be used in each game component to apply fixes
  const fixedState = debugGameState(gameState, gameName);
  if (JSON.stringify(fixedState) !== JSON.stringify(gameState)) {
    console.log(`${gameName}: Applied fixes to game state`);
    setGameState(fixedState);
  }
}
