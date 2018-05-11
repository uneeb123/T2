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
 *   spending_limit: <Integer>,
 *   shares: <Array of Share>,
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
 * Member document
 *
 * {
 *   _id: <ObjectId>,
 *   phone_number: <String>, // unique
 *   status: <Array of TreasuryStatus>
 * }
 *
 * TreasuryStatus
 *
 * {
 *   _id: <ObjectId>,
 *   treasury: <ObjectId>,
 *   invite_accepted: <Boolean>
 * }
 *
 */

class DatabaseClient {
  constructor() {
    let password = "v1LpAdxullM8Z8gY";
    let username = 'test_user';
    this.url = "mongodb+srv://" + username + ":" + password + "@noyou-4k2c1.mongodb.net/test";
    
    this.dbName = "Test";
    this.treasuryCollection = "Treasury";
    this.memberCollection = "Member";
  }

  _connectCollection(callback, collectionName) {
    var dbName = this.dbName;
    console.log("Attempting to connect to " + dbName + ":" + collectionName);

    MongoClient.connect(this.url, function(err, client) {
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
        // TODO send invites
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

  // DELETE
}

module.exports = DatabaseClient;
