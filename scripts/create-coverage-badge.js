const fs = require("fs");
const { execSync } = require("child_process");

try {
  const html = fs.readFileSync("./coverage/lcov-report/index.html", "utf8");
  const match = html.match(/(\d+\.\d+)%/);
  const coverage = match ? match[1] : "0";
  const color =
    coverage >= 90 ? "brightgreen" : coverage >= 80 ? "yellow" : "red";

  execSync(
    `curl -o badges/coverage.svg "https://img.shields.io/badge/coverage-${coverage}%25-${color}"`
  );
  console.log(`Coverage badge created with ${coverage}% coverage`);
} catch (error) {
  console.error("Failed to create coverage badge:", error.message);
  process.exit(1);
}
