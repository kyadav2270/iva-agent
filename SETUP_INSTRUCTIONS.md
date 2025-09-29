# 🚀 IVA Database Setup Instructions

## ✅ Connection Status: SUCCESSFUL
Your Supabase connection is working perfectly! Now we just need to create the database tables.

## 📋 Step-by-Step Database Setup

### 1. Open Supabase Dashboard
Go to: **https://supabase.com/dashboard/project/jcfjgswrnucdsciwamzo**

### 2. Access SQL Editor
- Click **"SQL Editor"** in the left sidebar
- Click **"New Query"** button

### 3. Run the Schema
Copy the ENTIRE contents from `supabase/schema.sql` and paste into the SQL editor, then click **"Run"**.

The schema will create:
- ✅ `companies` table (startup information)
- ✅ `evaluations` table (AI analysis results)  
- ✅ `founders` table (founder profiles)
- ✅ `market_insights` table (market data)
- ✅ `scoring_criteria` table (investment criteria)
- ✅ All indexes and relationships
- ✅ Default Impression Ventures criteria data

### 4. Verify Setup
After running the schema, test the connection:
```bash
node test-connection.mjs
```

### 5. Start Development Server
Once the schema is created:
```bash
npm run dev
```

Then open: **http://localhost:3000**

## 🎯 What's Next

Once the database is set up, you can:
1. **Test with a real company** - Try "Stripe" or "Plaid"
2. **View the analysis results** in the dashboard
3. **Export investment memos** for partner review
4. **Scale to your deal pipeline**

## 🆘 Need Help?

If you encounter any issues:
1. Check that all SQL executed without errors
2. Refresh the Supabase dashboard
3. Ensure your API keys are correct in `.env.local`
4. Run the connection test again

**The system is ready - just waiting for the database schema! 🚀**