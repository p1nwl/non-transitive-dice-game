import { DiceParser } from "./classes/DiceParser";
import { GameManager } from "./classes/GameManager";

async function main() {
  const args = process.argv.slice(2);

  try {
    const dice = DiceParser.parseDiceArgs(args);
    const gameManager = new GameManager(dice);
    await gameManager.play();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(String(error));
    }
    process.exit(1);
  }
}

main();
