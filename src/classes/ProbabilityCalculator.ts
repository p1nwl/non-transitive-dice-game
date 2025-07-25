import { Dice } from "./Dice";

export class ProbabilityCalculator {
  static calculateWinProbability(diceA: Dice, diceB: Dice): number {
    const facesA = diceA.getFaces();
    const facesB = diceB.getFaces();
    let winCount = 0;
    const totalComparisons = facesA.length * facesB.length;

    for (const faceA of facesA) {
      for (const faceB of facesB) {
        if (faceA > faceB) {
          winCount++;
        }
      }
    }

    return winCount / totalComparisons;
  }
}
