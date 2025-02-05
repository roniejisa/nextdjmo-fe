export const evaluateHand = (hand) => {
    console.log(hand);
    const values = hand.map(card => card.value);
    const suits = hand.map(card => card.suit);

    const valueCount = values.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});

    const isFlush = new Set(suits).size === 1;
    const sortedValues = values
        .map(value => {
            if (value === 'A') return 14;
            if (value === 'K') return 13;
            if (value === 'Q') return 12;
            if (value === 'J') return 11;
            return parseInt(value);
        })
        .sort((a, b) => a - b);

    const isStraight = (() => {
        const uniqueValues = [...new Set(sortedValues)];
        if (uniqueValues.length !== 5) return false;
        if (uniqueValues[4] - uniqueValues[0] === 4) return true;
        return JSON.stringify(uniqueValues) === JSON.stringify([2, 3, 4, 5, 14]);
    })();

    const sortedValueCount = Object.entries(valueCount)
        .map(([value, count]) => ({ value: parseInt(value) || (value === 'A' ? 14 : 0), count }))
        .sort((a, b) => b.count - a.count || b.value - a.value);

    const handData = {
        rank: 1,
        type: "High Card",
        values: sortedValues.reverse()
    };

    if (isFlush && isStraight) {
        handData.rank = sortedValues[4] === 14 ? 10 : 9;
        handData.type = sortedValues[4] === 14 ? "Royal Flush" : "Straight Flush";
    } else if (sortedValueCount[0].count === 4) {
        handData.rank = 8;
        handData.type = "Four of a Kind";
        handData.values = [sortedValueCount[0].value, sortedValueCount[1].value];
    } else if (sortedValueCount[0].count === 3 && sortedValueCount[1].count === 2) {
        handData.rank = 7;
        handData.type = "Full House";
        handData.values = [sortedValueCount[0].value, sortedValueCount[1].value];
    } else if (isFlush) {
        handData.rank = 6;
        handData.type = "Flush";
    } else if (isStraight) {
        handData.rank = 5;
        handData.type = "Straight";
    } else if (sortedValueCount[0].count === 3) {
        handData.rank = 4;
        handData.type = "Three of a Kind";
        handData.values = [sortedValueCount[0].value, ...sortedValues.filter(v => v !== sortedValueCount[0].value)];
    } else if (sortedValueCount[0].count === 2 && sortedValueCount[1].count === 2) {
        handData.rank = 3;
        handData.type = "Two Pair";
        handData.values = [
            sortedValueCount[0].value, // Cặp lớn hơn
            sortedValueCount[1].value, // Cặp nhỏ hơn
            sortedValueCount[2].value  // Kicker
        ];
    } else if (sortedValueCount[0].count === 2) {
        handData.rank = 2;
        handData.type = "One Pair";
        handData.values = [
            sortedValueCount[0].value, 
            ...sortedValues.filter(v => v !== sortedValueCount[0].value)
        ];
    }

    return handData;
};