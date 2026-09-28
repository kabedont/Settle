import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const[user, setUser] = useState("");
    const[groups, setGroups] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        //fetch user's name
        const nameGet = async (e) => {
            const data = await fetch("http://localhost:5000/api/auth/me", { 
                credentials: "include",
            })
            .then(res => res.json());
            setUser(data.name);
        }
        nameGet()

        //fetch data for groups list
        const groupsGet = async (e) => {
            const list = await fetch("http://localhost:5000/api/groups", {
                credentials: "include",
            })
            .then(res => res.json());
            setGroups(list);
        }
        groupsGet();
    }, []); //fetch data when the page loads

    //create group button
    const handleCreate = (e) => {
        navigate('/group/new');
    }

    return(
        <>
            <div className="greeting">Welcome back, {user} !</div>
            <div>Groups List</div>
            <button type="button" onClick={handleCreate}>Create group</button>
            {groups.map((group) => (
                <div key={group.id} className="groups-list">{group.name}</div>
            ))}
        </>
    )
}
export default Home;