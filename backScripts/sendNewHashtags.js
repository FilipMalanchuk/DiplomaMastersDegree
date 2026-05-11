const mongoose = require('mongoose');
const hashtagsSchema = require('../DB/hashtagsSchema');
const hashtagsModel = mongoose.model("hashtags", hashtagsSchema);


// adds new Tags not existing in DB
async function sendNewHashtags(hashtagsStr) {
    if( hashtagsStr.length<1) {return}
    try {
        let hashtagsArr = hashtagsStr.split(",");
        hashtagsArr = hashtagsArr.filter(x => x !== "");
        
        //find existing objects
        let hashtagsFound = await hashtagsModel.find({
            hashtagName: { $in: hashtagsArr }
        });
        // get array with only names
        let temp = []
        hashtagsFound.forEach(item => {
            temp.push(item.hashtagName);
        })

        let setToAdd = new Set();
        if (hashtagsArr.length > 0) {
            let arrToAddToDB = []
            // get array with only new data
            hashtagsArr.forEach(item => {
                if (temp.includes(item)) { return }
                arrToAddToDB.push(item);
            })
            // add data to a Set so it wont create the same tag more then once
            arrToAddToDB.forEach(item => {
                setToAdd.add(item);
            })
            // send new data to DB
            setToAdd.forEach( item => {
                hashtagsModel.create({hashtagName : item});
            })
        }
        return
    } catch (error) {
        console.log('sendNewHashtagsError', error)
    }
}

module.exports = sendNewHashtags;