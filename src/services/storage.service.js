import ImageKit from "imagekit";
import dotenv from 'dotenv'
dotenv.config();

const imagekit =new ImageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
}); 
 async function uploadFile(file,fileName){
    try{
    const result= await imagekit.upload({
         file:file,
         fileName:fileName,
    })
    return result;
}catch(err){
     throw new Error(err.message || "Upload failed");

}
 }
 
export {uploadFile}