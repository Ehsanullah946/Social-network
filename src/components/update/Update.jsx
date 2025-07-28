import { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Update = ({ setOpenUpdate,user }) => {
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const queryClient = useQueryClient();
    

   const [texts, setTexts] = useState({
      name: user.name || "",
      city: user.city || "",
      website: user.website || ""
});

      const upload = async(file) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await makeRequest.post('/uploads', formData);
          return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e)=>{
        setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    
 const mutation = useMutation({
  mutationFn: async (user) => {
    return await makeRequest.put("/users", user);
   },
     onSuccess: () => {
    // Refresh posts after successful post creation
    queryClient.invalidateQueries({ queryKey: ['user'] });
  },
});


  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;
    coverUrl = cover ?  await upload(cover): user.coverPic ;
    profileUrl = profile ? await upload(profile): user.profilePic;
    mutation.mutate({ ...texts, coverPic:coverUrl, profilePic:profileUrl });
      setOpenUpdate(false);
  }
console.log("Uploading cover:", cover);
console.log("Uploading profile:", profile);


    return <div className="update">
        <button onClick={() => setOpenUpdate(false)}>close</button>
        <form action="">
            <input type="file" onChange={e=>setCover(e.target.files[0])} />
            <input type="file" onChange={e=>setProfile(e.target.files[0])}  />
            <input type="text" name="name" onChange={handleChange} />
            <input type="text" name="city" onChange={handleChange} />
            <input type="text" name="website" onChange={handleChange} />
            <button onClick={handleClick}>Update</button>
        </form>
    </div>
}
 
export default Update;