const db = require("../db/queries");

async function createSettlement(req, res) {
    try {
        const group_id = req.params.id;
        const from_user = req.user.id;
        const {to_user, amount, currency} = req.body;
        if (to_user === "" || amount === undefined || amount === "" || currency.length === 0) {
            return res.status(400).json({message: "Cannot leave field empty"});
        }
        if (amount <= 0) {
            return res.status(400).json({message: "Amount must be greater than 0"})
        }
        const rows = await db.isMember(group_id, to_user);
        if (rows.length === 0) {
            return res.status(404).json({message: "That person isn't in the group"});
        }
        await db.insertSettlements(group_id, from_user, to_user, amount, currency);
        res.json({message: "Settlement created successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    }
}

async function getAllSettlements(req, res) {
    const settlements = await db.getAllSettlements();
    res.json(settlements);
}

module.exports = {
    createSettlement,
    getAllSettlements
};