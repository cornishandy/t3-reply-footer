#!/bin/bash
# Build the footer test pages and run their checks in headless Chrome: light and dark at 760px and 390px,
# no footer CSS at 360px, the team-list switch's always-show and always-hide, and a folded team list.
# Usage: test/run.sh   (SHOTS=1 also saves screenshots; exit 1 if any check fails)
# Needs Node 20+ (`npm ci --prefix test` once) and a Chrome: set CHROME, or it tries T3's bundled
# chrome-headless-shell, then Google Chrome.
set -euo pipefail
D="$(cd "$(dirname "$0")/.." && pwd)"; T="$D/test"
CH="${CHROME:-$(ls -d "$HOME"/.t3/tools/chrome-headless-shell/*/*/chrome-headless-shell 2>/dev/null | tail -1 || true)}"
[ -x "$CH" ] || CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -d "$T/node_modules" ] || npm ci --prefix "$T" --silent
node "$T/build.mjs" "$D/RULES.md" "$T/t3-subset.css" "$D/footer.css" "$T/footer-test.html" >/dev/null
status=0
for v in "footer-test light 760" "footer-test dark 760" "footer-test light 390" "footer-test dark 390" "footer-test light-nocss 360" \
         "footer-test light-team-always-show 760" "footer-test dark-team-always-hide 760" "footer-test-folded light 760" "footer-test-folded dark 390"; do
  set -- $v
  out="$("$CH" --headless --disable-gpu --hide-scrollbars --window-size="$3,3000" --virtual-time-budget=3000 --dump-dom "file://$T/$1.html#$2" 2>/dev/null \
    | python3 -I -c 'import sys,re,html; m=re.search(r"<pre id=\"results\"[^>]*>(.*?)</pre>", sys.stdin.read(), re.S); print(html.unescape(m.group(1)) if m else "NO RESULTS")')"
  echo "$1 $2 $3: $(echo "$out" | grep -E 'PASSED|FAILED|NO RESULTS' | head -1)"
  echo "$out" | grep -E '^FAIL' || true
  echo "$out" | grep -q 'ALL PASSED' || status=1
  if [ "${SHOTS:-}" = 1 ]; then
    "$CH" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size="$3,2600" --virtual-time-budget=3000 --screenshot="$D/docs/screenshots/$1-$2-$3.png" "file://$T/$1.html#$2" >/dev/null 2>&1 || true
  fi
done
exit $status
