import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CreateExpense() {
    const[group, setGroup] = useState("");
    const[description, setDescription] = useState("");
    const[amount, setAmount] = useState("");
    const[currency, setCurrency] = useState("");
    const[paidBy, setPaidBy] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
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
        } else {
            const data = await response.json();
            setErrorMessage(data.message);
        }
    }

    return(
        <>
            <h1 className="group-name">{group.name}</h1>
            <div className="card">
                <form onSubmit={handleCreate}>
                    <div className='field'>
                        <div>Description:</div>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className='field'>
                        <div>Amount:</div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className='field'>
                        <div>Currency:</div>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            required
                        >
                            <option value="">Select currency</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="SGD">SGD - Singapore Dollar</option>
                            <option value="IDR">IDR - Indonesian Rupiah</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="MYR">MYR - Malaysian Ringgit</option>
                            <option value="KRW">KRW - Korean Won</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="GBP">GBP - British Pound</option>
                        </select>
                    </div>

                    <div className='field'>Paid by: {paidBy.name}</div>
                    
                    <div className="error-message">{errorMessage}</div>
                    <button type="submit">Create Expense</button>
                </form>
            </div>
        </>
    )
}
export default CreateExpense;