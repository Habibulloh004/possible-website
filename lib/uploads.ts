import path from "path";
import { existsSync } from "fs";

function findProjectRoot(startDir = process.cwd()) {
  let currentDir = startDir;

  while (true) {
    if (existsSync(path.join(currentDir, "package.json"))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return startDir;
    }

    currentDir = parentDir;
  }
}

const projectRoot = findProjectRoot();
const uploadRoot = path.join(projectRoot, "public", "uploads");

export function getUploadRoot() {
  return uploadRoot;
}

export function resolveUploadPath(relativePath: string) {
  const normalized = path
    .normalize(relativePath)
    .replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(uploadRoot, normalized);

  if (!filePath.startsWith(uploadRoot)) {
    throw new Error("Invalid upload path");
  }

  return filePath;
}
