
const config = require('./config');
var Express=require("express");
var Mongoclient=require("mongodb").MongoClient;
var cors=require("cors");
const multer=require("multer")

var app=Express()

app.use(cors())


var CONNECTION_STRING=config
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
        console.log("result12 ",result)
    })
})

app.post('/api/todoapp/AddNotes',multer().none(),(request,response)=>{
    database.collection("todoappcollection").count({},function(error,numOfDocs){
    database.collection("todoappcollection").insertOne({
        id:(numOfDocs+1).toString(),
        description:request.body.newNotes,
        positive:request.body.positive,
        negative:request.body.negative

    })
    response.json("added Succesfully")
})
})

app.delete('/api/todoapp/DeleteNotes',(request,response)=>{
    database.collection("todoappcollection").deleteOne({
        id:request.query.id
    })
    response.json("Delete Succsesfullt")
    console.log("delete ")

})


app.put('/api/todoapp/UpdateNotes', multer().none(), (request, response) => {
    const id = request.body.id;
    const newDescription = request.body.newDescription;
    const positive = request.body.positive;
    const negative = request.body.negative;
console.log("update")

    if (!id || !newDescription) {
        response.status(400).json({ message: "Update a record." });
        return;
    }

    database.collection("todoappcollection").updateOne(
        { id: id },
        { $set: { description: newDescription ,
            positive: positive,
            negative: negative
        }
        
    },


        (error, result) => {
            if (result.matchedCount === 0) {
                response.status(404).json({ message: "Record not found." });
            } else {
                response.json({ message: "Record updated successfully." });
            }
        }
    );
});



app.put('/api/todoapp/UpdateNumber', multer().none(), (request, response) => {
    const id = request.body.id;
   
    const positive = request.body.positive;
    const negative = request.body.negative;
console.log("update")

    if (!id ) {
        response.status(400).json({ message: "Update a record." });
        return;
    }

    database.collection("todoappcollection").updateOne(
        { id: id },
        { $set: {
            positive: positive,
            negative: negative
        }
        
    },


        (error, result) => {
            if (result.matchedCount === 0) {
                response.status(404).json({ message: "Record1 not found." });
            } else {
                response.json({ message: "Record1 updated successfully." });
            }
        }
    );
});
