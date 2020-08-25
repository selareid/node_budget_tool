const fs = require('fs');

class AccountHandler {
  cachedAccounts = {}

  constructor() {
    let accountData = fs.readFileSync('data/accounts.js');
    let parsedData;

    try {
      parsedData = JSON.parse(accountData);
    } catch (err) {
      console.log(err);

      parsedData = {};
    }

    if (typeof parsedData == 'object') {
      this.cachedAccounts = parsedData;
    }
    else throw 'Big error, parsedData not equal to object, this is problem. Can be found in the AccountHandler constructor';
  }

  saveCached() {
    fs.writeFileSync('data/accounts.js', JSON.stringify(this.cachedAccounts));
    return OK;
  }

  getAllAccountData() {
    return this.cachedAccounts;
  }

  getTotalBalance() {
    let balance = 0;
    for (let accountN in this.cachedAccounts) {
      balance += this.cachedAccounts[accountN].balance;
    }
    return balance;
  }

  accountExists(accountName) {
    return this.cachedAccounts[accountName] !== undefined && this.cachedAccounts[accountName] !== null;
  }

  getBalance(accountName) {
    if (!this.accountExists(accountName)) return FAIL;
    return this.cachedAccounts[accountName].balance;
  }

  addBalance(accountName, amount = 0) {
    if (!this.accountExists(accountName)) return FAIL;
    this.cachedAccounts[accountName].balance += amount;

    this.saveCached();
    return this.cachedAccounts[accountName].balance;
  }

  addAccount(accountName, balance = 0) {
    if (this.accountExists(accountName)) return FAIL;

    this.cachedAccounts[accountName] = {
      accountName: accountName,
      balance: balance
    };

    this.saveCached();
    return OK;
  }

  removeAccount(accountName) {
    if (!this.accountExists(accountName)) return FAIL;
    delete this.cachedAccounts[accountName];
    this.saveCached();
    return OK;
  }
}

module.exports = AccountHandler;
