const renderCodeWithColorization = (code) => {
  // Define styles for syntax highlighting (using VS Code Dark+ theme colors)
  const styles = {
    keyword: { color: '#569CD6', fontWeight: 'bold' },
    function: { color: '#DCDCAA' },
    string: { color: '#CE9178' },
    number: { color: '#B5CEA8' },
    operator: { color: '#D4D4D4' },
    variable: { color: '#9CDCFE' },
    comment: { color: '#6A9955', fontStyle: 'italic' },
  };

  // Define regex patterns for different token types
  const tokenPatterns = {
    comment: /(?:\/\/.*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|#.*|--.*)/g, // Single and multi-line comments
    string: /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/g, // Strings
    function: /\b([a-zA-Z_]\w*)\s*(?=\()/g, // Function names
    keyword: /\b(const|let|if|else|return|def|function|for|while|class|import|export)\b/g, // Keywords
    number: /\b\d+(\.\d+)?\b/g, // Numbers
    operator: /[+\-*/%=&|!<>]=?/g, // Operators
    variable: /\b[a-zA-Z_]\w*\b/g, // Variables
  };

  // Tokenize the code
  const tokens = [];
  let remainingCode = code;

  while (remainingCode) {
    let match = null;
    let matchedType = null;

    // Find the first match among token patterns
    for (const [type, pattern] of Object.entries(tokenPatterns)) {
      pattern.lastIndex = 0;
      const regexMatch = pattern.exec(remainingCode);
      if (regexMatch && (!match || regexMatch.index < match.index)) {
        match = regexMatch;
        matchedType = type;
      }
    }

    // Handle unmatched text
    if (!match) {
      tokens.push({ text: remainingCode, type: null });
      break;
    }

    // Add plain text before the matched token
    if (match.index > 0) {
      tokens.push({ text: remainingCode.slice(0, match.index), type: null });
    }

    // Add the matched token
    tokens.push({ text: match[0], type: matchedType });

    // Update the remaining code
    remainingCode = remainingCode.slice(match.index + match[0].length);
  }

  // Render the tokens with syntax highlighting
  const renderedTokens = tokens.map((token, index) => {
    const uniqueId = `${token.text}-${index}`;

    return (
      <span key={uniqueId}>
        {/* Render the token with its corresponding color style */}
        <span style={styles[token.type] || {}}>
          {token.text}
        </span>
      </span>
    );
  });

  return <>{renderedTokens}</>;
};
const renderCodeWithPopups = (code, elementId) => {
  if (typeof code !== 'string') return null;
  // Tokenize the code
  const tokens = code.split(/(\s+|[.,!?;(){}[\]])/).filter(Boolean); // Tokenize the code
  const elementPopups = popups[elementId] || []; // Get the popups for the element

  const renderTokens = tokens.map((token, index) => {
      const uniqueId = `${token}-${index}`; // Create a unique ID for each token
      const matchedPopups = elementPopups.filter((p) => p.word_or_phrase === uniqueId); // Detect all matching popups for the token

      // If there are any popups matched for the token, apply the popup-related logic
      return (
          <span key={uniqueId} style={{ display: 'inline' }}>
              {/* Check if there are matching popups for the token */}
              {matchedPopups.length > 0 ? (
                  <span
                      onClick={() => handleWordClick(elementId, uniqueId, token.trim())} // Handle word click event
                      style={{
                          textDecoration: 'underline', // Underline the token if it has matching popups
                          textDecorationColor: '#e47234', // Custom underline color
                          cursor: 'pointer', // Change cursor to pointer
                      }}
                  >
                      {token} {/* Display the token with a popup link */}
                  </span>
              ) : (
                  <span style={{ cursor: 'default' }}>{token}</span> // Default rendering if no popups are matched
              )}
          </span>
      );
  });

  return <>{renderTokens}</>;
};