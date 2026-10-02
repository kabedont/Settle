import {useState} from "react";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
    {/*FUTURE TO-DO: convert to modal*/}
    const[name, setName] = useState("");
    const navigate = useNavigate();
    
    const handleSave = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/groups/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({name}),
        });

        if (response.ok) {
            navigate("/home");
        } else {
            console.log("creating group failed.");
        }
    }

    return(
        <>
            <div>Create Group</div>
            <form onSubmit={handleSave}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Save</button>
            </form>
        </>
    )   
}
export default CreateGroup;