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
