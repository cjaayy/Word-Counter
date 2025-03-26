// DOM elements
const elements = {
  textInput: document.getElementById('text-input'),
  wordCount: document.getElementById('word-count'),
  charCount: document.getElementById('char-count'),
  charNoSpaces: document.getElementById('char-no-spaces'),
  sentenceCount: document.getElementById('sentence-count'),
  paragraphCount: document.getElementById('paragraph-count'),
  readingTime: document.getElementById('reading-time'),
  avgWordLength: document.getElementById('avg-word-length'),
  readabilityScore: document.getElementById('readability-score'),
  currentChars: document.getElementById('current-chars'),
  maxChars: document.getElementById('max-chars'),
  charLimit: document.getElementById('char-limit'),
  clearBtn: document.getElementById('clear-btn'),
  copyBtn: document.getElementById('copy-btn'),
  copyStatsBtn: document.getElementById('copy-stats-btn')
};

// Constants
const MAX_CHARS = 2000; // Character limit
const READING_SPEED = 225; // Words per minute for reading time calculation

// Update all counts when text changes
const updateCounts = () => {
  const text = elements.textInput.value;
  
  // Update character counts
  const chars = text.length;
  elements.currentChars.textContent = chars;
  elements.charCount.textContent = chars;
  
  // Update character limit status
  updateCharLimitStatus(chars);
  
  // Characters without spaces
  const charsNoSpaces = text.replace(/\s/g, '').length;
  elements.charNoSpaces.textContent = charsNoSpaces;
  
  // Word count
  const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
  elements.wordCount.textContent = words.length;
  
  // Sentence count
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
  elements.sentenceCount.textContent = sentences.length || 0;
  
  // Paragraph count
  const paragraphs = text.split(/\n+/).filter(para => para.trim() !== '');
  elements.paragraphCount.textContent = paragraphs.length || 0;
  
  // Reading time in seconds
  const readingTimeValue = Math.ceil((words.length / READING_SPEED) * 60);
  elements.readingTime.textContent = readingTimeValue;
  
  // Advanced statistics
  calculateAdvancedStats(text, words);
};

// Update character limit status
const updateCharLimitStatus = (chars) => {
  elements.charLimit.classList.remove('warning', 'danger');
  
  if (chars > MAX_CHARS * 0.8 && chars <= MAX_CHARS) {
    elements.charLimit.classList.add('warning');
  } else if (chars > MAX_CHARS) {
    elements.charLimit.classList.add('danger');
  }
};

// Calculate advanced statistics
const calculateAdvancedStats = (text, words) => {
  // Average word length
  if (words.length > 0) {
    const totalWordLength = words.join('').length;
    const avgLength = (totalWordLength / words.length).toFixed(1);
    elements.avgWordLength.textContent = avgLength;
  } else {
    elements.avgWordLength.textContent = '0';
  }
  
  // Readability score (simplified Flesch-Kincaid approach)
  if (words.length > 0 && parseInt(elements.sentenceCount.textContent) > 0) {
    const sentenceCount = parseInt(elements.sentenceCount.textContent);
    const wordCount = words.length;
    
    // Calculate average words per sentence
    const wordsPerSentence = wordCount / sentenceCount;
    let score = 0;
    
    if (wordsPerSentence < 10) {
      score = 1; // Very easy to read
    } else if (wordsPerSentence < 14) {
      score = 2; // Easy to read
    } else if (wordsPerSentence < 18) {
      score = 3; // Fairly easy to read
    } else if (wordsPerSentence < 22) {
      score = 4; // Standard/average
    } else if (wordsPerSentence < 26) {
      score = 5; // Fairly difficult
    } else {
      score = 6; // Difficult to read
    }
    
    elements.readabilityScore.textContent = score;
  } else {
    elements.readabilityScore.textContent = '0';
  }
};

// Clear the text
const clearText = () => {
  elements.textInput.value = '';
  updateCounts();
  elements.textInput.focus();
};

// Copy text to clipboard
const copyText = async () => {
  try {
    await navigator.clipboard.writeText(elements.textInput.value);
    showCopySuccess(elements.copyBtn);
  } catch (err) {
    // Fallback for older browsers
    elements.textInput.select();
    document.execCommand('copy');
    showCopySuccess(elements.copyBtn);
  }
};

// Copy statistics to clipboard
const copyStats = async () => {
  const stats = `
Word Counter Statistics:
Words: ${elements.wordCount.textContent}
Characters: ${elements.charCount.textContent}
Characters (no spaces): ${elements.charNoSpaces.textContent}
Sentences: ${elements.sentenceCount.textContent}
Paragraphs: ${elements.paragraphCount.textContent}
Reading Time: ${elements.readingTime.textContent} seconds
Average Word Length: ${elements.avgWordLength.textContent}
Readability Score: ${elements.readabilityScore.textContent}
  `.trim();
  
  try {
    await navigator.clipboard.writeText(stats);
    showCopySuccess(elements.copyStatsBtn);
  } catch (err) {
    // Fallback for older browsers
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = stats;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    showCopySuccess(elements.copyStatsBtn);
  }
};

// Show success animation
const showCopySuccess = (button) => {
  button.classList.add('copy-success');
  setTimeout(() => {
    button.classList.remove('copy-success');
  }, 600);
};

// Initialize
const init = () => {
  // Set max characters
  elements.maxChars.textContent = MAX_CHARS;
  
  // Set up event listeners
  elements.textInput.addEventListener('input', updateCounts);
  elements.clearBtn.addEventListener('click', clearText);
  elements.copyBtn.addEventListener('click', copyText);
  elements.copyStatsBtn.addEventListener('click', copyStats);
  
  // Initial counts
  updateCounts();
};

// Initialize on load
window.addEventListener('DOMContentLoaded', init);