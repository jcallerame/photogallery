# Photo Gallery

This is my Photo Gallery web application.  It is not finished yet.  The back end is complete but is not fully tested.  The front end is in its early stages.

The back end is written in Java and uses MongoDB, and the front end is written in Javascript using the Angular 2 framework.

## Building and Running the Back End

Install GraphicsMagick (http://www.graphicsmagick.org/), and also install the JPEG (http://www.ijg.org/), ZLIB (http://www.zlib.net/), and LIBPNG (http://www.libpng.org/pub/png/pngcode.html) libraries.

Install Java SE 8 JDK, MongoDB, Gradle, and Wildfly.

Type:
```
cd backend
gradle build
```

Start the Mongo daemon by typing:
```
mongod
```

If you get an error, you may need to create and give permissions to the data directory mongodb is trying to use.

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
