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
        const loggedin_user = req.user.id;
        const user_id = user[0].id;
        if  (loggedin_user == user_id) {
            return res.status(400).json({message: "That's you."});
        }
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

//calculate net balance
async function getBalancesByGroupId (req, res) {
    const group_id = req.params.id;

    const members = await db.getMembersByGroupId(group_id);
    const totalPaidList = await db.getTotalPaidByGroupId(group_id);
    const totalOwedList = await db.getTotalOwedByGroupId(group_id);
    
    //build one balance object per member
    const balances = members.map((member) => {
        //find this member's row in totalPaidList/totalOwedList (undefined if they're not in it)
        const paidEntry = totalPaidList.find((p) => p.id === member.id);
        const owedEntry = totalOwedList.find((o) => o.id === member.id);

        //wrap in Number() since SUM() comes back as a string from postgres
        const total_paid = paidEntry ? Number(paidEntry.total_paid) : 0; //if not found, default to 0
        const total_owed = owedEntry ? Number(owedEntry.total_owed) : 0;
        
        //positive = this person is owed money overall, negative = they owe money overall
        return {
            id: member.id,
            name: member.name,
            net_balance: total_paid - total_owed,
        };
    });

    res.json(balances);
}

module.exports = {
    createGroups,
    getAllGroups,
    getOneGroup,
    addMember,
    getMember,
    deleteGroup,
    getBalancesByGroupId
};