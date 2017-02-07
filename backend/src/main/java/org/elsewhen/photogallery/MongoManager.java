package org.elsewhen.photogallery;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

public class MongoManager {
	private static MongoManager instance = null;
	
	private Datastore datastore = null;
	
	public MongoManager() throws IOException, UnknownHostException {
		SiteConfiguration siteConfig = SiteConfiguration.getInstance();
		String dbHost = siteConfig.getProperty("dbHost", "localhost");
		String dbPortStr = siteConfig.getProperty("dbPort", "27017");
		int dbPort = Integer.parseInt(dbPortStr);
		String dbUsername = siteConfig.getProperty("dbUsername");
		String dbPassword = siteConfig.getProperty("dbPassword");
		String dbName = siteConfig.getProperty("dbName", "photogallery");
		String mongoClientURIStr = "mongodb://" + dbUsername + ":" + dbPassword +"@" + dbHost + 
				":" + dbPort + "/" + dbName;
		MongoClientURI mongoClientURI = new MongoClientURI(mongoClientURIStr);
		final Morphia morphia = new Morphia();
		morphia.mapPackage("org.elsewhen.photogallery.domain");
		datastore = morphia.createDatastore(new MongoClient(mongoClientURI), dbName);
		datastore.ensureIndexes();
	}
	
	public static MongoManager getInstance() throws IOException, UnknownHostException {
		if (instance == null) {
			instance = new MongoManager();
		}
		return instance;
	}
	
	public Datastore getDatastore() {
		return datastore;
	}
}
