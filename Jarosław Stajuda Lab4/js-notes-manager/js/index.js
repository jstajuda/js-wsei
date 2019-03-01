import Note from './note.js';

const board = document.getElementById('board');
let notes = [];
let noteDeleteButtons = {};
let noteEditButtons = {};
let noteBookmarkButtons = {};

const newNoteButton = document.querySelector('#newNoteButton');
const noteDialog = document.querySelector('#noteDialog');
const noteDialogCancelButton = document.querySelector('#noteDialogCancelButton');
const noteDialogOkButton = document.querySelector('#noteDialogOkButton');
const addNoteButton = document.querySelector('#addNoteButton');
const form = document.querySelector('#noteForm');

newNoteButton.addEventListener('click', noteDialogOpen);
noteDialogCancelButton.addEventListener('click', noteDialogClose);


// #region note dialog window
function noteDialogOpen(note) {
  noteDialog.style.display = 'block';
  noteDialogPopulate(note);
  newNoteButton.style.display = 'none';
}

function noteDialogClose() {
  clearDialog();
  noteDialog.style.display = 'none';
  newNoteButton.style.display = 'block';
}

function clearDialog() {
  let titleError = document.querySelector('#inputTitleError');
  let contentError = document.querySelector('#inputNoteContentError');
  let content = document.querySelector('#inputNoteContent');
  let noteId = document.querySelector('#inputNoteId');
  titleError.innerHTML = "";
  contentError.innerHTML = "";
  form.reset();
  noteId.value = 0;
  content.innerHTML = "";
}

function noteDialogPopulate(note) {
  let title = document.querySelector('#inputNoteTitle');
  let noteId = document.querySelector('#inputNoteId');
  let content = document.querySelector('#inputNoteContent');
  let pinned = document.querySelector('#notePinnedCheck');

  if(note !== undefined && note !== null) {
    noteId.value = note.id;
    title.value = note.title;
    content.innerHTML = note.content;
    pinned.checked = note.isPinned;
  }
}

// #endregion

// #region note validate and save
noteDialogOkButton.addEventListener('click', function(e) {
  let noteId = document.querySelector('#inputNoteId').value;
  let title = document.querySelector('#inputNoteTitle').value;
  let titleError = document.querySelector('#inputTitleError');
  let content = document.querySelector('#inputNoteContent').value;
  let contentError = document.querySelector('#inputNoteContentError');
  let pinned = document.querySelector('#notePinnedCheck').checked;

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
    let note = {};

    if(noteId == 0) {
      note = new Note();
    } else {
      note = notes.find(note => note.id == noteId);
    }

    note.title = title;
    note.content = content;
    note.isPinned = pinned;

    note.Save();
    refreshBoard();
    noteDialogClose();
  }

});
// #endregion

// #region show notes
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

// #endregion

// #region edit notes
function bookmarkNote() {
  alert('Not implemented yet :(');
}

function editNote(e) {
  let id = e.target.parentNode.parentNode.id.split('-')[1];
  let note = notes.find(note => note.id == id);
  noteDialogOpen(note);
}

function deleteNote(e) {
  if( confirm('Are you sure?') ) {
    let id = e.target.parentNode.parentNode.id.split('-')[1];
    let note = notes.find(note => note.id == id);
    note.Delete();
    console.log(`Note ${this.id} deleted.`);
    refreshBoard();
  }
}
// #endregion

// init board
refreshBoard();