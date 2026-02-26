#!/usr/bin/env node

/**
 * send-requests.js
 * Gửi N request đến URL mục tiêu
 *
 * Sử dụng:
 *   node scripts/send-requests.js [số_lượng] [--concurrency N] [--delay ms]
 *
 * Ví dụ:
 *   node scripts/send-requests.js 100
 *   node scripts/send-requests.js 50 --concurrency 5 --delay 200
 */

const https = require("https");
const http = require("http");

// ─── Cấu hình mặc định ──────────────────────────────────────────────────────
const TARGET_URL = "https://nextjs.anhnt-d21.workers.dev/";
const DEFAULT_COUNT = 10;
const DEFAULT_CONCURRENCY = 5;  // số request song song
const DEFAULT_DELAY = 0;        // ms chờ giữa mỗi batch

// ─── Parse arguments ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const count = parseInt(args.find((a) => /^\d+$/.test(a)) ?? DEFAULT_COUNT, 10);
const concurrency = parseInt(args[args.indexOf("--concurrency") + 1] ?? DEFAULT_CONCURRENCY, 10);
const delay = parseInt(args[args.indexOf("--delay") + 1] ?? DEFAULT_DELAY, 10);

console.log(`\n🚀 Bắt đầu gửi request`);
console.log(`   URL         : ${TARGET_URL}`);
console.log(`   Số lượng    : ${count}`);
console.log(`   Song song   : ${concurrency}`);
console.log(`   Delay/batch : ${delay}ms\n`);

// ─── Helper: gửi 1 request ───────────────────────────────────────────────────
function sendRequest(index) {
    return new Promise((resolve) => {
        const url = new URL(TARGET_URL);
        const lib = url.protocol === "https:" ? https : http;
        const start = Date.now();

        const req = lib.get(TARGET_URL, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
                const ms = Date.now() - start;
                console.log(`  ✅ [${String(index).padStart(4)}] ${res.statusCode} — ${ms}ms`);
                resolve({ success: true, status: res.statusCode, ms });
            });
        });

        req.on("error", (err) => {
            const ms = Date.now() - start;
            console.log(`  ❌ [${String(index).padStart(4)}] ERROR — ${err.message}`);
            resolve({ success: false, error: err.message, ms });
        });

        req.setTimeout(10_000, () => {
            req.destroy();
            console.log(`  ⏱️  [${String(index).padStart(4)}] TIMEOUT`);
            resolve({ success: false, error: "timeout", ms: 10_000 });
        });
    });
}

// ─── Helper: sleep ───────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Main: gửi theo batch song song ─────────────────────────────────────────
async function run() {
    const results = [];
    const total = count;
    let done = 0;

    for (let i = 0; i < total; i += concurrency) {
        const batch = [];
        for (let j = i; j < Math.min(i + concurrency, total); j++) {
            batch.push(sendRequest(j + 1));
        }
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
        done += batchResults.length;

        if (delay > 0 && done < total) await sleep(delay);
    }

    // ─── Tổng kết ────────────────────────────────────────────────────────────
    const success = results.filter((r) => r.success).length;
    const failed = results.length - success;
    const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);

    console.log(`\n${"─".repeat(45)}`);
    console.log(`📊 Kết quả:`);
    console.log(`   Tổng gửi  : ${results.length}`);
    console.log(`   Thành công: ${success} ✅`);
    console.log(`   Thất bại  : ${failed} ❌`);
    console.log(`   Thời gian TB: ${avgMs}ms`);
    console.log(`${"─".repeat(45)}\n`);
}

run().catch(console.error);
