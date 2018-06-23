/**
 * Calculate the sums of the values in an array
 * @param values An array of numbers
 * @returns The sum of the numbers in the array
 */
function sum(values: number[]) {
    return values.reduce((acc, x) => acc + x);
}

/**
 * Calculate the mean (average) of an array of values
 */
function mean(values: number[]) {
    return sum(values) / values.length;
}

/**
 * Calculate the variance of an array of values
 */
function variance(values: number[]) {
    const count = values.length;
    const mu = mean(values);
    const errors = values.map(x => Math.pow((x - mu), 2));

    return sum(errors) / count;
}

/**
 * Calculate the standard deviation (sigma) of an array of values
 */
function standardDeviation(values: number[]) {
    return Math.sqrt(variance(values));
}

/**
 * Calculate the standard error of the mean for an array of values
 * @param values An array of number values
 * @returns The standard error of the values
 */
function standardError(values: number[]) {
    return standardDeviation(values) / Math.sqrt(values.length);
}

export { sum, mean, variance, standardDeviation, standardError };
