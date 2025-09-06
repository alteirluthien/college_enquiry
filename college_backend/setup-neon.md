# Neon Database Setup Guide

## Step 1: Create Neon Account and Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project named "college-enquiry"
3. Copy your connection string from the Neon dashboard

## Step 2: Update Environment Variables

Replace the DATABASE_URL and DIRECT_URL in your `.env` file with your actual Neon connection string:

```env
# Replace these with your actual Neon connection string
DATABASE_URL="postgresql://username:password@ep-your-endpoint.region.aws.neon.tech/college_enquiry?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-your-endpoint.region.aws.neon.tech/college_enquiry?sslmode=require"
```

## Step 3: Generate Prisma Client and Deploy

Run these commands after updating your .env:

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Deploy database schema to Neon
npx prisma db push

# Optional: View your database
npx prisma studio
```

## Step 4: Test the Connection

Start your server and test:

```bash
node server.js
```

## Your Neon Connection String Format

Your connection string should look like this:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

Example:
```
postgresql://john_doe:abc123@ep-cool-darkness-123456.us-east-1.aws.neon.tech/college_enquiry?sslmode=require
```

## Troubleshooting

- Make sure to include `?sslmode=require` at the end
- Ensure your IP is allowed (Neon allows all IPs by default)
- Check that the database name matches what you created in Neon
- Verify username and password are correct