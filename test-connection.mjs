import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jcfjgswrnucdsciwamzo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZmpnc3dybnVjZHNjaXdhbXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzQwMzksImV4cCI6MjA3NDcxMDAzOX0.WM-yy71mPc-yk0Ge2BSoq4xo8PaXSwqehribAgKbXfQ'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔗 Testing Supabase connection...')

try {
  // Test basic connection
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .limit(1)
  
  if (error) {
    if (error.code === 'PGRST116') {
      console.log('✅ Connection successful!')
      console.log('⚠️  Database tables not found - schema needs to be created')
      console.log('\n📋 Next steps:')
      console.log('1. Go to: https://supabase.com/dashboard/project/jcfjgswrnucdsciwamzo')
      console.log('2. Click "SQL Editor" in the left sidebar')
      console.log('3. Copy the contents of "supabase/schema.sql"')
      console.log('4. Paste and run the SQL query')
      console.log('5. Run this test again: npm run test:connection')
    } else {
      console.error('❌ Connection error:', error.message)
      console.error('Error details:', error)
    }
  } else {
    console.log('✅ Database connection successful!')
    console.log(`📊 Found ${data.length} records in companies table`)
    console.log('🚀 IVA is ready to run!')
  }
} catch (err) {
  console.error('❌ Connection failed:', err.message)
}