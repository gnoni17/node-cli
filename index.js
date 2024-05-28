#! /usr/bin/env node

import { Command } from "commander";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program.name("string-util").description("CLI to some JavaScript string utilities").version("0.0.1");

program
  .command("create-node")
  .description("create node program with express, prisma, postgres, docker and MVC")
  .argument("<name>", "name of project")
  .action(name => {
    try {
      const folderName = path.join(process.cwd(), name);

      if (!fs.existsSync(folderName)) {
        fs.cpSync(`${__dirname}/template`, folderName, { recursive: true });
      } else {
        console.log("Cartella gia esistente");
      }
    } catch (error) {
      console.log(error);
    }
  });

program.parse();
