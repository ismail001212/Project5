import axios from 'axios';

export const fetchContent = async (chapterId) => {
    const response = await axios.get(`http://localhost:5000/api/auth/titles/${chapterId}`);
    return response.data; // Ensure this returns an array
  };
  
  export const fetchSubtitle = async (chapterId) => {
    const response = await axios.get(`http://localhost:5000/api/auth/subtitles/${chapterId}`);
    return response.data; // Ensure this returns an array
  };
  
  export const fetchDescription = async (chapterId) => {
    const response = await axios.get(`http://localhost:5000/api/auth/descriptions/${chapterId}`);
    return response.data; // Ensure this returns an array
  };
  
  export const fetchImage = async (chapterId) => {
    const response = await axios.get(`http://localhost:5000/api/auth/images/${chapterId}`);
    return response.data; // Ensure this returns an array
  };
  
  export const fetchCodeSnippets = async (chapterId) => {
    const response = await axios.get(`http://localhost:5000/api/auth/code-snippets/${chapterId}`);
    return response.data; // Ensure this returns an array
  };
  
  export const fetchNotes = async (chapterId) => {
    const response = await axios.get(`http://localhost:5000/api/auth/notes/${chapterId}`);
    return response.data; // Ensure this returns an array
  };
  
  export const fetchLists = async (chapterId) => {
    const response = await axios.get(`http://localhost:5000/api/auth/lists/${chapterId}`);
    return response.data; // Ensure this returns an array
  };
  export const getLastIndex = async (chapterId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/lastIndex/${chapterId}`);
      return response.data.lastIndex + 1;
    } catch (error) {
      console.error('Error fetching index:', error);
      return 1;
    }
  };
  export const handleSaveContent = async (isEditing, id, newContent, updateContent, resetForm, chapter) => {
    try {
      if (!isEditing) {
        const nextIndex = await getLastIndex(chapter);
        newContent.index = nextIndex;
      }
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/titles/${id}`, newContent);
      } else {
        await axios.post('http://localhost:5000/api/auth/titles', newContent);
      }
      const updatedTitles = await fetchContent(chapter);
      updateContent(updatedTitles, 'title');
      resetForm();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };
  
  export const handleSaveSubtitle = async (isEditing, id, newSubtitle, updateContent, resetForm, chapter) => {
    try {
      if (!isEditing) {
        const nextIndex = await getLastIndex(chapter);
        newSubtitle.index = nextIndex;
      }
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/subtitles/${id}`, newSubtitle);
      } else {
        await axios.post('http://localhost:5000/api/auth/subtitles', newSubtitle);
      }
      const updatedSubtitles = await fetchSubtitle(chapter);
      updateContent(updatedSubtitles, 'subtitle');
      resetForm();
    } catch (error) {
      console.error('Error saving subtitle:', error);
    }
  };
  
  export const handleSaveDescription = async (isEditing, id, newDescription, updateContent, resetForm, chapter) => {
    try {
      if (!isEditing) {
        const nextIndex = await getLastIndex(chapter);
        newDescription.index = nextIndex;
      }
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/descriptions/${id}`, newDescription);
      } else {
        await axios.post('http://localhost:5000/api/auth/descriptions', newDescription);
      }
      const updatedDescriptions = await fetchDescription(chapter);
      updateContent(updatedDescriptions, 'description');
      resetForm();
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };
  
  export const handleSaveImage = async (isEditing, id, newImage, updateContent, resetForm, chapter) => {
    try {
      if (!isEditing) {
        const nextIndex = await getLastIndex(chapter);
        newImage.index = nextIndex;
      }
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/images/${id}`, newImage);
      } else {
        await axios.post('http://localhost:5000/api/auth/images', newImage);
      }
      const updatedImages = await fetchImage(chapter);
      updateContent(updatedImages, 'image');
      resetForm();
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };
  
  export const handleSaveCodeSnippet = async (isEditing, id, newCodeSnippet, updateContent, resetForm, chapter) => {
    try {
      if (!isEditing) {
        const nextIndex = await getLastIndex(chapter);
        newCodeSnippet.index = nextIndex;
      }
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/code-snippets/${id}`, newCodeSnippet);
      } else {
        await axios.post('http://localhost:5000/api/auth/code-snippets', newCodeSnippet);
      }
      const updatedCodeSnippets = await fetchCodeSnippets(chapter);
      updateContent(updatedCodeSnippets, 'codeSnippet');
      resetForm();
    } catch (error) {
      console.error('Error saving code snippet:', error);
    }
  };
  
  export const handleSaveNote = async (isEditing, id, newNote, updateContent, resetForm, chapter) => {
    try {
      if (!isEditing) {
        const nextIndex = await getLastIndex(chapter);
        newNote.index = nextIndex;
      }
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/notes/${id}`, newNote);
      } else {
        await axios.post('http://localhost:5000/api/auth/notes', newNote);
      }
      const updatedNotes = await fetchNotes(chapter);
      updateContent(updatedNotes, 'note');
      resetForm();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
  
  export const handleSaveList = async (isEditing, id, newList, updateContent, resetForm, chapter) => {
    try {
      if (!isEditing) {
        const nextIndex = await getLastIndex(chapter);
        newList.index = nextIndex;
      }
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/lists/${id}`, newList);
      } else {
        await axios.post('http://localhost:5000/api/auth/lists', newList);
      }
      const updatedLists = await fetchLists(chapter);
      updateContent(updatedLists, 'list');
      resetForm();
    } catch (error) {
      console.error('Error saving list:', error);
    }
  };
  export const fetchAllContent = async (chapterId) => {
    try {
      const [titles, subtitles, descriptions, images, codeSnippets, notes, lists] = await Promise.all([
        axios.get(`http://localhost:5000/api/auth/titles/${chapterId}`),
        axios.get(`http://localhost:5000/api/auth/subtitles/${chapterId}`),
        axios.get(`http://localhost:5000/api/auth/descriptions/${chapterId}`),
        axios.get(`http://localhost:5000/api/auth/images/${chapterId}`),
        axios.get(`http://localhost:5000/api/auth/code-snippets/${chapterId}`),
        axios.get(`http://localhost:5000/api/auth/notes/${chapterId}`),
        axios.get(`http://localhost:5000/api/auth/lists/${chapterId}`)
      ]);
  
      return {
        titles: titles.data,
        subtitles: subtitles.data,
        descriptions: descriptions.data,
        images: images.data,
        codeSnippets: codeSnippets.data,
        notes: notes.data,
        lists: lists.data
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
        lists: []
      };
    }
  };
  

 

  export const handleDeleteCodeSnippet = async (id, updateContent, chapter) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/code-snippets/${id}`);
      const updatedCodeSnippets = await fetchCodeSnippets(chapter);
      updateContent(updatedCodeSnippets, 'codeSnippet');
    } catch (error) {
      console.error('Error deleting code snippet:', error);
    }
  };
  
  
  

  export const handleDeleteNote = async (id, updateContent, chapter) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/notes/${id}`);
      const updatedNotes = await fetchNotes(chapter);
      updateContent(updatedNotes, 'note');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  
  

  export const handleDeleteList = async (id, updateContent, chapter) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/lists/${id}`);
      const updatedLists = await fetchLists(chapter);
      updateContent(updatedLists, 'list');
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };


  export const handleDeleteContent = async (id, type) => {
      try {
        await axios.delete(`http://localhost:5000/api/auth/deleteContent/${id}`, { data: { type } });
        setContent((prevContent) => prevContent.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    };