import * as readline from "readline/promises";
import { RandomGenerator } from "./RandomGenerator";
import Table from "cli-table3";
import crypto from "crypto";

export class FairRandomProtocol {
  private key: Buffer | null = null;
  private computerNumber: number | null = null;
  private hmac: string | null = null;
  private range: number;

  constructor(range: number) {
    if (range <= 0) {
      throw new Error("Range must be positive.");
    }
    this.range = range;
  }

  getComputerNumber(): number {
    if (this.computerNumber === null) {
      throw new Error("Computer number is not set. Protocol not initiated.");
    }
    return this.computerNumber;
  }

  getKey(): Buffer {
    if (this.key === null) {
      throw new Error("Key is not set. Protocol not initiated.");
    }
    return this.key;
  }

  async initiate(): Promise<void> {
    this.computerNumber = crypto.randomInt(this.range);
    this.key = RandomGenerator.generateKey();
    this.hmac = RandomGenerator.generateHMAC(this.key, this.computerNumber);

    console.log(
      `I selected a random value in the range 0...${this.range - 1} (HMAC=${
        this.hmac
      }).`
    );
  }

  async getUserInput(): Promise<number> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      while (true) {
        let prompt = "Add your number";
        if (this.range === 2) {
          prompt = "Try to guess my selection";
        } else {
          prompt += ` modulo ${this.range}.`;
        }
        prompt += "\n";

        for (let i = 0; i < this.range; i++) {
          prompt += `${i} - ${i}\n`;
        }
        prompt += "X - exit\n? - help\nYour selection: ";

        const answer = await rl.question(prompt);
        const trimmed = answer.trim();

        if (trimmed.toLowerCase() === "x") {
          rl.close();
          process.exit(0);
        }
        if (trimmed === "?") {
          console.log("Enter a number between 0 and " + (this.range - 1) + ".");
          continue;
        }

        const num = parseInt(trimmed, 10);
        if (isNaN(num) || num < 0 || num >= this.range) {
          console.log(
            `Invalid input. Please enter a number between 0 and ${
              this.range - 1
            }.`
          );
          continue;
        } else {
          rl.close();
          return num;
        }
      }
    } catch (err) {
      rl.close();
      throw err;
    }
  }

  finalize(userNumber: number, showDetails: boolean = true): number {
    if (this.computerNumber === null || this.key === null) {
      throw new Error("Protocol not initiated.");
    }

    const result = (this.computerNumber + userNumber) % this.range;

    if (showDetails) {
      const resultTable = new Table({
        style: { head: ["cyan"] },
      });

      resultTable.push(
        { "Computer Number": this.computerNumber },
        { "User Number": userNumber },
        { Modulo: this.range },
        { "Result (Index)": result },
        { "Secret Key": this.key.toString("hex").toUpperCase() }
      );

      console.log("Fair Roll Result:");
      console.log(resultTable.toString());
    } else {
      console.log(
        `My selection: ${this.computerNumber} (KEY=${this.key
          .toString("hex")
          .toUpperCase()}).`
      );
    }

    return result;
  }
}
