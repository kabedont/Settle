const db = require("../db/queries");

async function createGroups(req, res) {
    res.send("create groups");
}

async function getAllGroups(req, res) {
    res.send("get all groups");
}

async function getOneGroup(req, res) {
    res.send("get one group");
}

async function addMember(req, res) {
    res.send("add member");
}

async function deleteGroup(req, res) {
    res.send("delete group");
}

module.exports = {
    createGroups,
    getAllGroups,
    getOneGroup,
    addMember,
    deleteGroup
};