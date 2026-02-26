import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "counter.json");

interface CounterData {
  totalVisits: number;
  lastUpdated: string;
  history: { date: string; visits: number }[];
}

function readCounter(): CounterData {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as CounterData;
  } catch {
    return { totalVisits: 0, lastUpdated: new Date().toISOString(), history: [] };
  }
}

function writeCounter(data: CounterData) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET: lấy số lượt truy cập hiện tại
export async function GET() {
  const data = readCounter();
  return NextResponse.json(data);
}

// POST: tăng bộ đếm lên 1
export async function POST() {
  const data = readCounter();
  data.totalVisits += 1;
  data.lastUpdated = new Date().toISOString();

  // Ghi lịch sử theo ngày
  const today = new Date().toISOString().split("T")[0];
  const todayEntry = data.history.find((h) => h.date === today);
  if (todayEntry) {
    todayEntry.visits += 1;
  } else {
    data.history.push({ date: today, visits: 1 });
    // Giữ lại 30 ngày gần nhất
    if (data.history.length > 30) {
      data.history = data.history.slice(-30);
    }
  }

  writeCounter(data);
  return NextResponse.json(data);
}

// DELETE: reset bộ đếm
export async function DELETE() {
  const data: CounterData = {
    totalVisits: 0,
    lastUpdated: new Date().toISOString(),
    history: [],
  };
  writeCounter(data);
  return NextResponse.json(data);
}
