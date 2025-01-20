const express = require('express');
const bycrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const CryptoJS = require('crypto-js');

const app = express();

const router = express.Router();
const client = new OAuth2Client(process.env.Google_Client_ID)


    router.post('/signup', async (req, res) => {         
     let name = req.body.name
     let email = req.body.email
     let password = req.body.password
     try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.json({ status : 201, message: 'User already exists' });
        }
        // console.log(password);
        // let bytes = CryptoJS.AES.decrypt(password, "my-encryption-key").toString();
        // let decryptedPwd = bytes.toString(CryptoJS.enc.Utf8);
        // console.log(decryptedPwd)

        const newUser = new User({name, email, password: decrypt(password)});
            
        await newUser.save();
        
        res.json({ status : 200, message: 'User created' });

        } catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
   })

    function decrypt(password){
    let bytes = CryptoJS.AES.decrypt(password, process.env.CRYPTO_SECRET);
    let decryptedPwd = bytes.toString(CryptoJS.enc.Utf8);
    console.log(decryptedPwd);  
    return decryptedPwd;
   }

  
    router.post('/signin', async (req, res) => {
        console.log(req.body);
        let email = req.body.email
        let password = decrypt(req.body.password)
        
        try {
            console.log(email, password);
            const user = await User.findOne({email});
            if(!user){
                return res.json({status: 201, message:'User not found'});
            }
            const isMatch = await user.comparePassword(password);
            if(!isMatch){
                return res.json({status: 201, message:'Incorrect password'});
            }
            const token =jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );;
            return res.json({status: 200, message: 'User signed in', authToken: token});
        }
        catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
    });


  router.get('/', async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        return res.status(200).json({ message: `Welcome, user` });
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  });

  router.post('/google-signup', async (req, res)=>{
    const {token} = req.body;
    console.log(req.body)

    try {
        const ticket = await client.verifyIdToken({
            idToken : token,
            audience : process.env.GOOGLE_CLIENT_ID
        })
        console.log(ticket)
        // const payload = ticket.getPayload()

    }
    catch{

    }
  })

module.exports = router;