package org.elsewhen.photogallery;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SiteConfiguration {
	private static final Logger LOG = LoggerFactory.getLogger(SiteConfiguration.class);
	public static final String CONFIG_FILENAME = "photogallery.properties";
	
	private static SiteConfiguration instance = null;
	private Properties properties = null;
	
	private SiteConfiguration() throws IOException, FileNotFoundException {
		loadProperties();
	}
	
	public static SiteConfiguration getInstance() throws IOException, FileNotFoundException {
		if (instance == null) {
			instance = new SiteConfiguration();
		}
		return instance;
	}
	
	public void loadProperties() throws IOException, FileNotFoundException {
		Path currentPath = Paths.get("");
		Path absolutePath = currentPath.toAbsolutePath();
		String configFilePath = absolutePath.toString() + "/" + CONFIG_FILENAME;
		File file = new File(configFilePath);
		properties = new Properties();
		if (!file.exists() || file.isDirectory()) {
			LOG.error("File does not exist or is not a regular file: " + configFilePath);
			throw new FileNotFoundException();
		}
		try (InputStream is = new FileInputStream(configFilePath)) {
			properties.load(is);
			LOG.info("Loaded properties file: " + configFilePath);
		} catch (IOException ioe) {
			LOG.error("Error loading properties file: " + configFilePath);
			throw ioe;
		}
	}
	
	public String getProperty(String key) {
		return properties.getProperty(key);
	}
	
	public String getProperty(String key, String defaultValue) {
		String val = getProperty(key);
		return (val == null) ? defaultValue : val;
	}
	
	public Properties getProperties() {
		return properties;
	}
}
