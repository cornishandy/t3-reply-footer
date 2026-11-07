#!/bin/bash
# Build the footer test pages and run their checks in headless Chrome: light and dark at 760px and 390px,
# a 380px and a 520px chat lane inside wider windows (a narrowed window with the sidebar open; the 480px media
# query doesn't fire there), no footer CSS at 360px, the team-list switch's always-show and always-hide, and a
# folded team list.
# Usage: test/run.sh   (SHOTS=1 also saves screenshots; exit 1 if any check fails)
# Needs Node 20+ (`npm ci --prefix test` once) and a Chrome: set CHROME, or it tries T3's bundled
# chrome-headless-shell, then Google Chrome.
set -euo pipefail
D="$(cd "$(dirname "$0")/.." && pwd)"; T="$D/test"
CH="${CHROME:-}"
if [ -z "$CH" ]; then
  for candidate in "$HOME"/.t3/tools/chrome-headless-shell/*/*/chrome-headless-shell; do
    [ ! -x "$candidate" ] || CH="$candidate"
  done
  [ -n "$CH" ] || CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fi
[ -d "$T/node_modules" ] || npm ci --prefix "$T" --silent
node "$T/build.mjs" "$D/RULES.md" "$T/t3-subset.css" "$D/footer.css" "$T/footer-test.html" >/dev/null
status=0
for v in "footer-test light 760" "footer-test dark 760" "footer-test light 390" "footer-test dark 390" \
         "footer-test light-lane-380 640" "footer-test dark-lane-380 640" "footer-test light-lane-520 840" "footer-test light-nocss 360" \
         "footer-test light-team-always-show 760" "footer-test dark-team-always-hide 760" "footer-test-folded light 760" "footer-test-folded dark 390"; do
  set -- $v
  out="$("$CH" --headless --disable-gpu --hide-scrollbars --window-size="$3,3000" --virtual-time-budget=3000 --dump-dom "file://$T/$1.html#$2" 2>/dev/null \
    | python3 -I -c 'import sys,re,html; m=re.search(r"<pre id=\"results\"[^>]*>(.*?)</pre>", sys.stdin.read(), re.S); print(html.unescape(m.group(1)) if m else "NO RESULTS")')"
  echo "$1 $2 $3: $(echo "$out" | grep -E 'PASSED|FAILED|NO RESULTS' | head -1)"
  actual_width="$(echo "$out" | sed -nE 's/^(ALL PASSED|[0-9]+ FAILED) \((dark|light), ([0-9]+)px.*$/\3/p')"
  if [ "$actual_width" != "$3" ]; then
    echo "FAIL viewport: requested $3 px, reported ${actual_width:-unknown} px"
    status=1
  fi
  echo "$out" | grep -E '^FAIL' || true
  echo "$out" | grep -q 'ALL PASSED' || status=1
  if [ "${SHOTS:-}" = 1 ]; then
    "$CH" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size="$3,2600" --virtual-time-budget=3000 --screenshot="$D/docs/screenshots/$1-$2-$3.png" "file://$T/$1.html#$2" >/dev/null 2>&1 || true
  fi
done
exit $status
