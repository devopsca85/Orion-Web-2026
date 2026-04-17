#!/bin/bash
# =============================================================================
# import-wp-images.sh
# Scans images already copied to public/assets/images and organises them
# into the correct subfolders expected by the Next.js site.
# Usage: bash scripts/import-wp-images.sh
# =============================================================================

DEST="$(cd "$(dirname "$0")/.." && pwd)/public/assets/images"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  !${NC} $1"; }
miss() { echo -e "${RED}  ✗${NC} $1"; }

if [ ! -d "$DEST" ]; then
  echo -e "${RED}Destination folder not found: $DEST${NC}"
  exit 1
fi

echo ""
echo "============================================"
echo " Orion Solutions — Image Organiser"
echo "============================================"
echo " Source : $DEST  (flat dump)"
echo " Dest   : $DEST  (organised into subfolders)"
echo ""

mkdir -p "$DEST/team" "$DEST/blog" "$DEST/portfolio" \
         "$DEST/resources" "$DEST/partners" "$DEST/certs"

# Find best matching image already in public/assets/images by keyword
find_image() {
  local keyword="$1"
  local extensions="jpg jpeg png webp svg"
  for ext in $extensions; do
    local result
    # Search recursively so it finds files already moved to subfolders too
    result=$(find "$DEST" -iname "*${keyword}*.$ext" 2>/dev/null | head -1)
    if [ -n "$result" ]; then
      echo "$result"
      return
    fi
  done
}

copy_image() {
  local keyword="$1"
  local dest_path="$2"
  local label="$3"

  # Skip if the exact destination already exists
  if [ -f "$dest_path" ]; then
    ok "$label  (already in place)"
    return
  fi

  local src
  src=$(find_image "$keyword")
  if [ -n "$src" ]; then
    local ext="${src##*.}"
    local final_dest="${dest_path%.*}.$ext"
    cp "$src" "$final_dest"
    # Also copy as the declared extension if different (code references specific extensions)
    if [ "$final_dest" != "$dest_path" ]; then
      cp "$src" "$dest_path"
    fi
    ok "$label  →  $(basename "$src")"
  else
    miss "$label  (not found — keyword: '$keyword')"
  fi
}

# ── LOGO ─────────────────────────────────────────────────────────────────────
echo "[ Logo ]"
copy_image "logo"        "$DEST/logo.png"         "logo.png"
copy_image "favicon"     "$DEST/favicon.png"      "favicon.png"
echo ""

# ── TEAM ─────────────────────────────────────────────────────────────────────
echo "[ Team / Leadership ]"
copy_image "rajiv"       "$DEST/team/rajiv.jpg"   "team/rajiv.jpg"
copy_image "elena"       "$DEST/team/elena.jpg"   "team/elena.jpg"
copy_image "david"       "$DEST/team/david.jpg"   "team/david.jpg"
copy_image "samira"      "$DEST/team/samira.jpg"  "team/samira.jpg"
copy_image "priya"       "$DEST/team/priya.jpg"   "team/priya.jpg"
copy_image "marcus"      "$DEST/team/marcus.jpg"  "team/marcus.jpg"
copy_image "jordan"      "$DEST/team/jordan.jpg"  "team/jordan.jpg"
copy_image "aisha"       "$DEST/team/aisha.jpg"   "team/aisha.jpg"
echo ""

# ── BLOG ─────────────────────────────────────────────────────────────────────
echo "[ Blog Images ]"
copy_image "cloud-cost"  "$DEST/blog/cloud-cost.jpg"      "blog/cloud-cost.jpg"
copy_image "finops"      "$DEST/blog/cloud-cost.jpg"      "blog/cloud-cost.jpg (alt)"
copy_image "ai-enterprise" "$DEST/blog/ai-enterprise.jpg" "blog/ai-enterprise.jpg"
copy_image "artificial-intelligence" "$DEST/blog/ai-enterprise.jpg" "blog/ai-enterprise.jpg (alt)"
copy_image "zero-trust"  "$DEST/blog/zero-trust.jpg"      "blog/zero-trust.jpg"
copy_image "security"    "$DEST/blog/zero-trust.jpg"      "blog/zero-trust.jpg (alt)"
copy_image "architecture" "$DEST/blog/architecture.jpg"   "blog/architecture.jpg"
copy_image "microservice" "$DEST/blog/architecture.jpg"   "blog/architecture.jpg (alt)"
echo ""

