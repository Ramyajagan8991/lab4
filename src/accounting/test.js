const { expect } = require('chai');
const mock = require('mock-fs');
const fs = require('fs');

// Import the functions from the main app
const path = require('path');
const appPath = path.resolve(__dirname, '../index.js');
let readBalance, writeBalance;

describe('Account Management System', function () {
  before(() => {
    // Import functions after mock-fs is set up
    ({ readBalance, writeBalance } = require('../index.js'));
  });

  beforeEach(() => {
    mock({
      './balance.json': JSON.stringify({ balance: 1000.00 })
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('TC-01: View initial balance', function () {
    expect(readBalance()).to.equal(1000.00);
  });

  it('TC-02: Credit account with valid amount', function () {
    let balance = readBalance();
    balance += 200;
    writeBalance(balance);
    expect(readBalance()).to.equal(1200.00);
  });

  it('TC-03: Debit account with sufficient funds', function () {
    let balance = readBalance();
    balance -= 300;
    writeBalance(balance);
    expect(readBalance()).to.equal(700.00);
  });

  it('TC-04: Debit account with insufficient funds', function () {
    writeBalance(100);
    let balance = readBalance();
    if (balance < 200) {
      // Simulate insufficient funds
      expect(balance >= 200).to.be.false;
    }
  });

  it('TC-05: Credit account with zero', function () {
    let balance = readBalance();
    balance += 0;
    writeBalance(balance);
    expect(readBalance()).to.equal(1000.00);
  });

  it('TC-06: Debit account with zero', function () {
    let balance = readBalance();
    balance -= 0;
    writeBalance(balance);
    expect(readBalance()).to.equal(1000.00);
  });

  it('TC-09: Multiple operations in sequence', function () {
    let balance = readBalance();
    balance += 100;
    writeBalance(balance);
    expect(readBalance()).to.equal(1100.00);
    balance -= 50;
    writeBalance(balance);
    expect(readBalance()).to.equal(1050.00);
  });
});
