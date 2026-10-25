import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
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
                        <label>Email</label> 
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className='field'>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className='list-item'>Don't have an account? <a href="/register">Register</a>!</div>

                    <div>{errorMessage}</div>
                    <button type="submit">Log in</button>
                </form>
            </div>
        </>
    )
}
export default Login;