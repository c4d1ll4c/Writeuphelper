'use client';

import React from "react";
import { TaskList, generateTextFormat, copyToClipboard } from "@/lib/utils";

interface TextExportProps {
  taskList: TaskList;
}

export function TextExport({ taskList }: TextExportProps) {
  const [copied, setCopied] = React.useState(false);
  let formattedText = '';
  
  try {
    formattedText = generateTextFormat(taskList);
  } catch (error) {
    formattedText = "Error generating task text. Please try again.";
  }
  
  const handleCopy = async () => {
    const success = await copyToClipboard(formattedText);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-2">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent flex items-center"
        >
          {copied ? (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                />
              </svg>
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
      <textarea
        className="w-full rounded-md bg-background border border-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/30 hover:border-accent/50 transition-all duration-200 p-4 font-mono text-sm"
        value={formattedText}
        readOnly
        rows={20}
        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
      />
      <p className="text-xs text-muted-foreground">
        Click in the text field to select all content, or use the copy button above.
      </p>
    </div>
  );
} 