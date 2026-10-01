import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GroupDetail() {
    const[group, setGroup] = useState("");
    const[members, setMembers] = useState([]);
    const[expenses, setExpenses] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();

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
        const membersGet = async (e) => {
            const list = await fetch(`http://localhost:5000/api/groups/${id}/members`, {
                credentials: "include",
            })
            .then(res => res.json());
            setMembers(list);
        }
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

    return(
        <>
            <div className="group-name">{group.name}</div>
            <div>{group.creator_name} at {group.created_at}</div>

            <div>MEMBERS:</div>
            {members.map((member) => (
                <div key={member.id}>{member.name}</div>
            ))}
            
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