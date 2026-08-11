import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

const csvPath = path.resolve(__dirname, "../data/brands.csv");

interface BrandRow {
  brand: string;
  env_host: string;
  domain: string;
  product_id: string;
  variant_id: string;
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function main() {
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const rows: BrandRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  rows.sort((a, b) =>
    a.brand.localeCompare(b.brand, undefined, { sensitivity: "base" })
  );

  const header = "brand,env_host,domain,product_id,variant_id";
  const lines = rows.map((r) =>
    [r.brand, r.env_host, r.domain, r.product_id, r.variant_id]
      .map(csvEscape)
      .join(",")
  );

  fs.writeFileSync(csvPath, [header, ...lines].join("\n") + "\n");
  console.log(`Sorted ${rows.length} rows alphabetically by brand → ${csvPath}`);
}

main();

//   npm run sort:brands