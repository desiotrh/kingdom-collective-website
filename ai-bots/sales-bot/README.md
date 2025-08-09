# Sales Bot - Kingdom Studios

A modern, interactive sales assistant chatbot built with Next.js and TypeScript. Features dual personality modes: **Kingdom Studios** (premium/royal) and **Marketplace** (standard/sales-focused).

## 🚀 Features

- **Dual Personality Modes**: Toggle between Kingdom Studios (royal/premium) and Marketplace (standard/sales) tones
- **Real-time Chat**: Interactive conversation with simulated AI responses
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Custom Avatars**: Dynamic flame avatars that change based on selected tone
- **Message Flow Logic**: Predefined responses for common sales queries
- **TypeScript**: Fully typed for better development experience

## 🗂️ Project Structure

```
sales-bot/
├── public/
│   ├── flame-gold.svg          # Kingdom Studios flame icon
│   ├── flame-blue.svg          # Marketplace flame icon
├── pages/
│   ├── index.tsx               # Main bot page
│   └── _app.tsx               # App wrapper with global styles
├── components/
│   ├── ChatWindow.tsx         # Full chat logic and UI
│   ├── ChatAvatar.tsx         # Dynamic flame avatar
│   └── ToneToggle.tsx         # Marketplace vs Kingdom toggle
├── styles/
│   └── globals.css            # Global styles and Tailwind
├── utils/
│   └── messages.ts            # Static flow logic and responses
├── ENV_SETUP.md              # Environment variables guide
└── package.json
```

## 🛠️ Tech Stack

- **Next.js 15** - React framework with Pages Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd sales-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Usage

### Toggle Between Modes

Use the toggle switch in the top-right corner to switch between:

- **Kingdom Studios Mode**: Premium, royal-themed responses with higher pricing
- **Marketplace Mode**: Standard sales-focused responses with competitive pricing

### Chat Features

- **Real-time messaging**: Type and send messages instantly
- **Auto-scroll**: Chat automatically scrolls to new messages
- **Loading states**: Visual feedback during response generation
- **Keyboard shortcuts**: Press Enter to send messages

### Sample Conversations

**Kingdom Studios Mode:**

- "What's your pricing?" → Premium packages starting at $997
- "Show me a demo" → Royal-themed presentation offers
- "What features do you have?" → Kingdom-specific features

**Marketplace Mode:**

- "What's your pricing?" → Competitive packages starting at $497
- "Show me a demo" → Standard portfolio and case studies
- "What features do you have?" → Standard platform features

## 🔧 Configuration

### Environment Variables

See `ENV_SETUP.md` for optional configuration:

- **Stripe Keys**: Enable payment processing
- **Zapier Webhook**: Enable CRM integration
- **API URL**: Configure backend endpoints

### Customization

#### Adding New Responses

Edit `utils/messages.ts` to add new message flows:

```typescript
{
  id: 'custom-response',
  trigger: ['keyword1', 'keyword2'],
  response: "Your custom response here",
  tone: 'kingdom' // or 'marketplace'
}
```

#### Styling

Modify `styles/globals.css` for custom styles or update Tailwind classes in components.

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Assign subdomain: `salesbot.kingdomcollective.pro`

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🎯 Features in Detail

### ChatWindow Component

- **State Management**: Uses React hooks for message history and UI state
- **Auto-scroll**: Automatically scrolls to new messages
- **Loading States**: Shows typing indicators during response generation
- **Responsive Design**: Adapts to different screen sizes

### ChatAvatar Component

- **Dynamic Icons**: Changes based on selected tone
- **Animated Effects**: Glow effect for Kingdom mode
- **Gradient Backgrounds**: Different color schemes for each mode

### ToneToggle Component

- **Smooth Transitions**: Animated toggle between modes
- **Visual Feedback**: Color changes indicate current mode
- **Accessible**: Proper ARIA labels and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@kingdomstudios.com or create an issue in the repository.

---

**Built with ❤️ by Kingdom Studios**
