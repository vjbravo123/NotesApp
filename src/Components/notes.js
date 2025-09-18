import React, { useState, useEffect } from 'react';
import "../Css/notes.css";

const PAGE_SIZE = 10;

const predefinedNotes = [
  { id: 1, title: "Meeting with Team", content: "Discuss project milestones and deadlines.", timestamp: "07/25/2024, 10:00 AM" },
  { id: 2, title: "Grocery Shopping", content: "Buy milk, eggs, bread, and coffee.", timestamp: "07/25/2024, 12:00 PM" },
  { id: 3, title: "Workout Plan", content: "30 minutes of cardio and 20 minutes of strength training.", timestamp: "07/25/2024, 6:00 AM" },
  { id: 4, title: "Doctor's Appointment", content: "Annual check-up at 5:00 PM.", timestamp: "07/25/2024, 5:00 PM" },
  { id: 5, title: "Dinner with Friends", content: "Reservation at 7:30 PM at the new Italian restaurant.", timestamp: "07/25/2024, 7:30 PM" },
  { id: 6, title: "Read Book", content: "Finish reading 'The Great Gatsby'.", timestamp: "07/25/2024, 8:00 PM" },
  { id: 7, title: "Write Blog Post", content: "Topic: 'The Future of Web Development'.", timestamp: "07/25/2024, 9:00 AM" },
  { id: 8, title: "Email Clients", content: "Send project updates to all clients.", timestamp: "07/25/2024, 11:00 AM" },
  { id: 9, title: "Plan Vacation", content: "Research destinations and book flights for summer vacation.", timestamp: "07/25/2024, 4:00 PM" },
];

export const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes && savedNotes.length > 0) {
      setNotes(savedNotes);
    } else {
      setNotes(predefinedNotes);
      localStorage.setItem('notes', JSON.stringify(predefinedNotes));
    }
  }, []);

  const updateLocalStorage = (notes) => {
    localStorage.setItem('notes', JSON.stringify(notes));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateNote = () => {
    if (!noteTitle || !noteContent) return;
    const newNote = {
      id: Date.now(),
      title: noteTitle,
      content: noteContent,
      timestamp: new Date().toLocaleString(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setNoteTitle('');
    setNoteContent('');
    setIsModalOpen(false);
  };

  const handleEditNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    setNoteTitle(noteToEdit.title);
    setNoteContent(noteToEdit.content);
    setEditMode(true);
    setEditNoteId(id);
    setIsModalOpen(true);
  };

  const handleUpdateNote = () => {
    const updatedNotes = notes.map(note => (note.id === editNoteId ? { ...note, title: noteTitle, content: noteContent, timestamp: new Date().toLocaleString() } : note));
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setNoteTitle('');
    setNoteContent('');
    setEditMode(false);
    setEditNoteId(null);
    setIsModalOpen(false);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
  };

  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? <span key={index} className="highlight">{part}</span> : part
    );
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredNotes.length / PAGE_SIZE);
  const paginatedNotes = filteredNotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openModal = () => {
    setNoteTitle('');
    setNoteContent('');
    setEditMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="notes-container">
      <h1 className="notes-title">Notes</h1>
      <div className="search-bar-container">
        <input type="text" className="search-bar" placeholder="Search notes..." value={searchTerm} onChange={handleSearch} />
        <i className="fas fa-search search-icon"></i>
      </div>
      <div className="notes-list">
        <div className="note-item add-note-item" onClick={openModal}>
          <i className="fas fa-plus plus-icon"></i>
          <p className="add-note-text">Add Note</p>
        </div>
        {paginatedNotes.map(note => (
          <div key={note.id} className="note-item">
            <h2 className="note-title">{getHighlightedText(note.title, searchTerm)}</h2>
            <p className="note-excerpt">{getHighlightedText(note.content, searchTerm)}</p>
            <p className="note-timestamp">{note.timestamp}</p>
            <div className="note-actions">
              <button className='gbtn' onClick={() => handleEditNote(note.id)}>Edit</button>
              <button className='rbtn' onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{editMode ? 'Edit Note' : 'Add Note'}</h2>
            <input
              type="text"
              className="modal-input"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title"
            />
            <textarea
              className="modal-textarea"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Note Content"
            />
            <button className="modal-btn" onClick={editMode ? handleUpdateNote : handleCreateNote}>
              {editMode ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

