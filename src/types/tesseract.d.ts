declare module 'tesseract.js' {
  export interface Worker {
    loadLanguage(lang: string): Promise<void>;
    initialize(lang: string): Promise<void>;
    recognize(image: Buffer | string): Promise<{ data: { text: string } }>;
    terminate(): Promise<void>;
  }

  export interface WorkerOptions {
    logger?: (m: any) => void;
    errorHandler?: (e: any) => void;
    langPath?: string;
  }

  export function createWorker(options?: WorkerOptions): Promise<Worker>;
} 