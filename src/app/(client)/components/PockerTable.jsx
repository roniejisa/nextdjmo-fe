"use client";
import { useState, useEffect, useCallback, useContext } from "react";
import Image from "next/image";
import { evaluateHand } from "./pokerLogic";
import { SocketContext } from "@/context/SocketProvider";
import useRouterCustom from "@/packages/translation/Navigation";

/**
 * Mỗi khi có người raise thì tự động đánh index của người đó về 0
 * Sau đó sẽ lại chạy 1 vòng để kiểm tra người khác có raise hay call tiếp hay không
 * - Cần bỏ qua người đã all in
 * - Bỏ qua người đã fold
 *
 */
export default function PokerTable({ id }) {
  const { socketRef, sessionIdRef, addTypes } = useContext(SocketContext);
  const router = useRouterCustom();
  // State của bài, bàn chung và người chơi
  const [communityCards, setCommunityCards] = useState([]);
  const [players, setPlayers] = useState([]); // mỗi player: { hands, type, folded, betAction, chips, currentBet }
  const [showBotCards, setShowBotCards] = useState(false);
  // Stage: 0 (chưa lật), 1 (flop), 2 (turn), 3 (river)
  const [stage, setStage] = useState(0);
  const [winner, setWinner] = useState(null);
  // State cho chức năng cịc:
  const [pot, setPot] = useState(0);
  const [settings, setSettings] = useState(null);
  const [started, setStarted] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [isBB, setIsBB] = useState(false);
  const [isSB, setIsSB] = useState(false);
  useEffect(() => {
    if (socketRef.current) {
      setTimeout(() => {
        socketRef.current.sendEncode({
          type: "join-room",
          data: { id: sessionIdRef.current, roomId: id },
        });
      }, 1000);
    }

    addTypes("join-room", (body) => {
      if (body.error) {
        router.push("/");
        return false;
      }
      setSettings(body);
      setPlayers([...body.players]);
    });

    addTypes("update-players", ({ players }) => {
      setPlayers([...players]);
    });

    addTypes("start-round", ({ round, players }) => {
      setWinner(null);
      setPlayers([...players]);
      setIsBB(round.idBB === sessionIdRef.current);
      setIsSB(round.idSB === sessionIdRef.current);
      setMyTurn(round.idStart === sessionIdRef.current);
      setPot(round.pot);
      setStarted(true);
    });

    addTypes(
      "next-stage",
      ({ round: { pot, communityCards, idStart }, players }) => {
        setPlayers([...players]);
        console.log(communityCards);
        setCommunityCards([...communityCards]);
        setMyTurn(idStart === sessionIdRef.current);
        setPot(pot);
      }
    );

    addTypes("determine-winner", ({ round, players }) => {
      setPlayers([...players]);
      setWinner(round.winner);
    });

    addTypes("update-index-action", ({ round, players }) => {
      setPlayers([...players]);
      setMyTurn(round.idStart === sessionIdRef.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage >= 1 && stage < 3) {
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
    setStage(0);
    setWinner(null);
    setShowBotCards(false);
    socketRef.current.sendEncode({
      type: "start-round",
      data: { roomId: id },
    });
  };

  /**
   * Hàm giả lập hành động của bot.
   * Nếu forceCall === true, các bot sẽ KHÔNG fold mà luôn call.
   */
  // Hành động của người chơi (index 0)
  const handleCall = () => {
    socketRef.current.sendEncode({
      type: "handle-call",
      data: { roomId: id, id: sessionIdRef.current },
    });
  };

  const handleCheck = () => {
    socketRef.current.sendEncode({
      type: "handle-check",
      data: { roomId: id, id: sessionIdRef.current },
    });
  };

  const handleRaise = () => {
    socketRef.current.sendEncode({
      type: "handle-raise",
      data: { roomId: id, id: sessionIdRef.current, amount: 5000 },
    });
  };

  // Khi người chơi fold:
  // - Đánh dấu người chơi đã fold.
  // - Bắt buộc các bot không fold (forceCall) để họ tiếp tục đặt cịc.
  // - Chuyển stage về river, hiển thị bài chung và sau 1 giây xác định kết quả.
  const handleFold = () => {
    socketRef.current.sendEncode({
      type: "handle-fold",
      data: { roomId: id, id: sessionIdRef.current },
    });
  };

  // Hàm để cho bot chơi từ vòng hiện tại đến vòng cuối

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

  if (!started) {
    return (
      <div>
        <h3>Lobby - Room: {settings?.room_id}</h3>
        <p>Wait for the host to start the game</p>
        <div>
          {players.map((player, index) => (
            <div key={index} className="flex">
              <p>{player.name}</p>
              <p> - {player.chips}</p>
            </div>
          ))}
        </div>
        {players.length >= 2 && sessionIdRef.current == settings?.owner && (
          <button onClick={startNewRound}>Bắt đầu chơi</button>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-700">
      <p className="text-2xl font-bold mb-4 text-white"></p>
      {/* Bàn chơi */}
      <div className="relative w-full max-w-2xl h-[calc(100vh-200px)] bg-green-900 rounded-full border-4 border-yellow-500 flex flex-col items-center justify-center my-8">
        {/* Hiển thị bài chung theo stage */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex space-x-4">
            {communityCards.map((card, index) => (
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
          {/* Hiển thị thông tin pot, current bet và chip của người chơi */}
          <div className="mb-4 text-white absolute">
            <p>{pot}</p>
          </div>
        </div>
        {/* Hiển thị bài của các bot */}
        <div className="players">
          {players
            .filter((player) => player.id !== sessionIdRef.current)
            .map((player, i) => (
              <div
                key={i}
                className="player flex flex-col items-center space-y-2"
              >
                <div>
                  <div className="text-white text-sm">
                    {player.name} {player.folded && "(Folded)"}
                  </div>
                  {/* {player.betAction && !player.folded && (
                  <div className="text-sm text-white">
                    Action: {player.betAction}
                  </div>
                )} */}
                  {player.blind && (
                    <div className="text-sm text-white">
                      blind: {player.blind}
                    </div>
                  )}
                  <div className="text-sm text-white">
                    Chips: {player.chips}
                  </div>
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
            {players
              .find((player) => player.id === sessionIdRef.current)
              ?.hands.map((card, index) => (
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
            <div className="text-sm text-white">
              Blind:{" "}
              {
                players.find((player) => player.id === sessionIdRef.current)
                  ?.blind
              }
            </div>
            {players.find((player) => player.id === sessionIdRef.current)
              ?.handType && (
              <div className="text-sm text-white">
                Hand:{" "}
                {
                  players.find((player) => player.id === sessionIdRef.current)
                    ?.handType
                }
              </div>
            )}
            <div className="text-sm text-white">
              Chips:{" "}
              {
                players.find((player) => player.id === sessionIdRef.current)
                  ?.chips
              }
            </div>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-4 absolute bottom-4 right-4 flex space-x-4">
        {!winner &&
          !players.find((player) => player.id === sessionIdRef.current)
            ?.folded &&
          myTurn && (
            <>
              {players.find((player) => player.id === sessionIdRef.current)
                .type === "call" ? (
                <button
                  onClick={handleCall}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                >
                  Call
                </button>
              ) : (
                <button
                  onClick={handleCheck}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
                >
                  Check
                </button>
              )}

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
            {settings?.owner === sessionIdRef.current && (
              <button
                onClick={startNewRound}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md"
              >
                New Round
              </button>
            )}
          </>
        )}
      </div>

      {/* Hiển thị kết quả */}
      {winner && (
        <>
          <div className="mt-4 text-white text-xl font-bold absolute bottom-2">
            Winner: {players.find((player) => player.id === winner)?.name}
          </div>
        </>
      )}
    </div>
  );
}
