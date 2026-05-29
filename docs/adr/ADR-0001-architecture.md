# ADR-0001: Greenfield monorepo architecture for Nowlez Munshi

- **Status:** Accepted
- **Context:** Rebuilding the Nowlez (web) + Munshi (WhatsApp) product from the
  three-repo, mid-migration prototype into one final product. See
  `STATE_OF_THE_UNION.md` and `TARGET_ARCHITECTURE.md`.

## Decision

A full greenfield rewrite — **core and apps** — consolidated into a single
monorepo (`Nowlez-Munshi`), on the same proven stack (Python 3.12 · FastAPI ·
SQLAlchemy 2 · Alembic · Postgres · Redis/RQ · React 19 + Vite). The domain core
(`packages/nm_core`) is pure domain; `apps/{web,bot,worker}` are separate
deployable process types that depend on it by import.

## Locked

1. Monorepo, one domain core, one Postgres schema, one Alembic chain.
2. Rewrite the core too (it sheds migration residue — dual-write, the uuid5
   bridge, cross-repo pins — which were artifacts, not essential complexity).
3. **No data migration — clean launch.** No production data to preserve.
4. Channel-agnostic AI brain (`nm_core.ai`) and notification dispatch.

## Open questions — resolved with defaults (revisit anytime)

| # | Question | Default chosen | Rationale |
|---|---|---|---|
| 1 | Deploy platform | **VPS + Docker Compose** (Caddy + supercronic), `web`/`bot`/`worker`/`cron` as services | Matches the bot's current cheaper, lower-latency-to-NIC model; revisit in a deploy ADR. Not needed before Phase 6. |
| 2 | `web` & `bot` separate or merged | **Separate process types** sharing `nm_core` | Fault isolation + independent scaling; a web fault must not take down the bot/worker path. |
| 3 | Disposition of PR #1's thin MVP | **Fold its `ask_munshi` contract into `nm_core.ai`; remove the standalone app once `nm_core.ai` lands (Phase 4)** | The thin MVP's value is the channel-agnostic contract + parity test; keep that, drop the throwaway scaffold. Frozen in git history + `docs/`. |
| 4 | Brand/naming surface | **One product "Nowlez Munshi"**, "web" and "WhatsApp" as channels | Matches the unified thesis; cosmetic, easily changed. |

## Consequences

- The fragility classes catalogued in `STATE_OF_THE_UNION.md` (pin skew, uuid5
  bridge, silent unsent WhatsApp, mid-migration shims, web-only AI, split ops) are
  eliminated structurally rather than patched.
- Cost: the existing three repos are decommissioned at go-live (Phase 8); until
  then they keep serving as-is.
