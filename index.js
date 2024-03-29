const express = require('express')
const app = express()
const port = 3000

const DatabaseDriver = require ('./DatabaseDriver');
const driver = new DatabaseDriver();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', (request, response) => {
  try {
    result = '"Welcome to Treasury server! The server sits at the very heart of treasury. It is the classic way to store data in one central location! While this might not be a great for transparency. It works really well for storage" - Uneeb';
    response.send(result);
  } catch(error) {
    response.send({error: 'unknown'});
  }
})

/*
 * GET
 * All the treasuries
 */
app.get('/treasury', (request, response) => {
  driver.getAllTreasuries((result) => {
    response.send(result);
  });
});

/*
 * GET
 * All the members (including invited)
 */
app.get('/member', (request, response) => {
  driver.getAllMembers((result) => {
    response.send(result);
  });
});

/*
 * POST
 * Create a new treasury
 *
 */
app.post('/treasury', (request, response) => {
  var invitedMembers = request.body.invited_members;
  var treasurer = request.body.treasurer;
  var creator = request.body.creator;
  var limit = request.body.limit;
  driver.createTreasury(invitedMembers, treasurer, creator, limit).then((treasuryId) => {
    response.send({id: treasuryId});
  }, (e) => {
    response.sendStatus(500);
  });
});

/*
 * POST
 * New member signed up
 */
app.post('/member', (request, response) => {
  var phoneNumber = request.body.phone_number;
  driver.newMemberSignUp(phoneNumber).then((memberId) => {
    response.send({id: memberId});
  }, (e) => {
    response.sendStatus(500);
  });
});

/*
 * GET
 * Get member by id
 * @params {id} member id
 */
app.get('/member/:id', (request, response) => {
  var memberId = request.params.id;
  driver.getMember(memberId).then((member) => {
    response.send(member);
  });
});

/*
 * POST
 * Change member status
 * @params {id} member id
 * @body {json} key: accepted_invite, value: treasury id
 */
app.post('/member/:id', (request, response) => {
  var memberId = request.params.id;
  var treasuryId = request.body.accepted_invite;
  driver.acceptInvite(memberId, treasuryId).then((ready) => {
    response.send(ready);
  }, (e) => {
    response.sendStatus(500);
  });
});

/*
 * GET
 * Get treasury by id
 * @params {id} treasury id
 */
app.get('/treasury/:id', (request, response) => {
  var treasuryId = request.params.id;
  driver.getTreasury(treasuryId).then((treasury) => {
    response.send(treasury);
  });
});

/*
 * POST
 * Update treasury by id
 * @params {id} treasury id
 * @body {json} field key and values of the treasury
 */
app.post('/treasury/:id', (request, response) => {
  var treasuryId = request.params.id;
  var amount = request.body.amount; // positive is incoming, negative is outgoing
  var to_address = request.body.to_address; // 0 represents our address
  var tx_id = request.body.tx_id;
  var timestamp = request.body.timestamp;
  var fee = request.body.fee;
  driver.addTransactionToHistory(treasuryId, amount, to_address, tx_id, fee, timestamp).then((treasuryId) => {
    response.sendStatus(200);
  }, (e) => {
    console.log(e);
    response.sendStatus(500);
  });
});

/*
 * POST
 * Update treasury balance by id
 * @params {id} treasury id
 * @body {json} balance of treasury
 */
app.post('/treasury/:id/balance', (request, response) => {
  var treasuryId = request.params.id;
  var balance = request.body.balance;
  driver.updateTreasuryBalance(treasuryId, balance).then((treasuryId) => {
    response.sendStatus(200);
  }, (e) => {
    console.log(e);
    response.sendStatus(500);
  });
});

/*
 * POST
 * Add new address to treasury
 * @param {id} treasury id
 * @body {json} new address to be added
 */
app.post('/treasury/:id/addr', (request, response) => {
  var treasuryId = request.params.id;
  var address = request.body.address;
  driver.addAddressToTreasury(treasuryId, address).then(() => {
    response.sendStatus(200);
  }, (e) => {
    response.sendStatus(500);
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log('something is messed up');
    return;
  }

  console.log(`server is listening on ${port}`)
})
