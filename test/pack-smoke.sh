#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d "$ROOT_DIR/.tmp-pack-smoke.XXXXXX")"
export npm_config_cache="$TMP_DIR/.npm-cache"
export npm_config_loglevel=error
export LC_ALL=C
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

cd "$ROOT_DIR"

PACKAGE_NAME="$(node -p "const p=require('./package.json'); p.name.replace('@','').replace('/','-')")"
PACKAGE_VERSION="$(node -p "require('./package.json').version")"
TARBALL="$TMP_DIR/${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz"
CONSUMER_DIR="$TMP_DIR/consumer"

npm pack --ignore-scripts --pack-destination "$TMP_DIR" >/dev/null

if [[ ! -f "$TARBALL" ]]; then
  echo "Expected tarball not found: $TARBALL" >&2
  ls -la "$TMP_DIR" >&2
  exit 1
fi

mkdir -p "$CONSUMER_DIR/node_modules/@simon_he/s-three"
tar -xzf "$TARBALL" -C "$CONSUMER_DIR/node_modules/@simon_he/s-three" --strip-components=1

cat > "$CONSUMER_DIR/test-cjs.js" <<'EOF'
const { sThree } = require('@simon_he/s-three')
if (typeof sThree !== 'function')
  throw new Error('CJS import did not expose sThree function')
EOF

cat > "$CONSUMER_DIR/test-esm.mjs" <<'EOF'
import { sThree } from '@simon_he/s-three'
if (typeof sThree !== 'function')
  throw new Error('ESM import did not expose sThree function')
EOF

cat > "$CONSUMER_DIR/index.ts" <<'EOF'
import { sThree } from '@simon_he/s-three'

const fn: typeof sThree = sThree
console.log(typeof fn)
EOF

cat > "$CONSUMER_DIR/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["index.ts"]
}
EOF

node "$CONSUMER_DIR/test-cjs.js"
node "$CONSUMER_DIR/test-esm.mjs"
pnpm exec tsc -p "$CONSUMER_DIR/tsconfig.json"
