import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); //stops page from reloading

        const response = await fetch("http://localhost:5000/api/auth/log-in", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
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
            <div className="logo">Settle</div>
            <form onSubmit={handleSubmit}>
                <div>Email</div> 
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <div>Password</div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                <div>Don't have an account? <a href="/register">Register</a>!</div>

                <button type="submit">Submit</button>
            </form>
        </>
    )
}
export default Login;