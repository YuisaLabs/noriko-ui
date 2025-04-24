import fs from "fs-extra";
import path from "path";
import chalk from "chalk"
import { components } from "../utils/components";

function addComponent(name: string, targetDir: string) {
  const component = components.find(
    (component) => component.name.toLowerCase() === name.toLowerCase()
  );

  if (!component) {
    console.error(chalk.red(`Component ${name} not found.`));
    process.exit(1);
  }

  const destinationDir = path.resolve(process.cwd(), targetDir, `${name}.tsx`);

  if (fs.existsSync(destinationDir)) {
    console.warn(chalk.yellow(`Component ${name} already exists in ${targetDir}.`));
    return;
  }

  fs.ensureDirSync(path.dirname(destinationDir));
  fs.copyFileSync(component.path, destinationDir);

  console.log(chalk.green(`Component ${name} added to ${targetDir}.`));
}

export { addComponent };