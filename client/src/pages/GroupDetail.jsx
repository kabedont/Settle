import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GroupDetail() {
    const[group, setGroup] = useState("");
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
    }, []);

    return(
        <>
            <div className="group-name">{group.name}</div>
        </>
    )
}

export default GroupDetail;