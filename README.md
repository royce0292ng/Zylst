# Zylst
Zylst is a simple wishlist and event-sharing platform that helps people share what they want for birthdays, Christmas, and special occasions. It’s designed for friends and families who want an easy, stress-free way to give the right gifts without duplicates.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Management](#database-management)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## Features

- ✨ Create and manage wishlists for events
- 📝 Add items with details (name, description, price, links, tags)
- ✅ Mark items as completed with animated checkboxes
- 📅 Set event dates with countdown
- 🏷️ Categorize items with priority levels
- 📊 Track progress with live statistics
- 📱 Fully responsive design (mobile & desktop)
- 💾 PostgreSQL database with Prisma ORM
- 🚀 Server Actions for real-time updates
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL 15+ installed (or access to a PostgreSQL database)
- npm or yarn package manager

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/royce0292ng/Zylst.git
cd zylst
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL (Arch Linux)**
```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Initialize database
sudo -u postgres initdb -D /var/lib/postgres/data

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

In PostgreSQL prompt:
```sql
CREATE DATABASE zylst;
CREATE USER zylst WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE zylst TO zylst;
ALTER USER zylst CREATEDB;
\c zylst
GRANT ALL ON SCHEMA public TO zylst;
\q
```

## Configuration

### 1. Create Environment File

Create `.env` in the project root:
```bash
cp .env.example .env
```

Or create manually:
```env
# Database Connection
DATABASE_URL="postgresql://zylst:your_password@localhost:5432/zylst"

# Application
NODE_ENV=development
```

### 2. Configure PostgreSQL Authentication (Local Only)

Edit `/var/lib/postgres/data/pg_hba.conf`:
```bash
sudo nano /var/lib/postgres/data/pg_hba.conf
```

Change authentication method to `md5`:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Running the Application

### 1. Set Up Database Schema
```bash
# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed initial data
npx prisma db seed
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### 3. Access Prisma Studio (Database GUI)
```bash
npx prisma studio
```

Opens at: `http://localhost:5555`

## Database Management

### View Data
```bash
npx prisma studio
```

### Create New Migration
```bash
npx prisma migrate dev --name description_of_change
```

### Reset Database
```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Run all migrations
4. Seed the database

### Backup Database
```bash
# PostgreSQL backup
pg_dump -U zylst zylst > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U zylst zylst < backup_20240101.sql
```

## Development

### Project Structure
```
zylst/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── wishlist.ts          # Server Actions
│   │   ├── wishlists/
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Server Component
│   │   │       └── WishlistClient.tsx # Client Component
│   │   └── page.tsx                  # Home page (redirect)
│   ├── components/
│   │   └── wishlist/                 # Reusable components
│   ├── lib/
│   │   └── prisma.ts                 # Prisma Client
│   └── types/
│       └── wishlist.ts               # TypeScript types
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Seed data
├── .env                              # Environment variables
├── package.json
└── README.md
```

### Key Files

**`prisma/schema.prisma`** - Database schema definition
**`src/app/actions/wishlist.ts`** - Server-side data operations
**`src/lib/prisma.ts`** - Database client singleton
**`src/types/wishlist.ts`** - TypeScript type definitions

### Adding New Features

1. **Update Database Schema**
```bash
   # Edit prisma/schema.prisma
   npx prisma migrate dev --name feature_name
```

2. **Create Server Actions**
```typescript
   // src/app/actions/yourfeature.ts
   'use server';
   import { prisma } from '@/lib/prisma';
```

3. **Update UI Components**
```typescript
   // src/app/wishlists/[id]/WishlistClient.tsx
```

### Code Style

- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Server Actions for mutations
- Implement optimistic updates for better UX

## Deployment

### Option 1: Docker (Recommended)

1. **Build Docker Image**
```bash
   docker build -t zylst .
```

2. **Run with Docker Compose**
```bash
   docker-compose up -d
```

3. **View Logs**
```bash
   docker-compose logs -f
```

4. **Stop Application**
```bash
   docker-compose down
```

## Troubleshooting

### Common Issues

**1. "Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**2. "Database connection error"**
- Check `.env` DATABASE_URL is correct
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Test connection: `psql -U zylst -d zylst -h localhost`

**3. "Permission denied to create database"**
```bash
sudo -u postgres psql -c "ALTER USER zylst CREATEDB;"
```

**4. "Port 3000 already in use"**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 
```

**5. "Prisma schema validation error"**
```bash
# Check Prisma version (should be 5.x)
npx prisma --version

# Downgrade if needed
npm uninstall prisma @prisma/client
npm install prisma@5.22.0 @prisma/client@5.22.0
```

### Debug Mode

Enable query logging:
```typescript
// src/lib/prisma.ts
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Checking Logs

**Development**
- Check terminal where `npm run dev` is running

**Production (PM2)**
```bash
pm2 logs zylst
```

**Docker**
```bash
docker-compose logs -f
```

## Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create new migration
npx prisma migrate reset # Reset database
npx prisma db pull       # Pull schema from database
npx prisma db push       # Push schema to database (dev only)
npx prisma generate      # Generate Prisma Client
npx prisma format        # Format schema file
```

### Docker
```bash
docker-compose up -d           # Start containers
docker-compose down            # Stop containers
docker-compose logs -f         # View logs
docker-compose restart         # Restart containers
docker-compose ps              # List containers
```

## Security Notes

### Production Checklist

- [ ] Change all default passwords
- [ ] Use strong DATABASE_URL password
- [ ] Enable firewall (ufw)
- [ ] Set up SSL/HTTPS
- [ ] Enable automatic security updates
- [ ] Set up regular database backups
- [ ] Use environment variables for secrets
- [ ] Disable Prisma Studio in production
- [ ] Set NODE_ENV=production

### Firewall Setup
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Performance Tips

1. **Enable Connection Pooling**
   - Use Supabase connection pooling
   - Or set up PgBouncer

2. **Database Indexes**
   - Already configured in `schema.prisma`
   - Monitor slow queries with Prisma logging

3. **Caching**
   - Next.js automatically caches Server Components
   - Use `revalidatePath()` to invalidate cache

4. **Optimize Images**
   - Use Next.js Image component for item images

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

This project is licensed under the Apache License.

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/zylst/issues
- Documentation: https://github.com/yourusername/zylst/wiki

## Acknowledgments

- Built with Next.js and Prisma
- Icons by Lucide
- Styled with Tailwind CSS

---

**Current Version**: 0.0.1
**Last Updated**: January 2026