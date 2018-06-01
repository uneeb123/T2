const DatabaseDriver = require ('./DatabaseDriver');
const driver = new DatabaseDriver();

async function scenario1() {
  try {
    await driver.getAllMembers((members) => {
      console.log(members);
    });
    await driver.newMemberSignUp("1");
    await driver.newMemberSignUp("2");
    await driver.getAllMembers((members) => {
      console.log(members);
    });
    await driver.createTreasury(["2", "3"], "2", "1", 10);
    await driver.getAllMembers((members) => {
      console.log(members);
    });
    await driver.getAllTreasuries((treasuries) => {
      console.log(treasuries);
    })
  } catch(e) {
    console.log(e);
    // swallow
  }
}

async function scenario2() {
  try {
    var mem1 = await driver.newMemberSignUp("1");
    console.log(mem1);
    var mem2 = await driver.newMemberSignUp("2");
    console.log(mem2);
    var mem3 = await driver.newMemberSignUp("3");
    console.log(mem3);
    var treasury = await driver.createTreasury(["2", "3"], "2", "1", 10);
    var treasury = await driver.createTreasury(["3"], "2", "2", 10);
    var list1 = await driver.getCreatedTreasuries(mem1);
    console.log("Created treasuries by member 1");
    console.log(list1);
    var list2 = await driver.getCreatedTreasuries(mem2);
    console.log("Created treasuries by member 2");
    console.log(list2);
    var list3 = await driver.getMemberTreasuries(mem3);
    console.log("Member treasuries by member 3");
    console.log(list3);
  } catch(e) {
    console.log(e);
    // swallow
  }
}

async function scenario3() {
  try {
    var mem1 = await driver.newMemberSignUp("1");
    console.log(mem1);
    var mem2 = await driver.newMemberSignUp("2");
    console.log(mem2);
    var mem3 = await driver.newMemberSignUp("3");
    console.log(mem3);
    var treasuryId = await driver.createTreasury(["2", "3"], "2", "1", 10);
    var treasury = await driver.getTreasury(treasuryId);
    console.log(treasury);
    await driver.addTransactionToHistory(treasuryId, 100, "x100");
    await driver.addTransactionToHistory(treasuryId, 200, "x101");
    var history = await driver.getTransactionHistory(treasuryId);
    console.log(history);
    var treasuryAgain = await driver.getTreasury(treasuryId);
    console.log(treasuryAgain);

  } catch(e) {
    console.log(e);
    // swallow
  }
}

async function scenario4() {
  try {
    var mem1 = await driver.newMemberSignUp("1");
    console.log(mem1);
    var mem2 = await driver.newMemberSignUp("2");
    console.log(mem2);
    var mem3 = await driver.newMemberSignUp("3");
    console.log(mem3);
    var treasuryId = await driver.createTreasury(["2", "3"], "2", "1", 10);
    var treasury = await driver.getTreasury(treasuryId);
    console.log(treasury);
    await driver.acceptInvite(mem2, treasuryId);
    var treasuryAgain = await driver.getTreasury(treasuryId);
    console.log(treasuryAgain);
    await driver.acceptInvite(mem3, treasuryId);
    var treasuryAgainAgain = await driver.getTreasury(treasuryId);
    console.log(treasuryAgainAgain);

  } catch(e) {
    console.log(e);
    // swallow
  }
}

async function scenario5() {
  try {
    var mem1 = await driver.newMemberSignUp("1");
    var mem2 = await driver.newMemberSignUp("2");
    var mem3 = await driver.newMemberSignUp("3");
    var mem4 = await driver.newMemberSignUp("4");

    var treasury1 = await driver.createTreasury(["2", "5"], "2", "1", 10);

    var treasury2 = await driver.createTreasury(["3", "4"], "1", "1", 20);
    await driver.acceptInvite(mem3, treasury2);
    await driver.acceptInvite(mem4, treasury2);
    await driver.addTransactionToHistory(treasury2, 2, "0");
    await driver.addTransactionToHistory(treasury2, -1, "x100");

    var treasury3 = await driver.createTreasury(["1"], "1", "3", 5);

    var treasury4 = await driver.createTreasury(["1"], "4", "4", 40);
    await driver.acceptInvite(mem1, treasury4);
    await driver.addTransactionToHistory(treasury4, 5, "0");
    await driver.addTransactionToHistory(treasury4, 10, "0");
    await driver.addTransactionToHistory(treasury4, -1, "x100");
    await driver.addTransactionToHistory(treasury4, -2, "x101");
    await driver.addTransactionToHistory(treasury4, 10, "0");
    await driver.addTransactionToHistory(treasury4, -5, "x101");
    await driver.addTransactionToHistory(treasury4, -1, "x102");
    await driver.addTransactionToHistory(treasury4, -1, "x103");
    await driver.addTransactionToHistory(treasury4, 1, "0");
  } catch(e) {
    console.log(e);
    // swallow
  }
}

async function scenario6() {
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

async function scenario7() {
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

scenario6();
