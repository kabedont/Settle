import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GroupDetail() {
    const[group, setGroup] = useState("");
    const[members, setMembers] = useState([]);
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

        //fetch members
        const membersGet = async (e) => {
            const list = await fetch(`http://localhost:5000/api/groups/${id}/members`, {
                credentials: "include",
            })
        .then(res => res.json());
        setMembers(list);
        }
        membersGet();

    }, []);

    return(
        <>
            <div className="group-name">{group.name}</div>
            <div>{group.creator_name} at {group.created_at}</div>
            <div>MEMBERS:</div>
            {members.map((member) => (
                <div key={member.id}>{member.name}</div>
            ))}
        </>
    )
}

export default GroupDetail;