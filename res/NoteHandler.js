const fs = require('fs');

const NoteHandler = {
  set: function (text) {
    fs.writeFileSync('data/notes', text);
    return OK;
  },

  get: function () {
    return fs.readFileSync('data/notes',  {encoding:'utf8'});
  }
}

module.exports = NoteHandler;
