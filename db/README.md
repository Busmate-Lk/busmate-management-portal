# Database Export System

This directory contains scripts and tools for exporting the PostgreSQL database in multiple formats. The export system supports version control, reference snapshots, and full backups.

## 📁 Directory Structure

```
db/
├── dumps/              # Generated export files (git-ignored)
│   ├── schema.sql              # Database schema only
│   ├── reference-data.sql      # Reference table data
│   └── full-*.dump             # Timestamped full backups
├── scripts/            # Export shell scripts
│   ├── helpers.sh              # Shared functions and configuration
│   ├── export-schema.sh        # Schema export script
│   ├── export-reference.sh     # Reference data export script
│   ├── export-full.sh          # Full backup script
│   └── export-all.sh           # Combined export runner
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

1. **PostgreSQL Client Tools**: Ensure `pg_dump` and `psql` are installed
   ```bash
   # Check if tools are available
   which pg_dump psql
   ```

2. **Database URL**: Set the `DATABASE_URL` environment variable
   ```bash
   export DATABASE_URL='postgresql://username:password@localhost:5432/busmate'
   ```

### Running Exports

Use the Makefile commands from the project root:

```bash
# Export everything (recommended)
make db-all

# Individual exports
make db-schema      # Schema only
make db-reference   # Reference data only
make db-backup      # Full backup only
```

Or run scripts directly:

```bash
# From project root
bash db/scripts/export-all.sh

# Individual exports
bash db/scripts/export-schema.sh
bash db/scripts/export-reference.sh
bash db/scripts/export-full.sh
```

## 📋 Export Types

### 1. Schema Export (`schema.sql`)

**Purpose**: Version control of database structure

**What it includes**:
- Table definitions
- Indexes
- Constraints
- Views
- Functions
- Sequences

**What it excludes**:
- Data
- Ownership information
- Privileges/grants
- Comments (for cleaner diffs)

**When to use**:
- Before and after migrations
- To track schema changes in git
- To share structure with team members
- To initialize new environments

**Command**:
```bash
make db-schema
```

**Output**: `db/dumps/schema.sql`

**Restore**:
```bash
psql $DATABASE_URL < db/dumps/schema.sql
```

---

### 2. Reference Data Export (`reference-data.sql`)

**Purpose**: Version control of lookup/configuration data

**What it includes**:
- Data from specific reference tables (configured in `helpers.sh`)
- INSERT statements with column names
- Deterministic output for clean diffs

**What it excludes**:
- Schema definitions (assumes schema already exists)
- Transactional data
- User-generated data

**When to use**:
- To seed new environments
- To track changes in lookup values
- To share configuration across environments
- Before modifying reference data

**Command**:
```bash
make db-reference
```

**Output**: `db/dumps/reference-data.sql`

**Restore**:
```bash
# Assumes schema already exists
psql $DATABASE_URL < db/dumps/reference-data.sql
```

**Configured tables** (edit in `db/scripts/helpers.sh`):
- `roles`
- `permissions`
- `route_status`
- `vehicle_types`
- `fare_categories`
- `bus_types`

---

### 3. Full Backup Export (`full-<timestamp>.dump`)

**Purpose**: Complete database backup for disaster recovery

**What it includes**:
- Complete schema
- All data from all tables
- Compressed custom format

**What it excludes**:
- Ownership information (for portability)
- Privileges/grants

**When to use**:
- Before major changes
- Regular scheduled backups
- Before production deployments
- Point-in-time snapshots

**Command**:
```bash
make db-backup
```

**Output**: `db/dumps/full-2026-02-21_14-30-45.dump` (example)

**Restore**:
```bash
# Warning: -c flag drops existing objects
pg_restore -d $DATABASE_URL -v -c db/dumps/full-2026-02-21_14-30-45.dump

# Alternative: restore to a new empty database
pg_restore -d $NEW_DATABASE_URL -v db/dumps/full-2026-02-21_14-30-45.dump
```

**Selective restore**:
```bash
# List contents
pg_restore --list db/dumps/full-2026-02-21_14-30-45.dump

# Restore specific table
pg_restore -d $DATABASE_URL -t users db/dumps/full-2026-02-21_14-30-45.dump
```

---

### 4. Combined Export (`export-all.sh`)

Runs all three export types in sequence.

**Command**:
```bash
make db-all
```

**What it does**:
1. Exports schema
2. Exports reference data
3. Creates full backup
4. Shows summary of results

## 🔧 Configuration

### Adding Reference Tables

Edit `db/scripts/helpers.sh` and add table names to the `REFERENCE_TABLES` array:

```bash
readonly REFERENCE_TABLES=(
  "roles"
  "permissions"
  "route_status"
  "vehicle_types"
  "fare_categories"
  "bus_types"
  "your_new_table"  # Add your table here
)
```

### Setting Database URL

The scripts require the `DATABASE_URL` environment variable.

**Option 1**: Export in shell
```bash
export DATABASE_URL='postgresql://user:password@host:port/database'
```

**Option 2**: Load from `.env` file
```bash
# Add to .env (make sure it's in .gitignore!)
DATABASE_URL=postgresql://user:password@localhost:5432/busmate

