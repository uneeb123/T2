const DatabaseDriver = require ('./DatabaseDriver');
const driver = new DatabaseDriver();

async function scenario() {
  await newMemberSignUp("1");
  await newMemberSignUp("2");
  await getAllMembers((members) {
    console.log(members);
  });
  await createTreasury(["1", "2", "3"], "2", "1", 10);
  await getAllMembers((members) {
    console.log(members);
  });
  await getAllTreasuries((treasuries) => {
    console.log(treasuries);
  })
}

scenario();
