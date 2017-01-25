# Photo Gallery

This is my Photo Gallery web application.  It is not finished yet.  The back end is complete but is not fully tested.  The front end is in its early stages.

The back end is written in Java and uses MongoDB, and the front end is written in Javascript using the Angular framework.

## Building and Running the Back End

Install Java SE 8 JDK, MongoDB, Gradle, and Wildfly.

Type:
```
cd backend
gradle build
```

Start Wildfly, then go to http://localhost:9990 and deploy the file `photogallery/backend/build/libs/photogallery.war`.

## Building and Running the Front End

Install node v4 or later and npm v3 or later.  I recommend installing nvm, which you can then use to install or update node by typing `nvm install node`.

Type:
```
cd frontend
npm install
npm start
```

This should open your browser to http://localhost:3000/, where you can then see the application running in your web browser.
