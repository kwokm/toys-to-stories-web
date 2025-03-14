declare namespace NodeJS {
  interface ProcessEnv {
    // UploadThing environment variables
    NEXT_PUBLIC_UPLOADTHING_APP_ID: string;
    UPLOADTHING_TOKEN: string;
    
    // Other environment variables
    BLOB_READ_WRITE_TOKEN: string;
    GEMINI_API_KEY: string;
    GOOGLE_GENERATIVE_AI_API_KEY: string;
    REPLICATE_API_TOKEN: string;
    
    // Add other environment variables here as needed
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
