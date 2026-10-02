import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GroupDetail() {
    const[group, setGroup] = useState("");
    const[email, setEmail] = useState("");
    const[members, setMembers] = useState([]);
    const[expenses, setExpenses] = useState([]);
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
            console.log("User not found.");
        }
    }

    return(
        <>
            <div className="group-name">{group.name}</div>
            <div>{group.creator_name} at {new Date(group.created_at).toLocaleString()}</div>

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