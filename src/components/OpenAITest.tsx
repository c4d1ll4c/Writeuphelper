'use client';

import React from 'react';

export function OpenAITest() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const testOpenAI = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-openai');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test OpenAI API');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-accent/20 rounded-md bg-background/50">
      <h3 className="text-lg font-medium mb-2">OpenAI API Test</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Test if your OpenAI API key is properly configured.
      </p>

      <button
        onClick={testOpenAI}
        disabled={isLoading}
        className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test OpenAI API'}
      </button>

      {isLoading && (
        <div className="mt-3 p-3 bg-accent/10 rounded-md">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Testing OpenAI API configuration...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-800 rounded-md">
          <p className="text-sm font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-md">
          <p className="text-sm font-medium">Result:</p>
          <pre className="text-sm mt-1 overflow-auto p-2 bg-white rounded border border-green-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 