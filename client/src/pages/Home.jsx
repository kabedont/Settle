import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from "../config";

function Home() {
    const[user, setUser] = useState("");
    const[groups, setGroups] = useState([]);
    const navigate = useNavigate();

    //fetch data for groups list
    const groupsGet = async (e) => {
        const list = await fetch(`${API_URL}/api/groups`, {
            credentials: "include",
        })
        .then(res => res.json());
        setGroups(list);
    }
    
    useEffect(() => {
        //fetch user's name
        const nameGet = async (e) => {
            const data = await fetch(`${API_URL}/api/auth/me`, { 
                credentials: "include",
            })
            .then(res => res.json());
            setUser(data.name);
        }
        nameGet();

        //fetch groups list
        groupsGet();

    }, []); //fetch data when the page loads

    //create group button
    const handleCreate = (e) => {
        navigate('/group/new');
    }

    //delete group button
    const handleDelete = async (id) => {
        const reconfirm = window.confirm("Delete this group? All its members, expenses, and settlements will be permanently removed. This can't be undone.");

        if(!reconfirm){
            return;
        }

        const response = await fetch(`${API_URL}/api/groups/${id}`, {
            method: "DELETE",
            credentials: "include",
        })

        if(reconfirm && response.ok){
            groupsGet();
        }
    }

    return(
        <>
            <h1 className="greeting">Welcome back, {user} !</h1>
            <div className="card">
                <div className='flex-between'>
                    <h2>Your Groups</h2>
                    <button type="button" onClick={handleCreate}>Create group</button>
                </div>
                
            {groups.map((group) => (
                <div key={group.id} className='flex-between group-row'>
                    <Link to={`/group/${group.id}`}>
                        <div className="list-item">
                            {group.name}
                        </div>
                    </Link>
                <button className='delete-btn' type="button" onClick={(e) => handleDelete(group.id)}>🗑️</button>
                </div>
            ))}
                
            </div>
        </>
    )
}
export default Home;