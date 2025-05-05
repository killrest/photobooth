# Yoyobooth - Free Online Photo Booth

Turn your home into a free photobooth with exclusive templates, trendy filters, and fun stickers—beautiful results every time.

## Features

- Take photos directly from your browser
- Apply various templates and effects
- Share your creations instantly
- Support the project through donations

## Live Demo

Visit [https://freephotobooth.app](https://freephotobooth.app) to see the application in action.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/photobooth.git
   cd photobooth
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file and add the following:
   ```
   # Stripe API Keys
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   
   # Domain for success/cancel URLs
   NEXT_PUBLIC_DOMAIN_URL=http://localhost:3000
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set the following environment variables in Vercel:
   - `STRIPE_SECRET_KEY` (use production key for live site)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (use production key for live site)
   - `NEXT_PUBLIC_DOMAIN_URL` (your production domain)

## Built With

- Next.js - React framework
- Tailwind CSS - Styling
- Stripe - Payment processing

## License

This project is licensed under the MIT License.
