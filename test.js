const DatabaseDriver = require ('./DatabaseDriver');
const driver = new DatabaseDriver();

// NOTE tests are using dates in PST
async function scenario1() {
  try {
    var mem1 = await driver.newMemberSignUp("1");
    var mem2 = await driver.newMemberSignUp("2");
    var mem3 = await driver.newMemberSignUp("3");
    var mem4 = await driver.newMemberSignUp("4");

    var treasury1 = await driver.createTreasury(["2", "5"], "2", "1", 10000);

    var treasury2 = await driver.createTreasury(["3", "4"], "1", "1", 20000);
    await driver.acceptInvite(mem3, treasury2);
    await driver.acceptInvite(mem4, treasury2);
    await driver.addTransactionToHistory(treasury2, 20000, "0", "1234567890", 10000 ,"02/03/2017");
    await driver.addTransactionToHistory(treasury2, -10000, "x100", "1234567891", 10000 ,"03/03/2017");
    await driver.updateTreasuryBalance(treasury2, 10000);
    await driver.addAddressToTreasury(treasury2, "x400");

    var treasury3 = await driver.createTreasury(["1"], "1", "3", 50000);

    var treasury4 = await driver.createTreasury(["1"], "4", "4", 400000);
    await driver.acceptInvite(mem1, treasury4);
    await driver.addTransactionToHistory(treasury4, 50000, "0", "1234567892", 10000 ,"03/03/2018");
    await driver.addTransactionToHistory(treasury4, 100000, "0", "1234567893", 15000 ,"04/04/2018");
    await driver.addTransactionToHistory(treasury4, -10000, "x100", "1234567894", 10000 ,"05/04/2018");
    await driver.addTransactionToHistory(treasury4, -20000, "x101", "1234567895", 10000 ,"05/05/2018");
    await driver.addTransactionToHistory(treasury4, 100000, "x102", "1234567896", 10000 ,"05/06/2018");
    await driver.addTransactionToHistory(treasury4, 500000, "x101", "1234567897", 20000 ,"05/08/2018");
    await driver.addTransactionToHistory(treasury4, -10000, "x102", "1234567888", 10000 ,"05/12/2018");
    await driver.addTransactionToHistory(treasury4, -10000, "x103", "12345678947", 10000 ,"05/13/2018");
    await driver.addTransactionToHistory(treasury4, 10000, "0", "1234527897", 10000 ,"05/15/2018");
    await driver.updateTreasuryBalance(treasury4, 710000);
    await driver.addAddressToTreasury(treasury4, "x401");
  } catch(e) {
    console.log(e);
    // swallow
  }
}

async function scenario2() {
  try {
    var mem1 = await driver.newMemberSignUp("1");
    var mem2 = await driver.newMemberSignUp("2");
    
    var treasury = await driver.createTreasury(["2"], "1", "1", 100);
    await driver.acceptInvite(mem2, treasury);
    await driver.addAddressToTreasury(treasury, "ABC");
    await driver.addTransactionToHistory(treasury, 10, "0", "345", 1 ,"02/03/2017");
    await driver.updateTreasuryBalance(treasury, 100);
    await driver.addTransactionToHistory(treasury, -5, "x100", "123", 2,  "02/03/2017");
    await driver.updateTreasuryBalance(treasury, 900);
    await driver.addTransactionToHistory(treasury, -12, "x102", "124", 3, "04/03/2018");
    await driver.addTransactionToHistory(treasury, -10, "x101", "125", 2, "03/04/2016");
  } catch(e) {
    console.log(e);
    // swallow
  }
}

async function scenario3() {
  try {
    var mem1 = await driver.newMemberSignUp("1");
    var mem2 = await driver.newMemberSignUp("2");
    var treasury = await driver.createTreasury(["2"], "1", "1", 10000);
    await driver.acceptInvite(mem2, treasury);
  } catch(e) {
    console.log(e);
    // swallow
  }
}

scenario1();
