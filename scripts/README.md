# Demo Data Scripts

This directory contains scripts for managing demo data for the Toys to Stories application.

## Upload Demo Data

The `upload-demo-data.js` script uploads demo data to Vercel Blobs, which can then be loaded into the application by triple-clicking the home image.

### Prerequisites

1. Set up your demo data in the browser by creating toys and stories
2. Export the data from localStorage to JSON files:
   - `userData.json`: Contains the user's language, reading level, and toys
   - `stories.json`: Contains the user's stories

You can export the data from localStorage using the browser's developer tools:

1. Open the browser's developer tools (F12 or Ctrl+Shift+I)
2. Go to the "Application" tab
3. Select "Local Storage" in the left sidebar
4. Find the keys `userData` and `stories`
5. Copy the values and save them to `scripts/userData.json` and `scripts/stories.json` respectively

### Usage

Run the script with the Vercel Blob read-write token:

```bash
BLOB_READ_WRITE_TOKEN=your_token node scripts/upload-demo-data.js
```

### Loading Demo Data

Once the demo data is uploaded to Vercel Blobs, users can load it by triple-clicking the home image on the home page.

## How It Works

1. The `upload-demo-data.js` script uploads the demo data to Vercel Blobs
2. The `/api/demo-data` API route fetches the latest demo data from Vercel Blobs
3. When a user triple-clicks the home image, the demo data is loaded into localStorage
4. The user is redirected to the toys page, where they can see the demo data
