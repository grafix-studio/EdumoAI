
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { shuffle } from "@/lib/utils";

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

const emojis = ["🍎", "🍌", "🍒", "🍓", "🍋", "🍇", "🍉", "🍊", "🥭", "🍍", "🥥", "🥝"];

export default function MemoryMatchGame({ onScore, onComplete, isFinished }: MemoryMatchGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);

  // Initialize game board
  useEffect(() => {
    startNewGame();
  }, []);

  // Check if game is complete
  useEffect(() => {
    if (matchedPairs === 6 && !isFinished) {
      onComplete();
    }
  }, [matchedPairs, onComplete, isFinished]);

  // Disable interaction if game is finished
  useEffect(() => {
    if (isFinished && matchedPairs < 6) {
      // Reveal all cards when time runs out
      setCards(cards.map(card => ({
        ...card,
        isFlipped: true
      })));
    }
  }, [isFinished, matchedPairs, cards]);

  // Handle flipped cards
  useEffect(() => {
    // If we have 2 flipped cards, check for a match
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      
      // Increment moves
      setMoves(moves => moves + 1);
      
      // Check if cards match
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // It's a match
        setCards(prevCards => 
          prevCards.map((card, index) => 
            index === firstIndex || index === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        onScore(10); // Award points for matching
        setFlippedCards([]);
      } else {
        // Not a match, flip back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map((card, index) => 
              index === firstIndex || index === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, onScore]);

  const startNewGame = () => {
    // Create pairs of cards with emojis
    const gameEmojis = emojis.slice(0, 6);
    const cardPairs = [...gameEmojis, ...gameEmojis].map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle the cards
    setCards(shuffle(cardPairs));
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
  };

  const handleCardClick = (index: number) => {
    // Ignore if game is finished
    if (isFinished) return;
    
    // Ignore if we already have 2 cards flipped
    if (flippedCards.length === 2) return;
    
    // Ignore if card is already flipped or matched
    if (cards[index].isFlipped || cards[index].isMatched) return;
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map((card, i) => 
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, index]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <p className="text-center text-lg font-medium mb-2">
          Match all the pairs of cards
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Moves: {moves} | Pairs: {matchedPairs}/6
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
        {cards.map((card, index) => (
          <div 
            key={card.id}
            className={`cursor-pointer transition-all duration-300 transform ${
              card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
            } ${isFinished && !card.isMatched ? 'opacity-50' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <Card 
              className={`flex items-center justify-center h-24 w-24 select-none ${
                card.isMatched ? 'bg-green-100 dark:bg-green-900' : 'bg-card'
              }`}
            >
              {(card.isFlipped || card.isMatched) ? (
                <span className="text-4xl">{card.emoji}</span>
              ) : (
                <span className="text-4xl">❓</span>
              )}
            </Card>
          </div>
        ))}
      </div>
      
      {isFinished && (
        <div className="text-center mt-4">
          <p className="mb-4 text-lg font-medium">
            {matchedPairs === 6 ? '🎉 Great job! You found all matches!' : 'Time\'s up!'}
          </p>
          <Button onClick={startNewGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
