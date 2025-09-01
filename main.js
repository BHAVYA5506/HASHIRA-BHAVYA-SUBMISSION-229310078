const fs = require('fs');

const MOD = 1000000007n;

function power(base, exp) {
    let res = 1n;
    base %= MOD;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % MOD;
        base = (base * base) % MOD;
        exp /= 2n;
    }
    return res;
}

function modInverse(n) {
    return power(n, MOD - 2n);
}

function stringToBigIntMod(valStr, base) {
    const baseN = BigInt(base);
    let result = 0n;
    for (const char of valStr) {
        const digit = BigInt(parseInt(char, base));
        result = (result * baseN + digit) % MOD;
    }
    return result;
}

function solve(jsonString) {
    const data = JSON.parse(jsonString);
    const k = data.keys.k;

    const M = Array.from({ length: k }, () => new Array(k + 1).fill(0n));

    for (let i = 0; i < k; i++) {
        const x = BigInt(i + 1);
        const pointData = data[(i + 1).toString()];
        const base = parseInt(pointData.base, 10);
        const y = stringToBigIntMod(pointData.value, base);

        let currentXPower = 1n;
        for (let j = 0; j < k; j++) {
            M[i][j] = currentXPower;
            currentXPower = (currentXPower * x) % MOD;
        }
        M[i][k] = y;
    }

    for (let i = 0; i < k; i++) {
        let pivotRow = i;
        while (pivotRow < k && M[pivotRow][i] === 0n) {
            pivotRow++;
        }
        if (pivotRow === k) continue;

        [M[i], M[pivotRow]] = [M[pivotRow], M[i]];

        const inv = modInverse(M[i][i]);
        for (let j = i; j <= k; j++) {
            M[i][j] = (M[i][j] * inv) % MOD;
        }

        for (let row = 0; row < k; row++) {
            if (row !== i) {
                const factor = M[row][i];
                for (let col = i; col <= k; col++) {
                    const term = (factor * M[i][col]) % MOD;
                    M[row][col] = (M[row][col] - term + MOD) % MOD;
                }
            }
        }
    }

    const coefficients = M.map(row => row[k]);
    const result = [];

    for (let i = k - 1; i >= 0; i--) {
        let val = coefficients[i];
        if (val > MOD / 2n) {
            val = val - MOD;
        }
        result.push(val.toString());
    }

    console.log("Polynomial coefficients (c_m, c_{m-1}, ..., c_0):");
    console.log(result.join(' '));
}

(() => {
    try {
        const input = fs.readFileSync(0, 'utf-8');
        solve(input);
    } catch (error) {
        console.error("Error reading or processing input:", error.message);
    }
})();
