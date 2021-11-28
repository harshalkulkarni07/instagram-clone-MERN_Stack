import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
const SubscribedUserPosts = () => {
    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext);
    useEffect(() => {
        fetch("/getsubpost", {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result => {
                console.log(result.posts)

                setData(result.posts)
            })
    }, [])
    const likePost = (id)=>{
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
            .then(result => {
                const newData = data.map(item=>{
                    if(item._id===result._id){
                        return result;
                    }
                    else{
                        return item;
                    }
                })
                setData(newData);
            })
    }
    const unlikePost = (id)=>{
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
            .then(result => {
              const newData = data.map(item=>{
                  if(item._id===result._id){
                      return result;
                  }
                  else{
                      return item;
                  }
              })
              setData(newData);
            })
    }
    const makeComment = (text,postId)=>{
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
            .then(result => {
                const newData = data.map(item=>{
                    if(item._id===result._id){
                        return result;
                    }
                    else{
                        return item;
                    }
                })
                console.log(newData);
                setData(newData);
            })
    }
    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method: "delete",
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item=>{
                    return item._id !== result._id
                })
                setData(newData);
            })
    }
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key = {item._id}>
                            <div style={{ display: "flex", padding: "15px" }}>
                                <img style={{ width: "60px", height: "60px", borderRadius: "80px" }}
                                    src="https://images.unsplash.com/photo-1523956468692-1e219561ea46?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nzd8fHBlcnNvbnxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                                />
                                <h5 
                                style={{ padding: "10px", paddingLeft: "20px", marginTop: "3px" }}>
                                    <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id :  "/profile"}>
                                    {item.postedBy.name}</Link>
                                   {item.postedBy._id === state._id && <i className="material-icons" style={{cursor:"pointer",float:"right"}} onClick={()=>{deletePost(item._id)}}>delete</i>} 
                                </h5>
                            </div>

                            <div className="card-image">
                                <img
                                    src={item.photo} />
                            </div>
                            <div className="card-content" style={{padding: "15px"}}>
                                {
                                item.likes.includes(state._id) 
                                ? 
                                <i className="material-icons" style={{cursor:"pointer",color: "red"}} onClick={()=>{unlikePost(item._id)}}>favorite</i>
                                : <i className="material-icons" style={{cursor:"pointer"}} onClick={()=>{likePost(item._id)}}>favorite_border</i>
                                }
                                <h6>{item.likes.length} Likes</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                       return <h6 ><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text} </h6>
                                    })
                                }
                                 <form onSubmit={(e)=>{
                                     e.preventDefault()
                                     makeComment(e.target[0].value, item._id)
                                 }}>
                                 <input type="text" placeholder="Add comment" />
                                 </form>
                            </div>
                        </div> 

                    )
                })
            }
        </div>
    )
}
export default SubscribedUserPosts;