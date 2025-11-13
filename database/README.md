# Database Setup & Migrations

This directory contains database migrations and setup scripts for the Legal Will Generation Tool.

## Database Provider
- **Provider**: Supabase (PostgreSQL)
- **Environment**: Development and Production databases managed separately

## Running Migrations

### Development Environment (Replit)

Execute migrations using Supabase Dashboard:

1. **Navigate to Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy the migration file content from `database/migrations/001_create_increment_retry_function.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute

**Important**: Migrations must be run manually via Supabase Dashboard. There is no automated script due to Supabase RPC limitations.

### Production Environment

For production deployments:

1. Navigate to Supabase Project Dashboard
2. Go to **SQL Editor** → **New Query**
3. Run migrations in order:
   - `001_create_increment_retry_function.sql`
4. Verify function creation:
   ```sql
   SELECT routine_name, routine_type 
   FROM information_schema.routines 
   WHERE routine_name = 'increment_notification_retry';
   ```

## Migrations

### 001_create_increment_retry_function.sql
**Purpose**: Creates atomic retry increment function with user authorization

**Features**:
- Atomic transaction using `SELECT FOR UPDATE`
- User ownership validation
- Prevents race conditions
- Maximum retry count enforcement
- `SECURITY INVOKER` for RLS compliance

**Required by**: Notifications & Alerts System

## Database Schema

### Main Tables
- `profiles` - User profile data
- `wills` - Will documents with status and metadata
- `notifications` - System notifications with retry tracking

### Functions
- `increment_notification_retry(notification_id, requesting_user_id, max_retries)` - Atomic retry counter

## Security

All database objects follow these security principles:
1. **Row Level Security (RLS)** enabled on all tables
2. **SECURITY INVOKER** on functions to respect RLS
3. **User ownership validation** in all critical operations
4. **Authenticated access only** via JWT tokens
