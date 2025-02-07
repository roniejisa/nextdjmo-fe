"use client";
import { useState, useEffect, useCallback } from "react";
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

// Số chip khởi đầu cho mỗi người chơi
const INITIAL_CHIPS = 1000;
// Mức raise tối thiểu (có thể điều chỉnh)
const MIN_RAISE = 50;
const TOTAL_PLAYER = 9;
export default function PockerTableBot() {
  // State của bài, bàn chung và người chơi
  const [deck, setDeck] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [players, setPlayers] = useState([]); // mỗi player: { hands, type, folded, betAction, chips, currentBet }
  const [showBotCards, setShowBotCards] = useState(false);
  // Stage: 0 (chưa lật), 1 (flop), 2 (turn), 3 (river)
  const [stage, setStage] = useState(0);
  const [winner, setWinner] = useState(null);
  // State cho chức năng cược:
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);

  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage >= 1 && stage < 3) {
      console.log(communityCards.slice(0, `-${3 - stage}`));
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, i) => {
          let fullHand = [
            ...player.hands,
            ...communityCards.slice(0, `-${3 - stage}`),
          ];
          let handRank = evaluateHand(fullHand);

          return {
            ...player,
            type: handRank.type,
          };
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Hàm khởi tạo một vòng chơi mới:
  // Nếu đã có người chơi (vòng trước) thì giữ lại số chip và reset lại các thuộc tính khác.
  const startNewRound = () => {
    let newDeck = shuffleDeck(generateDeck());
    let newPlayers = [];

    // Random người chơi đi đầu tiên

    if (players.length > 0) {
      // Giữ lại số chip của người chơi và cập nhật lại bài mới, reset trạng thái
      newPlayers = players.map((p, i) => ({
        ...p,
        hands: [newDeck.pop(), newDeck.pop()],
        folded: false,
        currentBet: 0,
        betAction: "",
        type: "",
      }));
    } else {
      for (let i = 0; i < TOTAL_PLAYER; i++) {
        newPlayers.push({
          hands: [newDeck.pop(), newDeck.pop()],
          type: "",
          folded: false,
          betAction: "",
          chips: INITIAL_CHIPS,
          currentBet: 0,
        });
      }
    }

    setPlayers(newPlayers);
    setCommunityCards([
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
    ]);
    setDeck(newDeck);
    setStage(0);
    setWinner(null);
    setShowBotCards(false);
    setPot(0);
    setCurrentBet(0);
  };

  /**
   * Hàm giả lập hành động của bot.
   * Nếu forceCall === true, các bot sẽ KHÔNG fold mà luôn call.
   */
  const simulateBotsActions = (newPlayers, forceCall = false) => {
    newPlayers = newPlayers.map((p, i) => {
      if (i !== 0 && !p.folded) {
        // Xử lý hành động của bot
        let bot = { ...p };

        if (forceCall) {
          // Bắt buộc call
          let callAmount = currentBet - players[0].currentBet;

          // Đảm bảo callAmount ít nhất bằng min raise (giả sử minRaise là số tiền tối thiểu cho một raise)
          const minRaise = Math.max(
            currentBet,
            players[0].currentBet + MIN_RAISE
          ); // MIN_RAISE là số tiền tối thiểu cho một raise

          // Nếu người chơi cần gọi ít nhất bằng minRaise
          callAmount = Math.max(callAmount, minRaise - players[0].currentBet);

          bot.currentBet += callAmount;
          bot.chips -= callAmount;
          bot.betAction = "call";
        } else {
          let decision = Math.random();
          if (decision < 0.1) {
            // Fold
            bot.folded = true;
            bot.betAction = "fold";
          } else {
            // Call
            let callAmount = newPlayers[0].currentBet - bot.currentBet;
            if (newPlayers[0].folded) {
              callAmount = MIN_RAISE;
            }

            if (callAmount > bot.chips) {
              callAmount = bot.chips;
            }
            bot.currentBet += callAmount;
            bot.chips -= callAmount;
            bot.betAction = "call";
          }
        }

        newPlayers[i] = bot;
        return bot;
      }
      return p; // Người chơi thật giữ nguyên
    });
    setPlayers(newPlayers);
    // Cập nhật lại tổng số tiền trong pot (cộng thêm số tiền cược của người chơi)
    setCurrentBet(newPlayers[0].currentBet);
    const totalBet = newPlayers.reduce(
      (total, player) => total + player.currentBet,
      0
    );
    setPot(totalBet);
    return totalBet;
  };

  // Hành động của người chơi (index 0)
  const handleCall = () => {
    let callAmount = 0;
    if (stage == 0) {
      // Đảm bảo callAmount ít nhất bằng min raise (giả sử minRaise là số tiền tối thiểu cho một raise)
      const minRaise = Math.max(currentBet, MIN_RAISE); // MIN_RAISE là số tiền tối thiểu cho một raise
      // Nếu người chơi cần gọi ít nhất bằng minRaise
      callAmount = Math.max(callAmount, minRaise - players[0].currentBet);

      // Nếu số tiền call vượt quá chip của người chơi, chỉ cần gọi tất cả số chip còn lại
      if (callAmount > players[0].chips) {
        callAmount = players[0].chips;
      }
    }

    // Cập nhật trạng thái betAction của người chơi
    let newPlayers = players.map((player, index) => {
      if (index === 0) {
        return {
          ...player,
          betAction: "call",
          currentBet: player.currentBet + callAmount,
          chips: player.chips - callAmount,
        };
      }
      return player;
    });
    // Simulate các hành động của bot
    const pot = simulateBotsActions(newPlayers);

    // Tiến đến vòng tiếp theo
    nextStage(newPlayers, pot);
  };

  const handleRaise = () => {
    let callAmount = MIN_RAISE;
    if (callAmount > players[0].chips) {
      // Đảm bảo callAmount ít nhất bằng min raise (giả sử minRaise là số tiền tối thiểu cho một raise)
      callAmount = players[0].chips;
    }
    // Cập nhật trạng thái betAction của người chơi
    let newPlayers = players.map((player, index) => {
      if (index === 0) {
        return {
          ...player,
          betAction: "call",
          currentBet: player.currentBet + callAmount,
          chips: player.chips - callAmount,
        };
      }
      return player;
    });
    const pot = simulateBotsActions(newPlayers);
    nextStage(newPlayers, pot);
  };

  // Khi người chơi fold:
  // - Đánh dấu người chơi đã fold.
  // - Bắt buộc các bot không fold (forceCall) để họ tiếp tục đặt cược.
  // - Chuyển stage về river, hiển thị bài chung và sau 1 giây xác định kết quả.
  const handleFold = () => {
    let newPlayers = players.map((player, index) => {
      if (index === 0) {
        return {
          ...player,
          betAction: "fold",
          folded: true,
        };
      }
      return player;
    });

    // Sau khi người chơi fold, tiếp tục chơi với các bot
    setTimeout(() => {
      continueGameAfterFold(newPlayers, stage);
    }, 500);
  };

  // Hàm để cho bot chơi từ vòng hiện tại đến vòng cuối
  const continueGameAfterFold = (newPlayers, currentStage) => {
    if (currentStage < 3) {
      // Bot tiếp tục hành động nếu chưa đến vòng River
      simulateBotsActions(newPlayers, false);

      // Chuyển sang vòng tiếp theo sau 2 giây
      setTimeout(() => {
        setStage((prevStage) => {
          const nextStage = prevStage + 1;

          continueGameAfterFold(newPlayers, nextStage); // Gọi đệ quy để tiếp tục
          return nextStage;
        });
      }, 2000);
    } else {
      // Đến vòng River, xác định người thắng
      setTimeout(() => {
        setShowBotCards(true);
        const totalBet = newPlayers.reduce(
          (total, player) => total + player.currentBet,
          0
        );
        determineWinner(newPlayers, totalBet);
      }, 1000);
    }
  };

  // Chuyển sang stage cược tiếp theo (mỗi stage là 1 betting round)
  const nextStage = (newPlayers, pot) => {
    if (stage < 3) {
      setStage(stage + 1);
    } else {
      setShowBotCards(true);
      determineWinner(newPlayers, pot);
    }
  };

  // Hàm so sánh hai bộ bài có cùng rank (giả sử evaluateHand trả về đối tượng có thuộc tính rank và values)
  const compareHands = (values1, values2) => {
    // console.log(values1, values2);
    if (values1[0] === values2[0] && values1.length === 5) {
      const kicker1 = values1.slice(1);
      const kicker2 = values2.slice(1);
      for (let i = 0; i < kicker1.length; i++) {
        if (kicker1[i] > kicker2[i]) return 1;
        if (kicker1[i] < kicker2[i]) return -1;
      }
      return 0;
    }
    for (let i = 0; i < Math.min(values1.length, values2.length); i++) {
      if (values1[i] > values2[i]) return 1;
      if (values1[i] < values2[i]) return -1;
    }
    return 0;
  };

  // Xác định người thắng (bỏ qua những người đã fold).
  // Sau đó, cộng tiền trong pot cho người thắng (chia đều nếu có nhiều người thắng).
  const determineWinner = (newPlayers, pot) => {
    let bestHand = null;
    let bestPlayers = [];
    let ranks = [];

    // Tạo bản sao mới của players
    newPlayers.forEach((player, index) => {
      if (!player.folded) {
        let fullHand = [...player.hands, ...communityCards];
        let handRank = evaluateHand(fullHand);
        ranks.push({
          [index]: handRank,
        });
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
        // Cập nhật type của hand ngay trong vòng lặp
        players[index] = {
          ...players[index],
          type: handRank.type,
        };
      }
    });

    let top = ranks.sort((a, b) => {
      a = Object.values(a)[0];
      b = Object.values(b)[0];

      if (b.rank != a.rank) {
        return b.rank - a.rank;
      } else {
        return compareHands(b.values, a.values);
      }
    });

    top = top.map((item) => Object.keys(item)[0]);
    /**
     * Xác định số người thắng
     */
    // Chia tiền pot
    // console.log("Người chiến thắng ", bestPlayers);
    // console.log("Xếp hạng ", top);
    // console.log("Thông tin round ", newPlayers);

    newPlayers = newPlayers.map((player, index) => {
      let totalReward = 0;
      if (bestPlayers.length === 1 && bestPlayers.includes(index)) {
        const maxResult = newPlayers[0].currentBet;
        totalReward = newPlayers.reduce((total, player) => {
          if (maxResult < player.currentBet) {
            return total + (maxResult - player.currentBet);
          } else {
            return total + player.currentBet;
          }
        }, 0);
        return {
          ...player,
          chips: player.chips + totalReward,
        };
      } else if (bestPlayers.length > 1 && bestPlayers.includes(index)) {
        const maxBot = Math.floor(pot / bestPlayers.length);
        if (player.currentBet > maxBot) {
          totalReward = maxBot;
        } else if (maxBot > player.currentBet) {
          totalReward = player.currentBet;
        }
        return {
          ...player,
          chips: player.chips + totalReward,
        };
      } else {
      }
      return {
        ...player,
        chips: player.chips + totalReward,
      };
    });

    // Cập nhật state một lần duy nhất
    setPlayers(newPlayers);

    // Thông báo kết quả
    if (bestPlayers.length === 1) {
      const winnerIndex = bestPlayers[0];
      setWinner(
        winnerIndex === 0
          ? `Player wins with ${bestHand.type}`
          : `Bot ${winnerIndex} wins with ${bestHand.type}`
      );
    } else {
      const winnersText = bestPlayers
        .map((i) => (i === 0 ? "Player" : `Bot ${i}`))
        .join(" & ");
      setWinner(`${winnersText} win with ${bestHand.type}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-700">
      {/* Hiển thị thông tin pot, current bet và chip của người chơi */}
      <div className="mb-4 text-white absolute">
        <p>Pot: {pot}</p>
        <p>Current Bet: {currentBet}</p>
        <p>Your Chips: {players[0]?.chips}</p>
      </div>

      {/* Bàn chơi */}
      <div className="relative w-full max-w-2xl h-[calc(100vh-200px)] bg-green-900 rounded-full border-4 border-yellow-500 flex flex-col items-center justify-center my-8">
        {/* Hiển thị bài chung theo stage */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4">
          {communityCards
            .slice(0, stage === 0 ? 0 : stage === 1 ? 3 : stage === 2 ? 4 : 5)
            .map((card, index) => (
              <Image
                width={32}
                height={48}
                key={index}
                src={card.image}
                alt={`${card.value} of ${card.suit}`}
                sizes={"100vw"}
                className="w-16 h-24 rounded shadow-md p-1 bg-white"
              />
            ))}
        </div>
        {/* Hiển thị bài của các bot */}
        <div className="players">
          {players.slice(1).map((player, i) => (
            <div
              key={i}
              className="player flex flex-col items-center space-y-2"
            >
              <div>
                <div className="text-white text-sm">
                  Bot {i + 1} {player.folded && "(Folded)"}
                </div>
                {/* {player.betAction && !player.folded && (
                  <div className="text-sm text-white">
                    Action: {player.betAction}
                  </div>
                )} */}
                {player.type && showBotCards && (
                  <div className="text-sm text-white">Hand: {player.type}</div>
                )}
                <div className="text-sm text-white">Chips: {player.chips}</div>
              </div>
              <div className="flex space-x-2">
                {showBotCards ? (
                  player.hands.map((card, index) => (
                    <Image
                      width={32}
                      height={48}
                      key={index}
                      src={card.image}
                      alt={`${card.value} of ${card.suit}`}
                      className={`w-8 h-12 rounded shadow-md p-1 bg-white ${
                        player.folded ? "opacity-50" : ""
                      }`}
                    />
                  ))
                ) : (
                  <>
                    <div className="w-8 h-12 bg-gray-500 rounded shadow-md" />
                    <div className="w-8 h-12 bg-gray-500 rounded shadow-md" />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Hiển thị bài của người chơi */}
        <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2">
          <div className="flex space-x-2">
            {players[0]?.hands.map((card, index) => (
              <Image
                key={index}
                src={card.image}
                alt={`${card.value} of ${card.suit}`}
                width={32}
                height={48}
                sizes="100vw"
                className={`w-8 h-12 rounded shadow-md p-1 bg-white ${
                  players[0]?.folded ? "opacity-50" : ""
                }`}
              />
            ))}
          </div>
          <div>
            {players[0]?.type && (
              <div className="text-sm text-white">Hand: {players[0]?.type}</div>
            )}
            <div className="text-sm text-white">Chips: {players[0]?.chips}</div>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-4 absolute bottom-4 right-4 flex space-x-4">
        {!winner && !players[0]?.folded && (
          <>
            <button
              onClick={handleCall}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
            >
              Call
            </button>
            <button
              onClick={handleRaise}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md"
            >
              Raise
            </button>
            <button
              onClick={handleFold}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md"
            >
              Fold
            </button>
          </>
        )}
        {winner && (
          <>
            {players[0]?.chips > 0 ? (
              <button
                onClick={startNewRound}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md"
              >
                New Round
              </button>
            ) : (
              <div className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md">
                Game Over
              </div>
            )}
          </>
        )}
      </div>

      {/* Hiển thị kết quả */}
      {winner && (
        <div className="mt-4 text-white text-xl font-bold absolute bottom-2">
          Winner: {winner}
        </div>
      )}
    </div>
  );
}
