const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const express=require("express");
const app=express();
const path=require("path")
const methodOverride=require("method-override")

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'Sankalp26'
  });

//   let  idRandomUser=()=>{  
//     return[
//     faker.string.uuid(),
//     faker.internet.username(), 
//     faker.internet.email(),
//     faker.internet.password(),
    
// ];
// };

// let q="insert into user(id,username,email,password)values ?";
// let data=[]
//   for(i=1;i<=100;i++){
//     data.push(idRandomUser())
//   };




app.get("/",(req,res)=>{
    let q=`select count(*) from user;` 


try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count=result[0]["count(*)"]
            res.render("home.ejs",{count})
        });
    }
        catch(err){
            console.log(err);
            res.send("some error occurs")
        }
})    
  

app.get("/user",(req,res)=>{
    let q=`select * from user`



try{
    connection.query(q,(err,users)=>{
        if(err) throw err;
       res.render("alluser.ejs",{users})
    });
}
    catch(err){
        console.log(err);
        res.send("some error occurs")
    }

})

//edit route
app.get("/user/:id/edit",(req,res)=>{
    let{id}=req.params;
    let q=`select * from user where id='${id}'`

    try{  
        connection.query(q,(err,result)=>{
            if(err) throw err;
           let user=result[0]
           res.render("edit.ejs",{user})
        });
    }
        catch(err){
            console.log(err);
            res.send("some error occurs")
        }

})

//update (DB) route
app.patch("/user/:id",(req,res)=>{
    let{id}=req.params;
    let{password:formpass,username:newusername}=req.body;
    let q=`select * from user where id='${id}'`
    try{  
        connection.query(q,(err,result)=>{
           if(err) throw err;
           let user=result[0]
           if(formpass!=user.password){
             res.send("wrong password")
        }
        else{
            let q2=`update user set username='${newusername}' where id='${id}'`
            connection.query(q2,(err,result)=>{
                if(err) throw err
                res.redirect("/user")
            })
        }
           
        });
    } 
        catch(err){
            console.log(err);
            res.send("some error occurs")
        }
   
})

app.listen("8080",()=>{
    console.log("server is listen to port 8080")
})



 

