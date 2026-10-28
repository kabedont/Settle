import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CreateSettlement() {
    //from_user, to_user, amount, currency
    const[group, setGroup] = useState("");
    const[loggedInUser, setLoggedInUser] = useState("");
    const[userOwedList, setUserOwedList] = useState([]);
    const[userOwed, setUserOwed] = useState("");
    const[amountOwed, setAmountOwed] = useState("");
    const[currency, setCurrency] = useState("");
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

        //fetch logged in user, pairwise balances, and filter
        const fetchData = async (e) => {
            
            //fetch logged in user FIRST, and wait
            const user = await fetch(`http://localhost:5000/api/auth/me`, {
                credentials:"include",
            })
            .then(res => res.json());
            setLoggedInUser(user);

            //fetch pairwise balance (user owed list)
            const pair = await fetch(`http://localhost:5000/api/groups/${id}/pairwise-balances`, {
                credentials:"include",
            })
            .then(res => res.json());

            //filter down to only pairs where the logged in user is the debtor
            const owedByMe = pair.filter((p) => p.debtor_id === user.id);
            setUserOwedList(owedByMe);
        }
        fetchData();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:5000/api/groups/${id}/settlements`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({to_user: userOwed, amount: amountOwed, currency}),
        })

        if(response.ok){
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
                <form onSubmit={handleSubmit}>

                    <div className='field'>FROM: {loggedInUser.name}</div>

                    <div className='field'>
                        <div>TO: </div>
                        <select
                            required
                            value={userOwed}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                setUserOwed(selectedId);

                                const entry = userOwedList.find((o) => o.creditor_id === Number(selectedId));
                                if (entry) {
                                    setAmountOwed(entry.amount);
                                    setCurrency(entry.currency);
                                }
                            }}
                        >
                            <option value="">Select who to pay</option>
                            {userOwedList.map((entry) => (
                                <option key={entry.creditor_id} value={entry.creditor_id}>
                                    {entry.creditor_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='field'>
                        <div>AMOUNT: </div>
                        <input
                            required
                            type="number"
                            value={amountOwed}
                            onChange={(e) => setAmountOwed(e.target.value)}
                        />
                    </div>

                    <div className='field'>
                        <div>CURRENCY: </div>
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
                    
                    <div className="error-message">{errorMessage}</div>
                    <button type="submit">Settle Up</button>
                </form>
            </div>
        </>
    )
}

export default CreateSettlement;