# Load before running
source .env
make db-all
```

**Option 3**: Inline with command
```bash
DATABASE_URL='postgresql://...' make db-all
```

## 🛡️ Security Best Practices

1. **Never commit database dumps to git**
   - The `dumps/` directory should be in `.gitignore`
   - Schema and reference data are version controlled, not full backups

2. **Protect credentials**
   - Never hardcode passwords in scripts
   - Use environment variables or secure secret management
   - Keep `.env` files in `.gitignore`

3. **Backup rotation**
   - Full backups accumulate with timestamps
   - Implement a cleanup strategy for old backups
   - Consider automated archival to secure storage

4. **Access control**
   - Ensure database user has appropriate permissions
   - Use read-only user for schema exports if possible
   - Restrict backup access to authorized personnel

## 🔍 Troubleshooting

### "DATABASE_URL environment variable is not set"

**Solution**: Export the variable before running scripts
```bash
export DATABASE_URL='postgresql://user:password@localhost:5432/busmate'
```

### "pg_dump: command not found"

**Solution**: Install PostgreSQL client tools

**Ubuntu/Debian**:
```bash
sudo apt-get install postgresql-client
```

**macOS**:
```bash
brew install postgresql
```

**Check version**:
```bash
pg_dump --version
```

### "connection refused" or authentication errors

**Check**:
1. Database server is running
2. Host and port are correct
3. Username has connect permissions
4. Password is correct
5. Database name exists

**Test connection**:
```bash
psql $DATABASE_URL -c "SELECT version();"
```

### Empty or missing reference data

This is normal if:
- Reference tables are empty in the database
- Table names in `REFERENCE_TABLES` don't match actual table names

**Solution**: Verify table names match your schema:
```bash
psql $DATABASE_URL -c "\dt"
```

### "Permission denied" when running scripts

**Solution**: Make scripts executable
```bash
chmod +x db/scripts/*.sh
```

## 📅 Recommended Workflow

### Development

```bash
# Before starting work on schema changes
make db-schema

# Make your database changes
# ...

# After completing changes
make db-schema db-reference

# Commit to git
git add db/dumps/schema.sql db/dumps/reference-data.sql
git commit -m "Update database schema: add user preferences table"
```

### Before Deployment

```bash
# Create a full backup before deploying
make db-backup

# Archive the backup
cp db/dumps/full-*.dump ~/backups/pre-deploy-$(date +%Y%m%d).dump
```

### Regular Maintenance

```bash
# Weekly reference data snapshot
make db-reference

# Daily full backup (consider automation)
make db-backup

# Clean old backups (keep last 30 days)
find db/dumps -name "full-*.dump" -mtime +30 -delete
```

### Setting Up New Environment

```bash
# 1. Create database
createdb busmate

# 2. Restore schema
psql $DATABASE_URL < db/dumps/schema.sql

# 3. Restore reference data
psql $DATABASE_URL < db/dumps/reference-data.sql

# 4. (Optional) Restore full backup instead
pg_restore -d $DATABASE_URL db/dumps/full-2026-02-21_14-30-45.dump
```

## 🔗 Related Commands

### Useful PostgreSQL commands

```bash
# List all databases
psql $DATABASE_URL -c "\l"

# List all tables
psql $DATABASE_URL -c "\dt"

# Show table structure
psql $DATABASE_URL -c "\d table_name"

# Count rows in tables
psql $DATABASE_URL -c "SELECT schemaname,relname,n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC;"

# Database size
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

### Backup verification

```bash
# Check backup file size
ls -lh db/dumps/

# List backup contents
pg_restore --list db/dumps/full-*.dump | head -20

# Test restore (dry run)
pg_restore --list db/dumps/full-*.dump > /dev/null && echo "Backup file is valid"
```

## 📚 Additional Resources

- [PostgreSQL pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL pg_restore Documentation](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [PostgreSQL Backup Best Practices](https://www.postgresql.org/docs/current/backup.html)

## 🤝 Contributing

When modifying the export system:

1. Test changes on a non-production database
2. Verify all export types still work
3. Update this README if adding new features
4. Ensure scripts remain POSIX-compatible
5. Keep error messages clear and actionable
