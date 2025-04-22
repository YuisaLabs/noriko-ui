import fs from "fs-extra";
import path from "path";
import chalk from "chalk"

function addComponent(name: string, targetDir: string) {
  const componentMap: Record<string, string> = {
    button: path.resolve(__dirname, "../../../ui/src/components/button.tsx"),
  }

  const src = componentMap[name];
  if (!src) {
    console.error(chalk.red(`Component ${name} not found.`));
    process.exit(1);
  }

  const destinationDir = path.resolve(process.cwd(), targetDir, `${name}.tsx`);

  if (fs.existsSync(destinationDir)) {
    console.warn(chalk.yellow(`Component ${name} already exists in ${targetDir}.`));
    return;
  }

  fs.ensureDirSync(path.dirname(destinationDir));
  fs.copyFileSync(src, destinationDir);

  console.log(chalk.green(`Component ${name} added to ${targetDir}.`));
}

export { addComponent };