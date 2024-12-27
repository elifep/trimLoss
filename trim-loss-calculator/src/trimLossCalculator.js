export function calculateTrimLoss(cutParts, cutModal) {
    const results = [];
    let resultIndex = 0;

    // Iterate through each modal size
    cutModal.forEach((modal) => {
        // Iterate over possible trim values
        for (let trim = 0; trim < Math.floor(cutParts[0]); trim++) {
            const maxCounts = cutParts.map((part) => Math.floor(modal / part)); // Max possible counts for each part

            const generateCombinations = (currentCounts = [], level = 0, currentSum = 0) => {
                // Base case: If all parts are used, check the sum
                if (level === cutParts.length) {
                    if (currentSum === modal - trim) {
                        resultIndex++;
                        const countsObject = cutParts.reduce((acc, part, idx) => {
                            acc[part] = currentCounts[idx] || 0; // Default to 0 if not used
                            return acc;
                        }, {});
                        results.push({ index: resultIndex, counts: countsObject, trim, modal });
                    }
                    return;
                }

                // Recursive case: Try all counts for the current part
                for (let count = 0; count <= maxCounts[level]; count++) {
                    const newSum = currentSum + cutParts[level] * count;
                    if (newSum <= modal) {
                        generateCombinations([...currentCounts, count], level + 1, newSum);
                    } else {
                        break; // Stop if the sum exceeds the modal
                    }
                }
            };

            generateCombinations();
        }
    });

    return results;
}  