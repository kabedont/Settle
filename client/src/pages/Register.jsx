import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/sign-up", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({name, email, password}),
        });

        if (response.ok) {
            console.log(response.status);
            navigate('/home');
        } else {
            const data = await response.json();
            setErrorMessage(data.message);
        }
    }

    return(
        <>
            <h1 className="logo">Settle</h1>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className='field'>
                        <label>Name</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className='field'>
                        <label>Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
        
                    <div className='field'>
                        <label>Password</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="error-message">{errorMessage}</div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    )
}
export default Register;