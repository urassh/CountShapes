"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// メタボール（メタブロブ）効果を SVG フィルタで実装
// 複数の円をぼかしてコントラスト調整し、融合・分離のような見た目を作る
export default function MetaBlobs({
	count = 5,
}: {
	count?: number;
}) {
	const refs = useRef<Array<HTMLDivElement | null>>([]);
	const [mounted, setMounted] = useState(false);

	// 連動パラメータ（速度・振幅・融合度）の現在値と目標値
	const paramsRef = useRef({
		speed: 1, // 時間スケール
		amp: 1, // 振幅倍率
		sigma: 24, // ぼかし量
		thresh: -12, // 融合閾値（ColorMatrixのバイアス）
		target: { speed: 1, amp: 1, sigma: 24, thresh: -12 },
	});

	const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
	const cmRef = useRef<SVGFEColorMatrixElement | null>(null);

	const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

	useEffect(() => {
		setMounted(true);
	}, []);

	// count 変化を受け取り、背景アニメの目標パラメータを更新
	useEffect(() => {
		const onCountChange = (e: Event) => {
			const detail = (e as CustomEvent<{ count: number }>).detail;
			if (!detail) return;
			const abs = Math.min(Math.abs(detail.count), 20);
			const target = {
				speed: clamp(1 + abs * 0.06, 0.8, 2.4),
				amp: clamp(1 + abs * 0.12, 1, 3),
				sigma: clamp(24 + abs * 1.2, 18, 42),
				thresh: clamp(-12 + abs * 0.6, -12, -6),
			};
			paramsRef.current.target = target;
		};

		window.addEventListener("count-change", onCountChange as EventListener);
		return () => window.removeEventListener("count-change", onCountChange as EventListener);
	}, []);

	// 初期シードを固定化して、マウント間で動作が安定するように
	const seeds = useMemo(
		() =>
			Array.from({ length: count }, (_, i) => ({
				x: Math.random(),
				y: Math.random(),
				s: 0.8 + Math.random() * 0.8, // サイズ倍率
				d: (6 + Math.random() * 6) * (i % 2 === 0 ? 1 : -1), // 振幅ベース
				t: Math.random() * 1000, // 位相
				z: i, // z-index順
			})),
		[count]
	);

	useEffect(() => {
		if (!mounted) return;

		// 各ブロブの基準位置（left/top）を画面全体に分散して一度だけ設定
		seeds.forEach((seed, i) => {
			const el = refs.current[i];
			if (!el) return;
			const baseLeftPct = 12 + seed.x * 76; // 12%〜88%
			const baseTopPct = 12 + seed.y * 76; // 12%〜88%
			el.style.left = `${baseLeftPct}%`;
			el.style.top = `${baseTopPct}%`;
		});

		let raf = 0;
		const start = performance.now();

		const tick = () => {
			const now = performance.now();
			const elapsed = (now - start) / 1000; // 秒

			// 目標に向けてなめらかに補間
			const p = paramsRef.current;
			p.speed += (p.target.speed - p.speed) * 0.08;
			p.amp += (p.target.amp - p.amp) * 0.08;
			p.sigma += (p.target.sigma - p.sigma) * 0.08;
			p.thresh += (p.target.thresh - p.thresh) * 0.08;

			// フィルタ値を反映
			if (blurRef.current) blurRef.current.setAttribute("stdDeviation", p.sigma.toFixed(1));
			if (cmRef.current)
				cmRef.current.setAttribute(
					"values",
					`1 0 0 0 0\n0 1 0 0 0\n0 0 1 0 0\n0 0 0 32 ${p.thresh.toFixed(1)}`
				);

			const t = elapsed * p.speed;

			seeds.forEach((seed, i) => {
				const el = refs.current[i];
				if (!el) return;

				// 複数のノイズ関数を合成（擬似ランダム移動）
				const nx =
					Math.sin(t * (0.4 + seed.d * 0.02) + seed.t) +
					Math.cos(t * (0.9 + seed.s * 0.3) - seed.t * 0.3) * 0.7;
				const ny =
					Math.cos(t * (0.5 + seed.d * 0.018) - seed.t) +
					Math.sin(t * (0.8 + seed.s * 0.25) + seed.t * 0.5) * 0.6;

				// 位置は px で微移動させ、クラスター化を避ける（振幅は count 連動）
				const dx = nx * 140 * p.amp; // px
				const dy = ny * 120 * p.amp; // px

				// スケールもゆっくり変化して融合/分離を強調
				const scale = seed.s * (1 + Math.sin(t * 0.9 + seed.t) * 0.12);

				el.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`;
			});

			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [mounted, seeds]);

	if (!mounsrcted) return null;

	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
			{/* メタボール用フィルタ */}
			<svg className="absolute inset-0 size-0">
				<defs>
					<filter id="metaballs">
						<feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="24" result="blur" />
						<feColorMatrix
							ref={cmRef}
							in="blur"
							mode="matrix"
							values={`1 0 0 0 0\n0 1 0 0 0\n0 0 1 0 0\n0 0 0 32 -12`}
							result="goo"
						/>
						<feBlend in="SourceGraphic" in2="goo" />
					</filter>
				</defs>
			</svg>

			{/* ブロブ群（色は控えめ、融合・分離はフィルタで） */}
			<div className="absolute inset-0" style={{ filter: "url(#metaballs)" }}>
				{seeds.map((seed, i) => (
					<div
						key={i}
						ref={(el) => {
							refs.current[i] = el;
						}}
						className="absolute rounded-full blur-3xl will-change-transform"
						style={{
							width: `${24 + seed.s * 12}rem`,
							height: `${24 + seed.s * 12}rem`,
							background:
								i % 3 === 0
									? "rgba(217, 70, 239, 0.10)" // fuchsia-500 @10%
									: i % 3 === 1
										? "rgba(56, 189, 248, 0.20)" // sky-400 @20%
										: "rgba(52, 211, 153, 0.18)", // emerald-400 @18%
						}}
					/>
				))}
			</div>

			{/* 既存の柔らかな光のグラデーション */}
			<div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(255,255,255,0.8),transparent_60%)] dark:bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(255,255,255,0.2),transparent_60%)]" />
		</div>
	);
}
