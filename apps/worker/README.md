# apps/worker — crons + RQ workers

Background processing for Nowlez Munshi. Each entrypoint is a small `python -m` module that
delegates to `nm_core`; schedule the cron-style ones from your scheduler and run the RQ
worker as a long-lived process. See [`docs/DEPLOY.md`](../../docs/DEPLOY.md) for the
production schedule.

## Entrypoints

| Module | Kind | What it does |
|---|---|---|
| `nm_worker.sweep` | cron / loop | Re-fetch due cases and fan out detected changes. `--loop --interval 900` to run continuously |
| `nm_worker.send_worker` | long-lived | RQ worker draining the `wa_send` queue (at-least-once, with retry + scheduler) |
| `nm_worker.digest` | cron | Build and send scheduled cause-list digests |
| `nm_worker.canary` | cron | Fetch a known CNR from the live portal to detect eCourts schema drift / outages |
| `nm_worker.reengage` | cron | Nudge users inactive beyond `REENGAGE_AFTER_DAYS` |
| `nm_worker.documents` | cron / worker | Process uploaded order/judgment documents |

## Run locally

```bash
python -m nm_worker.sweep                       # one-shot refresh sweep
python -m nm_worker.sweep --loop --interval 900 # continuous
python -m nm_worker.send_worker                 # drain the WhatsApp send queue
python -m nm_worker.canary                      # live-portal health probe
```

In dev, `RQ_SYNC=1` runs queued jobs inline so you don't need a separate `send_worker`.

## Test

```bash
pytest apps/worker
```
