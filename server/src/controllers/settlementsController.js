async function createSettlement(req, res) {
    res.json ({message: "settlement created"});
}

async function getAllSettlements(req, res) {
    res.json ({message: "get all settlements"});
}

module.exports = {
    createSettlement,
    getAllSettlements
};