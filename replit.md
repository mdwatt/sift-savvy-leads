# Sift Savvy Landing Page

## Overview
Interactive landing page for Sift Savvy, an AI-powered inbox lead extraction platform. Features a live demo that lets visitors test lead extraction with their own email content.

## Project Structure
- `index.html` - Main landing page with embedded CSS and JavaScript (includes interactive demo)
- `server.py` - Flask backend serving static files and AI lead extraction API
- `assets/` - Media files (demo video, sample data, images)
- `favicon.ico` - Site favicon
- `siftsavvy-logo.png` - Logo image

## Technology Stack
- **Frontend**: Pure HTML/CSS/JavaScript (no framework)
- **Backend**: Flask + Python
- **AI**: OpenAI (via Replit AI Integrations) for lead extraction
- **Analytics**: Google Analytics (GA4), Google Ads, Reddit Pixel

## Server Configuration
- Flask app on port 5000
- Host: 0.0.0.0 (to support Replit's proxy/iframe setup)
- CORS enabled for API endpoints

## Recent Changes
- **2025-10-28**: Interactive lead extraction demo added
  - Added Flask backend with `/api/extract` endpoint
  - Integrated OpenAI for AI-powered lead extraction
  - Implemented smart filtering (personal emails, spam, newsletters rejected)
  - Added interactive demo section with text area and real-time extraction
  - 3-attempt rate limiting using browser localStorage
  - Visual results display with urgency badges and lead scoring
  - Tested and validated with business and personal email samples
  
- **2025-10-28**: Initial Replit setup
  - Configured Python HTTP server for static file serving
  - Set up workflow to serve on port 5000
  - Added .gitignore for Replit environment
  - Configured deployment for production hosting

## Features
- **Interactive Lead Extraction Demo**: Test AI extraction with 3 free attempts
  - Extracts: contact name, email, phone, company, intent
  - AI urgency detection (High/Medium/Low)
  - Lead scoring (1-10 scale)
  - Smart filtering of personal emails, spam, newsletters
  - Character counter and loading states
  - Color-coded urgency badges
- Responsive design with mobile support
- Fake door modal for early access/lead capture
- Analytics tracking for user interactions
- Embedded demo video with poster
- Sample CSV-Excel download
- Product Hunt integration

## API Endpoints
- `GET /` - Main landing page
- `POST /api/extract` - Lead extraction endpoint
  - Request: `{"content": "email text"}`
  - Response: Lead data or rejection reason
  - Rate limit: Client-side (3 attempts via localStorage)

## Deployment
- GitHub repository sync enabled (can push changes back to GitHub)
- Compatible with external hosting (Render, Vercel, etc.)
- Autoscale deployment configured for Replit hosting
