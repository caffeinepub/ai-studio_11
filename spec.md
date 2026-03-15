# AI Studio

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Home page with hero section, feature cards, and navigation to generators
- Image Generator page: prompt, style dropdown, size dropdown; calls POST /images/generations; shows result image with download + regenerate
- Video Generator page: prompt, duration dropdown; calls POST /video/generate; shows video player with download
- Voice Generator page: text input, voice dropdown, speed slider; calls POST /audio/speech; shows audio player with download
- AI Chat page: chat input, send button, conversation interface; calls POST /chat/completions
- User login/auth system (Internet Identity)
- Generation history saved per user (image, video, voice, text)
- Credit usage system (display credits, deduct on generation)
- Dark mode UI throughout
- Loading spinners and error states on all generator pages

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select components: authorization, http-outcalls, blob-storage
2. Generate Motoko backend:
   - User auth via authorization component
   - HTTP outcalls to https://agentrouter.org/v1/ for all 4 generation endpoints
   - Store generation history records per user (type, prompt, result URL/data, timestamp)
   - Credit system: default credits on signup, deduct per generation, query balance
3. Frontend:
   - React Router for page navigation (Home, Image, Video, Voice, Chat)
   - Sidebar or top nav with page links
   - Home page: hero + 4 feature cards
   - Generator pages each with form, loading state, result display, error state
   - History page/panel showing past generations
   - Credits display in header
   - Dark mode default with toggle
   - Responsive layout
