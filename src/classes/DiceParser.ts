import { Dice } from "./Dice";

export class DiceParser {
  static parseDiceArgs(args: string[]): Dice[] {
    if (args.length < 3) {
      throw new Error(
        "Error: At least 3 dice must be specified. \nExample: 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3"
      );
    }

    const diceList = args.map((arg, i) => {
      const parts = arg.split(",");
      const numbers: number[] = [];

      for (const part of parts) {
        const num = parseInt(part, 10);
        if (isNaN(num)) {
          throw new Error(
            `Error: Invalid number in dice ${i}: "${part}" is not an integer.`
          );
        }
        numbers.push(num);
      }

      return new Dice(numbers);
    });

    const faceCount = diceList[0].faces.length;
    for (const [index, dice] of diceList.entries()) {
      if (dice.faces.length !== faceCount) {
        throw new Error(
          `Error: Dice ${index} has a different number of faces (${dice.faces.length}) than expected (${faceCount}).`
        );
      }
    }

    return diceList;
  }
}
