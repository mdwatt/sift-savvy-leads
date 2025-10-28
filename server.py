#!/usr/bin/env python3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from openai import OpenAI

app = Flask(__name__, static_folder='.')
CORS(app)

client = OpenAI(
    api_key=os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY"),
    base_url=os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")
)

EXTRACTION_PROMPT = """You are a professional lead extraction assistant. Analyze the email content and extract business lead information.

CRITICAL FILTERING RULES:
1. REJECT if: Personal/family emails, casual conversations, newsletters, spam, promotional emails, phishing attempts
2. REJECT if: Generic greetings without specific business context, suspicious domains, threat language
3. ACCEPT only: Legitimate business inquiries with specific requests or proposals

Extract the following if it's a valid business lead:
- Contact Name: Full name of the person
- Email: Business email address
- Phone: Phone number if present
- Company: Company name
- Website: Company website URL if mentioned (without http/https prefix)
- LinkedIn: LinkedIn profile URL if mentioned (without http/https prefix)
- Intent: Brief description of what they want (1-2 sentences)
- Urgency Level: "High" (respond today), "Medium" (respond this week), or "Low" (no rush)
- Lead Score: Rate 1-10 based on clarity of intent, budget signals, decision-making authority
- Is Valid Lead: "yes" or "no" (reject personal emails, spam, newsletters)

If NOT a valid business lead, respond with:
{
  "is_valid_lead": "no",
  "reason": "[brief explanation why this was rejected]"
}

If it IS a valid business lead, respond with:
{
  "is_valid_lead": "yes",
  "contact_name": "...",
  "email": "...",
  "phone": "...",
  "company": "...",
  "website": "...",
  "linkedin": "...",
  "intent": "...",
  "urgency_level": "High/Medium/Low",
  "lead_score": X,
  "confidence": "High/Medium/Low"
}

Email content to analyze:
"""

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/extract', methods=['POST'])
def extract_lead():
    try:
        data = request.get_json()
        email_content = data.get('content', '').strip()
        
        if not email_content:
            return jsonify({'error': 'No content provided'}), 400
        
        if len(email_content) > 2000:
            return jsonify({'error': 'Content too long. Maximum 2000 characters.'}), 400
        
        # Call OpenAI for extraction
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a lead extraction expert. Always respond with valid JSON only."},
                {"role": "user", "content": EXTRACTION_PROMPT + email_content}
            ],
            temperature=0.3,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        
        # Parse and return the result
        import json
        lead_data = json.loads(result)
        
        return jsonify(lead_data)
        
    except Exception as e:
        print(f"Error extracting lead: {str(e)}")
        return jsonify({'error': 'Failed to process request. Please try again.'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
