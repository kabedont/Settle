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
    const totalSettlements = await db.getSettlementsByGroupId(group_id);
    const totalPaidList = await db.getTotalPaidByGroupId(group_id);
    const totalOwedList = await db.getTotalOwedByGroupId(group_id);
    
    //build one balance object per member
    const balances = members.map((member) => {
        //grab every currency-row belonging to this member (can >=1)
        const paidEntries = totalPaidList.filter((p) => p.id === member.id);
        const owedEntries = totalOwedList.filter((o) => o.id === member.id);

        const paidOutEntries = totalSettlements.filter((f) => f.from_user === member.id);
        const receivedBackEntries = totalSettlements.filter((t) => t.to_user === member.id);

        //collect every currency that appears, for this member, in either list
        const currencies = new Set([
            ...paidEntries.map((p) => p.currency),
            ...owedEntries.map((o) => o.currency),
            ...paidOutEntries.map((p) => p.currency),
            ...receivedBackEntries.map((r) => r.currency),
        ])
        
        //net paid vs owed, separately for each currency
        const balancesByCurrency = {};
        for(const currency of currencies) {
            const paidEntry = paidEntries.find((p) => p.currency === currency);
            const owedEntry = owedEntries.find((o) => o.currency === currency)
            const paidOut = paidOutEntries
                .filter((p) => p.currency === currency)
                .reduce((sum, p) => sum + Number(p.amount), 0);
            const receivedBack = receivedBackEntries
                .filter((r) => r.currency === currency)
                .reduce((sum, r) => sum + Number(r.amount), 0);
                
            //wrap in Number() since SUM() comes back as a string from postgres
            const paid = paidEntry ? Number(paidEntry.total_paid) : 0; //if not found, default to 0
            const owed = owedEntry ? Number(owedEntry.total_owed) : 0;

            balancesByCurrency[currency] = (paid + paidOut) - (owed + receivedBack); //positive = owed money in this currency, negative: owes
            
            if (Math.abs(balancesByCurrency[currency]) < 0.01) balancesByCurrency[currency] = 0;
        }
        
        return {
            id: member.id,
            name: member.name,
            balances: balancesByCurrency
        };
    });

    res.json(balances);
}

//calculate net balance between debtor and creditor
async function getPairwiseBalancesByGroupId(req, res) {
    const group_id = req.params.id;
    const rawDebts = await db.getRawDebtsByGroupId(group_id);
    const members = await db.getMembersByGroupId(group_id);
    const settlements = await db.getSettlementsByGroupId(group_id);

    const netByPair = {};

    //CALCULATING TOTAL DEBTS OWED
    for (const row of rawDebts) {
        const smaller = Math.min(row.debtor_id, row.creditor_id);
        const larger = Math.max(row.debtor_id, row.creditor_id);
        const key = `${smaller}-${larger}-${row.currency}`;

        if (!netByPair[key]) netByPair[key] = 0; //first time seeing this pair, start at 0

        if (row.debtor_id === larger) {
            netByPair[key] += Number(row.total_owed); //larger-id person owes -> positive
        } else {
            netByPair[key] -= Number(row.total_owed); //smaller-id person owes -> negative
        }
    }

    //CALCULATING TOTAL SETTLEMENTS
    for (const row of settlements) {
        const smaller = Math.min(row.from_user, row.to_user);
        const larger = Math.max(row.from_user, row.to_user);
        const key = `${smaller}-${larger}-${row.currency}`;

        if (!netByPair[key]) netByPair[key] = 0;

        if (row.from_user === larger) {
            netByPair[key] -= Number(row.amount); //larger-id person settles -> negative
        } else {
            netByPair[key] += Number(row.amount); //smaller-id person settles -> positive
        }
    }

    //turn netByPair (raw keys + signed numbers) into a readable array with actual names
    const pairwise = [];
    for(const [key, netAmount] of Object.entries(netByPair)) {
        if (Math.abs(netAmount) < 0.01) continue; //skip pairs that are fully settled

        const [smallerIdStr, largerIdStr, currency] = key.split("-");
        const smallerId = Number(smallerIdStr);
        const largerId = Number(largerIdStr);

        //if netAmount is positive, the "larger" id person owes the "smaller" id person
        const debtorId = netAmount > 0 ? largerId : smallerId;
        const creditorId = netAmount > 0 ? smallerId : largerId;
        
        const debtor = members.find((m) => m.id === debtorId);
        const creditor = members.find((m) => m.id === creditorId);
        
        pairwise.push({
            debtor_id: debtor.id,
            debtor_name: debtor.name,
            creditor_id: creditor.id,
            creditor_name: creditor.name,
            amount: Math.abs(netAmount), //always positive
            currency: currency 
        });
    }

    res.json(pairwise);
}

module.exports = {
    createGroups,
    getAllGroups,
    getOneGroup,
    addMember,
    getMember,
    deleteGroup,
    getBalancesByGroupId,
    getPairwiseBalancesByGroupId
};