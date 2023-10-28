//Import
var exp = require('express');
var dot = require('dotenv');
var mon = require('mongoose');
var bparser = require('body-parser');    
bparserInit = bparser.urlencoded({extended:false});  
var cors = require('cors');
 
//Initialize expressjs
var app = exp();
app.use(cors());
 
//
 
 
//Copy paste the connection link from mongosh powershell
//Below line, 'local' is the database name, if we don't mention the name, by default  it will connect to test database
mon.connect("mongodb://127.0.0.1:27017/local?directConnection=true&serverSelectionTimeoutMS=2000&appName=ExpressToMongo").then
    (()=>{console.log('Connected to the database...')}).catch
        (()=>{console.log("Unable to connect. Check the URL")})
 
//Define the structure of the collection
const userSchema = {userId: String, password : String, emailId : String};
//model(<collectionname>, <schemaName or structure of the collection>)
var UserData = mon.model('users',userSchema);   //Link this structure with the name of actual collection. Here 'Users' is the actual collection in database
 
// Creating API's
//Post API
function addNewUser(request, response) {
    console.log('Received request body:', request.body); // Add this line for debugging
 
    var udata = new UserData({
        'userId': request.body.userId,
        'password': request.body.password,
        'emailId': request.body.emailId
    });
    // Prepare the data to be Inserted into the collection
    // Insert the data into the collection.Then check if data insertion is successful. Use 'save()' function for insrting data
    //udata.save().then((data)=>{console.log('Insertion Successful...');
    //    response.send("<b> Inserted data successfully");
    //}).catch((error)=>{console.log(error);
     //   response.send("Unable to insert the data...")});
}
 
app.post('/insert', bparserInit, addNewUser);
 
//Get API
function getAllUsers(request, response) {
    // Retrieve all the records. If successfully retrieved, display it. Else, error.
    UserData.find()
        .then((data) => {
            console.log(data);
            response.send(data);
        })
        .catch((error) => {
            console.log(error);
            response.send('Could not retrieve the data');
        });
}
 
app.get('/getAll',getAllUsers);
 
// PUT API
function updateUser(request, response) {
    var userId = request.body.uid;
    var newPassword = request.body.password;
    var newEmailId = request.body.emailId;
 
    // Find the user by userId and update their data
    UserData.findOne({ 'userId': userId })
        .then((user) => {
            if (!user) {
                response.status(404).send('User not found');
            } else {
                // Update user data
                user.password = newPassword;
                user.emailId = newEmailId;
                // Save the updated user data
                return user.save();
            }
        })
        .then((updatedUser) => {
            if (updatedUser) {
                console.log('User data updated successfully');
                response.status(200).send('User data updated successfully');
            }
        })
        .catch((err) => {
            console.error(err);
            response.status(500).send('Error updating user');
        });
}
 
app.put('/update', bparserInit, updateUser);
 
 
// DELETE API
function deleteUser(request, response) {
    var userId = request.body.uid;
 
    // Find the user by userId and remove them
    UserData.findOneAndRemove({ 'userId': userId })
        .then((user) => {
            if (!user) {
                response.status(404).send('User not found');
            } else {
                console.log('User deleted successfully');
                response.status(200).send('User deleted successfully');
            }
        })
        .catch((err) => {
            console.error(err);
            response.status(500).send('Error deleting user');
        });
}
 
app.delete('/delete', bparserInit, deleteUser);
 
// GET BY ID API
function getUserById(request, response) {
    var userId = request.params.uid; // Assuming the userId is provided in the URL parameters
 
    // Find the user by userId
    UserData.findOne({ 'userId': userId })
        .then((user) => {
            if (!user) {
                response.status(404).send('User not found');
            } else {
                response.status(200).json(user); // Send user data as JSON
            }
        })
        .catch((err) => {
            console.error(err);
            response.status(500).send('Error retrieving user');
        });
}
 
app.get('/getById', getUserById);
 
//Check Connection
app.listen(8000, function(error){
    if(error != undefined){
        console.log(error.message)
    }
    else
        console.log('Connect to port 8000. Waiting for request')
        console.log('On the browser, visit http://localhost:8000/')
})

