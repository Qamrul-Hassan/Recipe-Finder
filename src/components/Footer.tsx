export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-8 sm:px-6">
      <div className="glass-panel shell-gradient footer-glow-line mx-auto w-full max-w-7xl rounded-3xl border border-[var(--surface-border)] px-6 py-6 shadow-lg">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-lg font-extrabold tracking-[0.12em] text-[var(--foreground)]">QAMRUL HASSAN</p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Product Designer and Frontend Developer
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">Recipe Finder</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Modern recipe discovery for meals and drinks
            </p>
          </div>
        </div>

        <p className="mt-4 border-t border-[var(--surface-border)] pt-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Copyright 2026. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
