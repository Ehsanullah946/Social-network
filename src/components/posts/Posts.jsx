import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";
import "./posts.scss";
// import makeRequest from "."


const Posts = () => {
  //TEMPORARY

const { isLoading, error, data } = useQuery({
  queryKey: ["posts"],
  queryFn: async () => {
    const res = await makeRequest.get("/posts");
    return res.data;
  },
});
  
  return <div className="posts">
    {error? "Something went wrong" : (isLoading? "loading.." : data.map(post=>(
      <Post post={post} key={post.id}/>
    )))}
  </div>;
};

export default Posts;
