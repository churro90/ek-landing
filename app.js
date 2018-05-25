const express      = require('express'),
    path           = require('path'),
    bodyParser     = require('body-parser'),
    cors           = require('cors'),
    mongoose       = require('mongoose'),
    nodemailer     = require('nodemailer'),
    Usuario        = require('./models/usuario'),
    Proveedor      = require('./models/proveedor'),
    MongoClient    = require('mongodb').MongoClient;
    config         = require('./config/database');

     mongoose.connect(config.database);
 /*    MongoClient.connect(config.database, function(err, db) {
        console.log("connected to " + db)
        db.close();
     });
       */

    // On connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database: '+config.database);
});
// On error
mongoose.connection.on('error', (err) => {
    console.log('Database error: '+err);
});


const app = express();

const port = 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});


app.get('/', (req, res , next) => {
    res.render('index.html');
});

app.post('/nuevo-proveedor', (req, res, next) =>{
    let nuevoProveedor = {
        tipo: req.body.tipo,
        email: req.body.email,
        nombreEmpresa: req.body.empresa,
        nombreContacto: req.body.nombreContacto,
        numeroContacto: req.body.numeroContacto,
        descripcionEmpresa: req.body.descripcion
    }
   
    Proveedor.create(nuevoProveedor, (err, proveedor) => {
        if(err) {
            res.json({success: false, msg:'Failed to register proveedor', err:err});
          } else {           
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: config.user, // generated ethereal user
                pass: config.pass // generated ethereal password
            },
        tls:{
            rejectUnathorized: false
        }
            
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'EntreKids <' +config.user+'>' , // sender address
            to:  nuevoProveedor.email, // list of receivers
            subject: 'Registro exitoso ✔', // Subject line
            attachments: [{
                filename: 'entrekids.png',
                path: 'public/images/entrekids.png',
                cid: 'entrekids@unique.cl' //same cid value as in the html img src
            }],
            html: `
            
            <body style="background-color: #f5f5f5; color: rgb(119,119,120);">
            
            <table class="head-wrap">
            <tr>
            <td></td>
            <td class="header container">
            <div class="content">
            <table>
            <tr>
            <td><img src="cid:entrekids@unique.cl" style="width: 18%; height: 18%;" /></td>            
            </tr>
            </table>
            </div>
            </td>
            <td></td>
            </tr>
            </table>
            
            <table style="width:100%;max-width:580px;margin:0 auto" align="center" cellpadding="0" cellspacing="0" >
            <tbody>       
                            
                           
             
                    
          
            <tr>
            <td style="border-radius:4px;padding:38px 7.5% 30px;background-color:#ffffff;border:solid 1px #d6d6d6"> 
            <h2 style="font-family: 'Calibri';">Hola! </h2>   
            <br>               
            <h2 style="font-family: 'Calibri';">
            Gracias por preferir Entrekids! Tu registro ha sido exitoso. Pronto estaremos en funcionamiento y te estaremos anunciando fechas y promociones de lanzamiento. Cualquier consulta no dudes en escribirnos a contacto@entrekids.cl</h2>              
            <br>
            <h2 style="font-family: 'Calibri';">Atentamente,</h2>
            <br>
            <h2 style="font-family: 'Calibri';">Equipo EntreKids </h2>
            </td>
            </tr>
            </tbody>
            </table>
            
           
         
          
            
                        `, // plain text body
           
        };
       
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
              res.json({success: true, msg:'Registro exitoso'});
            }
    });
   
 });
 
 app.post('/nuevo-usuario', (req, res, next) => {
    let nuevoUsuario = {
        tipo: req.body.tipo,
        email: req.body.email,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        panoramas: req.body.panoramas
    }
   
    Usuario.create(nuevoUsuario, (err, usuario) => {
        if(err) {
            res.json({success: false, msg:'Failed to register usuario', err:err});
          } else {           
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: config.user, // generated ethereal user
                pass: config.pass // generated ethereal password
            },
        tls:{
            rejectUnathorized: false
        }
            
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'EntreKids <' +config.user+'>' , // sender address
            to: nuevoUsuario.email , // list of receivers
            subject: 'Registro exitoso ✔', // Subject line
            attachments: [{
                filename: 'entrekids.png',
                path: 'public/images/entrekids.png',
                cid: 'entrekids@unique.cl' //same cid value as in the html img src
            }],
            html: `
            
            <body style="background-color: #f5f5f5; color: rgb(119,119,120);">
            
        
            
            <table style="width:100%;max-width:580px;margin:0 auto" align="center" cellpadding="0" cellspacing="0" >
            <tbody>        
                                      
            <tr>
            <td> <img src="cid:entrekids@unique.cl" style="height: 32px; margin: 30px 0;" /></td>
            </tr>
            <tr>
            <td style="border-radius:4px;padding:38px 7.5% 30px;background-color:#ffffff;border:solid 1px #d6d6d6">  
            <h2 style="font-family: 'Calibri';">Hola! </h2>           
            <br>              
            <h2 style="font-family: 'Calibri';">
            Gracias por preferir Entrekids! Tu registro ha sido exitoso. Pronto estaremos en funcionamiento y te estaremos anunciando fechas y promociones de lanzamiento. Cualquier consulta no dudes en escribirnos a contacto@entrekids.cl</h2>              
            <br>
            <h2 style="font-family: 'Calibri';">Atentamente,</h2>
            <br>
            <h2 style="font-family: 'Calibri';">Equipo EntreKids </h2>
            </td>
            </tr>
            </tbody>
            </table>
            
           
         
          
            
                        `, // plain text body
           
        };
       
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
              res.json({success: true, msg:'Registro exitoso'});
            }
    });
 });
 //Start Server
 app.listen(port, () => {
     console.log('Server started on port ' +port);
 });
