const express = require("express");
const app = express();
const fileuploader = require("express-fileupload")
const mysql2 = require("mysql2")

app.listen(5000,function() {
    console.log("Server Started at Port:5000");
})

app.use(express.static("Public"));

const configObj = {
    host:"127.0.0.1",
    user:"root",
    password:"Pr@kul2106",
    database:"project",
    dateStrings:true
}

const mysql = mysql2.createConnection(configObj);

mysql.connect(function(err) {
    if (err == null) {
        console.log("Connected to Database");
    }

    else {
        console.log("err.message");
    }
})

app.post("/", function(req,resp) {
    let filePath = process.cwd()+"/Public/index.html";
    resp.send(filePath);
})

app.use(express.urlencoded({extended:true}));

app.get("/check-email", function(req,resp){
    mysql.query("select * from users where emailid=?",[req.query.mail],function(err,resJsonAry) {
        if (resJsonAry.length == 1) {
            resp.send("Not Available");
        }

        else {
            resp.send("Avalaibleee");
        }
    })
})

app.get("/signup", function(req,resp) {
    mysql.query("insert into users value(?,?,?,current_date(),1)",[req.query.email,req.query.pass,req.query.type], function(err) {
        if (err == null) {
            resp.send("Status: Signed Up Successfully");
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/login",function(req,resp) {
    mysql.query("select * from users where emailid=? and password=?",[req.query.lemail,req.query.lpass], function(err,resJsonArray) {
        if (err) {
            resp.send(err.message);
            return;
        }

        if (resJsonArray.length == 1) {
            if (resJsonArray[0].status==1) {
                const uType = resJsonArray[0].utype;
                // if (uType == "Customer") {
                //     let filePath = process.cwd()+"/Public/customer-dash.html";
                //     resp.sendFile(filePath);
                // }

                // else {
                //     resp.send(uType);
                // }
                resp.send(uType);
            }

            else {
                resp.send("Your Account is Blocked! Contact Admin");
            }
        }

        else {
            resp.send("Invalid Credentials");
        }
    })
})

app.use(fileuploader());

app.get("/custProf",function(req,resp) {
    let filePath = process.cwd()+"/Public/profile-customer.html";
    resp.sendFile(filePath);
})

app.post("/custProf-save", function(req,resp) {
    const email = req.body.ntxtMail;
    const name = req.body.ntxtName;
    const num = req.body.ntxtMob;
    const add = req.body.ntxtAdd;
    const city = req.body.ntxtCity;
    const state = req.body.ntxtState;

    let filename;
    if (req.files == null) {
        filename = "nopic.jpg";
    }

    else {
        filename = req.files.nppic.name;
        let path = process.cwd()+"/Public/Uploads/"+filename;
        req.files.nppic.mv(path);
    }
    req.body.nppic = filename;

    mysql.query("insert into customers value(?,?,?,?,?,?,?)",[email,name,num,add,city,state,filename], function(err) {
        if (err == null) {
            resp.send("Profile Saved");
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/searchCust", function(req,resp) {
    mysql.query("select * from customers where email=?",[req.query.mail], function(err,ary) {
        resp.send(ary);
    })
})

app.post("/custProf-update",function(req,resp) {
    const email = req.body.ntxtMail;
    const name = req.body.ntxtName;
    const num = req.body.ntxtMob;
    const add = req.body.ntxtAdd;
    const city = req.body.ntxtCity;
    const state = req.body.ntxtState;

    let filename;
    if (req.files == null) {
        filename = req.body.hdn;
    }

    else {
        filename = req.files.nppic.name;
        let path = process.cwd()+"/Public/Uploads/"+filename;
        req.files.nppic.mv(path);
    }
    req.body.nppic = filename;

    mysql.query("update customers set name=?, contact=?, address=?, city=?, state=?, profile=? where email=?",[name,num,add,city,state,filename,email], function(err) {
        if (err == null) {
            resp.send("Profile Updated");
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/custDash",function(req,resp) {
    let filePath = process.cwd()+"/Public/customer-dash.html";
    resp.sendFile(filePath);
})

app.get("/reqManager",function(req,resp) {
    let filePath=process.cwd()+"/Public/req-manager.html";
    resp.sendFile(filePath);
})

app.get("/show-all-req", function(req,resp) {
    const mail = req.query.fetchmail;
    
    mysql.query("select * from tasks where emailid=?",[mail], function(err,respJsonArry) {
        if (err == null){
            resp.send(respJsonArry);
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/delete-task", function(req,resp) {
    const delrid=req.query.reqrid;
    mysql.query("delete from tasks where rid=?",[delrid],function(err,result)
    {
        if(err==null)
        {
           if(result.affectedRows==1)
               resp.send("Task Deleted Successfully");
           else
                resp.send("Inavlid ID");
        }
        else
           resp.send(err.message);
    })
})

app.get("/searchProviders", function(req,resp) {
    let filePath=process.cwd()+"/Public/search-provider.html";
    resp.sendFile(filePath);
})

app.get("/post-task",function(req,resp) {
    mysql.query("insert into tasks value(0,?,?,?,?,?,?)",[req.query.email,req.query.requ,req.query.add,req.query.city,req.query.date,req.query.task], function(err) {
        if (err == null) {
            resp.send("Requirement Posted");
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/fetch-home",function(req,resp) {
    mysql.query("select * from customers where email=?",[req.query.mail],function(err,respary) {
        resp.send(respary);
    })
})

app.get("/change-pass",function(req,resp) {
    mysql.query("update users set password=? where emailid=? and password=?",[req.query.newpass,req.query.mail,req.query.oldpass],function(err,respJsonAry) {
        if (err == null) {
            if (respJsonAry.affectedRows == 1) {
                resp.send("Password Changed Successfully!!");
            }

            else {
                resp.send("Invalid Credentials");
            }
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/provDash",function(req,resp) {
    let filePath = process.cwd()+"/Public/provider-dash.html";
    resp.sendFile(filePath);
})

app.get("/provProf",function(req,resp) {
    let filePath = process.cwd()+"/Public/profile-provider.html";
    resp.sendFile(filePath);
})

app.post("/provProf-save", function(req,resp) {
    const email = req.body.ntxtMail;
    const name = req.body.ntxtName;
    const num = req.body.ntxtMob;
    const gen = req.body.ntxtGen;
    const work = req.body.ntxtReq;
    const firm = req.body.ntxtFirm;
    const web = req.body.ntxtWeb;
    const add = req.body.ntxtAdd;
    const when = req.body.ntxtDate;
    const spec = req.body.ntxtSpec;

    let filename;
    filename = req.files.nppic.name;
    let path = process.cwd()+"/Public/Uploads/"+filename;
    req.files.nppic.mv(path);

    req.body.nppic = filename;
    
    mysql.query("insert into providers value(?,?,?,?,?,?,?,?,?,?,?)",[email,name,num,gen,work,firm,web,add,when,filename,spec], function(err) {
        if (err == null) {
            resp.send("Profile Saved");
        }

        else {
            resp.send(err.message);
        }
    })
})

app.post("/provProf-update", function(req,resp) {
    const email = req.body.ntxtMail;
    const name = req.body.ntxtName;
    const num = req.body.ntxtMob;
    const gen = req.body.ntxtGen;
    const type = req.body.ntxtReq;
    const firm = req.body.ntxtFirm;
    const web = req.body.ntxtWeb;
    const add = req.body.ntxtAdd;
    const since = req.body.ntxtDate;
    const info = req.body.ntxtSpec;

    let filename;
    if (req.files == null) {
        filename = req.body.hdn;
    }

    else {
        filename = req.files.nppic.name;
        let path = process.cwd()+"/Public/Uploads/"+filename;
        req.files.nppic.mv(path);
    }
    req.body.nppic = filename;

    mysql.query("update providers set name=?, contact=?, gender=?, category=?, firm=?, website=?, location=?, since=?, proofpic=?, otherinfo=? where email=?",[name,num,gen,type,firm,web,add,since,filename,info,email], function(err) {
        if (err == null) {
            resp.send("Profile Updated");
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/searchProv", function(req,resp) {
    mysql.query("select * from providers where email=?",[req.query.mail], function(err,ary) {
        resp.send(ary);
    })
})

app.get("/angular-fetch-distinct-city",function(req,resp) {
    mysql.query("select distinct location from providers",function(err,resJsonAry)
     {
        if (err == null) {
            resp.send(resJsonAry);
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/angular-fetch-one-record",function(req,resp) {
    mysql.query("select * from providers where location=? and category=?",[req.query.location,req.query.category],function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})

app.get("/angular-fetch-distinct-category",function(req,resp) {
    mysql.query("select distinct category from providers",function(err,respJsonAry) {
        resp.send(respJsonAry);
    })
})

app.get("/adminDash",function(req,resp) {
    let filePath=process.cwd()+"/Public/admin-dash.html";
    resp.sendFile(filePath);
})

app.get("/users-all",function(req,resp) {
    let filePath=process.cwd()+"/Public/users-manager.html";
    resp.sendFile(filePath);
})

app.get("/angular-show-all", function(req,resp) {
    mysql.query("select * from users", function(err,resJsonAry) {
        resp.send(resJsonAry);
    })
})

app.get("/angular-block",function(req,resp)
{
    const email=req.query.reqemail;
    mysql.query("update users set status=? where emailid=?",[0,email],function(err,result)
    {
        if(err==null)
        {
           if(result.affectedRows==1)
               resp.send("User Blocked Successfully!");
           else
                resp.send("Inavlid ID");
        }
        else
           resp.send(err.message);
    })

})

app.get("/angular-resume",function(req,resp)
{
    const email=req.query.reqemail;
    mysql.query("update users set status=? where emailid=?",[1,email],function(err,result)
    {
        if(err==null)
        {
            resp.send("User Unblocked Successfully!");
        }
        else
           resp.send(err.message);
    })

})

app.get("/angular-fetch-distinct-pwds",function(req,resp){
    mysql.query("select distinct password from users",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})

app.get("/fetch-one-record",function(req,resp){
    mysql.query("select * from users where password=?",[req.query.pwd],function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})

app.get("/providers-all",function(req,resp) {
    let filePath=process.cwd()+"/Public/providers.html";
    resp.sendFile(filePath);
})

app.get("/show-all-prov", function(req,resp) {
    mysql.query("select * from providers", function(err,resJsonAry) {
        resp.send(resJsonAry);
    })
})

app.get("/customers-all",function(req,resp) {
    let filePath=process.cwd()+"/Public/customers.html";
    resp.sendFile(filePath);
})

app.get("/show-all-cust", function(req,resp) {
    mysql.query("select * from customers", function(err,resJsonAry) {
        resp.send(resJsonAry);
    })
})