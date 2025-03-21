
import * as pdfjs from 'pdfjs-dist';
import { toast } from "sonner";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Supported file types
export const SUPPORTED_FILE_TYPES = ['.pdf', '.txt', '.doc', '.docx'];

/**
 * Extract text from PDF file using PDF.js with optimized processing
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
    
    // Process pages in larger chunks to improve performance
    const CHUNK_SIZE = 25; // Increased from 10 to 25 pages at a time
    let fullText = '';
    
    // Use a lower-level approach for text extraction to improve performance
    const processPage = async (page: any) => {
      try {
        const textContent = await page.getTextContent({
          normalizeWhitespace: true, // Normalize whitespace for better text quality
          disableCombineTextItems: false // Combine text items for better performance
        });
        return textContent.items.map((item: any) => item.str).join(' ');
      } catch (err) {
        console.error("Error extracting text from page:", err);
        return ""; // Return empty string on error to continue processing
      }
    };
    
    // Process pages in chunks
    for (let i = 0; i < numPages; i += CHUNK_SIZE) {
      const pagePromises = [];
      const endPage = Math.min(i + CHUNK_SIZE, numPages);
      
      // Create promises for each page in the current chunk
      for (let pageNum = i + 1; pageNum <= endPage; pageNum++) {
        pagePromises.push(
          pdfDoc.getPage(pageNum).then(processPage)
        );
      }
      
      // Process all pages in the current chunk concurrently
      const pageTexts = await Promise.all(pagePromises);
      
      // Append the text from the current chunk of pages
      fullText += pageTexts.join('\n');
      
      // Update progress for large documents less frequently to reduce UI updates
      if (numPages > 50 && i + CHUNK_SIZE < numPages && (i % 50) === 0) {
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
 * Optimized to create more efficient chunks
 */
export function chunkDocument(text: string, maxChunkSize: number = 8000): string[] {
  // More sophisticated chunking by paragraphs that respects document structure
  const paragraphs = text.split('\n').filter(p => p.trim());
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the max size
    if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + paragraph;
    }
    
    // If a paragraph is itself longer than maxChunkSize, split it
    if (paragraph.length > maxChunkSize) {
      const words = paragraph.split(' ');
      let subChunk = '';
      
      for (const word of words) {
        if (subChunk.length + word.length > maxChunkSize) {
          if (subChunk) {
            chunks.push(subChunk);
          }
          subChunk = word;
        } else {
          subChunk += (subChunk ? ' ' : '') + word;
        }
      }
      
      if (subChunk) {
        currentChunk = subChunk;
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}
