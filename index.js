#! /usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program.name("nodejs project generate").description("Generate a nodejs project").version("0.0.1");

program
  .command("create-node")
  .description("create node program with express, prisma, postgres, docker and MVC")
  .argument("<name>", "name of project")
  .action(name => {
    try {
      console.log(chalk.blue("Creazione progetto in corso..."));
      const folderName = path.join(process.cwd(), name);

      if (!fs.existsSync(folderName)) {
        fs.cpSync(`${__dirname}/template`, folderName, { recursive: true });
        console.log(chalk.green("Operazione eseguita con successo"));
      } else {
        console.log("Cartella gia esistente");
      }
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  });

program.parse();
