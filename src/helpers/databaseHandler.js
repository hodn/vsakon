// Library init
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync'); // Synchronous
const shortid = require('shortid'); // Maker of unique IDs

module.exports = class DatabaseHandler {
    constructor(app) {
        this.app = app,
            this.db = null;
    }

    // DB initialization
    initDb() {

        const userDataPath = this.app.getPath('desktop');
        const adapter = new FileSync(userDataPath + '/db.json');
        const db = low(adapter);

        /*
        Team: id, name, note, members (users - id)
        User: id, name, surename, note, age, weight, height, hrStill, hrRef, hrMax, vMax, gender
        Record: id, path, start, end, members, note
        Settings: selectedTeam, csvDirectory, csvComponents, Temperatures, graphLength, eventNames
        */

        // Init of new database - if no db json is present
        db.defaults({ teams: [this.getDefaultTeam()], users: [this.getDefaultUser()], records: [], settings: this.getDefaultSettings() })
            .write();

        this.db = db;
    }

    getDefaultUser() {
        const defaultUser = {
            id: "0",
            name: "General",
            surname: "User",
            note: "This is a default user to be edited",
            age: 40,
            weight: 80,
            height: 180,
            hrRest: 70,
            hrRef: 80,
            hrMax: 150,
            vMax: 2500,
            gender: "Male"
        }

        return defaultUser;
    }

    getDefaultTeam() {

        const defaultUser = this.getDefaultUser();
        const defaultTeam = {
            id: "0",
            name: "General Team",
            note: "This is a default team to be edited",
            members: []
        }

        // Filling the defaultTeam
        for (let index = 0; index < 30; index++) {
            defaultTeam.members.push(defaultUser.id);
        }

        return defaultTeam;
    }

    getDefaultSettings() {
        const defaultSettings = {
            selectedTeam: "0",
            csvDirectory: this.app.getPath('desktop'),
            csvComponents: { basicData: true, locationData: true, nodeData: true, performanceData: true },
            graphLength: 40,
            optimalTemp: [30, 35],
            eventNames: ["Event 1", "Event 2", "Event 3", "Event 4"]
        }

        return defaultSettings;
    }

    getSettings() {
        return this.db.get('settings')
            .value()
    }

    getSelectedTeam(membersId = false) {
        const selectedTeamId = this.getSettings().selectedTeam;
        let team = this.db.get("teams").cloneDeep().find({ id: selectedTeamId }).value();
        let members = [];

        for (let index = 0; index < team.members.length; index++) {
            const element = this.db.get("users").find({ id: team.members[index] }).value();
            members[index] = element;
        }

        if (membersId === true) {
            return team; // Only with member IDs
        }
        else {

            team.members = members
            return team; // Members as objects

        }
    }

    addRecord(start, path) {

        let record = {
            id: shortid.generate(),
            path,
            start,
            end: null,
            team: this.getSelectedTeam(true),
            note: null
        }

        this.db.get('records')
            .push(record)
            .write()

        return record.id;
    }

    updateRecord(id, parameter) {

        this.db.get('records')
            .find({ id: id })
            .assign(parameter)
            .write()

        return id;
    }

    getAllTeams() {

        return this.db.get('teams')
            .value()

    }

    getAllUsers() {

        return this.db.get('users')
            .value()

    }

    addUserOrTeam(record, collection) {

        this.db.get(collection)
            .push(record)
            .write()
    }

    updateUserOrTeam(id, record, collection) {

        this.db.get(collection)
            .find({ id: id })
            .assign(record)
            .write()
    }

    deleteUserOrTeam(id, collection){
        this.db.get(collection)
            .remove({ id: id })
    }
}
