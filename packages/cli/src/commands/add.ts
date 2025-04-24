import fs from "fs-extra";
import path from "path";
import chalk from "chalk"

import { components } from "../utils/components";
import { BASE_URL } from "../utils/config";
import { fetchComponent } from "../utils/fetch";

async function addComponent(name: string, targetDir: string) {
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

  const fileUrl = `${BASE_URL}${component.path}`;
  await fetchComponent(fileUrl, destinationDir);

  console.log(chalk.green(`Component ${name} added to ${targetDir}.`));
}

export { addComponent };