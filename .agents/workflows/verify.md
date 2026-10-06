# verify
From the repo root, run in order and stop at the first failure:
1. npm run typecheck
2. npm test
3. npm run build
4. Start the server with AI_PROVIDER=mock and request GET /api/health. Expect ok: true.
Report pass or fail for each step. Fix failures inside your own folders. Anything outside them goes under "Needs from others".
