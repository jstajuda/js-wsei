import Note from './note.js';


let notes = Note.GetAll();
console.log(notes);

// let currentNote = notes[0];


let note = new Note({title: 'Czwarta'});
// note.Save();

let newNote = new Note({title: 'Piąta'});

console.log(newNote);
// newNote.Save();
