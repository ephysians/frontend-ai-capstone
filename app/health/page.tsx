interface RepoData {
  full_name: string;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  default_branch: string;
}

async function getRepoHealth(): Promise<{ ok: true; data: RepoData } | { ok: false; error: string }> {
  try {
    const res = await fetch('https://api.github.com/repos/ephysians/frontend-ai-capstone', {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { ok: false, error: `GitHub API responded ${res.status}` };
    }
    const data = (await res.json()) as RepoData;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown fetch error' };
  }
}

export default async function HealthPage() {
  const result = await getRepoHealth();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-accent mb-3">health check</p>
      <h1 className="font-display font-semibold text-2xl sm:text-4xl text-ink">Live data fetch</h1>
      <p className="mt-4 text-muted max-w-xl">
        A real server-side fetch to GitHub&apos;s API for this repo, rendered on the server. Not a mock,
        this page fails visibly if the fetch fails, rather than silently showing stale or fake data.
      </p>

      <div className="mt-10 rounded-lg border border-white/10 bg-panel p-6">
        {result.ok ? (
          <dl className="grid gap-4 sm:grid-cols-2 font-mono text-sm">
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide">Repository</dt>
              <dd className="text-ink mt-1">{result.data.full_name}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide">Default branch</dt>
              <dd className="text-ink mt-1">{result.data.default_branch}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide">Open issues</dt>
              <dd className="text-ink mt-1">{result.data.open_issues_count}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs uppercase tracking-wide">Last pushed</dt>
              <dd className="text-ink mt-1">{new Date(result.data.pushed_at).toLocaleString()}</dd>
            </div>
          </dl>
        ) : (
          <p className="font-mono text-sm text-remove">Fetch failed: {result.error}</p>
        )}
      </div>
    </div>
  );
}
