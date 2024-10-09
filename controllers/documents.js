const Document = require('../models/Document');

//@desc     Get all documents
//@route    GET /api/v1/documents
//@access   Public
exports.getDocuments=async(req,res,next)=>{
    let query;
    //Copy req.query
    const reqQuery = {...req.query};
    //Fields to exclude
    const removeFields=['select','sort','page','limit'];
    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(params=>delete reqQuery[params]);
    console.log(reqQuery);
    //Create query string
    let queryStr=JSON.stringify(reqQuery);
    //Create operator ($gt,$gte,etc)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
    //finding resource
    query=Document.find(JSON.parse(queryStr));
    //Select Fields
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    //sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }
    try{
        const documents = await query;
        res.status(200).json({success:true, count:documents.length, data:documents});
    } catch(err){
        res.status(400).json({success:false});
        console.log(err);
    }
};

//@desc     Get single document
//@route    GET /api/v1/documents/:id
//@access   Public
exports.getDocument=async(req,res,next)=>{
    try{
        const document = await Document.findById(req.params.id);

        if(!document){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:document});
    } catch(err) {
        res.status(400).json({success:false});
    }
    
};

//@desc     Create new document
//@route    POST /api/v1/documents
//@access   Private
exports.createDocument=async(req,res,next)=>{
    const document = await Document.create(req.body);
    res.status(201).json({success:true, data:document});
};

//@desc     Update document
//@route    PUT /api/v1/documents/:id
//@access   Private
exports.updateDocument=async(req,res,next)=>{
    try{
        const document = await document.findByIdAndUpdate(req.params.id,req.body, {
            new: true,
            runValidators:true
        });
        if(!document){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:document});
    } catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Delete document
//@route    DELETE /api/v1/documents/:id
//@access   Private
exports.deleteDocument=async(req,res,next)=>{
    try{
        const document = await document.findById(req.params.id);
        if(!document){
            return res.status(400).json({success:false});
        }
        await document.deleteOne();
        res.status(200).json({success:true, data:{}});
    } catch(err){
        res.status(400).json({success:false});
    }
};

// @desc    Download a document as a text file
// @route   GET /api/v1/documents/:id/download-txt
// @access  Public
exports.downloadDocumentAsText = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(400).json({ success: false });
        }
        const filteredData = {
            topic: document.topic,
            writer: document.writer,
            content: document.content,
        };

        // Convert the JSON document to a plain text string
        const textData = JSON.stringify(filteredData, null, 2);
        // Set headers to prompt the user to download the file as a .txt
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${document.topic} by ${document.writer}.txt"`);

        // Send the document data as a downloadable text file
        res.send(textData);

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};