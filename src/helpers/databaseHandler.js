// Library init
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync'); // Synchronous

// Lib for work with IDs
const lodashId = require('lodash-id');

module.exports = class DatabaseHandler {
    constructor(app) {
        this.path = app.getPath('userData')
    }

    // DB initialization
    initDb() {

        const adapter = new FileSync(this.path + '/db.json');
        const db = low(adapter);
        db._.mixin(lodashId);

        /*
        Team: id, name, note, members (users - id)
        User: id, name, surename, note, age, weight, height, hrStill, hrRef, hrMax, vMax, gender
        Record: id, path, start, end, members, note
        */

        const defaultUser = {
            id: 0,
            name: "General",
            surename: "User",
            note: "This is a default user to be edited",
            age: 40,
            weight: 80,
            height: 180,
            hrStill: 70,
            hrRef: 80,
            hrMax: 150,
            vMax: 2500,
            gender: "Male"
        }

        const defaultTeam = {
            id: 0,
            name: "General Team",
            note: "This is a default team to be edited",
            members: []
        }

        // Filling the defaultTeam
        for (let index = 0; index < 30; index++) {
            defaultTeam.members.push(defaultUser);
        }

        // Init of new database - if no db json is present
        db.defaults({ teams: [defaultTeam], users: [defaultUser], records: [], settings: {} })
            .write()
    }
}
