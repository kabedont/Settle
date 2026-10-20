import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
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
            console.log("login failed.");
            console.log("status:", response.status);
            const data = await response.text();
            console.log("server says:", data); 
        }
    }

    return(
        <>
            <h1 className="logo">Settle</h1>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
        
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    )
}
export default Register;