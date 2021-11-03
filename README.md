# App Liker API ![favicon-32x32](https://github.com/heroku/favicon/raw/master/favicon.iconset/icon_32x32.png) 
Appliker backend API create using MongoDB, Express and Node.js.

## API Documentation
The API documentation is publicly available here:

- [https://documenter.getpostman.com/view/10795600/UVBzo9od](https://documenter.getpostman.com/view/10795600/UVBzo9od)


## LOCAL INSTALLATION
#### Requirements
Make sure you have the following before proceeding to clone this API to run locally:
    
 1. Node = preferably version 14.x
    
 2. Git

#### Clone
Clone this app in your local machine. Run the following command in your terminal/cmd/shell:
        
    git clone https://github.com/erickarugu/appliker-api/.git

Navigate inside the the newly created folder folder.

#### Install Dependencies 
To install the requirements, run this command in your shell/terminal/cmd:

    npm install 

Note: Ensure you have navigated inside the newly created folder beofre running the above command.

#### Add Environment Variables 
Add the following environment variables in a `.env` file in the main directory:

     MONGO_DEV_URL=
     MONGO_PROD_URL=
     ACCESS_TOKEN_SECRET=
     PORT=

Obtain the Mongo URLs from Mongo Atlas. Set PORT e.g PORT=8000. The ACCESS_TOKEN_SECRET is used to sign jwt tokens. You can use a random string.

#### Run locally
To start the server, run this command on your terminal/shell/cmd:

    npm run start
    
To view the app, point your browser to `http://localhost:PORT`

## Hosting
The API is hosted on Heroku:
- [https://app-liker.herokuapp.com/api/v1/posts](https://app-liker.herokuapp.com/api/v1)
