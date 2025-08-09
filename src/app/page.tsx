"use client";

import { useEffect, useState } from "react";
import CounterButton from "@/components/CounterButton";

export default function Home() {
  const [count, setCount] = useState(0);

  // 操作用の関数に分離
  const decrement = () => setCount((c) => c);
  const reset = () => setCount(0);
  const increment = () => setCount((c) => c + 1);
  const decrement10 = () => setCount((c) => c);
  const increment10 = () => setCount((c) => c);
  const double = () => setCount((c) => c);
  const negate = () => setCount((c) => c);

  // 背景アニメーションへ通知（グローバルイベント）
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("count-change", { detail: { count } }));
  }, [count]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Count Shapes</h1>
        <div
          className="text-6xl font-mono font-semibold mb-8 select-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {count}
        </div>
        <div className="flex gap-3 justify-center">
          <CounterButton onClick={decrement} ariaLabel="カウントを1減らす">
            -1
          </CounterButton>
          <CounterButton onClick={reset} ariaLabel="カウントをリセット">
            リセット
          </CounterButton>
          <CounterButton onClick={increment} ariaLabel="カウントを1増やす">
            +1
          </CounterButton>
        </div>
        {/* 追加の操作ボタン行 */}
        <div className="mt-3 flex gap-3 justify-center">
          <CounterButton onClick={decrement10} ariaLabel="カウントを10減らす">
            -10
          </CounterButton>
          <CounterButton onClick={double} ariaLabel="カウントを2倍にする">
            ×2
          </CounterButton>
          <CounterButton onClick={negate} ariaLabel="カウントの符号を反転する">
            +/-
          </CounterButton>
          <CounterButton onClick={increment10} ariaLabel="カウントを10増やす">
            +10
          </CounterButton>
        </div>
      </main>
    </div>
  );
}
