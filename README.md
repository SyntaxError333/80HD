# 80HD

## Put it online
1. Create a free Supabase project at https://supabase.com
2. Open SQL Editor, paste all of `supabase.sql`, and run it.
3. In Supabase > Project Settings > API, copy the Project URL and anon/public key.
4. Rename `.env.example` to `.env` and paste those values.
5. Run `npm install` then `npm run dev` to test locally.
6. Push this folder to GitHub and import it into Vercel at https://vercel.com
7. In Vercel Project Settings > Environment Variables add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then deploy.
8. In Supabase Authentication > URL Configuration, set Site URL to your Vercel URL and add the same URL under Redirect URLs.

Scoring: 100 points/hour + (10 × streak day), streak bonus capped at 100 points per submission/day.
