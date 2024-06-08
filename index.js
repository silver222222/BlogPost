import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

function Blog(title, author, content, date){
    this.title = title;
    this.author = author;
    this.content = content;
    this.date = date;
}

let listOfBlogs = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    res.render("index.ejs");
});

//show empty write. for adding blogs to array
app.get("/write", (req, res)=>{
    res.render("write.ejs");
});

//actually adding the thing in the array
app.post("/submit", (req,res)=>{
    console.log(req.body["blogContent"]);
    const date = new Date();
    let id = listOfBlogs.length + 1;
    let author = req.body["blogAuthor"];
    if (author ===""){
        author = "Anonymous";
    }
    let blog = new Blog(req.body["blogTitle"],author,req.body["blogContent"], 
        date.toLocaleString("default",{month: "long"}) + " " + date.getDate() + ", " + date.getFullYear());
    listOfBlogs.push(blog);
    res.redirect("/view"); //redirecting here instead of rendering views.ejs, when you refresh it wont send again.
    //res.render("view.ejs", {blogs: listOfBlogs}); //when using this, when you refresh, it resends the thing
});

//eding a blog. will direct to write.ejs with the forms completed
app.get("/write/:id", (req,res)=>{
    let reqID = req.params.id ;
    res.render("write.ejs", {blogs: listOfBlogs, index: reqID});
});

//the button in write.ejs when you save the blog.
app.post("/edited/:id", (req,res)=>{
    let reqID = req.params.id ;
    const date = new Date();
    listOfBlogs[reqID].title = req.body["blogTitle"];
    listOfBlogs[reqID].author = req.body["blogAuthor"];
    listOfBlogs[reqID].content = req.body["blogContent"];
    listOfBlogs[reqID].date = date.toLocaleString("default",{month: "long"}) + " " + date.getDate() + ", " + date.getFullYear();
    res.render("view.ejs", {blogs: listOfBlogs, index: reqID});
    // res.redirect("/view");
});

app.get("/delete/:id", (req,res)=>{
    let reqID = req.params.id;
    listOfBlogs.splice(reqID,1);
    res.render("view.ejs", {blogs: listOfBlogs, index: listOfBlogs.length-1});
});

//show the latest blog
app.get("/view", (req, res)=>{
    res.render("view.ejs",{blogs: listOfBlogs, index: listOfBlogs.length-1});
});


//show selected blog
app.get("/view/:id", (req, res)=>{
    let reqID = req.params.id ;
    res.render("view.ejs",{blogs: listOfBlogs, index: reqID});
});


app.listen(port, ()=>{
    console.log(`Server running at port ${port}`);
});
