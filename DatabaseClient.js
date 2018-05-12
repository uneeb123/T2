const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/*
 * There are two main collections for storage: Treasury collection and Member collection
 *
 * Treasury document
 *
 * {
 *   _id: <ObjectId>,
 *   members: <Array of ObjectId>, // all invited members
 *   treasurer: <ObjectId>,
 *   created_by: <ObjectId>,
 *   spending_limit: <Integer>,
 *   shares: <Array of Share>,
 *   history: <Array of TransactionHistory>,
 *   ready: <Boolean>
 * }
 *
 * Share document
 * 
 * {
 *   _id: <ObjectId>,
 *   member: <ObjectId>,
 *   contribution: <Integer>
 * }
 *
 * TransactionHistory document
 *
 * {
 *   _id: <ObjectId>,
 *   to_address: <String>,
 *   amount: <Integer>
 * }
 *
 * Member document
 *
 * {
 *   _id: <ObjectId>,
 *   registered: <Boolean>,
 *   phone_number: <String>, // should be unique; member not registered if null
 *   status: <Array of TreasuryStatus>
 * }
 *
 * TreasuryStatus
 *
 * {
 *   _id: <ObjectId>,
 *   treasury: <ObjectId>,
 *   invite_accepted: <Boolean>,
 *   unlock_requested: <Boolean>
 * }
 *
 */

module.exports = class DatabaseClient {
  constructor() {
    let password = "v1LpAdxullM8Z8gY";
    let username = 'test_user';
    this.url = "mongodb+srv://" + username + ":" + password + "@treasury-4k2c1.mongodb.net/test?retryWrites=true";
    
    this.dbName = "Test";
    this.treasuryCollection = "Treasury";
    this.memberCollection = "Member";
  }

  _connectCollection(collectionName, callback) {
    var dbName = this.dbName;
    console.log("Attempting to connect to " + dbName + ":" + collectionName);

    MongoClient.connect(this.url, { useNewUrlParser: true }, function(err, client) {
      assert.equal(null, err);
      if (err) {
        console.log(err.message);
      }

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      console.log("Successfully connected to database");
      callback(collection);
      client.close();
      console.log("Database connection closed");
    });
  }

  // CREATE

  insertTreasury(record, callback) {
    this._connectCollection(this.treasuryCollection, function(collection) {
      collection.insert(record, function(err, result) {
        assert.equal(null, err);
        callback();
      });
    });
  }

  insertMember(record, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.insert(record, function(err, result) {
        assert.equal(null, err);
        callback();
      });
    });
  }

  // READ

  getAllTreasuries(callback) {
    this._connectCollection(this.treasuryCollection, function(collection) {
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
      });
    });
  }

  getAllMembers(callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
      });
    });
  }

  getTreasury(id, callback) {
    this._connectCollection(this.treasuryCollection, function(collection) {
      collection.find({_id: id}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
      });
    });
  }

  getMember(id, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.find({_id: id}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
      });
    });
  }

  findMemberByPhoneNumber(phoneNumber, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.find({phone_number: phoneNumber}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
      });
    });
  }

  // UPDATE
  
  registerMember(memberId, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.update({_id: memberId}, {$set: { registered: true}}, function(err, result) {
        assert.equal(err, null);
        callback();
      });
    });
  }

  acceptInvite(memberId, treasuryId, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.update({_id: memberId, "status.treasury": treasuryId}, {$set: { "status.$.invite_accepted": true}}, function(err, result) {
        assert.equal(err, null);
        callback();
      });
    });
  }

  sendContribution(memberId, treasuryId, contribution, callback) {
    this._connectCollection(this.treasuryCollection, function(collection) {
      collection.update({_id: treasuryId, "shares.member": memberId}, {$inc: { "shares.$.contribution": contribution}}, function(err, result) {
        assert.equal(err, null);
        callback();
      });
    });
  }

  requestUnlock(memberId, treasuryId, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.update({_id: memberId, "status.treasury": treasuryId}, {$set: { "status.$.unlock_requested": true}}, function(err, result) {
        assert.equal(err, null);
        callback();
      });
    });
  }

  addTransactionToHistory(treasuryId, amount, to_address, callback) {
    this._connectCollection(this.treasuryCollection, function(collection) {
      collection.update({_id: treasuryId}, {$push: { history: {to_address: to_address, amount: amount}}}, function(err, result) {
        assert.equal(err, null);
        callback();
      });
    });
  }

  inviteMemberToTreasury(treasuryId, memberId, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.update({_id: memberId},
        {$push: { status: {
          treasury: treasuryId,
          invite_accepted: false,
          unlock_requested: false
        }}}, function(err, result) {
        assert.equal(err, null);
        callback();
      });
    });
  }

  addCreatorToTreasury(treasuryId, memberId, callback) {
    this._connectCollection(this.memberCollection, function(collection) {
      collection.update({_id: memberId},
        {$push: { status: {
          treasury: treasuryId,
          invite_accepted: true,
          unlock_requested: false
        }}}, function(err, result) {
        assert.equal(err, null);
        callback();
      });
    });
  }

  // DELETE

  // TODO
  deleteTreasury() {}

  // TODO
  deleteMember() {}
}
