const SUPABASE_URL = "https://cdnwxerixgrgvrdsotaf.supabase.co"

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkbnd4ZXJpeGdyZ3ZyZHNvdGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTU4NjIsImV4cCI6MjA4ODI5MTg2Mn0.RWdHadeoNvjMHomUu158umWEcmlUXNLIF3TrFwgJy3k"

const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth:{
      persistSession:true,
      autoRefreshToken:true
    }
  }
)
