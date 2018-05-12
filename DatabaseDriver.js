const DatabaseClient = require('./DatabaseClient');
const client = new DatabaseClient();
const uuidv4 = require('uuid/v4');

module.exports = class DatabaseDriver {

  constructor() {
  }

  /**
   * Creates a new Treasury
   * @param {Array} members - list of members phone numbers
   * @param {String} treasurer - treasurer's phone number
   * @param {String} creator - creator's phone number
   * @param {String} spending_limit - amount that is
   * allowed to be spent from the treasury per day
   *
   * @returns {Promise} created treasury id
   */
  createTreasury(members, treasurer, creator, spending_limit) {
    return new Promise((resolve, reject) => {
      var treasuryId = uuidv4();
      this.findMemberByPhoneNumber(creator).then((creator) => {
        var creatorId = creator._id;
        this._allMembersMustExist(members).then((memberIds) => {
          var treasurerId = this.findMemberByPhoneNumber(treasurer);
          var treasury = {
            _id: treasuryId,
            members: memberIds,
            treasurer: treasurerId,
            created_by: creatorId,
            spending_limit: spending_limit,
            shares: [],
            history: [],
            ready: false,
          };
          client.insertTreasury(treasury, function() {
            console.log("Driver: New treasury (" + treasuryId + ") has been created!");
            memberIds.forEach((memberId) => {
              client.inviteMemberToTreasury(treasuryId, memberId, () => {
                console.log("Driver: Member (" + memberId + ") has been invited to treasury (" + treasuryId + ")");
              });
            });
            client.addCreatorToTreasury(treasuryId, creatorId, () => {
              console.log("Driver: Creator (" + memberId + ") has been added to treasury (" + treasuryId + ")");
            });
          });
          resolve(treauryId);
        }, (e) => {
          console.log(e.message);
          reject(new Error("unable to create treasury"));
        });
      }, (e) => {
        console.log(e.message);
        reject(new Error("unable to create treasury"));
      });
    });
  }

  sendContribution() {
  }

  doTransaction() {
  }

  getAllTreasuries() {
  }

  /**
   * Creates a new member. A new member should not have any treasuries to his name.
   * @param {String} phoneNumber - member's phone number
   * @returns {Promise} created member id
   */
  createAndRegisterMember(phoneNumber) {
    return new Promise((resolve) => {
      var memberId = uuidv4();
      var member = {
        _id: memberId,
        registered: true,
        phone_number: phoneNumber,
        status: [],
      };
      client.insertMember(member, () => {
        console.log("Driver: New member (" + memberId + ") has been created and registered!");
        resolve(memberId);
      });
    });
  }

  /**
   * Creates a new member. A new member should not have any treasuries to his name.
   * @param {String} phoneNumber - member's phone number
   * @returns {Promise} created member id
   */
  onlyCreateMember(phoneNumber) {
    var memberId = uuidv4();
    var member = {
      _id: memberId,
      registered: false,
      phone_number: phoneNumber,
      status: [],
    };
    return new Promise((resolve) => {
      client.insertMember(member, () => {
        console.log("Driver: New member (" + memberId + ") has been created!");
        resolve(memberId);
      });
    });
  }

  /**
   * Registers an existing member
   * @param {String} phoneNumber - member's phone number
   * @returns {Promise} created member id
   */
  onlyRegisterMember(phoneNumber) {
    return new Promise((resolve, reject) => {
      this.findMemberByPhoneNumber(phoneNumber).then((member) => {
        var memberId = member._id;
        client.registerMember(memberId, () => {
          console.log("Driver: Existing member (" + memberId + " is now registered!");
          resolve(memberId);
        });
      }, (e) => {
        reject(new Error("member not found"));
      });
    });
  }

  /**
   * Creates and/or registers a new member when he signs up
   * @param {String} phoneNumber - member's phone number
   * @returns {Promise} member object
   */
  newMemberSignUp(phoneNumber) {
    return new Promise((resolve, reject) => {
      if (!this.memberExists(phoneNumber)) {
        this.createAndRegisterMember(phoneNumber).then((memberId) => {
          resolve(memberId);
        }, (e) => {
          reject(e);
        });
      } else {
        this.onlyRegisterMember(phoneNumber).then((memberId) => {
          resolve(memberId);
        }, (e) => {
          reject(e);
        });
      }
    });
  }

  /**
   * Looks up if a member already exists in the database
   * @param {String} phoneNumber - member's phone number
   */
  memberExists(phoneNumber) {
    this.findMemberByPhoneNumber(phoneNumber).then((member) => {
      return true;
    }, (e) => {
      return false
    });
  }

  /**
   * Get all members
   * @param {Function} callback - callback to trigger when function completes
   */
  getAllMembers(callback) {
    client.getAllMembers((allMembers) => {
      callback(allMembers);
    });
  }

  /**
   * Find member by his phone number
   * @param {String} phoneNumber - member's phone number
   * @returns {Promise} member object
   */
  findMemberByPhoneNumber(phoneNumber) {
    return new Promise((resolve, reject) => {
      client.findMemberByPhoneNumber(phoneNumber, (member) => {
        if (member.length > 0) {
          resolve(member[0]);
        } else {
          reject(new Error("not found"));
        }
      });
    });
  }

  // HELPER functions
  
  _allMembersMustExists(phoneNumberList) {
    return new Promise((resolve, reject) => {
      var allMemberIds = [];
      function memberMustExist(i) {
        if (i >= phoneNumberList.length) {
          resolve(allMemberIds);
        } else {
          var phoneNumber = phoneNumberList[i];
          this.findMemberByPhoneNumber(phoneNumber).then((member) => {
            allMemberIds.push(member._id);
            memberMustExist(i+1);
          }, (e) => {
            onlyCreateMember(phoneNumber).then((memberId) => {
              allMemberIds.push(memberId);
              memberMustExist(i+1);
            }, (e) => {
              reject(new Error("unable to create member"));
            });
          });
        }
      }
      memberMustExists(0);
    });
  }
}
