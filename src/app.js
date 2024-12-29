let express = require( 'express' );
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );

app.use( favicon( path.join( __dirname, 'image.png' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

// app.get( '/', ( req, res ) => {
//     res.sendFile( __dirname + '/home.html' );
// } );
// app.get('/home', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });
// app.use(express.static(path.join(__dirname, 'src')));

// Route pour la page d'accueil (home)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Route pour la page d'index
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


io.of( '/stream' ).on( 'connection', stream );

server.listen( 3000 );
console.log('Application Démarrée!');