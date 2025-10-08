export const round2 = (n: number) => Math.round(n * 100) / 100;
export const inclFromExcl = (excl: number, vatRate = 0.15) => round2(excl * (1 + vatRate));
export const exclFromIncl = (incl: number, vatRate = 0.15) => round2(incl / (1 + vatRate));
