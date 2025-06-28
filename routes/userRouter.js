const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const Product=require("../models/product-model")


const isLoggedIn=async (req,res,next)=>{
    try{
        let token=req.cookies.token
        // console.log(token)
        if(!token){
            return res.redirect('/')
        }
        
        let decoded=jwt.verify(token,"secret")
        let user=await User.findOne({email:decoded.email}).select("-password")//excluding the password
        req.user=user
        next() 
    }
    
  
    catch(err){
        res.redirect("/")
    }
}


router.get("/userpage",isLoggedIn,async(req,res)=>{
    let products=await Product.find()
    // console.log(products)

    res.render("shop",{products})
  
})

router.get('/login', (req, res) => {
    res.render("user-login");
});

router.get('/signup', (req, res) => {
    res.render("user-signup");
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render("user-login") // Changed to redirect to user login instead of index
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

router.get("/cart",isLoggedIn,async (req,res)=>{
    let user = await User.findOne({email: req.user.email}).populate('cart.product'); //note here we are populating the cart field this simply means that we first had the ids in the model but now we are getting the whole product object remember that reference id has to be given in the user model under the cart
    let cart=user.cart

    
    res.render("cart",{cart})
})

router.get("/cart/:id",isLoggedIn,async (req,res)=>{

        let id = req.params.id;

        // let product = await Product.findById(id);
        let user = await User.findOne({ _id: req.user._id });

        // Check if the product is already in the cart
        let cartItemIndex = user.cart.findIndex(item =>
             item.product && item.product._id.toString() === id);

        if (cartItemIndex > -1) {
            // If it exists, increment the quantity
            user.cart[cartItemIndex].quantity += 1;
        } else {
            // If it doesn't exist, add the product to the cart
            user.cart.push({ product: id, quantity: 1 });
        }

        await user.save();
        res.redirect("/user/cart");
    
})


router.get("/plus/:id", isLoggedIn, async (req, res) => {
    try {
        let id = req.params.id;//gives the id of the cart element  NOT THE PRODUCT ID

        // let product = await Product.findById(id);
        let user = await User.findOne({ _id: req.user._id });

        // Check if the product is already in the cart
        let cartItemIndex = user.cart.findIndex(item =>
             item.product && item._id.toString() === id);

        if (cartItemIndex > -1) {
            // Increment quantity if item exists
            user.cart[cartItemIndex].quantity += 1;
        } else {
            // Add new item to cart if it doesn't exist
            user.cart.push({ product: id, quantity: 1 });
        }

        await user.save();
        res.redirect("/user/cart");
    } catch (error) {
        console.error("Error increasing quantity:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/minus/:id", isLoggedIn, async (req, res) => {
    try {
        let id = req.params.id;//gives the id of the cart element  NOT THE PRODUCT ID

        // let product = await Product.findById(id);
        let user = await User.findOne({ _id: req.user._id });

        // Check if the product is already in the cart
        let cartItemIndex = user.cart.findIndex(item =>
             item.product && item._id.toString() === id);

        if (cartItemIndex > -1) {
            // Increment quantity if item exists
            if(user.cart[cartItemIndex].quantity>1){
            user.cart[cartItemIndex].quantity -= 1;
            }
            else{
                user.cart.splice(cartItemIndex,1)
            }
        } 

        await user.save();
        res.redirect("/user/cart");
    } catch (error) {
        console.error("Error decreasing quantity:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/register',  async (req, res) => {

    try {
        let { fullName, email, password } = req.body;  // Changed from fullname to fullName


        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user=await User.find({email:email})
        if(user.length>0){
            return res.status(401).send("User already exists")
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({ message: 'Error generating salt', error: err.message });
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password', error: err.message });
                }
                password = hash;
                try {
                    const newUser = new User({
                        fullName: fullName,  // Matches schema field name
                        email: email,
                        password: password
                    });

                    const savedUser = await newUser.save();
                    let token=jwt.sign({email,id:newUser._id},"secret")
                    res.cookie("token",token)
                    res.redirect("/user/userpage") // Redirect to user dashboard instead of index

                    // res.status(201).json(savedUser);
                }
                catch (error) {
                    res.status(500).json({ message: "Error registering user", error: error.message });
                }

            });
        });

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

router.post("/login",async (req,res)=>{
    let{email,password}=req.body
    let user=await User.findOne({email:email})

    if(!user){
        return res.status(401).send("User does not exist")
    }
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token=jwt.sign({email,id:user._id},"secret")
            res.cookie("token",token)
            res.redirect("/user/userpage");
        }
        else{
            res.send("Invalid credentials") 
        }
    })

})

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});


module.exports = router;