import Note from './note.js';

const board = document.getElementById('board');
let notes = [];
let noteDeleteButtons = {};
let noteEditButtons = {};
let noteBookmarkButtons = {};

const newNoteButton = document.querySelector('#new-note-button');
const newNoteDialog = document.querySelector('#newNoteContainer');
const addNoteCancelButton = document.querySelector('#addNoteCancelButton');
const addNoteButton = document.querySelector('#addNoteButton');



newNoteButton.addEventListener('click', newNoteDialogOpen);

addNoteCancelButton.addEventListener('click', newNoteDialogClose);

function newNoteDialogOpen() {
  newNoteDialog.style.display = 'block';
  newNoteButton.style.display = 'none';
}

function newNoteDialogClose() {
  newNoteDialog.style.display = 'none';
  newNoteButton.style.display = 'block';
}



addNoteButton.addEventListener('click', function(e) {
  let title = document.querySelector('#inputNoteTitle').value;
  let titleError = document.querySelector('#inputTitleError');
  let content = document.querySelector('#inputNoteContent').value;
  let contentError = document.querySelector('#inputNoteContentError');
  let pinned = document.querySelector('#notePinnedCheck').checked;
  let form = document.querySelector('#newNoteForm');

  let valid = true;

  if (title == undefined || title.length == 0 || title.length > 200 ) {
    valid = false;
    titleError.innerHTML = 'Title is required (max 200 characters)';
  }

  if (content.length > 1000) {
    valid = false;
    contentError.innerHTML = 'Content too long (max 1000 characters)';
  }

  if(valid) {
    let note = new Note({
      title: title,
      content: content,
      isPinned: pinned,
    });

    note.Save();
    refreshBoard();
    form.reset();
    newNoteDialogClose();
  }

});




function getNoteTemplate() {
  let noteTemplate = document.createElement('div');
  noteTemplate.classList.add('note');
  
  let noteTitle = document.createElement('div');
  noteTitle.classList.add('note-title');
  noteTitle.classList.add('text-primary');
  noteTemplate.appendChild(noteTitle);
  
  let noteDate = document.createElement('div');
  noteDate.classList.add('note-updated-at');
  noteTemplate.appendChild(noteDate);
  
  let divider = document.createElement('div');
  divider.classList.add('divider');
  noteTemplate.appendChild(divider);
  
  let noteContent = document.createElement('div');
  noteContent.classList.add('note-content');
  noteTemplate.appendChild(noteContent);

  divider = document.createElement('div');
  divider.classList.add('divider');
  noteTemplate.appendChild(divider);
  
  let noteTools = document.createElement('div');
  noteTools.classList.add('note-tools');
  noteTools.classList.add('text-right');
  let toolsEdit = document.createElement('i');
  toolsEdit.classList.add('icon');
  toolsEdit.classList.add('icon-edit');
  toolsEdit.classList.add('text-warning');
  let toolsDelete = document.createElement('i');
  toolsDelete.classList.add('icon');
  toolsDelete.classList.add('icon-delete');
  toolsDelete.classList.add('text-error');
  let toolsBookmark = document.createElement('i');
  toolsBookmark.classList.add('icon');
  toolsBookmark.classList.add('icon-bookmark');
  toolsBookmark.classList.add('text-success');
  noteTools.appendChild(toolsEdit);
  noteTools.appendChild(toolsDelete);
  noteTools.appendChild(toolsBookmark);
  noteTemplate.appendChild(noteTools);

  return noteTemplate;
}

function refreshBoard() {
  notes = Note.GetAll();
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }
  for(let i = 0; i < notes.length; i++) {
    let noteEl = getNoteTemplate();
    let note = notes[i];
    noteEl.id = 'note-' + note.id;
    noteEl.querySelector('.note-title').innerHTML = note.title;
    noteEl.querySelector('.note-content').innerHTML = note.content;
    board.appendChild(noteEl);
  }
  registerNoteButtonsEvents()
}


refreshBoard();


function registerNoteButtonsEvents() {
  noteDeleteButtons = document.querySelectorAll('.icon-delete');
  noteDeleteButtons.forEach( function(button) {
    button.addEventListener('click', deleteNote);
  });

  noteEditButtons = document.querySelectorAll('.icon-edit');
  noteEditButtons.forEach( function(button) {
    button.addEventListener('click', editNote);
  });

  noteBookmarkButtons = document.querySelectorAll('.icon-bookmark');
  noteBookmarkButtons.forEach( function(button) {
    button.addEventListener('click', bookmarkNote);
  });
}

function bookmarkNote() {
  alert('Not implemented yet :(');
}

function editNote(e) {
  let id = e.target.parentNode.parentNode.id.split('-')[1];
  let note = notes.find(note => note.id == id);
  editNoteDialogShow(note);
}

function editNoteDialogShow(note) {
  const editNoteDialog = document.querySelector('#editNoteContainer');
  const editNoteCancelButton = document.querySelector('#editNoteCancelButton');
  const editNoteSaveButton = document.querySelector('#editNoteSaveButton');
  
  
  let title = document.querySelector('#editInputNoteTitle');
  let titleError = document.querySelector('#editInputTitleError');
  let content = document.querySelector('#editInputNoteContent');
  let contentError = document.querySelector('#editInputNoteContentError');
  let pinned = document.querySelector('#editNotePinnedCheck').checked;
  let form = document.querySelector('#editNoteForm');
  
  title.value = note.title;
  content.innerHTML = note.content;
  pinned = note.isPinned;
  
  editNoteDialog.style.display = 'block';

  editNoteCancelButton.addEventListener('click', function() {
    editNoteDialog.style.display = 'none';
  });

  editNoteSaveButton.addEventListener('click', function() {
    let valid = true;
  
    if (title == undefined || title.length == 0 || title.length > 200 ) {
      valid = false;
      titleError.innerHTML = 'Title is required (max 200 characters)';
    }
  
    if (content.length > 1000) {
      valid = false;
      contentError.innerHTML = 'Content too long (max 1000 characters)';
    }
  
    if(valid) {
      note.title = title.value;
      note.content = content.value;
      note.isPinned = pinned;
      note.Save();
      refreshBoard();
      form.reset();
      editNoteDialog.style.display = 'none';
    }
  });
}

function deleteNote(e) {
  if( confirm('Are you sure?') ) {
    let id = e.target.parentNode.parentNode.id.split('-')[1];
    let note = notes.find(note => note.id == id);

    note.Delete();
    refreshBoard();
  }
}
