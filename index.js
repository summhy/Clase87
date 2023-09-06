//importar librerias
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

//declaraciones
const app = express();
const secret = "Chimbiroca";

//configuracion
app.use(express.json())

//rutas
app.get("/", (req,res)=>{    
    res.status(200).json({message:"Bienvenido"});
});

app.post("/login", (req,res)=>{    
    try{
        let user= req.body; //{nombre:..., password:...}
        //console.log(user)
        if(!user.nombre || !user.password){
            res.status(401).json({message:"datos erróneos"});
        }else{
            const token = jwt.sign(user, secret, {expiresIn:"1m"});
            res.status(200).json({token});
        }
        
    }catch{
        res.status(401).json({message:"error payload"});
    }
    
});

app.get("/api/v1/data",  (req, res)=>{
    let token = req.body;
    //console.log(jwt.verify(token.token, secret));
    if(jwt.verify(token.token, secret)){
        let data = fs.readFile("./data/data.json", (err, data) => {
        if(err) {
            res.status(500).json({message:err});
        } else {
            res.status(200).json(JSON.parse( data));
        }
      });
    }else{
        res.status(403).json({message:"Token inválido"});
    }
    
})

//controlar error 404
app.all("*",(req,res)=>{
    res.status(404).json({message:"Ruta no existe"})
})

//servicio
app.listen(3000, ()=>{console.log("http://localhost:3000")})