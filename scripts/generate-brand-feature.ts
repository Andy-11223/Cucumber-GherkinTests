import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync"; // npm i -D csv-parse

const csvPath = path.resolve(__dirname, "../data/brands.csv");
const outputPath = path.resolve(__dirname, "../features/negative-brands.feature");

const SHARED_QUERY_PARAMS = "lang=en&countryCode=GB&mock=true";

type Environment = "dev" | "staging" | "prod";

// prod has NO subdomain prefix; dev/staging do.
function resolveHost(env: Environment): string {
  switch (env) {
    case "dev":
      return "dev.drawer.kleep.ai";
    case "staging":
      return "staging.drawer.kleep.ai";
    case "prod":
      return "drawer.kleep.ai";
  }
}

// Usage: npm run generate:brands -- --env=prod
//    or: BRAND_ENV=dev npm run generate:brands
//npm run generate:brands -- --env=prod     # → https://drawer.kleep.ai/...
//npm run generate:brands -- --env=dev      # → https://dev.drawer.kleep.ai/...
//npm run generate:brands -- --env=staging  # → https://staging.drawer.kleep.ai/...
//

function resolveTargetEnvironment(): Environment {
  const cliArg = process.argv.find((a) => a.startsWith("--env="));
  const fromCli = cliArg?.split("=")[1];
  const fromEnvVar = process.env.BRAND_ENV;
  const value = (fromCli || fromEnvVar || "staging").toLowerCase();

  if (value !== "dev" && value !== "staging" && value !== "prod") {
    throw new Error(`Invalid environment "${value}". Expected one of: dev, staging, prod.`);
  }
  return value;
}

interface BrandRow {
  brand: string;
  env_host: string;
  domain: string;
  product_id: string;
  variant_id: string;
}

function buildDrawerUrl(row: BrandRow, targetEnv: Environment): string {
  const host = resolveHost(targetEnv);

  const params = new URLSearchParams();
  params.set("domain", row.domain);
  params.set("product_id", row.product_id);
  if (row.variant_id) {
    params.set("variantId", row.variant_id);
  }

  return `https://${host}/?${params.toString()}&${SHARED_QUERY_PARAMS}`;
}

function main() {
  const targetEnv = resolveTargetEnvironment();

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const allRows: BrandRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Rows missing domain or product_id can't produce a valid URL yet —
  // skip them and surface a clear list instead of generating a broken scenario.
  const readyRows = allRows.filter((r) => r.domain && r.product_id);
  const incompleteRows = allRows.filter((r) => !r.domain || !r.product_id);

  const examplesRows = readyRows
    .map((row) => `      | ${buildDrawerUrl(row, targetEnv)} |`)
    .join("\n");

  const incompleteComment =
    incompleteRows.length > 0
      ? `\n  # SKIPPED — missing domain/product_id in data/brands.csv, add manually below:\n` +
        incompleteRows.map((r) => `  #   - ${r.brand}`).join("\n") +
        `\n`
      : "";

  const featureContent = `@negative @iframe @screenshot @generated
Feature: Negative sizing flow across brands (env: ${targetEnv})

  # AUTO-GENERATED FILE — do not edit directly.
  # Edit data/brands.csv and rerun:
  #   npm run generate:brands -- --env=dev
  #   npm run generate:brands -- --env=staging
  #   npm run generate:brands -- --env=prod
  #   npx cucumber-js --tags "@generated"  --parallel 4
${incompleteComment}
  Scenario Outline: Continue button stays disabled when all measurements are invalid
    Given I navigate directly to the drawer "<url>"
    When I enter feet "0" and "0" inches
    And I enter my body weight "0" and age "0"
    Then the "Continue" button should be disabled

    Examples:
      | url |
${examplesRows}
`;

  fs.writeFileSync(outputPath, featureContent);

  console.log(`Generated ${readyRows.length} scenarios for env "${targetEnv}" → ${outputPath}`);
  if (incompleteRows.length > 0) {
    console.log(`\nSkipped ${incompleteRows.length} brand(s) missing domain/product_id — add manually:`);
    incompleteRows.forEach((r) => console.log(`  - ${r.brand}`));
  }
}

main();