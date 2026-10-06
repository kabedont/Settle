import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CreateExpense() {
    const[group, setGroup] = useState("");
    const[description, setDescription] = useState("");
    const[amount, setAmount] = useState("");
    const[currency, setCurrency] = useState("");
    const[paidBy, setPaidBy] = useState("");
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

        //fetch logged in user
        const userGet = async (e) => {
            const user = await fetch(`http://localhost:5000/api/auth/me`, {
                credentials:"include",
            })
            .then(res => res.json());
            setPaidBy(user);
        }
        userGet();
    }, []);

    //create expense button
    const handleCreate = async (e) => {
        e.preventDefault();

        const response = await fetch (`http://localhost:5000/api/groups/${id}/expenses`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({description, amount, currency}),
        })

        if (response.ok) {
            console.log(response.status);
            navigate(`/group/${id}`);
        }
    }

    return(
        <>
            <div className="group-name">{group.name}</div>
            <form onSubmit={handleCreate}>
                <div>Description:</div>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div>Amount:</div>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <div>Currency:</div>
                <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                />

                <div>Paid by: {paidBy.name}</div>

                <button type="submit">Create Expense</button>
            </form>
        </>
    )
}
export default CreateExpense;