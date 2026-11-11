/// <reference lib="webworker" />
// Parses and cleans a GujRERA CSV off the main thread, so the page stays responsive while 5,000+ rows are processed.
import { buildDataset, decodeCsv, parseCsv } from "@/lib/rera";

self.onmessage = (e: MessageEvent<ArrayBuffer>) => {
  try {
    const table = parseCsv(decodeCsv(e.data));
    if (table.length < 2) throw new Error("The file has no data rows.");
    const ds = buildDataset(table);
    if (!ds.columns.includes("projectCost") && !ds.columns.includes("total_est_cost_of_proj"))
      throw new Error("This doesn't look like a GujRERA export (no project cost column).");
    self.postMessage({ ok: true, ds });
  } catch (err) {
    self.postMessage({ ok: false, error: err instanceof Error ? err.message : "Could not process the file." });
  }
};
