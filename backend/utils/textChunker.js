/**
 * Split text into chunks for better AI processing
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size per chunk (in words)
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    // Clean text while preserving paragraph structure
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/<\/?s+>/g, '')
        .replace(/\n /g, '\n')
        .replace(/\n\n/g, '\n')
        .trim();

    // Try to split by paragraphs (single or double newlines)
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // If single paragraph exceeds chunk size, split it by words
        if (paragraphWordCount > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            // Split large paragraph into word-based chunks
            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                
                if (i + chunkSize >= paragraphWords.length) break;
            }
            continue;
        }

        // If adding this paragraph exceeds chunk size, save current chunk
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            // Create overlap from previous chunk
            const prevChunkText = currentChunk.join('');
            const prevWords = prevChunkText.split(/\s+/);
            const overlapText = prevWords.slice(Math.max(prevWords.length - overlap, 0)).join(' ');

            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
        } else {
            // Add paragraph to current chunk
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;
        }
    }

    // Add the last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex,
            pageNumber: 0
        });
    }

    // Fallback: if no chunks created, split by words
    if (chunks.length === 0 && cleanedText.length > 0) {
        const allWords = cleanedText.split(' ').map(word => word.toLowerCase());
        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
            const chunkWords = allWords.slice(i, i + chunkSize);
            if (chunkWords.length > 0) {
                chunks.push({ 
                    content: chunkWords.join(' '), 
                    chunkIndex: chunkIndex++, 
                    pageNumber: 0 
                });
            }
            if (i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};

/**
 * Find relevant chunks based on keyword matching (Basic TF-IDF style scoring)
 * @param {Array<Object>} chunks - Array of chunks
 * @param {string} query - Search query
 * @param {number} maxChunks - Maximum chunks to return
 * @returns {Array<Object>}
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  // 1. Safety Checks
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  // 2. Define Stop Words (Common words that add no meaning to search)
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it'
  ]);

  // 3. Process the Query
  const queryWords = query
    .toLowerCase()
    .split(/\s+/) // Split by whitespace
    .filter(w => w.length > 2 && !stopWords.has(w)); // Remove short words & stop words

  // If no valid words remain, just return the first few chunks
  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map(chunk => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id
    }));
  }

  // 4. Score Every Chunk
  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    // Loop through every significant word in the user's query
    for (const word of queryWords) {
      // Exact word match (Higher priority)
      // Note: We use backticks (`) here so ${word} is actually inserted
      const exactRegex = new RegExp(`\\b${word}\\b`, 'g');
      const exactMatches = (content.match(exactRegex) || []).length;
      score += exactMatches * 3;

      // Partial match (Lower priority, e.g., "test" matches "testing")
      const partialRegex = new RegExp(word, 'g');
      const partialMatches = (content.match(partialRegex) || []).length;
      
      // We subtract exact matches so we don't double count
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    // Bonus: If the chunk contains MULTIPLE different words from the query
    const uniqueWordsFound = queryWords.filter(word => 
      content.includes(word)
    ).length;

    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    // Normalize score by length 
    // (Prevents long chunks from winning just because they have more words)
    const normalizedScore = score / Math.sqrt(contentWords || 1);

    // Position Bias: Slight preference for chunks earlier in the document
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchedWords: uniqueWordsFound
    };
  });

  // 5. Filter, Sort, and Return
  return scoredChunks
    .filter(chunk => chunk.score > 0) // Remove irrelevant chunks
    .sort((a, b) => {
      // Primary Sort: Highest Score
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary Sort: Most unique keywords found
      if (b.matchedWords !== a.matchedWords) {
        return b.matchedWords - a.matchedWords;
      }
      // Tertiary Sort: Original order (Chunk Index)
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};

