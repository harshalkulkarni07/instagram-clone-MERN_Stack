import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
const CreatePost = () => {
  const history = useHistory();
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Created your amazing post",
              classes: "#42a5f5 blue lighten-1",
            });
            history.push("/");
          }
        });
    }
  }, [url]);
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "YOUR_CLOUD-NAME_FROM_CLOUDINARY");
    fetch("YOUR_CLOUDINARY-STORAGE_LINK/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className="card input-field"
      style={{
        margin: "10px auto",
        maxWidth: "600px",
        padding: "20px",
        textAlign: "center",
        marginTop: "30px",
      }}
    >
      <input
        type="text"
        placeholder="Add Caption"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        style={{ width: "245px", marginTop: "20px" }}
        onClick={() => postDetails()}
      >
        Post{" "}
      </button>
    </div>
  );
};
export default CreatePost;
