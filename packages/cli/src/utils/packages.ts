import path from "path";
import fs from "fs-extra";
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

export { REQUIRED_PACKAGES, hasPackage, configFiles  };