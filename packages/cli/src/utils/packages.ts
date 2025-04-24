import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";

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
  }
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

export { REQUIRED_PACKAGES, hasPackage, configFiles, installPackages };
