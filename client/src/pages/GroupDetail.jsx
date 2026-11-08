import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function GroupDetail() {
    const[group, setGroup] = useState("");
    const[email, setEmail] = useState("");
    const[loggedInUser, setLoggedInUser] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const[members, setMembers] = useState([]);
    const[expenses, setExpenses] = useState([]);
    const[balance, setBalance] = useState([]);
    const[pairwiseBalance, setPairwiseBalance] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();

    //fetch members function
    const membersGet = async (e) => {
        const list = await fetch(`${API_URL}/api/groups/${id}/members`, {
            credentials: "include",
        })
        .then(res => res.json());
        setMembers(list);
    }

    //fetch expenses
    const expensesGet = async (e) => {
        const list = await fetch(`${API_URL}/api/groups/${id}/expenses`, {
            credentials: "include",
        })
        .then(res => res.json());
        setExpenses(list);
    }

    //fetch pairwise balance
    const pairwiseBalanceGet = async (e) => {
        const data = await fetch(`${API_URL}/api/groups/${id}/pairwise-balances`, {
            credentials: "include",
        })
        .then(res => res.json());
        setPairwiseBalance(data);
    }

    //fetch balance
    const balanceGet = async (e) => {
        const data = await fetch(`${API_URL}/api/groups/${id}/balances`, {
            credentials: "include",
        })
        .then(res => res.json());
        setBalance(data);
    }
    
    useEffect(() => {
        //fetch group
        const groupGet = async (e) => {
            const group = await fetch(`${API_URL}/api/groups/${id}`, {
                credentials: "include",
            })
            .then(res => res.json());
            setGroup(group);
        }
        groupGet();

        //fetch members
        membersGet();
        
        //fetch expenses
        expensesGet();

        //fetch logged in user
        const userGet = async (e) => {
            const user = await fetch(`${API_URL}/api/auth/me`, {
                credentials:"include",
            })
            .then(res => res.json());
            setLoggedInUser(user);
        }
        userGet();

        //fetch balance
        balanceGet();

        //fetch pairwise balance
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

        const response = await fetch(`${API_URL}/api/groups/${id}/members`, {
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
            setErrorMessage(data.message);
        }
    }

    //delete expense button
    const handleDelete = async (expenseId) => {
        const response = await fetch(`${API_URL}/api/groups/${id}/expenses/${expenseId}`, {
            method: "DELETE",
            credentials: "include",
        })
        if(response.ok) {
            expensesGet();
            balanceGet();
            pairwiseBalanceGet();
        }
    }

    //find logged in user's entry in balance array
    const myBalance = balance.find((b) => b.id === loggedInUser.id);

    return(
        <>
            <h1 className="group-name">{group.name}</h1>
            <div className="caption field">{group.creator_name} at {new Date(group.created_at).toLocaleString()}</div>

            <div className="card card-highlight flex-between">
                <div>
                    {myBalance
                        ? Object.entries(myBalance.balances).map(([currency, amount]) => (
                            <div key={currency}>
                                {amount >= 0 ? (
                                    <>You are owed <span className="amount-positive">{amount.toFixed(2)} {currency}</span></>
                                ) : (
                                    <>You owe <span className="amount-negative">{Math.abs(amount).toFixed(2)} {currency}</span></>
                                )}
                            </div>
                        ))
                        : "Loading..."}
                </div>
                <button type="button" onClick={handleSettle}>Settle Up</button>
            </div>

            
            <div className="card card-highlight">
                {pairwiseBalance.map((pair) => (
                    <div key={`${pair.debtor_id}-${pair.creditor_id}`}>
                        {pair.debtor_name} owes {pair.creditor_name} <span className="amount-neutral">{pair.amount.toFixed(2)} {pair.currency}</span>
                    </div>
                ))}
            </div>

            <div className="card">
                <h2>Members</h2>
                {members.map((member) => (
                    <div key={member.id} className="list-item"> {member.name}</div>
                ))}

                <form className="input-button" onSubmit={handleAdd}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit">Add Member</button>
                    <div className="error-message">{errorMessage}</div>
                </form>
            </div>
            
            <div className="card">
                <h2>Expenses</h2>
                {expenses.map((expense) => (
                    <div key={expense.expenseId} className='flex-between group-row'>
                        <div className="list-item">{expense.description} — {expense.amount} {expense.currency} (paid by {expense.payer_name})</div>
                        <button className="delete-btn" type="button" onClick={(e) => handleDelete(expense.id)}>🗑️</button>
                    </div>
                ))}
                <button type="button" onClick={handleCreate}>Add Expense</button>
            </div>
        </>
    )
}

export default GroupDetail;