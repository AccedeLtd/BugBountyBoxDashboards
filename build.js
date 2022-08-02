const { execSync, execFileSync, execFile } = require("child_process");
const { writeFileSync } = require("fs");
const path = require("path");
const configFilePath = path.join(__dirname, "src/app/build-config.ts");
const env = process.argv[2] || "all";
console.log(`Building with config '${env.toUpperCase()}'...`);

// Update config file
writeFileSync(configFilePath, `export const env = '${env}';`);

try {
  // Build
  execSync(`"./node_modules/.bin/ng" build`, {
    stdio: "inherit",
  });
} finally {
  // Restore config file
  writeFileSync(configFilePath, `export const env = 'all';`);
}
