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
        User: id, name, surname, note, age, weight, height, hrStill, hrRef, hrMax, vMax, gender
        Record: id, path, start, end, members, note
        Settings: selectedTeam, csvDirectory, csvComponents, Temperatures, graphLength, eventNames
        */

        // Init of new database - if no db json is present
        db.defaults({ teams: [this.getDefaultTeam()], users: [this.getDefaultUser()], records: [], settings: this.getDefaultSettings() })
            .write();

        this.db = db;

        //db.get("records").remove().write()
    }

    getDefaultUser() {
        const defaultUser = {
            id: "0",
            name: "General",
            surname: "User",
            note: "To be edited",
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

    getDefaultTeam(onlyMembersId = false) {

        const defaultUser = this.getDefaultUser();
        const defaultTeam = {
            id: "0",
            name: "General Team",
            note: "To be edited",
            members: []
        }
        
        // Filling the defaultTeam
        for (let index = 0; index < 30; index++) {
           if(onlyMembersId) defaultTeam.members.push(defaultUser.id);
           else defaultTeam.members.push(defaultUser);
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

    getSelectedTeam(onlyMembersId = false) {
        const selectedTeamId = this.getSettings().selectedTeam;
        let team = this.db.get("teams").cloneDeep().find({ id: selectedTeamId }).value();

        if (onlyMembersId === true) {
            return team; // Only with member IDs
        }
        else {

            let members = [];
            for (let index = 0; index < team.members.length; index++) {
                const element = this.db.get("users").find({ id: team.members[index] }).value();
                members[index] = element;
            }

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
            team: this.getSelectedTeam(),
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

    getAllTeams(onlyMembersId = false) {

        let teams = this.db.get('teams').cloneDeep()
            .value()

        if (onlyMembersId) {
            return teams;
        } else {
            
            teams.forEach(team => {

                let members = [];
                for (let index = 0; index < team.members.length; index++) {
                    const element = this.db.get("users").find({ id: team.members[index] }).value();
                    members[index] = element;
                }
                team.members = members;
            });

            return teams;
        }


    }

    getAllUsers() {

        return this.db.get('users')
            .value()

    }

    getAllRecords() {
        return this.db.get('records')
            .value()
    }

    addUserOrTeam(record, collection) {

        record.id = shortid.generate();

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

    deleteItem(id, collection) {
        this.db.get(collection)
            .remove({ id: id })
            .write()
    }

    updateSettings(parameter){

        this.db.get('settings')
            .assign(parameter)
            .write()
    }
}
