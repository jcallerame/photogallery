# Photo Gallery

This is my Photo Gallery web application.  It lets you browse photos, add photos, edit photo information, and delete photos.  The back end is written in Java and uses MongoDB, Morphia, im4java, and GraphicsMagick, and the front end is written in TypeScript using the Angular 2 framework.

## Building and Running the Back End

Install GraphicsMagick (http://www.graphicsmagick.org/), and also install the JPEG (http://www.ijg.org/), ZLIB (http://www.zlib.net/), and LIBPNG (http://www.libpng.org/pub/png/pngcode.html) libraries.

Install Java SE 8 JDK, and the latest versions of MongoDB (tested with version 3.4.2), Gradle (tested with version 3.3), and Wildfly (tested with version 10.1.0 Final).

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

Launch a mongodb shell by typing:
```
mongo
```

In the mongo shell, create the database (by using it) and the user:
```
use photogallery;
db.createUser({user: "photogal", pwd: "ph0t0s", roles: [{role: "readWrite", db: "photogallery"}]});
```

Edit photogallery.properties and set the graphicsMagickCommandDirectory property
to the directory containing your GraphicsMagick (gm) executable.  Type
`which gm` to find out where this executable is located.  Do NOT include the
executable name ("gm") in the path.

Copy photogallery.properties to your wildfly base directory.

Start Wildfly from the directory to which you copied the properties file, then go to http://localhost:9990 and deploy the file `photogallery/backend/build/libs/photogallery.war`.

## Building and Running the Front End

Install node v4 or later and npm v3 or later.  I recommend installing nvm, which you can then use to install or update node by typing `nvm install node`.

Type:
```
cd frontend
npm install
npm start
```

This should open your browser to http://localhost:3000/, where you can then see the application running in your web browser.
