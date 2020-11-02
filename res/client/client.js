var socket = io();
var accounts = {
  total: {
    accountName: 'total',
    balance: 0.00,
    element: document.getElementById('totalText')
  }
};
var currentlySelected;

socket.on('connect', function (data) {
  console.log('Socket connected');
});

socket.on('account', function (data) {
  let accountName = data.accountName;
  let balance = data.balance;

  if (accounts[accountName]) {
    if (accountName == 'total') {
      accounts[accountName].element.innerHTML = `Total Balance: $${Math.floor(balance*100)/100}`;
    }
    else {
      accounts[accountName].element.innerHTML = `${accountName} | $${balance}`;
    }
  }
  else {
    accounts[accountName] = {
      accountName: accountName,
      balance: balance
    }

    var element = document.createElement('button');
    element.onclick = function () {currentlySelected = accountName; updateCurrentlySelected();}
    element.innerHTML = `${accountName} | $${balance}`;
    var listElement = document.createElement('li');
    listElement.appendChild(element);
    document.getElementById('accountsList').appendChild(listElement);
    accounts[accountName].element = element;
  }
});

socket.on('updateTextArea', function (text) {
  document.getElementById('textArea').value = text;
});

function updateCurrentlySelected() {
  document.getElementById('currentlySelected').innerHTML = `Currently Selected: ${currentlySelected || ""}`;
}

function handleFormClick() {
  let inputValue = parseFloat(document.getElementById('numberInput').value);

  if (!currentlySelected || !inputValue) return;

  socket.emit('addBalance', {accountName: currentlySelected, amount: inputValue});
  document.getElementById('numberInput').value = "";
  currentlySelected = null;
  updateCurrentlySelected();
}

function handleTransferFormClick() {
  let transfer = document.getElementById('transferEnd').value;
  let amount = parseFloat(document.getElementById('numberInput').value);
  socket.emit('addBalance', {accountName: currentlySelected, amount: -amount});
  socket.emit('addBalance', {accountName: transfer, amount: amount});
  document.getElementById('transferEnd').value = "";
  document.getElementById('numberInput').value = "";
  currentlySelected = null;
  updateCurrentlySelected();
}

function addAccount() {
  var accountName = document.getElementById('rightSideAccountName').value;
  socket.emit('addAccount', accountName);
  document.getElementById('rightSideAccountName').value = "";
}

function removeAccount() {
  var accountName = document.getElementById('rightSideAccountName').value;
  accounts[accountName].element.remove();
  delete accounts[accountName];
  socket.emit('removeAccount', accountName);
  document.getElementById('rightSideAccountName').value = "";
}

document.getElementById('textArea').oninput = function (e) {
  socket.emit('updateTextArea', e.target.value);
}
