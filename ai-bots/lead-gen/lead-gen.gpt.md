# MANTLED AI – Lead Generation Chatbot (Typebot JSON Generator)

🧠 PURPOSE:  
Generate a GPT-powered chatbot that collects leads by asking about user goals, needs, and contact info. Built for coaches, service providers, and digital product creators.

🎯 FEATURES:
- Custom welcome message
- Tone selector (Casual, Professional, Fun)
- Faith Mode toggle (optional encouragement + scripture)
- 3-step lead qualification (pain points, goals, budget/timeline)
- Lead capture (Name, Email, Phone)
- Lead magnet delivery (optional PDF/freebie)
- TikTok funnel-optimized CTA
- Optional upsell (book a call, buy now, etc.)
- Final thank-you message
- “Powered by Mantled Ai” tag (removable)
- Optional analytics event hook (conversion tracking)

---

## 🔁 PROMPT TO RUN:

Generate a Typebot-compatible JSON file for a lead gen chatbot with:

1. **Welcome Block**:
   - Ask user if they want help improving their business/life/etc.
   - Display tone selector (Casual, Professional, Fun)
   - Display Faith Mode toggle (Yes/No)

2. **Tone + Faith Logic**:
   - Store tone and Faith Mode as variables
   - Apply tone style to future messages
   - If Faith Mode = Yes → insert brief encouragement + scripture

3. **Lead Qualifying Blocks**:
   - Ask: “What’s your biggest challenge right now?”
   - Ask: “What’s your #1 goal for the next 90 days?”
   - Ask: “What timeline or budget are you working with?”

4. **Lead Capture**:
   - Input: Full Name
   - Input: Email Address
   - Input: Phone (optional)

5. **Freebie Delivery (optional)**:
   - Ask: “Would you like my free guide to [insert goal]?”
   - If Yes → display PDF/download button

6. **Upsell Panel**:
   - “Want direct help or coaching? Tap here to book a free call.”
   - Include calendar/scheduling link

7. **Final Block**:
   - Thank the user by name
   - Remind them to check their email
   - Show “Powered by Mantled Ai” (in smaller text)

8. **Bot Exit / Share Options**:
   - Button to copy/share link
   - Optional embed code + TikTok bio instructions (if requested)

---

📦 Output format: A complete JSON block ready for Typebot import  
🛠 Store output as: `lead-gen.json` inside the `/lead-gen` folder  
📎 Include variables and logic flow for tone + Faith Mode switches  
📲 Add emojis and spacing in tone-based outputs for realism  
✅ Validate syntax and structure for Typebot

---

# Extras

You can modify:
- The bot name (default: Mantled Lead Assistant)
- The flow steps for specific industries
- The call-to-action links or lead magnet file

Let’s build and sell this. 