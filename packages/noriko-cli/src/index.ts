#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import * as path from "path";

const program = new Command();

program
  .name("noriko")
  .description("CLI untuk noriko-react-ui")
  .version("0.1.0");

program
  .command("add")
  .argument("<component>", "Nama komponen yang ingin di-copy")
  .action(async (component) => {
    const componentDir = path.resolve(
      process.cwd(),
      "node_modules/noriko-react-ui/components",
      component
    );

    const targetDir = path.resolve(process.cwd(), "components", component);

    if (!fs.existsSync(componentDir)) {
      console.log(chalk.red(`❌ Komponen "${component}" tidak ditemukan.`));
      return;
    }

    await fs.ensureDir(path.dirname(targetDir));
    await fs.copy(componentDir, targetDir);

    console.log(chalk.green(`✅ Komponen "${component}" berhasil dicopy ke /components.`));
  });

program.parse();
