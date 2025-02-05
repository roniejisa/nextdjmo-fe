"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { evaluateHand } from "./pokerLogic";

const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

function generateDeck() {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value, image: `/cards/${value}_of_${suit}.png` });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  return deck.sort(() => Math.random() - 0.5);
}

export default function PokerTable() {
  const [deck, setDeck] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showBotCards, setShowBotCards] = useState(false);
  const [stage, setStage] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    let newDeck = shuffleDeck(generateDeck());
    setDeck(newDeck);

    let playerHands = [];
    for (let i = 0; i < 22; i++) {
      // 1 người chơi + 4 bot
      playerHands.push({
        hands: [newDeck.pop(), newDeck.pop()],
        type: "",
      });
    }

    setPlayers(playerHands);
    setCommunityCards([
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
    ]);
  }, []);

  const nextStage = () => {
    if (stage < 3) {
      setStage(stage + 1);
    } else {
      setShowBotCards(true);
      determineWinner();
    }
  };

  const determineWinner = () => {
    let bestHand = null;
    let bestPlayers = [];

    players.forEach(({ hands }, index) => {
      let fullHand = [...hands, ...communityCards];
      let handRank = evaluateHand(fullHand);

      if (
        !bestHand ||
        handRank.rank > bestHand.rank ||
        (handRank.rank === bestHand.rank &&
          compareHands(handRank.values, bestHand.values) > 0)
      ) {
        bestHand = handRank;
        bestPlayers = [index];
      } else if (
        handRank.rank === bestHand.rank &&
        compareHands(handRank.values, bestHand.values) === 0
      ) {
        bestPlayers.push(index);
      }
    });

    setPlayers((prevPlayers) => {
      return prevPlayers.map(({ hands }, index) => {
        let fullHand = [...hands, ...communityCards];
        let handRank = evaluateHand(fullHand);
        return {
          hands,
          type: handRank.type,
        };
      });
    });

    if (bestPlayers.length === 1) {
      setWinner(
        bestPlayers[0] === 0
          ? "Player"
          : `Bot ${bestPlayers[0]} - ${bestHand.type}`
      );
    } else {
      setWinner(
        bestPlayers.map((i) => (i === 0 ? "Player" : `Bot ${i}`)).join(" & ") +
          ` - ${bestHand.type}`
      );
    }
  };

  // So sánh hai bộ bài có cùng rank theo thứ tự ưu tiên
  // So sánh hai bộ bài có cùng rank theo thứ tự ưu tiên
  const compareHands = (values1, values2) => {
    // Trường hợp "Three of a Kind"
    if (values1[0] === values2[0] && values1.length === 5) {
      // Đã có 3 lá giống nhau, so sánh với các kicker còn lại
      const kicker1 = values1.slice(1); // Các kicker còn lại
      const kicker2 = values2.slice(1);
      for (let i = 0; i < kicker1.length; i++) {
        if (kicker1[i] > kicker2[i]) return 1;
        if (kicker1[i] < kicker2[i]) return -1;
      }
      return 0;
    }

    // So sánh các giá trị từ lớn đến nhỏ
    for (let i = 0; i < Math.min(values1.length, values2.length); i++) {
      if (values1[i] > values2[i]) return 1;
      if (values1[i] < values2[i]) return -1;
    }
    return 0;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-700">
      {/* Hiển thị bài của 4 bot */}
      <div className="top-10 flex flex-wrap gap-4">
        {players.slice(1).map(({ hands, rank, type }, i) => (
          <div key={i} className="flex space-x-2">
            {showBotCards ? (
              hands.map((card, index) => (
                <Image
                  width={64}
                  height={96}
                  key={index}
                  src={card.image}
                  alt={`${card.value} of ${card.suit}`}
                  className="w-16 h-24 rounded shadow-md p-1 bg-white"
                />
              ))
            ) : (
              <>
                <div className="w-16 h-24 bg-gray-500 rounded shadow-md" />
                <div className="w-16 h-24 bg-gray-500 rounded shadow-md" />
              </>
            )}
            <p>Bot {i + 1}</p>
            <p>Type: {type}</p>
          </div>
        ))}
      </div>
      {/* Bàn chơi */}
      <div className="relative w-full max-w-4xl h-96 bg-green-900 rounded-full border-4 border-yellow-500 flex flex-col items-center justify-center">
        {/* <h2 className="text-white text-xl font-bold">Poker Table</h2> */}

        {/* Khu vực bài ở giữa */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4">
          {communityCards
            .slice(0, stage === 0 ? 0 : stage === 1 ? 3 : stage === 2 ? 4 : 5)
            .map((card, index) => (
              <Image
                width={64}
                height={96}
                key={index}
                src={card.image}
                alt={`${card.value} of ${card.suit}`}
                sizes={'100vw'}
                className="w-16 h-24 rounded shadow-md p-1 bg-white"
              />
            ))}
        </div>

        {/* Khu vực bài của người chơi */}
        <div className="absolute bottom-5 flex flex-wrap space-x-4">
          {players[0]?.hands.map((card, index) => (
            <Image
              key={index}
              src={card.image}
              alt={`${card.value} of ${card.suit}`}
              width={64}
              height={96}
              sizes="100vw"
              className="w-16 h-24 rounded shadow-md p-1 bg-white"
            />
          ))}
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={nextStage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
        >
          {stage < 3 ? "Next" : "Showdown"}
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md">
          Raise
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md">
          Fold
        </button>
      </div>

      {/* Kết quả */}
      {winner && (
        <div className="mt-4 text-white text-xl font-bold">
          Winner: {Array.isArray(winner) ? winner.join(" & ") : winner}
        </div>
      )}
    </div>
  );
}
