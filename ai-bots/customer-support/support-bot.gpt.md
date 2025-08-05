# MANTLED AI – Customer Support Chatbot (Typebot JSON Generator)

🧠 PURPOSE:  
Build a customer support chatbot that helps businesses handle FAQs, order issues, product questions, and contact routing — saving time and reducing manual support.

🎯 FEATURES:
- Welcome message + brand tone selector
- Option to enable Faith Mode (scripture + grace-filled tone)
- FAQ menu with common categories (Shipping, Returns, Tech Support, etc.)
- Smart routing logic (choose a path → answer → offer escalation option)
- "Still need help?" contact form or escalation to human
- Optional file upload (e.g., receipt, screenshot)
- Powered by Mantled Ai footer (removable)
- Optional satisfaction rating (1–5 stars)

---

## 🔁 PROMPT TO RUN:

Generate a Typebot-compatible JSON for a customer support chatbot with:

1. **Welcome Block**:
   - “Hi! I’m here to help — how can I support you today?”
   - Let user choose a tone: Casual, Professional, Friendly
   - Offer Faith Mode toggle: Yes/No

2. **Tone & Faith Handling**:
   - Store selected tone and apply formatting accordingly
   - If Faith Mode = Yes → begin response with:  
     “🙏 You are seen and valued. Let’s get you helped!”

3. **Main Menu (User Choice)**:
   - Buttons: 📦 Shipping, 🔁 Returns, 🛠️ Tech Issues, ❓General Questions

4. **FAQ Flow**:
   For each option, display 2–3 relevant questions → user taps → gets GPT-style response

   Example for Shipping:
   - Q: “When will my order arrive?”
   - A: “Most orders ship within 48 hours...”

   Example for Returns:
   - Q: “Do you accept returns?”
   - A: “Yes, we have a 14-day return policy. Here’s how it works...”

5. **Still Need Help?**:
   - Ask: “Would you like to contact our support team directly?”
   - Input: Name, Email, Message
   - Optional: Upload file

6. **Satisfaction Rating (optional)**:
   - “How helpful was this chat?” → Emoji scale 1–5 stars
   - Store value for internal feedback

7. **Final Message**:
   - “Thanks for chatting with us!”
   - “If you enabled Faith Mode: 'May peace and clarity go with you today.'”
   - Display brand link or back to store
   - Show: “Powered by Mantled Ai” (small)

---

📦 Output format: Typebot-compatible JSON  
🧠 Store as: `support-bot.json`  
📍 Folder: `C:\Users\dezme\Chatbots\customer-support\`

---

# Extras

- Support topics can be adapted to match each business (e.g., digital vs physical)
- Escalation email can be routed with Zapier
- Add optional WhatsApp or Messenger handoff links if client prefers

Let’s reduce support load and increase clarity for clients — Mantled style 🔥 