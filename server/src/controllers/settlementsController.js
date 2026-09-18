const db = require("../db/queries");

async function createSettlement(req, res) {
    const group_id = req.params.id;
    const from_user = req.user.id;
    const {to_user, amount, currency} = req.body;
    await db.insertSettlements(group_id, from_user, to_user, amount, currency);
    res.json({message: "Settlement created successfully"});
}

async function getAllSettlements(req, res) {
    const settlements = await db.getAllSettlements();
    res.json(settlements);
}

module.exports = {
    createSettlement,
    getAllSettlements
};