#!/usr/bin/env bash

# Combined Export Runner
# Executes all database export scripts in sequence
# Use this for a complete database snapshot (schema, reference data, and full backup)

set -e

# Load helper functions and variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/helpers.sh"

# Main execution
main() {
  print_header "Running All Database Exports"
  
  local start_time=$(date +%s)
  
  print_info "This will run three export operations:"
  echo "  1. Schema export (for version control)"
  echo "  2. Reference data export (for version control)"
  echo "  3. Full backup (for disaster recovery)"
  echo ""
  
  # Track success/failure
  local failed_exports=()
  
  # Run schema export
  print_header "Step 1/3: Schema Export"
  if bash "${SCRIPT_DIR}/export-schema.sh"; then
    print_success "Schema export completed"
  else
    print_error "Schema export failed"
    failed_exports+=("schema")
  fi
  
  echo ""
  echo ""
  
  # Run reference data export
  print_header "Step 2/3: Reference Data Export"
  if bash "${SCRIPT_DIR}/export-reference.sh"; then
    print_success "Reference data export completed"
  else
    print_error "Reference data export failed"
    failed_exports+=("reference-data")
  fi
  
  echo ""
  echo ""
  
  # Run full backup
  print_header "Step 3/3: Full Backup"
  if bash "${SCRIPT_DIR}/export-full.sh"; then
    print_success "Full backup completed"
  else
    print_error "Full backup failed"
    failed_exports+=("full-backup")
  fi
  
  echo ""
  echo ""
  
  # Summary
  print_header "Export Summary"
  
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  
  if [ ${#failed_exports[@]} -eq 0 ]; then
    print_success "All exports completed successfully in ${duration} seconds"
    echo ""
    echo "Generated files in ${OUT_DIR}:"
    ls -lh "${OUT_DIR}/" | tail -n +2
    exit 0
  else
    print_error "Some exports failed: ${failed_exports[*]}"
    echo "Duration: ${duration} seconds"
    exit 1
  fi
}

# Run main function
main "$@"
