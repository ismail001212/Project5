import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!text) return; // Prevent running effect if text is falsy (e.g., undefined or empty string)

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);  // Clean up interval when component unmounts or text changes
  }, [text, speed]);

  return <span dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

export default TypingEffect;
