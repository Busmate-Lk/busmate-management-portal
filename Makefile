.PHONY: help db-schema db-reference db-backup db-all

# Default target - show help
help:
	@echo "BusMate Database Export Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  make db-schema     - Export database schema (for version control)"
	@echo "  make db-reference  - Export reference/lookup table data"
	@echo "  make db-backup     - Create full database backup with timestamp"
	@echo "  make db-all        - Run all export operations"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - Set DATABASE_URL environment variable"
	@echo "  - Install PostgreSQL client tools (pg_dump, psql)"
	@echo ""
	@echo "Example:"
	@echo "  export DATABASE_URL='postgresql://user:pass@localhost:5432/busmate'"
	@echo "  make db-all"

# Export database schema only (for version control)
db-schema:
	@bash db/scripts/export-schema.sh

# Export reference data tables (for version control)
db-reference:
	@bash db/scripts/export-reference.sh

# Create full database backup with timestamp
db-backup:
	@bash db/scripts/export-full.sh

# Run all database exports
db-all:
	@bash db/scripts/export-all.sh
