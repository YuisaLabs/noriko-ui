import ora from "ora";
import fs from "fs-extra";
import path from "path";

import { fetch } from "undici";

async function fetchComponent(url: string, destination: string): Promise<void> {
  const spinner = ora(`Downloading component from ${path.basename(destination)}`).start();

  const response = await fetch(url);

  if (!response.ok || !response.body) {
    spinner.fail("Failed to download component");
    throw new Error(`Failed to download component`);
  }

  await fs.ensureDir(path.dirname(destination));
  const fileStream = fs.createWriteStream(destination);

  const reader = response.body.getReader();
  const pump = async () => {
    const { done, value } = await reader.read();
    if (done) {
      fileStream.end();
      return;
    }
    fileStream.write(value);
    await pump();
  }

  await pump();
  spinner.succeed(`Component downloaded to ${path.basename(destination)}`);
}

export { fetchComponent };