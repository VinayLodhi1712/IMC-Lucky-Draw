# IMC Lucky Draw - Setup Instructions

## Local Development Setup

### Backend (Node.js/Express)
1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node api.js
   # OR for development with auto-reload:
   npm run dev
   ```
   Backend will run on: `http://localhost:5000`

### Frontend (Next.js)
1. Navigate to project root:
   ```bash
   cd ../
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```
   Frontend will run on: `http://localhost:3000`

## Environment Configuration

### Automatic Fallback Feature
The app now includes automatic fallback between local and deployed backends:
- If local backend (localhost:5000) fails, it automatically tries the deployed backend
- If deployed backend fails, it automatically tries the local backend
- No need for manual switching!

### Environment Files:
- `.env` - Local development (points to localhost:5000)
- `.env.production` - Production deployment (points to Render)
- `.env.example` - Template file with instructions

### Manual Backend Selection:
Edit `.env` file to specify which backend to use:

**For Local Backend:**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

**For Deployed Backend:**
```env
NEXT_PUBLIC_API_URL="https://imc-lucky-draw.onrender.com"
```

**For Automatic Detection (Recommended):**
```env
# Leave empty or comment out for automatic detection
# NEXT_PUBLIC_API_URL=""
```

## Deployment Ready

### Frontend Deployment (Vercel):
1. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://imc-lucky-draw.onrender.com
   SECRET=vinay
   ```

2. The app will automatically work with the deployed backend

### Backend Deployment (Render):
- Already configured with proper CORS for both local and deployed frontends
- No additional configuration needed

## Key Features

### ✅ Deployment Compatibility
- Works with both local and deployed environments
- Automatic environment detection
- Proper CORS configuration for all scenarios

### ✅ Automatic Fallback
- If one backend fails, automatically tries the other
- Better reliability and development experience
- No manual intervention required

### ✅ Easy Switching
- Simply change one environment variable
- Restart frontend to apply changes
- No complex configuration needed

## API Endpoints
- `/Login` - User authentication
- `/property_random-winner_1` - Get 1st property winner
- `/property_random-winner_2` - Get 2nd property winners
- `/property_random-winner_3` - Get 3rd property winners
- `/water_random-winner_1` - Get 1st water winner
- `/water_random-winner_2` - Get 2nd water winners
- `/water_random-winner_3` - Get 3rd water winners
- `/property_random-zone-winners/:zoneNumber` - Get zone property winners
- `/water_random-zone-winners/:zoneNumber` - Get zone water winners
- `/GenerateExcel` - Export property winners to Excel
- `/GenerateExcelWater` - Export water winners to Excel

## Database
- MongoDB Atlas cluster
- Connection string in environment files

## Pushing to GitHub & Deployment

When you push these changes:

1. **Local Development**: Will continue working as before
2. **Vercel Deployment**: Will automatically use the deployed backend
3. **Render Backend**: Will accept requests from both local and deployed frontends
4. **Fallback**: If either backend is down, the app will try the other automatically

**Ready for deployment!** 🚀
