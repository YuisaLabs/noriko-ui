import { Command } from "commander";
import { version } from "../package.json";
import { addComponent } from "./commands/add";

const program = new Command();

program
  .name("noriko")
  .description("Noriko UI CLI - Add UI Component to your project")
  .version(version)

program
  .command("add")
  .argument("<component>", "Component name to add (e.g. button)")
  .option("-d, --dir <directory>", "Target directory", "components")
  .description("Add a component to your project")
  .action((component, options) => {
    addComponent(component, options.dir);
  })

program.parse()

