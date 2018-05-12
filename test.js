const driver = require ('./DatabaseDriver');
//const driver = new DatabaseDriver();

async function scenario() {
  try {
    await driver.newMemberSignUp("1");
    await driver.newMemberSignUp("2");
    await driver.getAllMembers((members) => {
      console.log(members);
    });
    await driver.createTreasury(["1", "2", "3"], "2", "1", 10);
    await driver.getAllMembers((members) => {
      console.log(members);
    });
    await driver.getAllTreasuries((treasuries) => {
      console.log(treasuries);
    })
  } catch(e) {
    // swallow
  }
}

scenario();