# ── PORTFOLIO ────────────────────────────────────────────────────────────────
echo "[ Portfolio / Case Studies ]"
copy_image "fintech"       "$DEST/portfolio/fintech.jpg"         "portfolio/fintech.jpg"
copy_image "banking"       "$DEST/portfolio/fintech.jpg"         "portfolio/fintech.jpg (alt)"
copy_image "healthcare"    "$DEST/portfolio/healthcare.jpg"      "portfolio/healthcare.jpg"
copy_image "medical"       "$DEST/portfolio/healthcare.jpg"      "portfolio/healthcare.jpg (alt)"
copy_image "ecommerce"     "$DEST/portfolio/ecommerce.jpg"       "portfolio/ecommerce.jpg"
copy_image "retail"        "$DEST/portfolio/ecommerce.jpg"       "portfolio/ecommerce.jpg (alt)"
copy_image "manufacturing" "$DEST/portfolio/manufacturing.jpg"   "portfolio/manufacturing.jpg"
copy_image "factory"       "$DEST/portfolio/manufacturing.jpg"   "portfolio/manufacturing.jpg (alt)"
echo ""

# ── RESOURCES ────────────────────────────────────────────────────────────────
echo "[ Resources ]"
copy_image "cloud-migration"  "$DEST/resources/cloud-migration-guide.jpg" "resources/cloud-migration-guide.jpg"
copy_image "ai-report"        "$DEST/resources/ai-report.jpg"             "resources/ai-report.jpg"
copy_image "zero-trust"       "$DEST/resources/zero-trust.jpg"            "resources/zero-trust.jpg"
copy_image "digital-transform" "$DEST/resources/dt-roi.jpg"               "resources/dt-roi.jpg"
copy_image "data-mesh"        "$DEST/resources/data-mesh.jpg"             "resources/data-mesh.jpg"
copy_image "finops"           "$DEST/resources/finops-webinar.jpg"        "resources/finops-webinar.jpg"
echo ""

# ── PARTNERS ─────────────────────────────────────────────────────────────────
echo "[ Partner Logos ]"
copy_image "aws"          "$DEST/partners/aws.svg"         "partners/aws.svg"
copy_image "azure"        "$DEST/partners/azure.svg"       "partners/azure.svg"
copy_image "google-cloud" "$DEST/partners/gcp.svg"         "partners/gcp.svg"
copy_image "salesforce"   "$DEST/partners/salesforce.svg"  "partners/salesforce.svg"
copy_image "snowflake"    "$DEST/partners/snowflake.svg"   "partners/snowflake.svg"
copy_image "databricks"   "$DEST/partners/databricks.svg"  "partners/databricks.svg"
copy_image "crowdstrike"  "$DEST/partners/crowdstrike.svg" "partners/crowdstrike.svg"
copy_image "hashicorp"    "$DEST/partners/hashicorp.svg"   "partners/hashicorp.svg"
echo ""

# ── CERTS ────────────────────────────────────────────────────────────────────
echo "[ Certification Logos ]"
copy_image "iso27001"  "$DEST/certs/iso27001.svg" "certs/iso27001.svg"
copy_image "iso-27001" "$DEST/certs/iso27001.svg" "certs/iso27001.svg (alt)"
copy_image "soc2"      "$DEST/certs/soc2.svg"     "certs/soc2.svg"
copy_image "soc-2"     "$DEST/certs/soc2.svg"     "certs/soc2.svg (alt)"
copy_image "iso9001"   "$DEST/certs/iso9001.svg"  "certs/iso9001.svg"
copy_image "cmmi"      "$DEST/certs/cmmi.svg"     "certs/cmmi.svg"
echo ""

# ── OG IMAGE ─────────────────────────────────────────────────────────────────
echo "[ OG / Social Share Image ]"
copy_image "og-image" "$DEST/og-image.jpg" "og-image.jpg"
copy_image "social"   "$DEST/og-image.jpg" "og-image.jpg (alt)"
echo ""

# ── SUMMARY ──────────────────────────────────────────────────────────────────
echo "============================================"
total=$(find "$DEST" -type f ! -name ".gitkeep" | wc -l)
echo -e " ${GREEN}Done.${NC} $total image files in $DEST"
echo ""
echo " Missing images above (✗) — rename those files so they contain"
echo " the keyword shown, then run this script again."
echo "============================================"
echo ""
