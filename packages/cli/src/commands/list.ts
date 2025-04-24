import chalk from "chalk";
import { components } from "../utils/components";

async function listComponents() {
  if (components.length === 0) {
    console.error(chalk.red("No components found."));
    return;
  }

  console.log(chalk.blue("Available components:"));

  components.forEach((component) => {
    console.log(
      chalk.green(`${component.name}`),
      chalk.yellow(`- ${component.description}`)
    );
  })
}

export { listComponents }