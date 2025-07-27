import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext)
  
  const upload = async() => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post('/uploads', formData);
      return res.data;
    } catch (error) {
      console.log(error);

    }
  }

  const queryClient = useQueryClient();


 const mutation = useMutation({
  mutationFn: async (newPost) => {
    return await makeRequest.post("/posts", newPost);
   },
     onSuccess: () => {
    // Refresh posts after successful post creation
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});

const handleChange = (e) => {
  setDesc(e.target.value);
// set text input value
  };
  const handleFileChange = (e) => {
  setFile(e.target.files?.[0]);
};
  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc(""); 
    setFile(null);
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">

          <img
            src={currentUser.profilePic}
            alt=""
            />
          <input type="text" placeholder={`What's on your mind ${currentUser.name}?`}
          onChange={handleChange}/>
          </div>
          <div className="right">
            {file && <img className="file" src={URL.createObjectURL(file)} alt="" />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={handleFileChange} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
