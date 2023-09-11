const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 8080;

const folderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
});

const bookmarkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    bookmarkId: {
        type: Number,
        required: true
    }
});

const Folder = mongoose.model("Folder", folderSchema);
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

// MONGOOSE SETUP
mongoose.connect('mongodb://localhost:27017/browser-sync-yt')
    .then(() => {
        console.log('MONGOOSE CONNECTED')
    })
    .catch(e => {
        console.log(e);
    })


const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/****************************
 * 
 * EXPRESS ROUTES
 * 
 *****************************/


// INDEX ROUTE
app.get("/bookmarks", async (req, res) => {
    const bookmarks = await Bookmark.find({});

    res.json(bookmarks);
});

// CREATE ROUTE
app.post("/bookmarks", async (req, res) => {
    const { title, url, bookmarkId } = req.body;

    const newBookmark = new Bookmark({ title, url, bookmarkId });
    await newBookmark.save();

    res.send("Successfully created new bookmark");
});

// UPDATE ROUTE
app.patch("/bookmarks/:bookmarkId", async (req, res) => {
    const { bookmarkId } = req.params;
    const { title, url } = req.body;

    await Bookmark.findOneAndUpdate({ bookmarkId }, { title, url });

    res.send("Successfully updated bookmark");
});

// DESTROY ROUTE
app.delete("/bookmarks/:bookmarkId", async (req, res) => {
    const { bookmarkId } = req.params;

    await Bookmark.findOneAndDelete({ bookmarkId });

    res.send("Successfully deleted bookmark");
});

// 404 NOT FOUND ROUTE
app.use("*", (req, res) => {
    res.status(404).send("Not Found");
});


app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});