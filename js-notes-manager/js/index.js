import Note from './note.js';


// let notes = Note.GetAll();
// console.log(notes);

// // let currentNote = notes[0];


// let note = new Note({title: 'Czwarta'});
// // note.Save();

// let newNote = new Note({title: 'Piąta'});

// console.log(newNote);
// // newNote.Save();

// let note = new Note();
// console.log(note.ToJSON());


function get(url) {
  return new Promise( (resolve, reject) => {

    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = () => {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = () => {
      reject(Error("Network error"));
    };

    req.send();

  });
};


// get('./js/note.json').then(
//   (response) => {
//     console.log("Success", response);
//   },
//   (error) => {
//     console.log("Failed", error);
//   }
// );

// let url = './js/note.json';

// function getJSON(url) {
//   return get(url).then(JSON.parse);
// };

// async function getNote(url) {
//   return await getJSON(url);
// }

// let note2 = getNote(url);
// console.log(note2);

function resolveAfter2Seconds(x) {
  return new Promise( resolve => {
    setTimeout( () => {
      resolve(x);
    }, 2000);
  });
}

function resolve2sec(value) {

  return new Promise(
    function(resolve) {
      setTimeout(function() {
        resolve(value);
      }, 2000);
    }
  );

}

resolve2sec(15).then(console.log);

async function f1() {
  var x = await resolveAfter2Seconds(10);
  console.log(x);
}

async function f2() {
  var y = await 20;
  console.log(y);
}

async function f3() {
  try {
    var z = await Promise.reject(30);
  } catch(e) {
    console.log(e);
  }
}
