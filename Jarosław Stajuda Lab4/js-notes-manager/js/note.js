export default class Note {

  constructor(obj) {
    obj = obj || {}
    this.id = obj.id || parseInt(Note.Count()) + 1;
    this.title = obj.title || 'Tytuł notatki';
    this.content = obj.content || 'Treść notatki';
    this.isPinned = obj.isPinned || false;
    this.isDeleted = obj.isDeleted || false;
    this.createdAt = obj.createdAt || new Date();
    this.updatedAt = obj.updatedAt || undefined;
  }

  Save() {
    if(this.updatedAt == undefined) {
      this.updatedAt = this.createdAt;
      localStorage.setItem('noteIndex', this.id);
    }
    this.updatedAt = new Date();
    localStorage.setItem('note-' + this.id, this.ToJSON());
  }

  Delete() {
    this.isDeleted = true;
    this.Save();
  }

  static GetAll() {
    let notes = [];
    let count = parseInt(Note.Count());

    if (count > 0) {
      for(let i = 1; i <= count; i++) {
        let note = new Note(JSON.parse(localStorage.getItem('note-' + i)));
        if( note.isDeleted !== true) {
          notes.push(note);
        }
      }
    }

    return notes.reverse();
  }

  ToJSON() {
    return JSON.stringify(this);
  }

  static Count() {
    let index = localStorage.getItem('noteIndex');
    if ( index !== null) {
      return index;
    }
    localStorage.setItem('noteIndex', 0);
    return 0;
  }


}
