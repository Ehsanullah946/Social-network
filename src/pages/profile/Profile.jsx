import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import {  useContext } from "react";
import { AuthContext } from "../../context/authContext";


const Profile = () => {

  const { currentUser } = useContext(AuthContext);
    const queryClient = useQueryClient();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery({
  queryKey: ["user"],
  queryFn: async () => {
    const res = await makeRequest.get("/users/find/"+userId);
    return res.data;
    },
  });




  const {isLoading:rIsLoading,  data:relationshipsData } = useQuery({
  queryKey: ["relationship"],
  queryFn: async () => {
    const res = await makeRequest.get("/relationships?followedUserId="+userId);
    return res.data;
    },
  });

  console.log(relationshipsData);

       const mutation = useMutation({
         mutationFn: async (following) => {
           if (following) return await makeRequest.delete("/relationships?userId="+ userId);
            return await makeRequest.post("/relationships",{userId});
            
        },
          onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['relationship'] });
       },
     });
    
    const handleFollowing = (e) => {
      e.preventDefault();
      mutation.mutate(relationshipsData?.includes(currentUser.id))
    }
  

  return (
    <div className="profile">
      <div className="images">
        <img
          src={data?.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={data?.profilePic}
          alt="profile image"
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="medium" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="medium" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="medium" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="medium" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="medium" />
            </a>
          </div>
          <div className="center">
            <span>{data?.username}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {rIsLoading ? "loading": userId === currentUser.id ? <button>update</button> :
              <button onClick={handleFollowing}>{relationshipsData.includes(currentUser.id) ? "following" : "follow"}</button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
    </div>
  );
};

export default Profile;
