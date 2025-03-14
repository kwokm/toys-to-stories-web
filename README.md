This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Cloud Text-to-Speech API Setup

To use the pronunciation generation feature, you'll need to set up Google Cloud Text-to-Speech API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project or select an existing one
2. Enable the Text-to-Speech API for your project
3. Create a service account with the "Cloud Text-to-Speech User" role
4. Create and download a JSON key file for this service account
5. There are two ways to authenticate with the Google Cloud API:
   
   ### Option 1: Using environment variables
   Add the following to your `.env.local` file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
   ```
   
   ### Option 2: Using credentials file
   Place your service account JSON file in a secure location, and set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to point to this file.

   ```bash
   # On Unix/Linux/macOS
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
   
   # On Windows
   set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your-service-account-key.json
   ```

### API Usage Example

```typescript
// Example of calling the pronunciation API
const response = await fetch('/api/pronunciations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    toys: ['teddy bear', 'train', 'building blocks'],
    options: {
      // Optional configuration
      languageCode: 'en-US',
      voiceName: 'en-US-Neural2-F',
    }
  }),
});

const data = await response.json();
console.log(data.results);
// Each result includes the toy name/object and pronunciation URL
```
