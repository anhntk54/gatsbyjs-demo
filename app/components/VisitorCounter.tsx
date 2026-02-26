"use client";

import { useEffect, useState, useCallback } from "react";

interface CounterData {
    totalVisits: number;
    lastUpdated: string;
    history: { date: string; visits: number }[];
}

export default function VisitorCounter() {
    const [data, setData] = useState<CounterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);
    const [counted, setCounted] = useState(false);

    const fetchCounter = useCallback(async () => {
        try {
            const res = await fetch("/api/counter");
            const json = await res.json();
            setData(json);
        } finally {
            setLoading(false);
        }
    }, []);

    // Đếm 1 lượt khi component mount
    useEffect(() => {
        if (counted) return;
        setCounted(true);

        (async () => {
            try {
                const res = await fetch("/api/counter", { method: "POST" });
                const json = await res.json();
                setData(json);
            } finally {
                setLoading(false);
            }
        })();
    }, [counted]);

    const handleReset = async () => {
        if (!confirm("Bạn có chắc muốn reset bộ đếm về 0?")) return;
        setResetting(true);
        try {
            const res = await fetch("/api/counter", { method: "DELETE" });
            const json = await res.json();
            setData(json);
        } finally {
            setResetting(false);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchCounter();
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    // Lấy lượt truy cập hôm nay
    const todayStr = new Date().toISOString().split("T")[0];
    const todayVisits = data?.history.find((h) => h.date === todayStr)?.visits ?? 0;

    // Số ngày hoạt động
    const activeDays = data?.history.length ?? 0;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-blue-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:from-violet-900/40 dark:to-blue-900/40 dark:text-violet-300">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
                    </span>
                    Bộ đếm lượt truy cập
                </div>
            </div>

            {/* Main counter */}
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-px shadow-2xl">
                <div className="rounded-2xl bg-gradient-to-br from-violet-950/90 to-blue-950/90 p-8 text-center backdrop-blur-xl">
                    {loading ? (
                        <div className="flex h-24 items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-300 border-t-transparent"></div>
                        </div>
                    ) : (
                        <>
                            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-violet-300">
                                Hôm nay
                            </p>
                            <p
                                className="bg-gradient-to-r from-violet-200 via-purple-100 to-blue-200 bg-clip-text font-mono text-7xl font-black tracking-tight text-transparent"
                                style={{ textShadow: "none" }}
                            >
                                {todayVisits.toLocaleString("vi-VN")}
                            </p>
                            <p className="mt-3 text-xs text-violet-400">
                                Cập nhật lần cuối: {data ? formatDate(data.lastUpdated) : "—"}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Stats cards */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm dark:border-violet-900/30 dark:bg-zinc-900">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Tổng tích lũy
                    </p>
                    <p className="font-mono text-3xl font-bold text-violet-600 dark:text-violet-400">
                        {loading ? "—" : (data?.totalVisits ?? 0).toLocaleString("vi-VN")}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">tổng lượt truy cập</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/30 dark:bg-zinc-900">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                        Hoạt động
                    </p>
                    <p className="font-mono text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {loading ? "—" : activeDays}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">ngày có dữ liệu</p>
                </div>
            </div>

            {/* History */}
            {data && data.history.length > 0 && (
                <div className="mb-6 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Lịch sử 7 ngày gần nhất
                    </p>
                    <div className="space-y-2">
                        {[...data.history]
                            .reverse()
                            .slice(0, 7)
                            .map((h) => {
                                const pct = Math.min(
                                    100,
                                    Math.round((h.visits / Math.max(...data.history.map((x) => x.visits))) * 100)
                                );
                                return (
                                    <div key={h.date} className="flex items-center gap-3">
                                        <span className="w-20 shrink-0 text-xs text-zinc-500">{h.date}</span>
                                        <div className="flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="w-8 shrink-0 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                            {h.visits}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-violet-300 hover:text-violet-700 hover:shadow-md disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-violet-700 dark:hover:text-violet-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                </button>
                <button
                    onClick={handleReset}
                    disabled={resetting || loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-medium text-red-500 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:shadow-md disabled:opacity-50 dark:border-red-900/30 dark:bg-zinc-900 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-950/30"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {resetting ? "Đang reset..." : "Reset"}
                </button>
            </div>
        </div>
    );
}
