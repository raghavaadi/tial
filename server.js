const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
app.use(cors());
let port = process.env.PORT || 5000;

app.use(express.json());
const locationRouter = require('./routes/location');
app.use('/location', locationRouter);
app.use((req,res,next)=>{
   if( req.method==='GET'){
res.status(500).json({'err':'invalid request'})
   }
   else if(req.method==='POST'){
    
      
   }
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});