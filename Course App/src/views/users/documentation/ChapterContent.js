import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CCol, CRow, CButton, CModal, CModalHeader, CModalBody } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilCheckCircle, cilClipboard, cilMediaPlay, cilNotes } from '@coreui/icons';
import axios from 'axios';
import './EnglishPage.css'; // Assuming you still want to keep the external CSS for general styles
import { useColorModes } from '@coreui/react';

const Contentchapter = () => {
    const { chapter_id } = useParams();
    const [content, setContent] = useState([]);
    const [popups, setPopups] = useState({});
    const [selectedWord, setSelectedWord] = useState('');
    const [selectedPopupContent, setSelectedPopupContent] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { colorMode } = useColorModes('coreui-free-react-admin-template-theme');
    const [isCopied, setIsCopied] = useState(false);
    const [showResult, setShowResult] = useState({});
    const [typedResult, setTypedResult] = useState({});
    const [textAlignment, setTextAlignment] = useState('left');
    const tocRef = useRef(null);
    const sectionRefs = useRef({});

    const languages = [
        { id: 1, name: 'Moroccan Arabic', displayName: 'الدارجة المغربية', flag: 'https://flagcdn.com/w320/ma.png', page: '/Categories' },
        { id: 2, name: 'Egyptian Arabic', displayName: 'العربية المصرية', flag: 'https://flagcdn.com/w320/eg.png', page: '/Categories' },
        { id: 3, name: 'French', displayName: 'Français', flag: 'https://flagcdn.com/w320/fr.png', page: '/Categories' },
        { id: 4, name: 'English', displayName: 'English', flag: 'https://flagcdn.com/w320/gb.png', page: '/Categories' },
        { id: 5, name: 'Classical Arabic', displayName: 'العربية الفصحى', flag: 'https://flagcdn.com/w320/sa.png', page: '/Categories' },
    ];

    const colors = {
        light: {
            keyword: '#9cff63',
            string: '#50FA7B',
            comment: '#6272A4',
            function: '#8BE9FD',
            method: '#FF79C6',
            special: '#BD93F9',
            variable: '#F1FA8C',
            operator: '#FFB86C',
            type: '#FF5555',
            constant: '#FF79C6',
            annotation: '#FF79C6',
            torch: '#FF79C6',
            tensorflow: '#FF6F61'
        },
        dark: {
            keyword: '#ff7b00',
            string: '#bd93f9',
            comment: '#6272a4',
            function: '#50fa7b',
            method: '#FF5555',
            special: '#FFB86C',
            variable: '#F1FA8C',
            operator: '#FF79C6',
            type: '#FF5555',
            constant: '#FF79C6',
            annotation: '#FF79C6',
            torch: '#FF79C6',
            tensorflow: '#FF6F61'
        },
        blue: {
            keyword: '#FFD700',
            string: '#87CEEB',
            comment: '#B0E0E6',
            function: '#7FFFD4',
            method: '#1E90FF',
            special: '#7B68EE',
            variable: '#FFB6C1',
            operator: '#FFA500',
            type: '#00FFFF',
            constant: '#FF69B4',
            annotation: '#FF69B4',
            torch: '#FF79C6',
            tensorflow: '#FF6F61'
        }
    };

    useEffect(() => {
        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'English';
        const language = languages.find(lang => lang.name === selectedLanguage);
        let calculatedAlignment = 'left';
        if (language && (language.name.includes('Arabic'))) {
            calculatedAlignment = 'right';
        }
        setTextAlignment(calculatedAlignment);
    }, []);

    useEffect(() => {
        if (chapter_id) {
            fetchAllContent(chapter_id)
                .then(async (data) => {
                    const allContent = [
                        ...data.titles.map((item) => ({ ...item, type: 'title' })),
                        ...data.subtitles.map((item) => ({ ...item, type: 'subtitle' })),
                        ...data.descriptions.map((item) => ({ ...item, type: 'description' })),
                        ...data.images.map((item) => ({ ...item, type: 'image' })),
                        ...data.codeSnippets.map((item) => ({ ...item, type: 'codeSnippet' })),
                        ...data.notes.map((item) => ({ ...item, type: 'note' })),
                        ...data.lists.map((item) => ({ ...item, type: 'list' })),
                    ];

                    allContent.sort((a, b) => a.index - b.index);
                    setContent(allContent);

                    const popupRequests = allContent.map((item) =>
                        axios.get(`http://localhost:5000/api/auth/popups/${item._id}`).then((res) => ({
                            elementId: item._id,
                            popups: res.data,
                        }))
                    );

                    try {
                        const popupResponses = await Promise.all(popupRequests);
                        const popupData = {};
                        popupResponses.forEach(({ elementId, popups }) => {
                            popupData[elementId] = popups;
                        });
                        setPopups(popupData);
                    } catch (error) {
                        console.error('Error fetching popups for elements:', error);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching content:', error);
                });
        }
    }, [chapter_id]);

    const fetchAllContent = async (chapter) => {
        try {
            const [titles, subtitles, descriptions, images, codeSnippets, notes, lists] = await Promise.all([
                axios.get(`http://localhost:5000/api/auth/titles/${chapter}`),
                axios.get(`http://localhost:5000/api/auth/subtitles/${chapter}`),
                axios.get(`http://localhost:5000/api/auth/descriptions/${chapter}`),
                axios.get(`http://localhost:5000/api/auth/images/${chapter}`),
                axios.get(`http://localhost:5000/api/auth/code-snippets/${chapter}`),
                axios.get(`http://localhost:5000/api/auth/notes/${chapter}`),
                axios.get(`http://localhost:5000/api/auth/lists/${chapter}`),
            ]);

            return {
                titles: titles.data,
                subtitles: subtitles.data,
                descriptions: descriptions.data,
                images: images.data,
                codeSnippets: codeSnippets.data,
                notes: notes.data,
                lists: lists.data,
            };
        } catch (error) {
            console.error('Error fetching all content:', error);
            return {
                titles: [],
                subtitles: [],
                descriptions: [],
                images: [],
                codeSnippets: [],
                notes: [],
                lists: [],
            };
        }
    };

    const fetchPopupContent = async (elementId, uniqueId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/getpopup`, {
                params: {
                    element_id: elementId,
                    word_or_phrase: uniqueId,
                },
            });
            return response.data.popup_content || 'No popup content available';
        } catch (error) {
            console.error('Error fetching popup content:', error);
            return 'Failed to load popup content';
        }
    };

    const handleWordClick = async (elementId, uniqueId, word) => {
        setSelectedWord(word);
        try {
            const popupContent = await fetchPopupContent(elementId, uniqueId);
            setSelectedPopupContent(popupContent);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error fetching pop-up content:', error);
        }
    };

    const renderContentWithPopups = (content, elementId, type) => {
        if (typeof content !== 'string') return null;
        const words = content.split(/(\s+|[.,!?;()]+)/).filter(Boolean);
        const renderWords = words.map((word, index) => {
            const uniqueId = `${word}-${index}`;
            const elementPopups = popups[elementId] || [];
            const popup = elementPopups.find((p) => p.word_or_phrase === uniqueId);

            let wordStyle = {};
            if (textAlignment === 'right') {
                wordStyle = { direction: 'ltr', unicodeBidi: 'isolate' };
            }

            return (
                <span key={uniqueId} style={{ display: 'inline' }}>
                    {popup ? (
                        <span
                            onClick={() => handleWordClick(elementId, uniqueId, word.trim())}
                            style={{
                                textDecoration: 'underline',
                                textDecorationColor: '#e47234',
                                cursor: 'pointer',
                                ...wordStyle,
                            }}
                        >
                            {word}
                        </span>
                    ) : (
                        <span style={{ cursor: 'default', ...wordStyle }}>
                            {word}
                        </span>
                    )}
                </span>
            );
        });

        switch (type) {
            case 'title':
                return <h1 className="content-title" style={{ textAlign: textAlignment, direction: textAlignment === 'right' ? 'rtl' : 'ltr' }}>{renderWords}</h1>;
            case 'subtitle':
                return <h4 ref={(el) => (sectionRefs.current[elementId] = el)} id={elementId} className="subtitle" style={{ textAlign: textAlignment, direction: textAlignment === 'right' ? 'rtl' : 'ltr' }}>{renderWords}</h4>;
            case 'description':
                return <p className="explanation" style={{ textAlign: textAlignment, direction: textAlignment === 'right' ? 'rtl' : 'ltr' }}>{renderWords}</p>;
            case 'list':
                return <li style={{ direction: textAlignment === 'right' ? 'rtl' : 'ltr' }}>{renderWords}</li>;
            default:
                return <div style={{ direction: textAlignment === 'right' ? 'rtl' : 'ltr' }}>{renderWords}</div>;
        }
    };


    const handleCopy = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        });
    };

    const handleSeeResult = (codeResults, itemId) => {
        setShowResult((prev) => ({ ...prev, [itemId]: true }));
        setTypedResult((prev) => ({ ...prev, [itemId]: '' }));

        if (codeResults) {
            let i = -1;
            const interval = setInterval(() => {
                setTypedResult((prev) => ({
                    ...prev,
                    [itemId]: prev[itemId] + codeResults[i],
                }));
                i++;
                if (i === codeResults.length - 1) clearInterval(interval);
            }, 50);
        }
    };

    const renderCodeWithPopups = (code, elementId, theme = colorMode) => {
        if (typeof code !== 'string') return null;
        const currentColors = colors[theme] || colors.light;

        const keywords = [
            "function",
            'DOCTYPE', 'html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script', 'div', 'span',
            'header', 'footer', 'main', 'section', 'article', 'nav', 'aside', 'ul', 'ol', 'li',
            'table', 'tr', 'td', 'th', 'thead', 'tbody', 'form', 'input', 'textarea', 'button',
            'select', 'option', 'label', 'a', 'img', 'iframe', 'canvas', 'svg', 'audio', 'video',
            'source', 'track', 'map', 'area', 'embed', 'object', 'param', 'blockquote', 'cite',
            'code', 'pre', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br',
            'hr', 'strong', 'em', 'i', 'b', 'u', 'small', 'sup', 'sub', 'abbr', 'time', 'mark',
            'progress', 'meter', 'details', 'summary', 'dialog',
            'var', 'let', 'const', 'if', 'else', 'switch', 'case', 'break',
            'continue', 'for', 'while', 'do', 'try', 'catch', 'finally', 'throw',
            'new', 'delete', 'typeof', 'instanceof', 'this', 'class', 'extends', 'super',
            'import', 'export', 'default', 'await', 'async', 'yield', 'in', 'of', 'with', 'void',
            'debugger', 'enum',
            'def', 'return', 'if', 'else', 'elif', 'for', 'while', 'break', 'continue',
            'import', 'from', 'as', 'pass', 'yield', 'try', 'except', 'finally',
            'raise', 'with', 'del', 'global', 'nonlocal', 'lambda', 'assert', 'True',
            'False', 'None', 'and', 'or', 'not', 'is', 'in',
            'color', 'background', 'border', 'padding', 'margin', 'font', 'text', 'align',
            'display', 'flex', 'grid', 'position', 'top', 'right', 'bottom', 'left',
            'z-index', 'overflow', 'opacity', 'visibility', 'box-shadow', 'transform',
            'transition', 'animation', 'clip', 'content', 'cursor', 'outline', 'resize',
            'scroll', 'filter',
            'public', 'private', 'protected', 'static', 'final', 'abstract',
            'synchronized', 'volatile', 'transient', 'class', 'interface',
            'extends', 'implements', 'import', 'package', 'throw', 'throws',
            'try', 'catch', 'finally', 'return', 'if', 'else', 'switch',
            'case', 'default', 'break', 'continue', 'for', 'while', 'do',
            'new', 'this', 'super', 'void', 'int', 'double',
            'char', 'boolean', 'long', 'short', 'byte', 'instanceof',
            'null', 'true', 'false',
        ];
        const booleans = ['True', 'False'];
        const nullUndefined = ['None'];
        const numbers = /\b\d+(\.\d+)?\b/;
        const operators = /[=+\-*/%&|^!<>]=?/;
        const predefinedFunctions = {
            python: [
                'print', 'len', 'input', 'str', 'int', 'range', 'float', 'list', 'dict', 'tuple', 'set', 'bool',
                'sorted', 'min', 'max', 'sum', 'abs', 'open', 'close', 'read', 'write', 'append', 'extend', 'pop',
                'remove', 'insert', 'index', 'count', 'join', 'split', 'map', 'filter', 'reduce', 'zip', 'eval',
                'exec', 'type', 'isinstance', 'callable', 'dir', 'help', 'input', 'round', 'format', 'sorted',
                'any', 'all', 'next', 'reversed', 'enumerate', 'hash', 'id', 'del', 'setattr', 'getattr', 'hasattr',
                'isinstance', 'issubclass', 'classmethod', 'staticmethod', 'property', 'abs', 'divmod', 'pow', 'min',
                'max', 'sum', 'bin', 'oct', 'hex'
            ],
            javascript: [
                'log', 'console.log', 'alert', 'parseInt', 'parseFloat', 'Math.random', 'setTimeout', 'setInterval', 'clearTimeout',
                'clearInterval', 'parseFloat', 'parseInt', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent',
                'encodeURI', 'encodeURIComponent', 'eval', 'eval()', 'JSON.parse', 'JSON.stringify', 'document.getElementById',
                'window', 'document', 'Math.abs', 'Math.floor', 'Math.ceil', 'Math.round', 'Math.max', 'Math.min', 'Math.pow',
                'Math.sqrt', 'Math.random', 'Math.log', 'Math.sin', 'Math.cos', 'Math.tan', 'Math.PI', 'Math.E', 'Math.LN2',
                'Math.LN10', 'Math.LOG2E', 'Math.LOG10E', 'Math.SQRT1_2', 'Math.SQRT2', 'Array.isArray', 'Array.from', 'Array.concat',
                'Array.push', 'Array.pop', 'Array.shift', 'Array.unshift', 'Array.slice', 'Array.splice', 'Array.indexOf', 'Array.join',
                'Array.forEach', 'Array.filter', 'Array.map', 'Array.reduce', 'Array.reduceRight', 'Array.sort', 'Array.reverse',
                'String.fromCharCode', 'String.charAt', 'String.charCodeAt', 'String.concat', 'String.includes', 'String.indexOf',
                'String.toLowerCase', 'String.toUpperCase', 'String.split', 'String.trim', 'String.trimStart', 'String.trimEnd'
            ],
            java: [
                'System.out.println', 'Math.abs', 'Math.max', 'Math.min', 'Math.pow', 'Math.sqrt', 'Math.random', 'log',
                'Thread.sleep', 'String.valueOf', 'String.charAt', 'String.equals', 'String.compareTo', 'String.toLowerCase',
                'String.toUpperCase', 'String.split', 'String.indexOf', 'String.contains', 'String.trim', 'String.substring',
                'String.replace', 'String.format', 'String.isEmpty', 'Integer.parseInt', 'Integer.toString', 'Double.parseDouble',
                'Double.toString', 'Boolean.parseBoolean', 'Boolean.toString', 'Float.parseFloat', 'Float.toString', 'Character.isDigit',
                'Character.isLetter', 'Character.toLowerCase', 'Character.toUpperCase', 'Math.random', 'Math.floor', 'Math.ceil',
                'Math.round', 'Math.log', 'Math.sqrt', 'Math.PI', 'Math.E', 'Math.sin', 'Math.cos', 'Math.tan', 'Thread.sleep',
                'String.join', 'String.format'
            ],
        };

        const tokens = code.split(/(\s+|[.,!?;(){}[\]])/).filter(Boolean);
        const elementPopups = popups[elementId] || [];

        let insideSingleLineComment = false;
        let insideString = false;
        let insideHTMLComment = false;

        const renderTokens = tokens.map((token, index) => {
            const uniqueId = `${token}-${index}`;
            const popup = elementPopups.find((p) => p.word_or_phrase === uniqueId);

            let tokenStyle = {};
            let isCommentToken = false;

            if (insideHTMLComment || token.includes('<!--')) {
                tokenStyle = { color: currentColors.comment, fontStyle: 'italic' };
                isCommentToken = true;
                insideHTMLComment = true;
                if (token.includes('-->')) {
                    insideHTMLComment = false;
                }
            } else {
                Object.values(predefinedFunctions).forEach((functions) => {
                    if (functions.includes(token)) {
                        tokenStyle = { color: currentColors.function };
                    }
                });
            }

            if (insideSingleLineComment || token.trim().startsWith('#') || token.trim().startsWith('//') || token.trim().startsWith('--')) {
                tokenStyle = { color: currentColors.comment, fontStyle: 'italic' };
                isCommentToken = true;
                insideSingleLineComment = true;
            }

            if (insideSingleLineComment && token.includes('\n')) {
                insideSingleLineComment = false;
            }

            if (!isCommentToken) {
                if ((token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) && !insideString) {
                    insideString = true;
                    tokenStyle = { color: currentColors.string };
                } else if (insideString && (token.endsWith('"') || token.endsWith("'") || token.endsWith('`'))) {
                    insideString = false;
                    tokenStyle = { color: currentColors.string };
                } else if (insideString) {
                    tokenStyle = { color: currentColors.string };
                } else if (keywords.includes(token)) {
                    tokenStyle = { color: currentColors.keyword, fontWeight: 'bold' };
                } else if (booleans.includes(token)) {
                    tokenStyle = { color: currentColors.boolean };
                } else if (nullUndefined.includes(token)) {
                    tokenStyle = { color: currentColors.null };
                } else if (numbers.test(token)) {
                    tokenStyle = { color: currentColors.number };
                } else if (operators.test(token)) {
                    tokenStyle = { color: currentColors.operator };
                } else if (token === 'torch') {
                    tokenStyle = { color: currentColors.torch, fontWeight: 'bold' };
                } else if (token === 'tensorflow') {
                    tokenStyle = { color: currentColors.tensorflow, fontWeight: 'bold' };
                } else if (token === 'method' || token === 'methodName') {
                    tokenStyle = { color: currentColors.method };
                } else if (token === 'specialWord') {
                    tokenStyle = { color: currentColors.special };
                } else if (token === 'variableName') {
                    tokenStyle = { color: currentColors.variable };
                } else if (token === 'type') {
                    tokenStyle = { color: currentColors.type, fontWeight: 'bold' };
                } else if (token === 'constant') {
                    tokenStyle = { color: currentColors.constant, fontWeight: 'bold' };
                } else if (token === 'annotation') {
                    tokenStyle = { color: currentColors.annotation, fontStyle: 'italic' };
                }
            }

            return (
                <span key={uniqueId} style={{ display: 'inline', direction: 'ltr', unicodeBidi: 'isolate' }}>
                    {popup ? (
                        <span
                            onClick={() => handleWordClick(elementId, uniqueId, token.trim())}
                            style={{
                                textDecoration: 'underline',
                                textDecorationColor: '#e47234',
                                cursor: 'pointer',
                                ...tokenStyle,
                            }}
                        >
                            {token}
                        </span>
                    ) : (
                        <span style={{ cursor: 'default', ...tokenStyle }}>{token}</span>
                    )}
                </span>
            );
        });

        return (
            <pre style={{ margin: '0', fontFamily: "'Courier New', Courier, monospace", color: '#FFFFFF', whiteSpace: 'pre-wrap', wordWrap: 'break-word', direction: 'ltr', textAlign: 'left' }}>
                <code style={{direction: 'ltr', textAlign: 'left'}}>
                    {renderTokens}
                </code>
            </pre>
        );
    };

    let languageselected = localStorage.getItem('selectedLanguage') || 'English';
    let languagee = languages.find(lang => lang.name === languageselected);

    // Generate TOC links dynamically
    const tocLinks = content
        .filter(item => item.type === 'subtitle')
        .map(item => (
            <li key={item._id} style={{marginBottom: '8px'}}>
                <a href={`#${item._id}`} id={`toc-${item._id}`} className="toc-link" style={{
                    textDecoration: 'none',
                    color: 'var(--toc-text-color)',
                    fontWeight: '400',
                    fontSize: 'var(--toc-font-size)',
                    transition: 'color 0.3s, font-size 0.3s' ,
                    textAlign: 'left',
                    direction: 'ltr'
                }}>
                    {item.subtitle}
                </a>
            </li>
        ));


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Deactivate all links first
                        tocRef.current.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                        // Activate the link corresponding to the intersecting section
                        const activeTocLink = tocRef.current.querySelector(`a[href="#${entry.target.id}"]`);
                        if (activeTocLink) {
                            activeTocLink.classList.add('active');
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.6
            }
        );

        // Observe subtitle sections
        Object.values(sectionRefs.current).forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);


    return (
        <>
            <style>
                {`
                /* General TOC and Content styles - these styles are applied by default */
                .toc {
                    position: fixed; /* Default to fixed for larger screens */
                    top: 60px;
                    right: 20px;
                    background-color: rgba(0, 0, 0, 0.05);
                    padding: 15px;
                    border-radius: 8px;
                    width: 200px;
                    font-size: 14px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    z-index: 500;
                    overflow-y: auto;
                    max-height: 80vh;
                    direction: ltr;
                    text-align: left;
                }

                .toc h2 {
                    margin-top: 0;
                    font-size: 16px;
                    color: var(--toc-text-color);
                    font-weight: 400;
                    text-align: left;
                }

                .toc ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    text-align: left;
                    direction: ltr;
                }

                .toc li {
                    margin-bottom: 8px;
                }

                .toc .toc-link {
                    text-decoration: none;
                    color: var(--toc-text-color);
                    font-weight: 400;
                    font-size: var(--toc-font-size);
                    transition: color 0.3s, font-size 0.3s;
                    text-align: left;
                    direction: ltr;
                }

                /* Styles for content row - default large screen style */
                .content-row-style {
                    margin-right: 240px; /* To accommodate fixed TOC */
                    margin-left: 0;
                    justify-content: center;
                    max-width: 960px;
                }

                /* Media query for screens smaller than medium (md breakpoint) */
                @media (max-width: 768px) { /* Or adjust breakpoint as needed, e.g., 992px for 'lg' */
                    .toc {
                        position: relative; /* Make TOC part of document flow */
                        width: 100%;        /* Full width on smaller screens */
                        right: auto;         /* Remove right positioning */
                        top: auto;           /* Remove top positioning */
                        margin-bottom: 20px; /* Add some space below TOC */
                        max-height: none;    /* Allow TOC to expand as needed */
                        overflow-y: visible; /* No need for vertical scroll on TOC when in flow */
                        box-shadow: none;    /* Optionally remove shadow to integrate better in flow */
                        padding: 10px;      /* Adjust padding for smaller screens */
                    }
                    .content-row-style {
                        margin-right: 0; /* No right margin as TOC is not fixed to the side */
                        margin-left: 0;  /* Ensure no left margin */
                        padding-left: 10px;  /* Add some padding on the sides */
                        padding-right: 10px;
                        max-width: 100%;    /* Allow content to take full width on smaller screens */
                    }
                }

                /* macOS buttons style for code snippets */
                .os-buttons {
                    display: flex;
                    gap: 10px;
                    position: absolute;
                    top: 10px;
                    left: 10px;
                }

                .os-button {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                .os-button.red {
                    background-color: #ff605c;
                    border: 1px solid #e0443e;
                    box-shadow: 0 1px 1px rgba(255, 96, 92, 0.8);
                }

                .os-button.yellow {
                    background-color: #ffbd44;
                    border: 1px solid #e0a42c;
                    box-shadow: 0 1px 1px rgba(255, 189, 68, 0.8);
                }

                .os-button.green {
                    background-color: #00ca56;
                    border: 1px solid #00ad43;
                    box-shadow: 0 1px 1px rgba(0, 202, 86, 0.8);
                }
                `}
            </style>
            <CRow className="justify-content-center">
                <nav className="toc" aria-label="Table of Contents" ref={tocRef}>
                    <h2 style={{
                        marginTop: '0',
                        fontSize: '16px',
                        color: 'var(--toc-text-color)',
                        fontWeight: '400',
                        textAlign: 'left'
                    }}>Contents</h2>
                    <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        textAlign: 'left',
                        direction: 'ltr'
                    }}>
                        {tocLinks}
                    </ul>
                </nav>

                <CRow className="justify-content-start content-row-style">
                    {content.map((item) => (
                        <CCol key={item._id} md={12} className="mb-3" style={{ direction: textAlignment === 'right' ? 'rtl' : 'ltr', textAlign: textAlignment }}>
                            {item.type === 'title' && <h1 style={{ textAlign: textAlignment, direction: textAlignment === 'right' ? 'rtl' : 'ltr' }} className="content-title">{renderContentWithPopups(item.title, item._id)}</h1>}
                            {item.type === 'subtitle' && renderContentWithPopups(item.subtitle, item._id)}
                            {item.type === 'description' && <p style={{ textAlign: textAlignment, direction: textAlignment === 'right' ? 'rtl' : 'ltr' }} className="content-description">{renderContentWithPopups(item.description, item._id)}</p>}
                            {item.type === 'list' && (
                                <ul style={{ textAlign: textAlignment, listStyleType: 'disc', paddingRight: textAlignment === 'right' ? '20px' : '0', paddingLeft: textAlignment === 'left' ? '20px' : '0', direction: textAlignment === 'right' ? 'rtl' : 'ltr' }} type="cercle ">
                                    <li style={{direction: textAlignment === 'right' ? 'rtl' : 'ltr', textAlign: textAlignment}}>
                                        {renderContentWithPopups(item.item, item._id)}
                                    </li>
                                </ul>)}
                            {item.type === 'image' && (
                                <div style={{ textAlign: 'center', direction: textAlignment === 'right' ? 'rtl' : 'ltr' }}>
                                    <img
                                        src={item.src}
                                        alt={item.alt || 'Image'}
                                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '20px' }}
                                    />
                                </div>
                            )}

                            {item.type === 'note' && (
                                <div style={{
                                    padding: '20px',
                                    borderRadius: '12px',
                                    marginTop: '20px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    background: 'linear-gradient(135deg,rgb(158, 155, 146),rgb(173, 143, 68))',
                                    color: 'white',
                                    direction: textAlignment === 'right' ? 'rtl' : 'ltr',
                                    textAlign: textAlignment
                                }}>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                        textAlign: textAlignment,
                                        direction: textAlignment === 'right' ? 'rtl' : 'ltr'
                                    }}>
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            marginBottom: '10px',
                                            textAlign: textAlignment,
                                            direction: textAlignment === 'right' ? 'rtl' : 'ltr'
                                        }}>
                                            <CIcon icon={cilNotes} style={{
                                                marginLeft: textAlignment === 'left' ? '5px' : '0',
                                                marginRight:  textAlignment === 'right' ? '5px' : '0'
                                            }} />
                                            {
                                                languagee.name.includes('Arabic') ? (
                                                    <span>ملاحظة:</span>
                                                ) : (
                                                    <span>Note:</span>
                                                )
                                            }
                                        </div>
                                        <div style={{
                                            fontSize: '18px',
                                            lineHeight: '1.5',
                                            textAlign: textAlignment,
                                            direction: textAlignment === 'right' ? 'rtl' : 'ltr',
                                        }}>
                                            {renderContentWithPopups(item.note, item._id)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {item.type === 'codeSnippet' && (
                                <>
                                    <div
                                        style={{
                                            width: '100%',
                                            maxWidth: '800px',
                                            backgroundColor: '#00000D',
                                            padding: '40px 20px 20px 20px',
                                            borderRadius: '8px',
                                            overflowX: 'auto',
                                            overflowY: 'visible',
                                            maxHeight: 'none',
                                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4), 0 -6px 12px rgba(0, 0, 0, 0.4), 6px 0 12px rgba(0, 0, 0, 0.4), -6px 0 12px rgba(0, 0, 0, 0.4)',
                                            position: 'relative',
                                            marginBottom: '20px',
                                            boxSizing: 'border-box',
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#888888 #333333',
                                            direction: 'ltr',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div className="os-buttons">
                                            <div className="os-button red"></div>
                                            <div className="os-button yellow"></div>
                                            <div className="os-button green"></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', position: 'absolute', top: '10px', right: '15px', direction: 'rtl' }}>
                                            <CButton style={{ display: 'flex', alignItems: 'center', color: colorMode === 'blue' || colorMode === 'dark' ? 'white' : 'black' }} onClick={() => handleCopy(item.code)}>
                                                <CIcon
                                                    icon={isCopied ? cilCheck : cilClipboard}
                                                    style={{ color: colorMode === 'blue' || colorMode === 'dark' ? 'white' : 'black' }}
                                                />
                                            </CButton>
                                            {item.codeResults && (
                                                <CButton
                                                    style={{ display: 'flex', alignItems: 'center', color: colorMode === 'blue' || colorMode === 'dark' ? 'white' : 'black' }}
                                                    onClick={() => handleSeeResult(item.codeResults, item._id)}
                                                >
                                                    <CIcon icon={showResult[item._id] ? cilCheckCircle : cilMediaPlay} style={{ color: colorMode === 'blue' || colorMode === 'dark' ? 'white' : 'black' }}
                                                    />
                                                </CButton>
                                            )}
                                        </div>
                                        <pre style={{ margin: '0', fontFamily: "'Courier New', Courier, monospace", color: '#FFFFFF', whiteSpace: 'pre-wrap', wordWrap: 'break-word', direction: 'ltr', textAlign: 'left' }}>
                                            <code style={{direction: 'ltr', textAlign: 'left'}}>
                                                {renderCodeWithPopups(item.code, item._id)}
                                            </code>
                                        </pre>
                                    </div>

                                    {showResult[item._id] && (
                                        <div
                                            className="result"
                                            style={{
                                                marginTop: '10px',
                                                padding: '10px',
                                                backgroundColor: '#2d2d2d',
                                                color: '#ffffff',
                                                border: '1px solid #555555',
                                                borderRadius: '4px',
                                                maxWidth: '800px',
                                                width: '100%',
                                                minHeight: '20px',
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: "'Courier New', Courier, monospace",
                                                fontSize: '14px',
                                                boxSizing: 'border-box',
                                                display: 'block',
                                                opacity: 1,
                                                transition: 'opacity 0.5s ease',
                                                direction: textAlignment === 'right' ? 'rtl' : 'ltr',
                                                textAlign: textAlignment
                                            }}
                                        >
                                            {
                                                languagee.name.includes('Arabic') ? (
                                                    <h5>النتيجة:</h5>
                                                ) : (
                                                    <h5>Result:</h5>
                                                )
                                            }
                                            <pre style={{ whiteSpace: 'pre-wrap', color: '#ffffff', margin: '0', direction: 'ltr', textAlign: 'left' }}>
                                            <code style={{direction: 'ltr', textAlign: 'left'}}>{renderContentWithPopups(item.codeResults, item._id)}</code></pre>
                                        </div>
                                    )}
                                </>)}
                        </CCol>
                     ))}
                </CRow>
            </CRow>

            <CModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    textAlign: textAlignment,
                    direction: textAlignment === 'right' ? 'rtl' : 'ltr',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '1050',
                    maxWidth: '800px',
                    width: '100%'
                }}
            >
                <CModalHeader
                    className='Model'
                    closeButton style={{direction: textAlignment === 'right' ? 'rtl' : 'ltr'}}
                >{/* You can add header title here if needed */}</CModalHeader>
                <CModalBody
                    className='Model' style={{direction: textAlignment === 'right' ? 'rtl' : 'ltr', textAlign: textAlignment}}
                >{selectedPopupContent}</CModalBody>

            </CModal>
        </>
    );
};

export default Contentchapter;