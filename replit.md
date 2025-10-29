# Sift Savvy Landing Page

## Overview
Streamlined, conversion-focused landing page for Sift Savvy, an AI-powered inbox lead extraction platform. Features an interactive demo that lets visitors test lead extraction with their own email content.

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

## Deployment Configuration
- `.gitignore` - Excludes Replit-specific files (pyproject.toml, uv.lock, attached_assets) from GitHub
- `.renderignore` - Excludes development artifacts from Render deployment
- Render uses only `requirements.txt` for Python dependencies

## Recent Changes
- **2025-10-29**: Converted to production WSGI server (Gunicorn)
  - Added Gunicorn 22.0.0 to requirements.txt for production deployment
  - Render start command: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 4 --timeout 120 server:app`
  - Production-ready configuration replaces Flask development server
  - Deployed as Web Service on Render (not Static Site)
  - Custom domain: https://leads.siftsavvy.com
  - Architect Agent verified all endpoints functional with Gunicorn

- **2025-10-28**: Fixed Render deployment issue (permanent fix)
  - Root cause: Service was configured as Static Site instead of Web Service
  - Solution: Recreated as Web Service + updated .gitignore/.renderignore to exclude venv/
  - Added /api/test-openai endpoint for OpenAI connection diagnostics
  - Enhanced error logging with detailed stack traces for production debugging
  - Server.py verified working in both dev and production environments


- **2025-10-28**: Implemented production-ready 24-hour auto-refresh rate limiting
  - Rate limiting now uses timestamped state (count + resetAt) instead of simple counter
  - Attempts automatically refresh every 24 hours without page reload
  - Countdown timer shows "0 attempts left — refreshes in Xh Ym" when exhausted
  - Users regain 3 attempts automatically when timer elapses (in-session)
  - Edge cases handled: corrupt data, multi-tab sync, network errors don't consume attempts
  - Production-ready: No manual localStorage clearing required (F12 workaround removed)
  - Architect Agent verified complete functionality and best practices maintained

- **2025-10-28**: Added Website and LinkedIn extraction fields
  - Hero section example now displays website and LinkedIn profile
  - Updated demo placeholder text with website and LinkedIn examples
  - "How it works" section mentions website and LinkedIn extraction
  - Backend AI prompt updated to extract website and LinkedIn URLs
  - Frontend JavaScript displays website and LinkedIn fields when present
  - API tested successfully - extracts all fields including new additions
  - Architect Agent verified all functionality working properly and best practices maintained

- **2025-10-28**: Moved interactive demo higher for better conversion flow
  - Demo section ("Try It Now") now appears immediately after hero
  - New page flow: Hero → Interactive Demo → How It Works → Product Hunt → Final CTA
  - Captures visitor engagement while attention is highest
  - Architect Agent verified all functionality preserved and best practices maintained

- **2025-10-28**: Landing page streamlined for conversions
  - Updated hero messaging to target solopreneurs, small business owners, freelancers, marketers, recruiters, entrepreneurs
  - Removed Automation, Evidence/Testimonials, Pricing, and FAQ sections
  - Added Product Hunt community section
  - Added strong final CTA section with "Go to Main App" button
  - Reduced from 663 to 586 lines (77 lines removed)
  
- **2025-10-28**: Interactive lead extraction demo added
  - Added Flask backend with `/api/extract` endpoint
  - Integrated OpenAI for AI-powered lead extraction
  - Implemented smart filtering (personal emails, spam, newsletters rejected)
  - Added interactive demo section with text area and real-time extraction
  - Production-ready rate limiting: 3 attempts every 24 hours with auto-refresh
  - Visual results display with urgency badges and lead scoring
  - Tested and validated with business and personal email samples
  
- **2025-10-28**: Initial Replit setup
  - Configured Python HTTP server for static file serving
  - Set up workflow to serve on port 5000
  - Added .gitignore for Replit environment
  - Configured deployment for production hosting

## Features
- **Interactive Lead Extraction Demo (The Bot)**: Test AI extraction with 3 free attempts every 24 hours
  - Extracts: contact name, email, phone, company, website, LinkedIn, intent
  - AI urgency detection (High/Medium/Low)
  - Lead scoring (1-10 scale)
  - Smart filtering of personal emails, spam, newsletters
  - Character counter and loading states
  - Color-coded urgency badges
  - **24-hour auto-refresh**: Attempts automatically reset after 24h with live countdown timer
  - Production-ready: No manual browser cache clearing required
- **Streamlined Conversion Flow**: Focused page structure driving users to main app
- **Product Hunt Integration**: Community social proof
- **Multiple CTAs**: Strategic placement throughout page to main app
- Responsive design with mobile support
- Analytics tracking for user interactions
- Embedded demo video

## API Endpoints
- `GET /` - Main landing page
- `POST /api/extract` - Lead extraction endpoint
  - Request: `{"content": "email text"}`
  - Response: Lead data or rejection reason
  - Rate limit: Client-side (3 attempts per 24 hours, auto-refreshes)

## Target Audience
- Solopreneurs
- Small business owners
- Freelancers
- Marketers
- Recruiters
- Entrepreneurs

## Deployment
- GitHub repository sync enabled (can push changes back to GitHub)
- Compatible with external hosting (Render, Vercel, etc.)
- Autoscale deployment configured for Replit hosting
