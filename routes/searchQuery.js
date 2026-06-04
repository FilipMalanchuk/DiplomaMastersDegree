const express = require('express');
const mongoose = require("mongoose");
const signImageUrlAndAttackToData = require('../backScripts/signImageUrlAndAttackToData');

const articleSchema = require('../DB/articleSchema');
const articleModel = mongoose.model("articles", articleSchema);

const router = express.Router();

router.get("/", async (req, res) => {
    try {


        // TODO
        let caseSensetive = true;
        //  $options: "i" 
        let page = 0;

        let searchText = req.query.searchText ? req.query.searchText.split(" ").join("|") : "";
        let tagsArr = req.query.tags ? req.query.tags.split(" ") : [];

        let queryResults = [];
        if (searchText || tagsArr.length > 0) {
            console.log("searchText", searchText, "   tagsArr", tagsArr);

            let searchQuery = {};
            let tagsQuery = { articleTags: { $in: tagsArr } };
            let textSearchQuery = {
                $or: [
                    { headline: { $regex: searchText } },
                    { articleText: { $regex: searchText } }
                ]
            }


            if (searchText && tagsArr.length > 0) {
                let dbSearch = await articleModel.find({ $and: [tagsQuery, textSearchQuery] })
                queryResults = dbSearch;
            } else if (searchText) {
                let dbSearch = await articleModel.find(textSearchQuery);
                queryResults = dbSearch;
            } else if (tagsArr.length > 0) {
                let dbSearch = await articleModel.find(tagsQuery);
                queryResults = dbSearch;
            } else {
                console.log("searchQueryError");
            }
        }
        let dataWithImageUrl = await signImageUrlAndAttackToData(queryResults)
        dataWithImageUrl.reverse();


        res.render("search", {
            articles: dataWithImageUrl
        });
        
    } catch (error) {
        console.error("searchQuery.js error", error);
    }
})














module.exports = router