#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import * as path from "path";
import { fileURLToPath } from "url";

let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  __dirname = path.dirname(require.main?.filename || ".");
}

const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const program = new Command();

program
  .name("noriko")
  .description("CLI untuk noriko-react-ui")
  .version(packageJson.version);

program
  .command("add")
  .argument("<component>", "Nama komponen yang ingin di-copy")
  .action(async (component) => {
    const componentDir = path.resolve(
      process.cwd(),
      "node_modules/@yuisalabs/noriko-react-ui/src/components/ui",
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
