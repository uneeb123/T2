const DatabaseClient = require('./DatabaseClient');
const uuidv4 = require('uuid/v4');

const DATABASENAME = "Test6";
const client = new DatabaseClient(DATABASENAME);

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
          this.findMemberByPhoneNumber(treasurer).then((treasurerObject) => {
            var treasurerId = treasurerObject._id;
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
                console.log("Driver: Creator (" + creatorId + ") has been added to treasury (" + treasuryId + ")");
              });
              resolve(treasuryId);
            });
          }, (e) => {
            console.log(e.message);
            reject(new Error("unable to create treasury"));
          });
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

  getAllTreasuries(callback) {
    client.getAllTreasuries((allMembers) => {
      callback(allMembers);
    });
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
   * @returns {Promise} member id
   */
  newMemberSignUp(phoneNumber) {
    return new Promise((resolve, reject) => {
      this.findMemberByPhoneNumber(phoneNumber).then((member) => {
        if (member.registered) {
          console.log("Driver: Existing member (" + member._id + ") is already registered!");
          resolve(member._id);
        }
        else {
          this.onlyRegisterMember(phoneNumber).then((memberId) => {
            resolve(memberId);
          }, (e) => {
            reject(e);
          });
        }
      }, (e) => {
        // member not found
        this.createAndRegisterMember(phoneNumber).then((memberId) => {
          resolve(memberId);
        }, (e) => {
          reject(e);
        });
      });
    });
  }

  /**
   * Looks up if a member already exists in the database
   * @param {String} phoneNumber - member's phone number
   * @returns {Promise} boolean whether member exists
   */
  memberExists(phoneNumber) {
    return new Promise((resolve, reject) => {
      this.findMemberByPhoneNumber(phoneNumber).then((member) => {
        resolve(true);
      }, (e) => {
        // swallow
        // ... not found
        resolve(false);
      });
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

  acceptInvite(memberId, treasuryId) {
    return new Promise((resolve, reject) => {
      client.acceptInvite(memberId, treasuryId, () => {
        console.log("Driver: Member (" + memberId + ") has accepted invite to treasury (" + treasuryId + ")");
        this.isTreasuryReady(treasuryId).then((ready) => {
          if (ready) {
            client.setTreasuryReady(treasuryId, () => {
              console.log("Driver: Treasury (" + treasuryId + ") is now ready");
              resolve(true);
            });
          } else {
            console.log("Driver: Treasury (" + treasuryId + ") is still not ready");
            resolve(false);
          }
        }, (e) => {
          reject(e);
        });
      });
    });
  }

  isTreasuryReady(treasuryId) {
    return new Promise((resolve, reject) => {
      var allInvitesAccepted = true;
      this.getTreasury(treasuryId).then((treasury) => {
        var allInvitedMembers = treasury.members;
        function memberInviteAccepted(i, that) {
          if (i >= allInvitedMembers.length) {
            resolve(allInvitesAccepted);
          } else {
            var memberId = allInvitedMembers[i];
            that.getMember(memberId).then((member) => {
              var allStatus = member.status;
              var treasuryFound = allStatus.find(function(status) {
                return (status.treasury == treasuryId);
              });
              if (!treasuryFound) {
                reject(new Error("misconfigured treasury"));
              }
              allInvitesAccepted = allInvitesAccepted && treasuryFound.invite_accepted;
              if (!allInvitesAccepted) {
                resolve(false);
              } else {
                memberInviteAccepted(i+1, that);
              }
            }, (e) => {
              reject(e);
            });
          }
        }
        memberInviteAccepted(0, this);
      }, (e) => {
        reject(e);
      });
    });
  }

  addTransactionToHistory(treasuryId, amount, to_address) {
    return new Promise((resolve, reject) => {
      client.addTransactionToHistory(treasuryId, amount, to_address, () => {
        console.log("Driver: Transaction " + amount + " satoshis to " + to_address + " created");
        resolve(treasuryId);
      });
    });
  }

  getTransactionHistory(treasuryId) {
    return new Promise((resolve, reject) => {
      client.getTreasury(treasuryId, (treasuryArray) => {
        var history = treasuryArray[0].history;
        resolve(history);
      });
    });
  }

  getCreatedTreasuries(memberId) {
    return new Promise((resolve, reject) => {
      this.getAllTreasuriesForMember(memberId).then((allTreasuries) => {
        var createdTreasuries = allTreasuries.filter(function(treasury) {
          return (treasury.created_by == memberId);
        }); 
        resolve(createdTreasuries);
      }, (e) => {
        reject(e);
      });
    });
  }

  getMemberTreasuries(memberId) {
    return new Promise((resolve, reject) => {
      this.getAllTreasuriesForMember(memberId).then((allTreasuries) => {
        var createdTreasuries = allTreasuries.filter(function(treasury) {
          return ((treasury.created_by != memberId) && 
            (treasury.members.indexOf(memberId) != -1));
        }); 
        resolve(createdTreasuries);
      }, (e) => {
        reject(e);
      });
    });
  }

  getAllTreasuriesForMember(memberId) {
    return new Promise((resolve, reject) => {
      client.getMember(memberId, (memberArray) => {
        var member = memberArray[0];
        var memberTreasuryIds = member.status.map(treasuryStatus => treasuryStatus.treasury);
        this._getTreasuries(memberTreasuryIds).then((treasuries) => {
          resolve(treasuries);
        }, (e) => {
          reject(e);
        });
      });
    });
  }

  getTreasury(treasuryId) {
    return new Promise((resolve, reject) => {
      client.getTreasury(treasuryId, (treasuryArray) => {
        var treasury = treasuryArray[0];
        resolve(treasury);
      });
    });
  }

  getMember(memberId) {
    return new Promise((resolve, reject) => {
      client.getMember(memberId, (memberArray) => {
        var member = memberArray[0];
        resolve(member);
      });
    });
  }

  // HELPER functions
  
  _getTreasuries(treasuryIds) {
    return new Promise((resolve, reject) => {
      var allTreasuries = [];
      function getTreasury(i) {
        if (i >= treasuryIds.length) {
          resolve(allTreasuries);
        } else {
          var treasuryId = treasuryIds[i];
          client.getTreasury(treasuryId, (treasuryArray) => {
            var treasury = treasuryArray[0];
            allTreasuries.push(treasury);
            getTreasury(i+1);
          });
        }
      }
      getTreasury(0);
    });
  }
  
  _allMembersMustExist(phoneNumberList) {
    return new Promise((resolve, reject) => {
      var allMemberIds = [];
      function memberMustExist(i, that) {
        if (i >= phoneNumberList.length) {
          resolve(allMemberIds);
        } else {
          var phoneNumber = phoneNumberList[i];
          that.findMemberByPhoneNumber(phoneNumber).then((member) => {
            allMemberIds.push(member._id);
            memberMustExist(i+1, that);
          }, (e) => {
            that.onlyCreateMember(phoneNumber).then((memberId) => {
              allMemberIds.push(memberId);
              memberMustExist(i+1, that);
            }, (e) => {
              reject(new Error("unable to create member"));
            });
          });
        }
      }
      memberMustExist(0, this);
    });
  }
}
