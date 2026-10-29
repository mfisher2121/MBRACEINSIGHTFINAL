# MBRACE Insight site funnel

Public pages live in `site/`. Deploy that folder to Netlify.

## First-touch drop (what gets sent)

Rule: `site/deliverables/FIRST-TOUCH.md`

| # | Asset | URL |
|---|---|---|
| 1 | Personalized leave-behind | template at `/deliverables/templates/` |
| 2 | GBP scorecard vs top 3 | `/example-report/` · capture `/report/` |
| 3 | DMV Visibility Gap | `/visibility-gap/` |
| 4 | Decision Center (live) | `/decision-center/` |
| 5 | 90-day GBP calendar | `/playbooks/90-day-gbp-calendar.html?company=<Company>&date=<YYYY-MM-DD>` |

Envelope page: `/package/`

Playbooks stay in the library at `/playbooks/` until they engage. Each one takes `?company=` (and the calendar takes `&date=`) so n8n can send a personalized link per company.

## Pages

| URL | Job |
|---|---|
| `/` | Homepage |
| `/package/` | First-touch drop (the envelope) |
| `/visibility-gap/` | DMV visibility gap map |
| `/decision-center/` | White-label rebate / heat-pump tools |
| `/audit/` | 60-second GBP video audit |
| `/report/` | Market Intelligence Report capture |
| `/example-report/` | Sample scorecard |

## Forms → n8n

Import `n8n/form-intake-audit-report.json`. Set `N8N_WEBHOOK_AUDIT` and `N8N_WEBHOOK_REPORT` in Netlify.
