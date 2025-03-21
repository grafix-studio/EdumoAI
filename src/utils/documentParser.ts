
import * as pdfjs from 'pdfjs-dist';
import { toast } from "sonner";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Supported file types
export const SUPPORTED_FILE_TYPES = ['.pdf', '.txt', '.doc', '.docx'];

/**
 * Extract text from PDF file using PDF.js
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdfDoc = await pdfjs.getDocument({data: arrayBuffer}).promise;
    
    // Get the total number of pages
    const numPages = pdfDoc.numPages;
    
    // Show toast for large documents
    if (numPages > 30) {
      toast.info(`Processing ${numPages} pages. This might take a moment...`);
    }
    
    // Process pages in chunks to handle large documents
    const CHUNK_SIZE = 10; // Process 10 pages at a time
    let fullText = '';
    
    // Process pages in chunks
    for (let i = 0; i < numPages; i += CHUNK_SIZE) {
      const pagePromises = [];
      const endPage = Math.min(i + CHUNK_SIZE, numPages);
      
      // Create promises for each page in the current chunk
      for (let pageNum = i + 1; pageNum <= endPage; pageNum++) {
        pagePromises.push(
          pdfDoc.getPage(pageNum).then(async page => {
            const textContent = await page.getTextContent();
            // Extract text from the page
            return textContent.items.map((item: any) => item.str).join(' ');
          })
        );
      }
      
      // Process all pages in the current chunk concurrently
      const pageTexts = await Promise.all(pagePromises);
      
      // Append the text from the current chunk of pages
      fullText += pageTexts.join('\n');
      
      // Update progress for large documents
      if (numPages > 30 && i + CHUNK_SIZE < numPages) {
        toast.info(`Processed ${endPage} of ${numPages} pages...`);
      }
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Extract text from a text file
 */
export async function extractTextFromTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read text file'));
    };
    reader.readAsText(file);
  });
}

/**
 * Parse document content from various file types
 */
export async function parseDocument(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  } else if (fileName.endsWith('.txt')) {
    return extractTextFromTextFile(file);
  } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
    // For simplicity, let the user know we can't process these yet
    throw new Error("DOC/DOCX files are not supported yet. Please convert to PDF or text.");
  } else {
    throw new Error(`Unsupported file type. Please upload ${SUPPORTED_FILE_TYPES.join(', ')}`);
  }
}

/**
 * Chunk a document into smaller segments to handle large documents
 */
export function chunkDocument(text: string, maxChunkSize: number = 8000): string[] {
  // Simple chunking by paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim());
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + paragraph;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}
