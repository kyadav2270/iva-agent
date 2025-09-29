// Database setup script for IVA
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://jcfjgswrnucdsciwamzo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZmpnc3dybnVjZHNjaXdhbXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzQwMzksImV4cCI6MjA3NDcxMDAzOX0.WM-yy71mPc-yk0Ge2BSoq4xo8PaXSwqehribAgKbXfQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test connection
    const { data, error } = await supabase
      .from('companies')
      .select('count', { count: 'exact' })
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ Connection successful! Database schema not yet created.')
      console.log('\n📋 Next steps:')
      console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/jcfjgswrnucdsciwamzo')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and run the SQL from: supabase/schema.sql')
      console.log('4. After running the schema, test again with: node setup-database.js')
    } else if (error) {
      console.error('❌ Connection failed:', error.message)
      return
    } else {
      console.log('✅ Database connection successful!')
      console.log(`📊 Companies table exists with ${data.length} records`)
      
      // Test other tables
      const tables = ['evaluations', 'founders', 'market_insights', 'scoring_criteria']
      for (const table of tables) {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('count', { count: 'exact' })
        
        if (tableError) {
          console.log(`❌ ${table} table: ${tableError.message}`)
        } else {
          console.log(`✅ ${table} table: Ready`)
        }
      }
    }
    
    console.log('\n🚀 IVA Database Setup Complete!')
    console.log('You can now run: npm run dev')
    
  } catch (err) {
    console.error('❌ Setup failed:', err.message)
  }
}

setupDatabase()