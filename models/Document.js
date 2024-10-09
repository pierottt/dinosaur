const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    topic: {
        type : String,
        require : [true,'Please add a topic'],
        trim : true,
    },
    writer: {
        type : String,
        require : [true,'Please add a writer'],
        trim : true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    content: {
        type : String,
        require : [true,'Please add a content'],
        trim : true,
    },
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});


module.exports = mongoose.model('Document',DocumentSchema);