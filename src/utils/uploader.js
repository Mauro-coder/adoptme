import __dirname from "./index.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        if(req.baseUrl.includes('/pets')){
            cb(null,`${__dirname}/../public/img/pets`)
            return
        }

        if(req.baseUrl.includes('/users')){
            cb(null,`${__dirname}/../public/img/users`)
            return
        }

    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage})

export default uploader;