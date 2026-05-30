const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🗄️ MongoDB Connection (Local Database)
// Agar aap cloud use kar rahe ho toh apna URL daalna, nahi toh local ke liye ye perfect hai
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Database Se Connection Ho Gaya! 🗄️"))
  .catch((err) => console.log("Database connect nahi hua ❌", err));

// 📝 User Schema (Database mein kya save hoga uska structure)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    picture: String,
    googleId: String
});
const User = mongoose.model('User', userSchema);

// 🚀 Test Route
app.get('/', (req, res) => {
    res.send("Backend Server Ekdum Mast Chal Raha Hai! 🚀");
});

// 🔑 Google Login API Route (Yahan frontend se token aayega)
app.post('/api/google-login', async (req, res) => {
    const { name, email, picture, sub } = req.body;
    
    try {
        // Check karo kya user pehle se database mein hai?
        let user = await User.findOne({ googleId: sub });
        
        if (!user) {
            // Agar naya user hai, toh database mein save karo
            user = new User({
                name: name,
                email: email,
                picture: picture,
                googleId: sub
            });
            await user.save();
            console.log("Naya User Database Mein Save Ho Gaya! 🎉");
        } else {
            console.log("Purana User Hai, Direct Login Karwaya! 😎");
        }
        
        res.status(200).json({ message: "Login Successful", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});