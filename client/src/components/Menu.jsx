import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = ({cat}) => {
  // const posts = [
  //   {
  //     id: 1,
  //     title: "something",
  //     desc: "very good",
  //     img: "https://images.pexels.com/photos/296282/pexels-photo-296282.jpeg?auto=compress&cs=tinysrgb&w=600"
  //   },
  //   {
  //     id: 2,
  //     title: "another thing",
  //     desc: "ooga",
  //     img: "https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=600"
  //   }
  // ]

  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get('/posts/?cat=' + cat);
        setPosts(res.data);
      } catch (err){
        console.log(err);
      }
    };

    fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1>Other Posts you may like</h1>
      {posts.map(post => (
        <div className="post" key={post.id}>
          <img src={"../upload/" + post.img} alt="" />
          <h2>{post.title}</h2>
          <button>Read More</button>
        </div>
      ))}
    </div>
  )
}

export default Menu