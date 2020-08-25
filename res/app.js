require('./Constants.js');
const AccountHandler = require('./AccountHandler.js');
const Notes = require('./NoteHandler.js');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let accountHandler = new AccountHandler();


app.get('*', function(req, res) {
  console.log(`New request to ${req.url}`);

  switch (req.url) {
    case '/client.js':
      res.sendFile(__dirname + '/client/client.js');
      break;
    case '/styles.css':
      res.sendFile(__dirname + '/client/styles.css');
      break;
    default:
      res.sendFile(__dirname + '/client/index.html');
  }
});

io.on('connection', socket => {
  console.log('New socket connection ' + socket.id);

  sendAllAccountDetails(socket);
  socket.emit('updateTextArea', Notes.get());

  socket.on('addBalance', function (data) {
    accountHandler.addBalance(data.accountName, data.amount);
    socket.emit('account', {accountName: data.accountName, balance: accountHandler.getBalance(data.accountName)});
    socket.emit('account', {accountName: 'total', balance: accountHandler.getTotalBalance()});
  });

  socket.on('addAccount', function (accountName) {
    accountHandler.addAccount(accountName);
    sendAllAccountDetails(socket);
  });

  socket.on('removeAccount', function (accountName) {
    accountHandler.removeAccount(accountName);
    sendAllAccountDetails(socket);
  });

  socket.on('updateTextArea', function (text) {
    Notes.set(text);
    socket.emit('updateTextArea', Notes.get());
  });
});

function sendAllAccountDetails(socket) {
  socket.emit('account', {accountName: 'total', balance: accountHandler.getTotalBalance()});
  for (let accountName in accountHandler.getAllAccountData()) {
    socket.emit('account', accountHandler.getAllAccountData()[accountName]);
  }
}

http.listen(3400, function(){
    console.log('listening on *:3400');
});
