import { useState } from 'react';

interface UseGeminiOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface UseGeminiReturn {
  generateContent: (prompt: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useGemini(options: UseGeminiOptions = {}): UseGeminiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: options.model || 'gemini-1.5-flash',
          temperature: options.temperature || 1,
          maxTokens: options.maxTokens || 8192,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      return data.text;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while generating content';
      setError(errorMessage);
      console.error('Gemini error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    isLoading,
    error,
  };
} 