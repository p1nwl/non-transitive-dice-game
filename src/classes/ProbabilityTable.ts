import { Dice } from "./Dice";
import { ProbabilityCalculator } from "./ProbabilityCalculator";
import Table from "cli-table3";

export class ProbabilityTable {
  private dice: Dice[];

  constructor(dice: Dice[]) {
    this.dice = dice;
  }

  display(): void {
    const numDice = this.dice.length;
    if (numDice < 2) {
      console.log("Not enough dice to display a probability table.");
      return;
    }

    const table = new Table({
      head: ["Dice \\ Opponent", ...this.dice.map((_, i) => `Dice ${i}`)],
      style: { head: ["cyan"] },
    });

    for (let i = 0; i < numDice; i++) {
      const row: any[] = [`Dice ${i}`];
      for (let j = 0; j < numDice; j++) {
        if (i === j) {
          row.push("-");
        } else {
          const prob = ProbabilityCalculator.calculateWinProbability(
            this.dice[i],
            this.dice[j]
          );
          row.push(prob.toFixed(2));
        }
      }
      table.push(row);
    }

    console.log(table.toString());
  }
}
