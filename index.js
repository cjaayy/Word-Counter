const textInput = document.getElementById('text-input');
        const wordCount = document.getElementById('word-count');
        const charCount = document.getElementById('char-count');
        const charNoSpaces = document.getElementById('char-no-spaces');
        const sentenceCount = document.getElementById('sentence-count');
        const paragraphCount = document.getElementById('paragraph-count');
        const readingTime = document.getElementById('reading-time');
        
        textInput.addEventListener('input', updateCounts);
        
        function updateCounts() {
            const text = textInput.value;
            
            // Word count
            const words = text.trim() ? text.trim().split(/\s+/) : [];
            wordCount.textContent = words.length;
            
            // Character count (with spaces)
            charCount.textContent = text.length;
            
            // Character count (without spaces)
            charNoSpaces.textContent = text.replace(/\s/g, '').length;
            
            // Sentence count (basic implementation)
            const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
            sentenceCount.textContent = sentences.length;
            
            // Paragraph count
            const paragraphs = text.split(/\n+/).filter(paragraph => paragraph.trim() !== '');
            paragraphCount.textContent = paragraphs.length;
            
            // Reading time (based on average reading speed of 225 words per minute)
            const readingTimeValue = Math.ceil(words.length / (225 / 60));
            readingTime.textContent = readingTimeValue;
        }
        
        // Initial update
        updateCounts();