import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { useEffect , useState } from 'react'
import './Post.css'
import firebase from 'firebase'
import { db } from '../firebase'

function Post({postId,user, username, caption, imageUrl}) {
    const [comments , setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection('posts')
            .doc(postId)            
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot)=> {
                setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }
        return ()=>{
            unsubscribe()
        }
    }, [postId])

    const postComment = (e) =>{
        e.preventDefault()
        db.collection('posts').doc(postId).collection(comments).add({
            text:comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })   
        setComment('')
    }

    return (
        <div className='post'>
            
            <div className="post__header">
            <Avatar
            className='post__avatar'
            alt='Afeez BAdmos'
            src='https://cdn.pixabay.com/photo/2021/02/27/09/22/dog-6054052__340.jpg'/>
            <h3>{username}</h3>
            </div>
            <img
             className='post__image'
              src={imageUrl}
               alt=""
               />
            <h4 className='post__text'> <strong> { username } </strong>{caption}</h4>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>
                ))}
            </div>
            {user && (
            <form className='post__commentbox'>
                <input
                className='post__input'
                placeholder='Add a comment ...'
                onChange={(e)=> setComment(e.target.value)}
                type="text"/>

                <button
                className='post__button'
                disabled={!comment}
                type='submit'
                onClick={postComment}
                 >
                    Post
                </button>
            </form>
            )}


            
        </div>
    )
}

export default Post
