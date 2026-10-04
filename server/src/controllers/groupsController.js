const db = require("../db/queries");

async function createGroups(req, res) {
    const {name} = req.body;
    const created_by = req.user.id;
    const group_id = await db.insertGroup(name, created_by);
    await db.addMember(created_by, group_id);
    res.json({message: "Group created successfully"});
}

async function getAllGroups(req, res) {
    const user_id = req.user.id;
    const groups = await db.getAllGroups(user_id);
    res.json(groups);
}

async function getOneGroup(req, res) {
    const id = req.params.id;
    const group = await db.getGroupById(id);
    res.json(group[0]);
}

async function addMember(req, res) {
    try {
        const group_id = req.params.id;
        const {email} = req.body;
        const user = await db.getUserByEmail(email);
        if (user.length === 0) { //when no rows came back
            return res.status(401).json({ message: "User not found." });
        }
        const user_id = user[0].id;
        await db.addMember(user_id, group_id);
        res.json({message: "Member added successfully"});
    } catch (err) {
        if (err.code === "23505") {
            res.status(400).json({message: "User already added."});
        } else {
            res.status(500).json({message: "Something went wrong."});
        }
    }
}

async function getMember(req, res) {
    const group_id = req.params.id;
    const members = await db.getMembersByGroupId(group_id);
    res.json(members);
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
    getMember,
    deleteGroup
};