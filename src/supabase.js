import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nnidxufnykutfpszfjja.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaWR4dWZueWt1dGZwc3pmamphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzE0MTksImV4cCI6MjA5NDI0NzQxOX0.sxZOApxZOXSey3iz_ZTjZh9Qnz6_aNxHs7_YZY7b7wM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
