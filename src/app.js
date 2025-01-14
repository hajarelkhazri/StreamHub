let express = require( 'express' );
let bodyParser= require ('body-parser');
let pg =require ('pg');
const db=new pg.Client({
  user:"streamhubdb_user",
  host:"dpg-cu36rk5ds78s73egasq0-a",
  database:"streamhubdb",
  password:"NekgrrTVNF2tfLkr5pZWkhtLMs49Mng4",
  port:5432,
});
db.connect();
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );

app.use( favicon( path.join( __dirname, 'image.png' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

 app.get( '/', ( req, res ) => {
     res.sendFile( __dirname + '/home.html' );
 } );
// app.get('/home', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });

// Route pour la page d'accueil (home)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'home.html'));
// });

// Route pour la page d'index
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.of( '/stream' ).on( 'connection', stream );
app.get("/login", (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post("/register", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
  console.log(email)
  console.log(password)
  try{ 
  const checkout= await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email,] 
  ) 
  if(checkout.rows.length>0) {
    res.send("email already exist try to log in")
  }  
  else{
     const result= await db.query(
    "INSERT INTO users (email,password) VALUES ($1,$2)",
    [email,password]
  )
  console.log(result);
  res.sendFile(__dirname + '/index.html');
  }
   }
  catch(err){
    console.log(err);
  }
  
});

app.post("/login", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
  console.log(email)
  console.log(password)
  const result = await db.query(
    "SELECT * FROM users  WHERE email=$1",
    [email]
  )
    if(result.rows.length>0){
      const user= result.rows[0];
      const ps=user.password;
      if(ps===password){
        res.sendFile(__dirname + '/index.html')
      }
      else{
        res.send("invalid password")
      }
    }
    else{
      res.send("email dosnt exist try to register")
     }  
  
});

server.listen( 3000 );
console.log('Application Démarrée!');
