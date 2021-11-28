const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requiredLogin = require('../middelware/requiredLogin')

router.get('/allpost',requiredLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requiredLogin,(req,res)=>{
    const {body, pic} = req.body
    if(!body || !pic){
        return res.status(422).json({error:"Please fill all fields"})
    }
    console.log(req.body);
    req.user.password = undefined
    const post = new Post({
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result =>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requiredLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myPost=>{
        res.json({myPost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    
    },{
        //mongo will give last record if set to false here we want upadted record with like
        new:true
    }).exec((err,result)=>{
        if(err){
           return res.status(422).json({error:err}) 
        }else{
            res.json(result)
        }
    })
 
})
router.put('/unlike',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    
    },{
        //mongo will give last record if set to false here we want upadted record with like
        new:true
    }).exec((err,result)=>{
        if(err){
           return res.status(422).json({error:err}) 
        }else{
            res.json(result)
        }
    })
 
})
router.put('/comment',requiredLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    
    },{
        //mongo will give last record if set to false here we want upadted record with like
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
           return res.status(422).json({error:err}) 
        }else{
            res.json(result)
        }
    })
 
})
router.delete('/deletepost/:postId',requiredLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err || !post){
                return res.status(422).json({error:err})
            }else{
                if(post.postedBy._id.toString() === req.user._id.toString()){
                    post.remove()
                    .then(result=>{
                        res.json(result)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
            }
        })
})

router.get('/getsubpost',requiredLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router