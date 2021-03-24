import { useState , useEffect} from 'react'
import { auth, db } from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import Post from './components/Post';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const[posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user , setUser] = useState(null)
  const [ openSignIn, setOpenSignIn] = useState(false)


  useEffect(() => {
    auth.onAuthStateChanged((authUser)=> {
      if (authUser){
        //user has logged in
        console.log(authUser)
        setUser(authUser)       
      } else {
        setUser(null);
      }
    })
  }, [user , username])
  
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({ 
        id:doc.id,
        post:doc.data()        
      })))
    })
    // codes run here
  }, []);

  const signUp = (e) =>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username,
      })
    })
    .catch((error)=> alert(error.message))
    setOpen(false)

  }
const signIn = (event) =>{
  event.preventDefault();
  auth.signInWithEmailAndPassword(email,password)
  .catch((error)=> alert(error.message))
  setOpenSignIn(false)
}
  return (
    <div className="app">
       <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
              <center>
                  <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                  />
              </center>
              <Input
              placeholder='username'
              value={username}
              className=""
              onChange={(e)=> setUsername(e.target.value)}
              type="text"
              />
              <Input
              placeholder='email'
              value={email}
              className=""
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              />

              <Input
              placeholder='password'
              value={password}
              className=""
              onChange={(e)=> setPassword(e.target.value)}
              type="password"
              />
              <Button onClick={signUp}>Sign Up</Button>
          </form>
      </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
              <center>
                  <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                  />
              </center>
              <Input
              placeholder='username'
              value={username}
              className=""
              onChange={(e)=> setUsername(e.target.value)}
              type="text"
              />
              
              <Input
              placeholder='password'
              value={password}
              className=""
              onChange={(e)=> setPassword(e.target.value)}
              type="password"
              />
              <Button onClick={signIn}>Login</Button>
            </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
        className="app__headerImage"
         src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""/>
      {user ? (
        <Button onClick={()=> auth.signOut()}> Logout</Button>
      ) : (
        <div className="app__loginContainer">
           <Button onClick={()=> setOpenSignIn(true)}> Login</Button>
           <Button onClick={()=> setOpen(true)}> Sign up</Button>
        </div>
      )}
      </div>
      <div className="app__posts">
        <div className="app__postLeft">
      {posts.map(({id, post}) => (
        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
      ))}

      </div>
      <div className="app__postRight">
      <InstagramEmbed
        url='https://instagram.com/'
        clientAccessToken= '1142890146153624|749f6357455a982a1858719018a00a42'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      </div>
      </div>



      {user?.displayName ? (
      <ImageUpload username={user.displayName}/>
      ) : ( <h3>Sorry you need to login to upload </h3> )}
    </div>
  );
}

export default App;
