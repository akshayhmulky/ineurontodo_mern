# ineurontodo
Play with todo and tasks

## Features:
 - SignIn and SignUp (using Appwrite)
 - Allows users to create their todos and its respective tasks
 - Filter todo by created date and completed todo
 - Mark todo as completed
 - Real time search feature

## Technologies used:
 - Frontend: React
- Backend: ExpressJs, MongoDB, NodeJs
- Auth: Appwrite

## Authentication Handling:
- Register a user using an api(account.create) provided by Appwrite, once user is created in Appwrite backend, then we proceed to create a user in MongoDB by storing email and appwriteId (We could have ignored this user creation on MongoDb, however this helps if we are also creating an autentication using JWT token)
- Login a user using an api (account.createEmailSession) provided by Appwrite, since Appwrite restricts the number of times user can hit their api, we made use of localStorage for storing the user post login.
- To check if user is loggedIn, Appwrite provides an api account.get(), however as discussed previously it has limited number of hits, hence we substituted this api with localStorage to check if user is loggedin.
- Logout feature: Appwrite provides an api account.deleteSession('current') to logout user, and we also clear user from localStorage.
- Todo restriction: To make sure that users are able perform CRUD operations ONLY on their todos and tasks, we are passing appwriteId with every request, so that in the backend , we can fetch a user from mongoDB using appwriteId and compare that user with owner of Todo.

Minor Issue with Appwrite Authentication:
   - We get back user data when we register a user and also when we login a user in Appwrite, however $id which we get while registering a user does not match with the $id of a loggedin user, instead it matches userId of loggedin user (login api sends back both $id and userId)
  Work Around:
   - When user is initially registered we save $id as appwriteId in the MongoDB backend, however post logIn instead of sending $id we send userId for validation.

 
 
## Screenshots:
  
  <img width="911" alt="Homepage" src="https://user-images.githubusercontent.com/43242236/205498057-3eef59e5-f6dc-420c-8658-462957060878.png">
  
  <img width="487" alt="image" src="https://user-images.githubusercontent.com/43242236/205498127-d4e171b6-b23b-4b0c-819c-721e55fba990.png">

  <img width="479" alt="image" src="https://user-images.githubusercontent.com/43242236/205498186-5567d2dc-c0d6-49ae-a438-902f91e05d6a.png">
  
  <img width="479" alt="image" src="https://user-images.githubusercontent.com/43242236/205498374-4f0e7a3c-e114-46fd-a7f6-8d3d5cd3b6bc.png">

  <img width="483" alt="image" src="https://user-images.githubusercontent.com/43242236/205498598-b718aa68-ec83-4e71-8b5b-8ff0eff51db0.png">

   


  
  

