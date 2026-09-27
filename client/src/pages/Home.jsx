import { useState, useEffect } from 'react'

function Home() {
    const[user, setUser] = useState("");
    
    useEffect(() => {
        const nameGet = async (e) => {
            const data = await fetch("http://localhost:5000/api/auth/me", { 
                credentials: "include",
            })
            .then(res => res.json());
            setUser(data.name);
        }
        nameGet()
    }, []);
    
    return(
        <>
            <div className="greeting">Welcome back, {user} !</div>
        </>
    )
}
export default Home;