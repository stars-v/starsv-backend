const multer = require("multer");
const Image = require('../../models/image.model')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
 
const upload = multer({ storage })
 
 
 const cb = (req,res) => {
    const img = fs.readFileSync(req.file.path);
    const encode_img = img.toString('base64');
    const final_img = {
        contentType:req.file.mimetype,
        image: new Buffer(encode_img,'base64')
    };
    const profileImage = Image.create(final_img, function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result.img.Buffer);
            console.log("Saved To database");
            res.contentType(final_img.contentType);
            res.locals.imageId = profileImage._id
        }
    })
 }
    
module.exports = {
  upload,
  cb
}
