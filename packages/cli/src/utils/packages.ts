import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { execa } from "execa";
import { fetchComponent } from "./fetch";
import { BASE_URL } from "./config";
import { components } from "./components";

interface ConfigFile {
  path: string;
}

const configFiles: ConfigFile[] = [
  {
    path: "/packages/ui/src/main.css",
  },
  {
    path: "/packages/ui/tailwind.config.js",
  },
  {
    path: "/packages/ui/postcss.config.js",
  },
  {
    path: "/packages/ui/src/utils/classes.tsx",
  },
];

const REQUIRED_PACKAGES = [
  "autoprefixer",
  "clsx",
  "tailwindcss",
  "@tailwindcss/postcss",
  "postcss",
  "tailwind-merge",
  "tailwind-variants",
  "react-aria-components",
];

function hasPackage(packageName: string): boolean {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) return false;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  return (
    (packageJson.dependencies && packageJson.dependencies[packageName]) ||
    (packageJson.devDependencies && packageJson.devDependencies[packageName])
  );
}

async function installPackages() {
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
}

function getTargetPath(fileName: string): string {
  if (fileName === "main.css") {
    return path.join(process.cwd(), "src", fileName);
  }

  if (fileName === "classes.tsx") {
    return path.join(process.cwd(), "src", "utils", fileName);
  }

  return path.join(process.cwd(), fileName);
}
async function installConfigFiles() {
  const { installConfigFiles } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installConfigFiles",
      message: "Do you want to install config files?",
      default: true,
    },
  ]);

  if (!installConfigFiles) {
    console.log(chalk.gray("Skipping config files installation."));
    return;
  }

  for (const file of configFiles) {
    const fileName = path.basename(file.path);
    const targetPath = getTargetPath(fileName);

    if (fs.existsSync(targetPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `File ${path.basename(
            targetPath
          )} already exists. Do you want to overwrite it?`,
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
      spinner.succeed(
        `File ${path.basename(file.path)} downloaded successfully.`
      );
    } catch (error) {
      spinner.fail(`Failed to download ${path.basename(file.path)}`);
      console.error(
        chalk.red(`Failed to download ${path.basename(file.path)}`)
      );
    }
  }
}

async function installComponents() {
  if (components.length === 0) {
    console.log(chalk.yellow("No components to install."));
    return;
  }

  const { installBaseComponents } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installBaseComponents",
      message: "Do you want to install base components?",
      default: true,
    }
  ]);

  if (!installBaseComponents) {
    console.log(chalk.gray("Skipping base components installation."));
    return;
  }

  console.log(chalk.cyan("Installing base components:"));

  for (const component of components) {
    const destinationDir = path.join(process.cwd(), "src", "components", "ui", `${component.name}.tsx`);

    await fs.ensureDir(path.dirname(destinationDir));

    if (fs.existsSync(destinationDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `Component ${component.name} already exists.`,
          default: false,
        }
      ]);

      if (!overwrite) {
        console.log(chalk.gray(`Skipping ${destinationDir}`));
        continue;
      }
    }

    const spinner = ora(`Installing ${component.name} component`).start();
    const fileUrl = `${BASE_URL}${component.path}`;

    try {
      await fetchComponent(fileUrl, destinationDir);
      spinner.succeed(`Component ${component.name} installed successfully.`);
    } catch (error) {
      spinner.fail(`Failed to install ${component.name} component`);
      console.error(chalk.red(`Failed to install ${component.name} component`));
    }
  }

  console.log(chalk.green("All base components installed successfully."));
}

export {
  REQUIRED_PACKAGES,
  hasPackage,
  configFiles,
  installPackages,
  installConfigFiles,
  installComponents,
};
