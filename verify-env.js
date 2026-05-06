
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Checking Environment Variables...')
if (supabaseUrl && supabaseUrl.startsWith('https://')) {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set correctly.')
} else {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing or invalid.')
}

if (supabaseAnonKey) {
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is present.')
} else {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.')
}
