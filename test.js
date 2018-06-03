const DatabaseDriver = require ('./DatabaseDriver');
const driver = new DatabaseDriver();

// NOTE tests are using dates in PST
async function scenario1() {
  try {
    var addr1 = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2";
    var addr2 = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy";
    var addr3 = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";

    var addr4 = "3CvKMSKYstWetfTVn5Au4n4GFp7yJaMLK5";
    var addr5 = "3UxBMKEYatWetqTFn6AudF4GSk1jFtMNN4";

    var tx1 = "571895a37bf4ac51d2c0e3b4e246428525dbaf7c4e2938cdb83170a51be9e1c8";
    var tx2 = "272137d347266df607ecbf7baf73691910c985444ccf59dc9246380216dd8b19";
    var tx3 = "4b25a0b863e94cfedac2736e31632c5ae0578ad66e9d2fdb7c294b16f54de46d";
    var tx4 = "a8aa697659e358383ccdeb33521c6f25d430f3d912ac14ea07b7b19c27768b52"; 
    var tx5 = "203aa194dc7cfe88463dad80d4afc267fb28b1c1daa1248f8b4d7893d15a630f";
    var tx6 = "66b0351da35ad4709959d563de6af5a91f4bfc127f7b494275bacfabe6674a7b";
    var tx7 = "98038555876024ec7889a62f55f135e3299718b6c96be1a222a98e4c61539684";
    var tx8 = "5b82f44bf2b0f338fe7685046b4a628b867ae74028f738f6dc0ee2a142e9eb16";
    var tx9 = "b7b053971cb45fb587819d9d558328504992ec77c3b83b6cb1384e29b1b7a644";
    var tx10 = "1190e9b31945721d091a047c189c6b147d4e6b0269a124956f196c779fe0e4f8";
    var tx11 = "5bbdeb84260b76934aea5f83df8379ae877c5cc5e390555354b38fa22d0a2993";

    var mem1 = await driver.newMemberSignUp("1");
    var mem2 = await driver.newMemberSignUp("2");
    var mem3 = await driver.newMemberSignUp("3");
    var mem4 = await driver.newMemberSignUp("4");

    var treasury1 = await driver.createTreasury(["2", "5"], "2", "1", 10000);

    var treasury2 = await driver.createTreasury(["3", "4"], "1", "1", 20000);
    await driver.acceptInvite(mem3, treasury2);
    await driver.acceptInvite(mem4, treasury2);
    await driver.addTransactionToHistory(treasury2, 20000, "0", tx1, 10000 ,"02/03/2017");
    await driver.addTransactionToHistory(treasury2, -10000, addr1, tx2, 10000 ,"03/03/2017");
    await driver.updateTreasuryBalance(treasury2, 10000);
    await driver.addAddressToTreasury(treasury2, addr4);

    var treasury3 = await driver.createTreasury(["1"], "1", "3", 50000);

    var treasury4 = await driver.createTreasury(["1"], "4", "4", 400000);
    await driver.acceptInvite(mem1, treasury4);
    await driver.addTransactionToHistory(treasury4, 50000, "0", tx3, 10000 ,"03/03/2018");
    await driver.addTransactionToHistory(treasury4, 100000, "0", tx4, 15000 ,"04/04/2018");
    await driver.addTransactionToHistory(treasury4, -10000, addr2, tx5, 10000 ,"05/04/2018");
    await driver.addTransactionToHistory(treasury4, -20000, addr1, tx6, 10000 ,"05/05/2018");
    await driver.addTransactionToHistory(treasury4, 100000, "0", tx7, 10000 ,"05/06/2018");
    await driver.addTransactionToHistory(treasury4, 500000, "0", tx8, 20000 ,"05/08/2018");
    await driver.addTransactionToHistory(treasury4, -10000, addr3, tx9, 10000 ,"05/12/2018");
    await driver.addTransactionToHistory(treasury4, -10000, addr4, tx10, 10000 ,"05/13/2018");
    await driver.addTransactionToHistory(treasury4, 10000, "0", tx11, 10000 ,"05/15/2018");
    await driver.updateTreasuryBalance(treasury4, 710000);
    await driver.addAddressToTreasury(treasury4, addr5);
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
