#!/bin/bash
# =============================================================================
# import-wp-images.sh
# Step 1: Copies ALL images from public/assets/uploads → public/assets/images
#         (preserving folder structure, skipping duplicates)
# Step 2: Resolves the specific filenames expected by the Next.js code by
#         searching for keyword-matching files and copying to exact paths.
# Usage: bash scripts/import-wp-images.sh
# =============================================================================

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/assets/uploads"
DEST="$ROOT/public/assets/images"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
miss() { echo -e "${RED}  ✗${NC} $1"; }
info() { echo -e "${YELLOW}  →${NC} $1"; }

if [ ! -d "$SRC" ]; then
  echo -e "${RED}Source folder not found: $SRC${NC}"
  exit 1
fi

echo ""
echo "============================================"
echo " Orion Solutions — Image Importer"
echo "============================================"
echo " Source : $SRC"
echo " Dest   : $DEST"
echo ""

# ── STEP 1: Create subfolders ─────────────────────────────────────────────────
echo "[ Creating destination folders ]"
mkdir -p \
  "$DEST" \
  "$DEST/team" \
  "$DEST/blog" \
  "$DEST/portfolio" \
  "$DEST/resources" \
  "$DEST/partners" \
  "$DEST/certs"
ok "All subfolders ready"
echo ""

# ── STEP 2: Bulk copy everything from uploads → images ────────────────────────
echo "[ Copying all WordPress images (bulk) ]"
total_before=$(find "$DEST" -type f | wc -l)

# rsync preferred (skips existing, shows progress); fall back to cp -r
if command -v rsync &>/dev/null; then
  rsync -a --ignore-existing \
    --include="*.jpg" --include="*.jpeg" --include="*.png" \
    --include="*.webp" --include="*.svg" --include="*.gif" \
    --include="*.ico" --include="*/" --exclude="*" \
    "$SRC/" "$DEST/"
  rsync_status=$?
  if [ $rsync_status -eq 0 ]; then
    ok "rsync complete"
  else
    info "rsync had warnings (non-fatal)"
  fi
else
  # Fallback: copy while preserving directory structure
  find "$SRC" -type f \( \
    -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
    -o -iname "*.webp" -o -iname "*.svg" -o -iname "*.gif" \
    -o -iname "*.ico" \
  \) | while read -r file; do
    rel="${file#$SRC/}"
    dest_file="$DEST/$rel"
    dest_dir="$(dirname "$dest_file")"
    mkdir -p "$dest_dir"
    [ -f "$dest_file" ] || cp "$file" "$dest_file"
  done
  ok "Copy complete (rsync not available, used cp)"
fi

total_after=$(find "$DEST" -type f | wc -l)
info "Files copied: $((total_after - total_before))  (total in dest: $total_after)"
echo ""

# ── STEP 3: Resolve specific filenames expected by Next.js code ───────────────
echo "[ Resolving specific Next.js image paths ]"

# Search the entire DEST (including year/month subfolders from WP) by keyword
find_image() {
  local keyword="$1"
  local result
  for ext in jpg jpeg png webp svg gif; do
    result=$(find "$DEST" -iname "*${keyword}*.$ext" 2>/dev/null | head -1)
    [ -n "$result" ] && echo "$result" && return
  done
}

resolve_image() {
  local keyword="$1"
  local dest_path="$2"
  local label="$3"

  [ -f "$dest_path" ] && ok "$label  (already in place)" && return

  local src
  src=$(find_image "$keyword")
  if [ -n "$src" ]; then
    local ext="${src##*.}"
    local final_dest="${dest_path%.*}.$ext"
    cp "$src" "$final_dest"
    [ "$final_dest" != "$dest_path" ] && cp "$src" "$dest_path"
    ok "$label  →  $(basename "$src")"
  else
    miss "$label  (no file with keyword '$keyword' found)"
  fi
}

# Logo
resolve_image "logo"               "$DEST/logo.png"         "logo.png"
resolve_image "favicon"            "$DEST/favicon.png"      "favicon.png"

