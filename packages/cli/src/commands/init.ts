import chalk from "chalk";
import ora from "ora";
import path from "path";
import inquirer from "inquirer";
import fs from "fs-extra";
import { execa } from "execa";
import { configFiles, hasPackage, REQUIRED_PACKAGES } from "../utils/packages";
import { BASE_URL } from "../utils/config";
import { fetchComponent } from "../utils/fetch";


async function init() {
  console.log(chalk.cyan("Initializing project..."));

  const missingPackages = REQUIRED_PACKAGES.filter((pkg) => !hasPackage(pkg));

  if (missingPackages.length === 0) {
    console.log(chalk.green("All required packages are already installed."));
    return;
  }

  console.log(chalk.yellow("Package not installed:"));
  missingPackages.forEach((pkg) => console.log(`- ${pkg}`));

  const spinner = ora("Installing missing packages...").start();

  try {
    await execa("npm", ["install", ...missingPackages], { stdio: "inherit" });
    spinner.succeed("All Missing packages installed successfully.");
  } catch (error) {
    spinner.fail("Failed to install packages");
    console.error(chalk.red("Failed to install packages."));
  }

  for (const file of configFiles) {
    const targetPath = path.resolve(process.cwd(), path.basename(file.path));

    if (fs.existsSync(targetPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `File ${targetPath} already exists. Do you want to overwrite it?`,
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