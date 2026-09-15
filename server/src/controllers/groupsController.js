const db = require("../db/queries");

async function createGroups(req, res) {
    const {name} = req.body;
    const created_by = req.user.id;
    await db.insertGroup(name, created_by);
    res.json({message: "Group created successfully"});
}

async function getAllGroups(req, res) {
    const groups = await db.getAllGroups();
    res.json(groups);
}

async function getOneGroup(req, res) {
    const id = req.params.id;
    const group = await db.getGroupById(id);
    res.json(group[0]);
}

async function addMember(req, res) {
    const {user_id, group_id} = req.body;
    await db.addMember(user_id, group_id);
    res.json({message: "Member added successfully"});
}

async function deleteGroup(req, res) {
    const id = req.params.id;
    await db.deleteGroup(id);
    res.json({message: "Group deleted successfully"});
}

module.exports = {
    createGroups,
    getAllGroups,
    getOneGroup,
    addMember,
    deleteGroup
};