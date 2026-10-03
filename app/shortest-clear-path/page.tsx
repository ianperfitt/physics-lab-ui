"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";

function createMatrix(size: number): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function buildExampleMatrix(): number[][] {
  return [
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [1, 0, 1, 0],
    [0, 0, 0, 0],
  ];
}

export default function ShortestClearPathPage() {
  const [size, setSize] = useState(4);
  const [matrix, setMatrix] = useState<number[][]>(() => buildExampleMatrix());
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const matrixPreview = useMemo(
    () => matrix.map((row) => row.join(" ")).join("\n"),
    [matrix],
  );

  const updateMatrixSize = (nextSize: number) => {
    const normalizedSize = Math.min(6, Math.max(1, nextSize));
    setSize(normalizedSize);

    if (normalizedSize === 1) {
      setMatrix([[0]]);
      return;
    }

    const nextMatrix = createMatrix(normalizedSize);
    for (let row = 0; row < normalizedSize; row += 1) {
      for (let col = 0; col < normalizedSize; col += 1) {
        nextMatrix[row][col] = matrix[row]?.[col] ?? 0;
      }
    }
    setMatrix(nextMatrix);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const nextValue = Number(value) || 0;
    const safeValue = nextValue === 0 || nextValue === 1 ? nextValue : 0;

    setMatrix((current) =>
      current.map((currentRow, rowIndex) =>
        rowIndex === row
          ? currentRow.map((currentCell, colIndex) =>
              colIndex === col ? safeValue : currentCell,
            )
          : currentRow,
      ),
    );
  };

  const solveMatrix = async (gridInput: number[][] = matrix) => {
    setError(null);
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
      const response = await fetch(`${apiBase}/api/matrices/shortest-clear-path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grid: gridInput }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to compute the shortest clear path.");
      }

      setResult(payload.length);
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Unable to reach the Java API.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = () => {
    const example = buildExampleMatrix();
    setSize(example.length);
    setMatrix(example);
    void solveMatrix(example);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          <ArrowLeft className="h-4 w-4" />
          <Link
            href="/"
            className="hover:text-sky-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
          >
            PhysicsLab
          </Link>
          <span> / Shortest Clear Path</span>
        </div>

        <section className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-6 md:p-8 shadow-sm">
          <div className="mb-6 max-w-3xl">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
              Java backend
            </p>
            <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-950">
              Shortest Clear Path
            </h1>
            <p className="leading-7 text-slate-600">
              Enter a binary matrix and have the Java service calculate the shortest path
              length from the top-left to the bottom-right cell using 8-direction BFS.
            </p>
          </div>

          <aside className="mb-6 rounded-2xl border border-emerald-200 bg-white p-5 text-sm leading-6 text-slate-700">
            <h2 className="mb-2 text-base font-black uppercase tracking-[0.16em] text-emerald-700">
              Complexity
            </h2>
            <p>
              Breadth-first search explores each cell at most once and checks up to 8 neighbors per cell.
              For an n x n grid, that gives O(n²) time and O(n²) space in the worst case.
            </p>
          </aside>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <label className="text-sm font-semibold text-slate-700" htmlFor="matrix-size">
                  Matrix size
                </label>
                <select
                  id="matrix-size"
                  value={size}
                  onChange={(event) => updateMatrixSize(Number(event.target.value))}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((option) => (
                    <option key={option} value={option}>
                      {option} x {option}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={loadExample}
                  className="rounded-xl border border-emerald-200 bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-200"
                >
                  Load example
                </button>
              </div>

              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
              >
                {matrix.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      type="number"
                      min={0}
                      max={1}
                      value={cell}
                      onChange={(event) =>
                        handleCellChange(rowIndex, colIndex, event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 text-center text-base font-bold text-slate-900 outline-none transition focus:border-emerald-500"
                      aria-label={`Matrix cell ${rowIndex + 1}, ${colIndex + 1}`}
                    />
                  )),
                )}
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <div className="mb-1 font-bold uppercase tracking-[0.16em] text-slate-500">
                  Quick reference
                </div>
                <div>0 = open cell, 1 = blocked cell</div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Result
                </div>

                {error ? (
                  <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
                ) : (
                  <>
                    <div className="text-4xl font-black tracking-tight text-slate-950">
                      {result === null ? "—" : result}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {result === null
                        ? "Press Solve to calculate the shortest clear path."
                        : result === -1
                          ? "No clear path exists from the start to the destination."
                          : "This is the length of the shortest valid path from (0, 0) to the bottom-right cell."}
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => void solveMatrix(matrix)}
                disabled={isLoading}
                className="mt-6 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? "Computing…" : "Solve shortest path"}
              </button>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Current matrix
                </div>
                <pre className="whitespace-pre-wrap text-xs leading-5 text-slate-700">
                  {matrixPreview}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
