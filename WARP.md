# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Primary Commands (run from root)
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the web application  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint on web app
- `pnpm typecheck` - Run TypeScript type checking

### Database Commands
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations in development
- `pnpm db:seed` - Seed the database with sample data

### Package Manager
- Uses `pnpm` with workspace configuration
- All commands should be run from the repository root
- Package manager version is pinned to `pnpm@10.18.0`

## Architecture Overview

### Monorepo Structure
This is a pnpm workspace with a clear separation of concerns:

- **`apps/web/`** - Next.js 15 application (main frontend)
- **`packages/core/`** - Shared business logic, schemas, and utilities
- **`packages/services/`** - Service layer with entitlements and guards
- **`packages/db/`** - Database layer with Prisma schema and migrations

### Multi-tenant SaaS Architecture
The application is built as a multi-tenant SaaS platform:

- **Tenant Model**: Each tenant has modules that can be enabled/disabled
- **Module System**: Features like `bookings`, `pos`, `finance` are modular
- **Entitlements**: The `@nexablend/services` package provides entitlement checking
- **Guards**: Route and API protection based on tenant entitlements

### Key Architectural Patterns

**Entitlements System**:
- `getEntitlements(tenantId)` returns a Set of enabled module keys
- `requireModule()` function guards API routes and pages
- Modules: `"bookings" | "pos" | "finance"`
- Status: `"ACTIVE" | "PAST_DUE" | "CANCELLED"`

**Money Handling**:
- VAT rate configured as 15% (South African market)
- Timezone: `Africa/Johannesburg`
- Utility functions for inclusive/exclusive price calculations
- All monetary calculations use `round2()` for precision

**Database**:
- PostgreSQL with Prisma ORM
- Schema located in `packages/db/prisma/schema.prisma`
- Tenant-based data isolation
- Module activation tracking per tenant

### Technology Stack
- **Frontend**: Next.js 15 with React 19, Turbopack, Tailwind CSS v4
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM v5.22
- **Validation**: Zod schemas in `@nexablend/core`
- **Type Safety**: TypeScript throughout

### Development Context
- South African business context (VAT rate, timezone)
- Multi-tenant architecture requiring tenant context in all operations
- Modular feature system allowing granular access control
- Early development stage with placeholder tenant ID ("demo")