#!/bin/bash
# Offline runner regression: a passing page at the wrong viewport must fail.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"
fixture="$(mktemp -d "$T/.run-width.XXXXXX")"
trap 'rm -rf "$fixture"' EXIT
cat > "$fixture/chrome" <<'CHROME'
#!/bin/bash
for arg in "$@"; do
  case "$arg" in --window-size=*) width="${arg#*=}"; width="${width%%,*}" ;; esac
done
if [ "${CLAMP_PHONE:-}" = 1 ] && [ "$width" -lt 500 ]; then width=500; fi
printf '<pre id="results">ALL PASSED (light, %spx)</pre>\n' "$width"
CHROME
chmod +x "$fixture/chrome"
CHROME="$fixture/chrome" "$T/run.sh" > "$fixture/exact.log"
if CLAMP_PHONE=1 CHROME="$fixture/chrome" "$T/run.sh" > "$fixture/clamped.log"; then
  echo "FAIL: runner accepted passing pages at the wrong width"
  exit 1
fi
[ "$(grep -c '^FAIL viewport:' "$fixture/clamped.log")" = 4 ]
echo "PASS: exact widths accepted; four clamped phone widths rejected"
