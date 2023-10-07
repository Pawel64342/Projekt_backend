var Express=require("express");
var Mongoclient=require("mongodb").MongoClient;
var cors=require("cors");
const multer=require("multer")

var app=Express()

app.use(cors())
var CONNECTION_STRING="mongodb+srv://Pawel64342:Student.002@cluster0.poobja8.mongodb.net/?retryWrites=true&w=majority"

var DATABASENAME="todoappdb"
var database;

const port = process.env.PORT || 9003;
app.listen(port,()=>{
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database=client.db(DATABASENAME);
        console.log("Mongo DB connection success ",port)
    }
        )
})



app.get('/api/todoapp/GetNotes',(request,response)=>{
    database.collection("todoappcollection").find({}).toArray((error,result)=>{
        response.send(result)
        console.log("result ",result)
    })
})

app.post('/api/todoapp/AddNotes',multer().none(),(request,response)=>{
    database.collection("todoappcollection").count({},function(error,numOfDocs){
    database.collection("todoappcollection").insertOne({
        id:(numOfDocs+1).toString(),
        description:request.body.newNotes
    })
    response.json("added Succesfully")
})
})

app.delete('/api/todoapp/DeleteNotes',(request,response)=>{
    database.collection("todoappcollection").deleteOne({
        id:request.query.id
    })
    response.json("Delete Succsesfullt")
})