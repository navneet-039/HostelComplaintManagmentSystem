import sendMail from "./resend.js"
import { performance } from "perf_hooks";

// 1. Generate 500 fake emails
const emails = Array.from({ length: 1500 }, (_, i) => ({
  to: `test${i}@example.com`,
}));

// 2. Batch size
const BATCH_SIZE = 25;

// 3. Split into batches
const batches = [];
for (let i = 0; i < emails.length; i += BATCH_SIZE) {
  batches.push(emails.slice(i, i + BATCH_SIZE));
}

// 4. Send one batch in parallel
const sendBatch = async (batch, index) => {
  const start = performance.now();

  await Promise.all(
    batch.map((email) =>
      sendMail(
        email.to,
        "Test Email",
        "<h1>Hello from HostelSync</h1>"
      )
    )
  );

  const end = performance.now();

  console.log(
    `Batch ${index + 1}/${batches.length} → ${(end - start) / 1000}s`
  );
};

// 5. Run full benchmark
const runTest = async () => {
  console.log("Starting 500 email benchmark...\n");

  const start = performance.now();

  for (let i = 0; i < batches.length; i++) {
    await sendBatch(batches[i], i);
  }

  const end = performance.now();

  console.log("\n========================");
  console.log(`TOTAL TIME: ${(end - start) / 1000}s`);
  console.log("========================");
};

runTest();