#!/usr/bin/env bash
# Upload the built site (dist/) to the web host over FTP with TLS.
# Reads FTP_HOST, FTP_USER, FTP_PASS, FTP_DIR from .env. FTP_DIR is the web root on the server
# ("/" or "/public_html"). Pass --check to only list the target folder and stop.
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a
: "${FTP_HOST:?}" "${FTP_USER:?}" "${FTP_PASS:?}"; FTP_DIR="${FTP_DIR:-/}"; FTP_DIR="${FTP_DIR%/}/"
BASE="ftp://$FTP_HOST$FTP_DIR"
CURL=(curl -s -S --ssl-reqd --ftp-create-dirs --user "$FTP_USER:$FTP_PASS" -m 120)
echo "Target: $BASE"; echo "Currently there:"; "${CURL[@]}" --list-only "$BASE" | sed 's/^/  /'
if "${CURL[@]}" --list-only "$BASE" | grep -qiE '^(scrollcraft|app\.js|thank-you)'; then
  echo "STOP: that folder holds the harrowtech site. Edit FTP_USER/FTP_PASS/FTP_DIR in .env first."; exit 2; fi
[ "${1:-}" = "--check" ] && exit 0
[ -f dist/index.html ] || { echo "dist/ is missing; run npm run build first"; exit 1; }
n=0; find dist -type f | sort | while read -r f; do
  rel="${f#dist/}"; "${CURL[@]}" -T "$f" "$BASE$rel"; n=$((n+1)); printf '\r  uploaded %s' "$rel                    "
done; echo; echo "Done. Verify:"; for p in / /commissions/ /wall-hangings/ /carpets/ /process/ /designs/ /enquire/ /faq/ /care/ /trade/ /terms/ /privacy/ /images/grand/hero-grand-800w.webp /sitemap-index.xml /robots.txt /nope; do
  printf '  %-36s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' -m 20 "https://harrowandthread.com$p")"; done