# Team
resolve_image "rajiv"              "$DEST/team/rajiv.jpg"   "team/rajiv.jpg"
resolve_image "elena"              "$DEST/team/elena.jpg"   "team/elena.jpg"
resolve_image "david"              "$DEST/team/david.jpg"   "team/david.jpg"
resolve_image "samira"             "$DEST/team/samira.jpg"  "team/samira.jpg"
resolve_image "priya"              "$DEST/team/priya.jpg"   "team/priya.jpg"
resolve_image "marcus"             "$DEST/team/marcus.jpg"  "team/marcus.jpg"
resolve_image "jordan"             "$DEST/team/jordan.jpg"  "team/jordan.jpg"
resolve_image "aisha"              "$DEST/team/aisha.jpg"   "team/aisha.jpg"

# Blog
resolve_image "cloud-cost"         "$DEST/blog/cloud-cost.jpg"      "blog/cloud-cost.jpg"
resolve_image "ai-enterprise"      "$DEST/blog/ai-enterprise.jpg"   "blog/ai-enterprise.jpg"
resolve_image "zero-trust"         "$DEST/blog/zero-trust.jpg"      "blog/zero-trust.jpg"
resolve_image "architecture"       "$DEST/blog/architecture.jpg"    "blog/architecture.jpg"

# Portfolio
resolve_image "fintech"            "$DEST/portfolio/fintech.jpg"         "portfolio/fintech.jpg"
resolve_image "healthcare"         "$DEST/portfolio/healthcare.jpg"      "portfolio/healthcare.jpg"
resolve_image "ecommerce"          "$DEST/portfolio/ecommerce.jpg"       "portfolio/ecommerce.jpg"
resolve_image "manufacturing"      "$DEST/portfolio/manufacturing.jpg"   "portfolio/manufacturing.jpg"

# Resources
resolve_image "cloud-migration"    "$DEST/resources/cloud-migration-guide.jpg" "resources/cloud-migration-guide.jpg"
resolve_image "ai-report"          "$DEST/resources/ai-report.jpg"             "resources/ai-report.jpg"
resolve_image "digital-transform"  "$DEST/resources/dt-roi.jpg"                "resources/dt-roi.jpg"
resolve_image "data-mesh"          "$DEST/resources/data-mesh.jpg"             "resources/data-mesh.jpg"
resolve_image "finops"             "$DEST/resources/finops-webinar.jpg"        "resources/finops-webinar.jpg"

# Partners
resolve_image "aws"                "$DEST/partners/aws.svg"          "partners/aws.svg"
resolve_image "azure"              "$DEST/partners/azure.svg"        "partners/azure.svg"
resolve_image "google-cloud"       "$DEST/partners/gcp.svg"          "partners/gcp.svg"
resolve_image "salesforce"         "$DEST/partners/salesforce.svg"   "partners/salesforce.svg"
resolve_image "snowflake"          "$DEST/partners/snowflake.svg"    "partners/snowflake.svg"
resolve_image "databricks"         "$DEST/partners/databricks.svg"   "partners/databricks.svg"
resolve_image "crowdstrike"        "$DEST/partners/crowdstrike.svg"  "partners/crowdstrike.svg"
resolve_image "hashicorp"          "$DEST/partners/hashicorp.svg"    "partners/hashicorp.svg"

# Certs
resolve_image "iso27001"           "$DEST/certs/iso27001.svg"  "certs/iso27001.svg"
resolve_image "soc2"               "$DEST/certs/soc2.svg"      "certs/soc2.svg"
resolve_image "iso9001"            "$DEST/certs/iso9001.svg"   "certs/iso9001.svg"
resolve_image "cmmi"               "$DEST/certs/cmmi.svg"      "certs/cmmi.svg"

# OG image
resolve_image "og-image"           "$DEST/og-image.jpg"  "og-image.jpg"
resolve_image "social"             "$DEST/og-image.jpg"  "og-image.jpg (alt)"

echo ""

# ── SUMMARY ──────────────────────────────────────────────────────────────────
echo "============================================"
total_final=$(find "$DEST" -type f | wc -l)
echo -e " ${GREEN}Done.${NC} $total_final total image files in $DEST"
echo ""
echo " Any ✗ above means no file with that keyword was found."
echo " Rename the file so it contains the keyword and re-run."
echo "============================================"
echo ""
