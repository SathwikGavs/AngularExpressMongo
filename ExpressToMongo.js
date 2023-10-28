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

/*const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/local?directConnection=true&serverSelectionTimeoutMS=2000&appName=ExpressToMongo')
  .then(() => {
    console.log('Connected to the database...');
  })
  .catch((err) => {
    console.log('Unable to connect. Check the URL:', err);
  });

// Define the user schema
const userSchema = {
  userId: String,
  password: String,
  emailId: String,
};

// Create a model for the User collection
const UserData = mongoose.model('Users', userSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve a simple HTML form to input user data
app.get('/', (req, res) => {
  res.send(`
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
        }
        h1 {
          color: #007bff;
        }
        label {
          display: block;
          margin: 10px 0;
        }
        input {
          width: 20%;
          padding: 5px;
          margin: 5px 0;
        }
        button {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
        }
        a {
          text-decoration: none;
          color: #007bff;
        }
      </style>
    </head>
    <body>
      <h1 style="color: #007bff;">Mongo DB Add User</h1>
      <form action="/addUser" method="POST">
        <label for="userId">User ID </label>
        <input type="text" id="userId" name="userId"><br>
        <label for="password">Password </label>
        <input type="password" id="password" name="password"><br>
        <label for="emailId">Email ID </label>
        <input type="email" id="emailId" name="emailId"><br>
        <button type="submit" style="background-color: #007bff; color: #fff;">Add User</button>
      </form>

      <h1 style="color: #007bff;">User List</h1>
      <a href="/allUsers" style="text-decoration: none; color: #007bff;">View All Users</a>
    </body>
  </html>

  `);
});

// Add a new user
app.post('/addUser', (req, res) => {
  const newUser = new UserData({
    userId: req.body.userId,
    password: req.body.password,
    emailId: req.body.emailId,
  });

  newUser
    .save()
    .then(() => {
      console.log('User added successfully');
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
      res.send('Unable to add the user.');
    });
});

// Retrieve all users
app.get('/allUsers', (req, res) => {
  UserData.find()
    .then((data) => {
      res.send(`
        <html>
          <head>
            <style>
              // Add your CSS styles for the table here //
            </style>
          </head>
          <body>
            <h1>User List</h1>
            <a href="/addUser">Add New User</a>
            <table>
              <tr>
                <th>User ID</th>
                <th>Password</th>
                <th>Email ID</th>
                <th>Actions</th>
              </tr>
              ${data
                .map((user) => `
                  <tr>
                    <td>${user.userId}</td>
                    <td>${user.password}</td>
                    <td>${user.emailId}</td>
                    <td>
                      <form action="/deleteUser" method="POST">
                        <input type="hidden" name="userId" value="${user.userId}">
                        <button type="submit">Delete</button>
                      </form>
                      <a href="/updateUser?userId=${user.userId}">Update</a>
                    </td>
                  </tr>
                `)
                .join('')}
            </table>
          </body>
        </html>
      `);
    })
    .catch((error) => {
      console.error(error);
      res.send('Could not retrieve the data.');
    });
});

// Delete a user
app.post('/deleteUser', (req, res) => {
  const userId = req.body.userId;

  UserData.findOneAndRemove({ userId })
    .then(() => {
      console.log('User deleted successfully');
      res.redirect('/allUsers');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error deleting user');
    });
});

// Update a user (GET request to show the update form)
app.get('/updateUser', (req, res) => {
  const userId = req.query.userId;

  UserData.findOne({ userId })
    .then((user) => {
      if (user) {
        res.send(`
        <html>
        <head>
          <style>
            // Add your CSS styles for the update form here //
          </style>
        </head>
        <body>
          <h1 style="color: #007bff;">Update User Data</h1>
          <form action="/updateUser" method="POST">
            <input type="hidden" name="userId" value="${user.userId}">
            <label for="password">New Password</label>
            <input type="password" id="password" name="password" value="${user.password}"><br>
            <label for="emailId">New Email ID</label>
            <input type="email" id="emailId" name="emailId" value="${user.emailId}"><br>
            <button type="submit" style="background-color: #007bff; color: #fff;">Update User</button>
          </form>
        </body>
      </html>
        `);
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error updating user');
    });
});

// Update a user (POST request to update the data)
app.post('/updateUser', (req, res) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const newEmailId = req.body.emailId;

  UserData.findOne({ userId })
    .then((user) => {
      if (user) {
        user.password = newPassword;
        user.emailId = newEmailId;

        return user.save();
      } else {
        res.status(404).send('User not found');
      }
    })
    .then(() => {
      console.log('User data updated successfully');
      res.redirect('/allUsers');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error updating user');
    });
});

const server = app.listen(port, () => {
  const address = server.address();
  console.log(`Server is running on http://localhost:${address.port}`);
});*/
