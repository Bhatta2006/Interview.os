# 🔐 Vercel Production Environment Setup

Copy and paste these values into your [Vercel Project Settings > Environment Variables](https://vercel.com/docs/projects/environment-variables).

## Generated Secrets (Safe to Use)
```env
# Signs "Refresh Tokens" for long-lived sessions
REFRESH_SECRET=0d7eb6afa2dd8704a798cdc6fac80a8559c32de5fe4528cfcc7d081d836487d0a

# Protects your Daily Cron Jobs from attackers
CRON_SECRET=b0117676270498f5d72dfd5f50a78e4bd28fc3066ce77a4619f8116547d0ecf6

# Protects forms against CSRF attacks
CSRF_SECRET=9ac63be88337c93cd90b630772fbe66f46605559ef73dabd5e13ddb9d8d540ef3

# Existing JWT Secret (Keep this if you have existing users, or generate new)
JWT_SECRET=super-secret-key-change-this
```

## Required External Keys (You must provide these)
```env
# Your Production Database (Supabase / Neon / RDS)
DATABASE_URL="postgresql://user:pass@host:port/db?pgbouncer=true"

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_OAUTH_CLIENT="your-client-id"
GOOGLE_OAUTH_SECRET="your-client-secret"
```

## ⚠️ Important Actions
1.  **Add these variables** to Vercel.
2.  **Redeploy** the project to apply changes.
3.  **Run Migration**: In your local terminal, run this to push the schema to your PROD DB:
    ```bash
    # (Replace DATABASE_URL in your local .env temporarily, or use the flag)
    npx prisma db push
    ```
