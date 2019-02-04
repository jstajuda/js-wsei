const newNoteButton = document.getElementById('newNoteButton');
const newNoteContainer = document.getElementById('newNoteContainer');
const newNoteFormWrapper =  document.getElementById('newNoteFormWrapper');

newNoteButton.addEventListener('click', () => {
    newNoteContainer.classList.toggle('displayed');
});

newNoteContainer.addEventListener('click', event => {
    if(event.target !== newNoteContainer) return;
    newNoteContainer.classList.toggle('displayed');
});
