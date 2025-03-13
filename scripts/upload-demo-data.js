#!/usr/bin/env node

/**
 * This script uploads demo data to Vercel Blobs.
 * It takes the userData and stories from localStorage and uploads them to Vercel Blobs.
 *
 * Usage:
 * 1. First, set up your demo data in the browser by creating toys and stories
 * 2. Run this script to upload the demo data to Vercel Blobs
 *
 * Requirements:
 * - Node.js
 * - @vercel/blob package
 * - BLOB_READ_WRITE_TOKEN environment variable
 *
 * Example:
 * BLOB_READ_WRITE_TOKEN=your_token node scripts/upload-demo-data.js
 */

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

async function uploadDemoData() {
  try {
    // Check if the BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
      console.error('Please set it before running this script');
      console.error('Example: BLOB_READ_WRITE_TOKEN=your_token node scripts/upload-demo-data.js');
      process.exit(1);
    }

    // Check if the demo data files exist
    const userDataPath = path.join(__dirname, 'userData.json');
    const storiesPath = path.join(__dirname, 'stories.json');

    if (!fs.existsSync(userDataPath)) {
      console.error(`Error: ${userDataPath} does not exist`);
      console.error('Please create it by copying your userData from localStorage');
      process.exit(1);
    }

    if (!fs.existsSync(storiesPath)) {
      console.error(`Error: ${storiesPath} does not exist`);
      console.error('Please create it by copying your stories from localStorage');
      process.exit(1);
    }

    // Read the demo data files
    const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

    // Upload the demo data to Vercel Blobs
    console.log('Uploading userData to Vercel Blobs...');
    const userDataBlob = await put(`userdata-${Date.now()}.json`, JSON.stringify(userData), {
      access: 'public',
      contentType: 'application/json',
    });
    console.log('userData uploaded successfully:', userDataBlob.url);

    console.log('Uploading stories to Vercel Blobs...');
    const storiesBlob = await put(`stories-${Date.now()}.json`, JSON.stringify(stories), {
      access: 'public',
      contentType: 'application/json',
    });
    console.log('stories uploaded successfully:', storiesBlob.url);

    console.log('\nDemo data uploaded successfully!');
    console.log('You can now triple-click the home image to load this demo data');
  } catch (error) {
    console.error('Error uploading demo data:', error);
    process.exit(1);
  }
}

uploadDemoData();
