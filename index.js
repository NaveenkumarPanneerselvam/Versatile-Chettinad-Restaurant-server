const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./credentials.env" });
const sendMail = require("./contactController");
const FoodModel=require("./models/Food")

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['PUT', 'GET', 'POST', 'DELETE']
}));


app.use(express.json());
app.use(bodyParser.json()); 


mongoose.connect("mongodb://localhost:27017/Menu")
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...')) 


app.post("/contact", sendMail);


//Inserted the data
app.post("/insert",async(req,res)=>{
    const {foodName,description}=req.body;
    const food=new FoodModel({foodName,description})
    try
    {
      await food.save()
      res.send("Data inserted successfully")
    }
    catch(err)
    {
         console.log(err)

    }
})

//Retrieving the data

app.get("/read",async(req,res)=>{
  try{
    const food=await FoodModel.find()
    res.send(food)
  }
  catch(err)
  {
    console.log(err)
  }
})

//Updating the data


app.put("/update", async (req, res) => {
  try {
      const { id, newFoodName, newFoodDescription } = req.body;

      if (!id) {
          return res.status(400).json({ error: "ID is required for updating." });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ID format." });
      }

      const updateFields = {};
      if (newFoodName) updateFields.foodName = newFoodName;
      if (newFoodDescription) updateFields.description = newFoodDescription;

      const updatedFood = await FoodModel.findByIdAndUpdate(id, updateFields, { new: true });

      if (!updatedFood) {
          return res.status(404).json({ error: "Food item not found." });
      }

      res.status(200).json({ message: " Data updated successfully", updatedFood });
  } catch (err) {
      console.error(" Error updating food item:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



// app.put("/update",async(req,res)=>{
//   const {newFoodName,newFoodDescription,id}=req.body;
//   try{
//        const food=await FoodModel.findById(id);
//        if(!food)
//        {
//         return res.status(404).send("Data not found")
//        }
//         if (newFoodName) food.foodName = newFoodName;
//         if (newFoodDescription) food.description = newFoodDescription;
//        await food.save()
//        res.send("Data updated successfully")
//     }
//     catch(err)
//     {
//       console.log(err)
//     }
// })


//Deleting the data

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params; // Destructuring id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }
  
  try {
    const result = await FoodModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Food item not found");
    }
    res.send("Food item deleted successfully");
  } catch (err) {
    console.error("Error deleting food item:", err);
    res.status(500).send("Internal Server Error");
  }
});



app.listen(3001,()=>{
    console.log("Server is running on port 3001")
})


