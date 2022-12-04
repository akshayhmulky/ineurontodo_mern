const User = require('../models/userModel');

//When user registers, he/she will pass on appwriteId from frontEnd which we will save in the backend along with email address
/*
API ENDPOINT: http://localhost:5000/api/v1/user/create/
body
{
  "email":"xyz@gmail.com",
  "appwriteId":"XXXXXXXXXXXXXXX"
}
*/
exports.createUser = async (req, res) => {
  try {
    const { email, appwriteId } = req.body;
    if (!email || !appwriteId) {
      return res.status(400).json({
        success: false,
        error: 'Email and appwriteId cannot be blank',
      });
    }
    const user = await User.create({
      email,
      appwriteId,
    });
    res.status(201).json({
      success: true,
      message: 'User has been created',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
