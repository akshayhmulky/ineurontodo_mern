/*
MAJOR ISSUE:
while registering we use appwriteId as $id, however post Login, $id is moved to UserId by appwrite for some reason, hence once we have stored
user in localStorage, we would be using appwrite as userId
*/

import { Client, Account, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('http://localhost/v1')
  .setProject('638b17c6b2560326173c');

//=================================HELPER FUNCTIONS ====================================================================

export const register = async (email, password) => {
  return await account.create(ID.unique(), email, password);
};

//-----------------------------------------------------------------------------------------------------------------

//Login function
export const login = async (email, password) => {
  /*
  NOTE: Since appwrite restricts certain number of hits to login api, we are going to make use of 
  localstorage for storing the data.

  return await account.createEmailSession(email, password);
  */
  const user = await account.createEmailSession(email, password);
  //Save user in the localstorage
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

//-------------------------------------------------------------------------------------------------------------------

//Get user function returns user if user is loggedin
export const getUser = async () => {
  /*
  NOTE: Since account.get() restricts only certain number of hits to the api, we have stored user in localstorage
  return await account.get();
  */
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('PARSING', user);
  return user;
};

//-----------------------------------------------------------------------------------------------------------------------

//LOGOUT function
export const logout = async () => {
  await account.deleteSession('current');
  localStorage.removeItem('user');
};

export const account = new Account(client);
