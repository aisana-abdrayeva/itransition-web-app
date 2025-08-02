const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();
app.use(cors(
    {
        origin: process.env.NODE_ENV === 'production' 
            ? "https://itransition-web-app-frontend.onrender.com"
            : "http://localhost:5173",
        credentials: true,
    }
));
app.use(express.json());

app.use("/api/auth", authRoutes);  
app.use("/api/users", userRoutes); 

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});