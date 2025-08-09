"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  // 操作用の関数に分離
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(0);
  const increment = () => setCount((c) => c + 1);
  const decrement10 = () => setCount((c) => c - 10);
  const increment10 = () => setCount((c) => c + 10);
  const double = () => setCount((c) => c * 2);
  const negate = () => setCount((c) => -c);

  // 背景アニメーションへ通知（グローバルイベント）
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("count-change", { detail: { count } }));
  }, [count]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold mb-6">カウントアプリ</h1>
        <div
          className="text-6xl font-mono font-semibold mb-8 select-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {count}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={decrement}
            className="h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="カウントを1減らす"
          >
            -1
          </button>
          <button
            type="button"
            onClick={reset}
            className="h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="カウントをリセット"
          >
            リセット
          </button>
          <button
            type="button"
            onClick={increment}
            className="h-10 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            aria-label="カウントを1増やす"
          >
            +1
          </button>
        </div>
        {/* 追加の操作ボタン行 */}
        <div className="mt-3 flex gap-3 justify-center">
          <button
            type="button"
            onClick={decrement10}
            className="h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="カウントを10減らす"
          >
            -10
          </button>
          <button
            type="button"
            onClick={double}
            className="h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="カウントを2倍にする"
          >
            ×2
          </button>
          <button
            type="button"
            onClick={negate}
            className="h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="カウントの符号を反転する"
          >
            +/-
          </button>
          <button
            type="button"
            onClick={increment10}
            className="h-10 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            aria-label="カウントを10増やす"
          >
            +10
          </button>
        </div>
      </main>
    </div>
  );
}
