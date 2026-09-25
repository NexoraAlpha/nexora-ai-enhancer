# Nexora AI Enhancer

Starter Vercel app for:
- Photo AI upscaling using Replicate Real-ESRGAN.
- Video enhancement UI prepared for an asynchronous GPU pipeline.

## Deploy
1. Upload this project to GitHub.
2. Import it into Vercel.
3. Add `REPLICATE_API_TOKEN` in Vercel Environment Variables.
4. Deploy.

## Important architecture note
Do not send large videos through a Vercel Serverless Function. Vercel documents a 4.5 MB function payload limit. For production video processing, upload directly to object storage (Supabase Storage/Vercel Blob), then send the resulting URL to an asynchronous GPU worker. This starter deliberately blocks large files so it doesn't pretend the serverless endpoint can handle them.

## Photo model
The endpoint uses `nightmareai/real-esrgan`. Model availability, pricing, and inputs can change, so verify the current Replicate model page before production launch.

## Next production step
Implement:
Storage upload → job row → GPU processing worker → progress polling/realtime → output storage → download.
