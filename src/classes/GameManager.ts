import * as readline from "readline/promises";
import { Dice } from "./Dice";
import { FairRandomProtocol } from "./FairRandomProtocol";
import { ProbabilityTable } from "./ProbabilityTable";
import Table from "cli-table3";

export class GameManager {
  private dice: Dice[];
  private computerDieIndex: number | null = null;
  private userDieIndex: number | null = null;

  constructor(dice: Dice[]) {
    this.dice = dice;
  }

  private displayDiceTable(excludeIndex: number | null = null) {
    const table = new Table({
      head: ["Index", "Dice Faces"],
      style: { head: ["cyan"] },
    });

    this.dice.forEach((die, index) => {
      if (excludeIndex !== null && index === excludeIndex) return;
      table.push([index, die.toString()]);
    });

    console.log(table.toString());
    console.log("X - Exit");
    console.log("? - Help (Show probability table)");
  }

  private async selectDie(
    prompt: string,
    excludeIndex: number | null = null
  ): Promise<number> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      while (true) {
        console.log(prompt);
        this.displayDiceTable(excludeIndex);

        const answer = await rl.question("Your selection: ");
        const trimmed = answer.trim();

        if (trimmed.toLowerCase() === "x") {
          rl.close();
          process.exit(0);
        }

        if (trimmed === "?") {
          const table = new ProbabilityTable(this.dice);
          table.display();
          continue;
        }

        const index = parseInt(trimmed, 10);
        const isValidIndex =
          index >= 0 &&
          index < this.dice.length &&
          (excludeIndex === null || index !== excludeIndex);

        if (!isValidIndex) {
          console.log("Invalid selection. Please try again.");
          continue;
        } else {
          rl.close();
          return index;
        }
      }
    } catch (err) {
      rl.close();
      throw err;
    }
  }

  private async rollDie(die: Dice, playerName: string): Promise<number> {
    console.log(`It's time for ${playerName} roll.`);
    const protocol = new FairRandomProtocol(die.getFaces().length);
    await protocol.initiate();
    const userIndex = await protocol.getUserInput();
    const finalIndex = protocol.finalize(userIndex);
    const result = die.roll(finalIndex);
    console.log(
      `${playerName === "my" ? "My" : "Your"} roll result is ${result}.`
    );
    return result;
  }

  public async play(): Promise<void> {
    console.log("Let's determine who makes the first move.");
    const firstMoveProtocol = new FairRandomProtocol(2);
    await firstMoveProtocol.initiate();

    const userChoice = await firstMoveProtocol.getUserInput();
    const computerChoice = firstMoveProtocol.getComputerNumber();
    firstMoveProtocol.finalize(userChoice, false);

    const userGoesFirst = (computerChoice + userChoice) % 2 === 0;

    if (userGoesFirst) {
      console.log("You make the first move.");
      this.userDieIndex = await this.selectDie("Choose your dice:");
      const availableForComputer = this.dice
        .map((_, i) => i)
        .filter((i) => i !== this.userDieIndex);
      if (availableForComputer.length === 0) {
        throw new Error("No dice available for computer to choose.");
      }
      this.computerDieIndex =
        availableForComputer[
          Math.floor(Math.random() * availableForComputer.length)
        ];
      console.log(
        `I choose the ${this.dice[this.computerDieIndex].toString()} dice.`
      );
    } else {
      console.log("I make the first move.");
      const availableForComputer = this.dice.map((_, i) => i);
      this.computerDieIndex =
        availableForComputer[
          Math.floor(Math.random() * availableForComputer.length)
        ];
      console.log(
        `I choose the ${this.dice[this.computerDieIndex].toString()} dice.`
      );
      this.userDieIndex = await this.selectDie(
        "Choose your dice:",
        this.computerDieIndex
      );
    }

    const userDie = this.dice[this.userDieIndex!];
    const computerDie = this.dice[this.computerDieIndex!];

    const computerRoll = await this.rollDie(computerDie, "my");
    const userRoll = await this.rollDie(userDie, "your");

    if (userRoll > computerRoll) {
      console.log(`You win (${userRoll} > ${computerRoll})!`);
    } else if (computerRoll > userRoll) {
      console.log(`Computer wins (${computerRoll} > ${userRoll})!`);
    } else {
      console.log(`It's a tie (${userRoll} = ${computerRoll})!`);
    }
  }
}
