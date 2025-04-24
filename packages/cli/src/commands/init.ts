import chalk from "chalk";
import ora from "ora";
import path from "path";
import inquirer from "inquirer";
import fs from "fs-extra";
import { configFiles, hasPackage, REQUIRED_PACKAGES } from "../utils/packages";
import { BASE_URL } from "../utils/config";
import { fetchComponent } from "../utils/fetch";

function getTargetPath(fileName: string): string {
  if (fileName === "main.css") {
    return path.join(process.cwd(), "src", fileName);
  }

  if (fileName === "classes.tsx") {
    return path.join(process.cwd(), "src", "utils", fileName);
  }

  return path.join(process.cwd(), fileName);
}

async function init() {
  console.log(chalk.cyan("Initializing project..."));

  for (const file of configFiles) {
    const fileName = path.basename(file.path);
    const targetPath = getTargetPath(fileName);

    if (fs.existsSync(targetPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `File ${path.basename(targetPath)} already exists. Do you want to overwrite it?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.gray(`Skipping ${targetPath}`));
        continue;
      }
    }

    const spinner = ora(`Downloading ${path.basename(file.path)}`).start();
    const fileUrl = `${BASE_URL}${file.path}`;

    try {
      await fetchComponent(fileUrl, targetPath);
      spinner.succeed(`File ${path.basename(file.path)} downloaded successfully.`);
    } catch (error) {
      spinner.fail(`Failed to download ${path.basename(file.path)}`);
      console.error(chalk.red(`Failed to download ${path.basename(file.path)}`));
    }
  }

  console.log(chalk.green("Initialized successfully."));
}

export { init };