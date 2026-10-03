'use client';

import { useState, type FormEvent } from 'react';
import { Grid3X3 } from 'lucide-react';
import Link from 'next/link';

interface ReductionResult {
  echelonForm: number[][];
  rank: number;
  pivotColumns: number[];
}

const exampleMatrix = `[[1, 2, -1], [2, 4, 1], [-1, 1, 2]]`;

export default function RowEchelonPage() {
  const [matrixInput, setMatrixInput] = useState(exampleMatrix);
  const [result, setResult] = useState<ReductionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function reduceMatrix(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    let matrix: unknown;
    try {
      matrix = JSON.parse(matrixInput);
    } catch {
      setError('Enter a matrix as valid JSON, for example [[1, 2], [3, 4]].');
      return;
    }

    setIsLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const response = await fetch(`${apiBase}/api/matrices/row-echelon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrix }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to reduce this matrix.');
      }

      setResult(payload as ReductionResult);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to reach the matrix API.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            <Grid3X3 className="h-4 w-4" />
            <Link
              href="/"
              className="hover:text-sky-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700"
            >
              PhysicsLab
            </Link>
            <span> / Linear Algebra</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Row Echelon Form</h1>
          <p className="max-w-3xl text-slate-600">
            Enter a rectangular matrix to apply Gaussian elimination. The Java service uses
            partial pivoting and a relative floating-point tolerance.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={reduceMatrix} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label htmlFor="matrix" className="mb-2 block text-sm font-bold text-slate-800">
              Matrix (JSON array of rows)
            </label>
            <textarea
              id="matrix"
              value={matrixInput}
              onChange={(event) => setMatrixInput(event.target.value)}
              rows={7}
              spellCheck={false}
              className="w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <p className="mt-2 text-xs text-slate-500">Example: [[1, 2], [3, 4]]</p>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 rounded-xl bg-sky-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoading ? 'Reducing…' : 'Reduce matrix'}
            </button>
          </form>

          <section className="min-h-64 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-live="polite">
            <h2 className="mb-4 text-xl font-bold">Result</h2>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            {!error && !result && <p className="text-sm text-slate-500">Submit a matrix to see its row echelon form.</p>}
            {result && (
              <>
                <div className="overflow-x-auto">
                  <table className="border-separate border-spacing-2 font-mono text-sm" aria-label="Row echelon form matrix">
                    <tbody>
                      {result.echelonForm.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((value, columnIndex) => (
                            <td key={columnIndex} className="min-w-12 rounded bg-slate-100 px-2 py-1 text-center">
                              {Number(value.toPrecision(6))}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-600">Rank</dt><dd>{result.rank}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-600">Pivot columns (zero-based)</dt><dd>{result.pivotColumns.join(', ') || 'None'}</dd></div>
                </dl>
              </>
            )}
          </section>
        </div>

        <aside className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm leading-6 text-slate-700">
          <h2 className="mb-1 font-bold text-sky-900">What the algorithm does</h2>
          <p>For each column, it selects the largest available pivot, swaps that row into place, and eliminates entries below the pivot. This produces row echelon form; it does not normalize pivots or eliminate entries above them, so the result is not necessarily reduced row echelon form.</p>
        </aside>

        <aside className="mt-6 rounded-2xl border border-sky-100 bg-white p-5 text-sm leading-6 text-slate-700">
          <h2 className="mb-2 text-base font-black uppercase tracking-[0.16em] text-sky-700">
            Complexity
          </h2>
          <p>
            The algorithm scans each pivot column and processes rows in the matrix, so the dominant work is
            O(mn · min(m, n)) for an m x n matrix in the general case. It stores the working matrix and pivot list,
            giving O(mn) additional space.
          </p>
        </aside>
      </section>
    </main>
  );
}
