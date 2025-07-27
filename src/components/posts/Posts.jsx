import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
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

  console.log(data)

  return <div className="posts">
    {isLoading? "loading.." : data.map(post=>(
      <Post post={post} key={post.id}/>
    ))}
  </div>;
};

export default Posts;
