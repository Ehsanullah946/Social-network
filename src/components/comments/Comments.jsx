import { useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import moment from "moment";
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';
import { useState } from "react";

const Comments = ({postId}) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  //Temporary

   const queryClient = useQueryClient();

   
   const { isLoading, error, data } = useQuery({
     queryKey: ["comments"],
     queryFn: async () => {
       const res = await makeRequest.get("/comments?postId="+postId);
       return res.data;
      },
      
   });
  
  
    
  console.log(error);
  
    const mutation = useMutation({
     mutationFn: async (newComment) => {
       return await makeRequest.post("/comments", newComment);
      },
        onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['comments'] });
     },
   });

  
  const handleClick = async (e)=>{
    e.preventDefault();
     console.log("Sending comment:", { desc, postId }); 
    mutation.mutate({ desc, postId })
    setDesc("");
  }

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment"  value={desc} onChange={e=>setDesc(e.target.value)} />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? "loading.." : data.map((comment) => (
        <div className="comment">
          <img src={comment.profilePicture} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
