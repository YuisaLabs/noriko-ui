import chalk from "chalk";
import {
  installPackages,
  installConfigFiles,
  installComponents,
} from "../utils/packages";

async function init() {
  console.log(chalk.cyan("Initializing project..."));

  await installPackages();
  await installConfigFiles();
  await installComponents();

  console.log(chalk.green("Initialized successfully."));
}

export { init };
