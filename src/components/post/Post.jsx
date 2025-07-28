import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';
import moment from "moment";
import { makeRequest } from "../../axios";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  
  const queryClient = useQueryClient();

  // const [liked, setLike] = useState(null);

  
  const { isLoading, error, data } = useQuery({
  
  queryKey: ["likes",post.id],
  queryFn: async () => {
    const res = await makeRequest.get("/likes?postId="+post.id);
    return res.data;
  },
  });
  
     const mutation = useMutation({
       mutationFn: async (liked) => {
         if (liked) return await makeRequest.delete("/likes?postId="+ post.id);
          return await makeRequest.post("/likes", {postId:post.id});
          
      },
        onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['likes'] });
     },
   });

  
  const handleClick = (e) => {
    e.preventDefault();

    mutation.mutate(data?.includes(currentUser.id))


  }
  


  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./uploads/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item" >
            {data?.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleClick} /> : <FavoriteBorderOutlinedIcon  onClick={handleClick}  />}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
