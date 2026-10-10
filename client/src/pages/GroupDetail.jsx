import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GroupDetail() {
    const[group, setGroup] = useState("");
    const[email, setEmail] = useState("");
    const[loggedInUser, setLoggedInUser] = useState("");
    const[members, setMembers] = useState([]);
    const[expenses, setExpenses] = useState([]);
    const[balance, setBalance] = useState([]);
    const[pairwiseBalance, setPairwiseBalance] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();

    //fetch members function
    const membersGet = async (e) => {
        const list = await fetch(`http://localhost:5000/api/groups/${id}/members`, {
            credentials: "include",
        })
        .then(res => res.json());
        setMembers(list);
    }
    
    useEffect(() => {
        //fetch group
        const groupGet = async (e) => {
            const group = await fetch(`http://localhost:5000/api/groups/${id}`, {
                credentials: "include",
            })
            .then(res => res.json());
            setGroup(group);
        }
        groupGet();

        //fetch members
        membersGet();

        //fetch expenses
        const expensesGet = async (e) => {
            const list = await fetch(`http://localhost:5000/api/groups/${id}/expenses`, {
                credentials: "include",
            })
            .then(res => res.json());
            setExpenses(list);
        }
        expensesGet();

        //fetch logged in user
        const userGet = async (e) => {
            const user = await fetch(`http://localhost:5000/api/auth/me`, {
                credentials:"include",
            })
            .then(res => res.json());
            setLoggedInUser(user);
        }
        userGet();

        //fetch balance
        const balanceGet = async (e) => {
            const data = await fetch(`http://localhost:5000/api/groups/${id}/balances`, {
                credentials: "include",
            })
            .then(res => res.json());
            setBalance(data);
        }
        balanceGet();

        //fetch pairwise balance
        const pairwiseBalanceGet = async (e) => {
            const data = await fetch(`http://localhost:5000/api/groups/${id}/pairwise-balances`, {
                credentials: "include",
            })
            .then(res => res.json());
            setPairwiseBalance(data);
        }
        pairwiseBalanceGet();

    }, []);

    //add expense button
    const handleCreate = (e) => {
        navigate(`/group/${id}/expense/new`);
    }

    //settle up button
    const handleSettle = (e) => {
        navigate(`/group/${id}/settle/new`);
    }

    //add member button
    const handleAdd = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:5000/api/groups/${id}/members`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({email}),
        })

        if(response.ok){
            membersGet();
        } else {
            const data = await response.json();
            console.log(data.message);
        }
    }

    //find logged in user's entry in balance array
    const myBalance = balance.find((b) => b.id === loggedInUser.id);
    let balanceText = "Loading...";
    if (myBalance) {
        if (myBalance.net_balance >= 0) {
            balanceText = `YOU ARE OWED ${myBalance.net_balance.toFixed(2)}`;
        } else {
            balanceText = `YOU OWE ${Math.abs(myBalance.net_balance.toFixed(2))}`;
        }
    }

    return(
        <>
            <div className="group-name">{group.name}</div>
            <div>{group.creator_name} at {new Date(group.created_at).toLocaleString()}</div>

            <div>{balanceText}</div>

            {pairwiseBalance.map((pair) => (
                <div key={`${pair.debtor_id}-${pair.creditor_id}`}>
                    {pair.debtor_name} owes {pair.creditor_name} {pair.amount.toFixed(2)}
                </div>
            ))}

            <div>MEMBERS:</div>
            {members.map((member) => (
                <div key={member.id}>{member.name}</div>
            ))}

            <form onSubmit={handleAdd}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Add Member</button>
            </form>
            
            <div>EXPENSES:</div>
            {expenses.map((expense) => (
                <div key={expense.id}>{expense.description} — {expense.amount} {expense.currency} (paid by {expense.payer_name})</div>
            ))}

            <button type="button" onClick={handleCreate}>Add Expense</button>
            <button type="button" onClick={handleSettle}>Settle Up</button>
        </>
    )
}

export default GroupDetail;