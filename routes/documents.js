const express=require('express');
//const {getCar, getCars,createCar,updateCar,deleteCar}= require('../controllers/cars');
const {getDocuments,getDocument,createDocument,updateDocument,deleteDocument, downloadDocumentAsText} = require('../controllers/documents')

const router=express.Router();

const {protect,authorize} = require('../middleware/auth');

router.route('/').get(getDocuments).post(protect,authorize('admin'),createDocument);
router.route('/:id').get(getDocument).put(protect,authorize('admin'),updateDocument).delete(protect,authorize('admin'),deleteDocument)
router.route('/:id/download-txt').get(downloadDocumentAsText)


module.exports=router;