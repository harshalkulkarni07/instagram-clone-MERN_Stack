import React, { useContext,useRef,useEffect ,useState} from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import companyLogo from "../assets/sprite.png";
import M from 'materialize-css'
const NavBar = () => {
  const  searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
   const {state,dispatch} = useContext(UserContext)
   const history = useHistory()
   useEffect(()=>{
       M.Modal.init(searchModal.current)
   },[])
  const renderList = () => {
    if (state) {
      return [
        <li>
          <i
            class="material-icons modal-trigger"
            style={{ paddingRight: "15px", cursor: "pointer" }}
            data-target="modal1"
          >
            search
          </i>
        </li>,
        <li>
          <i
            className="material-icons"
            style={{ paddingRight: "15px", cursor: "pointer" }}
            onClick={() => {
              history.push("/profile");
            }}
          >
            person
          </i>
        </li>,
        <li>
          <i
            className="material-icons"
            style={{ paddingRight: "15px", cursor: "pointer" }}
            onClick={() => {
              history.push("/create");
            }}
          >
            add
          </i>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            style={{ width: "145px", paddingRight: "15px", cursor: "pointer" }}
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            logout{" "}
          </button>
        </li>,
        <li>
          <Link to="/myfollowingpost" style={{ fontWeight: "bold" }}>
            My Following's Post
          </Link>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin" style={{ fontWeight: "bold" }}>
            Signin
          </Link>
        </li>,
        <li>
          <Link to="/signup" style={{ fontWeight: "bold" }}>
            Signup
          </Link>
        </li>,
      ];
    }
  };
  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
 }

  return (
    <nav>
      <div className="nav-wrapper white " style={{ color: "black" }}>
        <img
          className="left"
          className="logo"
          src={companyLogo}
          width="40"
          height="40"
        />
        <Link to={state ? "/" : "/signin"} className="brand-logo  left" style={{left:'60px'}}>
          Instagram
        </Link>
        <ul id="nav-mobile " className="right">
          {renderList()}
        </ul>
      </div>
      <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={"/profile/"+item._id} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>
      
    </nav>
  );
};

export default NavBar;
