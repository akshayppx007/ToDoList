const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);


const _ = require("lodash");

const {
    urlencoded
} = require("body-parser");

const app = express();
app.use(urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

app.use(express.static("public"));
mongoose.connect("mongodb+srv://akshayppx:" + process.env.password + "@cluster0.4ezz2so.mongodb.net/toDoList");



const itemsShema = new mongoose.Schema({
    name: String
})

const item = mongoose.model("item", itemsShema);

const item1 = new item({
    name: "Welcome"
});
const item2 = new item({
    name: "<- click here to delete"
});


const defaultItems = [item1, item2]

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsShema]
});



const List = mongoose.model("list", listSchema);




app.get("/", function (req, res) {

    item.find({}, function(err, i) {
        if (i.length === 0) {
            item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("items added");
                }
                res.redirect("/");
            })
        } else {
            res.render("list", {listTitle: "today", add_items: i})
        }
        
    });
    // res.render("list", {
    //     listTitle: "Today",
    //     add_item: items
    // });
});


app.get("/:id", function(req, res) {
    let id_names = _.capitalize(req.params.id);
   

    List.findOne({name: id_names}, function(err, l) {
        if(!l) {
            let list = List({
                name :id_names,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + id_names);
        } else {
            res.render("list",  {listTitle: l.name, add_items: l.items});
        }
    });

});






app.post("/", function(req, res) {


  let new_item = req.body.do_list;
  let title = req.body.list_name;
  let item_s = new item({
    name: new_item
  });
  
  if (title === "today") {
    item_s.save();

    res.redirect("/");
  } else {
    List.findOne({name: title}, function(err, l) {
        l.items.push(item_s);
        l.save();
        res.redirect("/" + title);
    });
  
} });

app.post("/delete", function(req, res) {
    let item_to_delete =  req.body.checkbox;
    let list_title = req.body.listTitle;

    if (list_title === "today") {
        item.findByIdAndRemove(item_to_delete, function(err) {
            if(!err) {
                console.log("delete successfull")
            }
            res.redirect("/");
        } );
     

    } else {
        List.findOneAndUpdate({name: list_title}, {$pull: {items: {_id: item_to_delete}}}, function(err, l) {
            if(!err) {
                res.redirect("/" + list_title);
            }

        })
            
        }
    });
    
    




// app.post("/work", function(res, req) {
//     var item = req.body.do_list;
//     workItems.push(item);
//     res.redirect("/work");
// })


const port = process.env.PORT || 3000;


app.listen(port, function () {
    console.log("server is running at port " + port +"...")
});