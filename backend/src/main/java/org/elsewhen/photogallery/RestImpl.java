package org.elsewhen.photogallery;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.elsewhen.photogallery.domain.Image;
import org.im4java.core.ConvertCmd;
import org.im4java.core.IM4JavaException;
import org.im4java.core.IMOperation;
import org.im4java.process.Pipe;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RestImpl implements RestApi {
	private static final Logger LOG = LoggerFactory.getLogger(RestImpl.class);
	private static final int THUMBNAIL_WIDTH = 200;
	private static final int THUMBNAIL_HEIGHT = 150;
	private static final String GRAPHICS_MAGICK_COMMAND_DIR = "/usr/local/bin";
	private static final String MIME_TYPE_JPEG = "image/jpeg";
	
	/**
	 * Gets the public site configuration properties.
	 * @return a Response object containing all of the site configuration properties whose
	 * names start with "public.".
	 */
	@Override
	public Response getPublicConfigProperties() {
		Properties allProperties;
		try {
			allProperties = SiteConfiguration.getInstance().getProperties();
		} catch (IOException ioe) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		Properties publicProperties = new Properties();
		Set<String> allPropertyNames = allProperties.stringPropertyNames();
		for (String propertyName : allPropertyNames) {
			if (propertyName.startsWith("public.")) {
				publicProperties.setProperty(propertyName, allProperties.getProperty(propertyName));
			}
		}
		return Response.ok().entity(publicProperties).build();
	}
	
	private static boolean isImageFileSizeAcceptable(int contentLength) {
		String maxImageFileSizeStr = null;
		try {
			maxImageFileSizeStr = SiteConfiguration.getInstance().getProperty("public.maxImageFileSize");
		} catch (IOException ioe) {
			//Already logged in SiteConfiguration.getInstance().
		}
		if (maxImageFileSizeStr != null) {
			try {
				int maxImageFileSize = Integer.parseInt(maxImageFileSizeStr);
			    if (maxImageFileSize > 0 && contentLength > maxImageFileSize) {
			    	LOG.error("Uploaded image file size of " + contentLength
			    			+ " exceeds maximum image file size of " + maxImageFileSize);
			    	return false;
			    }
			} catch (NumberFormatException nfe) {
				LOG.error("maxImageFileSize setting in kickstart.properties is not an integer.");
			}
		}

	    return true;
	}
	
	/**
	 * Gets the image itself
	 */
	@Override
	public Response getImage(String id) throws IOException {
		Datastore datastore = MongoManager.getInstance().getDatastore();
		Image image = datastore.get(Image.class, id);
		return Response.ok().type(image.getImageMimeType()).entity(
				image.getImageData()).build();
	}
	
	/**
	 * Gets the thumbnail
	 */
	@Override
	public Response getThumbnail(String id) throws IOException {
		Datastore datastore = MongoManager.getInstance().getDatastore();
		Image image = datastore.get(Image.class, id);
		return Response.ok().type(image.getThumbnailMimeType()).entity(
				image.getThumbnailData()).build();
	}

	/**
	 * Uploads a new image to S3, generating a key and including the key in the response.
	 */
	@Override
	public Response uploadImage(HttpServletRequest request) throws IOException {
		LOG.debug("Adding image.");
		return addOrReplaceImage(null, request);
	}
	
	/**
	 * Replaces an existing image by overwriting the image on S3.
	 */
	@Override
	public Response replaceImage(String id, HttpServletRequest request) throws IOException {
		LOG.debug("Replacing image.");
		return addOrReplaceImage(id, request);
	}
	
	/**
	 * Handles an uploaded image, sending it to S3 with the given key.  If the key is new,
	 * include it in the response.
	 * @param key The S3 key for the image
	 * @param request The HttpServletRequest
	 * @param isNewKey true if this is a newly-generated key which should be included in the 
	 * HTTP response body.
	 * @return An HTTP response
	 * @throws IOException
	 */
	public Response addOrReplaceImage(String id, HttpServletRequest request) 
			throws IOException {
		int contentLength = request.getContentLength();
		String mimeType = request.getContentType();
		LOG.debug("content length: " + contentLength);
		LOG.debug("content type: " + mimeType);
		if (!isImageFileSizeAcceptable(contentLength)) {
			return Response.status(Response.Status.REQUEST_ENTITY_TOO_LARGE)
					.type(APPLICATION_JSON).entity("{}").build();
		}
		InputStream requestInputStream = request.getInputStream();
		byte[] imageBytes = IOUtils.toByteArray(requestInputStream);
		InputStream imageInputStream = new ByteArrayInputStream(imageBytes);
		LOG.debug("imageBytes length: " + imageBytes.length);
		//Create thumbnail
		IMOperation op = new IMOperation();
		op.addImage("-");
		op.resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
		//JPEG doesn't support transparency -- so make transparent pixels white
		op.background("white");
		op.flatten();
		op.addImage("jpeg:-");
		ByteArrayOutputStream os = new ByteArrayOutputStream(contentLength);
		Pipe pipeIn = new Pipe(imageInputStream, null);
		Pipe pipeOut = new Pipe(null, os);
		ConvertCmd convert = new ConvertCmd(true);
		convert.setSearchPath(GRAPHICS_MAGICK_COMMAND_DIR);
		convert.setInputProvider(pipeIn);
		convert.setOutputConsumer(pipeOut);
		try {
			convert.run(op);
			imageInputStream.close();
			os.close();
		} catch (InterruptedException ie) {
			LOG.error("GraphicsMagick convert command was interrupted", ie);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		} catch (IM4JavaException im4je) {
			LOG.error("An error occurred while executing the GraphicsMagick convert command",
					im4je);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
		byte[] thumbnailBytes = os.toByteArray();
		
		//Store both original image and thumbnail in database.
		Datastore datastore = MongoManager.getInstance().getDatastore();
		Image image;
		Map<String, String> responseMap = new HashMap<>();
		if (id == null) {
			image = new Image();
			image.setId(UUID.randomUUID().toString());
			image.setImageData(imageBytes);
			image.setImageMimeType(mimeType);
			image.setThumbnailData(thumbnailBytes);
			image.setThumbnailMimeType(MIME_TYPE_JPEG);
			datastore.save(image);
			responseMap.put("id", image.getId().toString());
		} else {
			Query<Image> updateQuery = datastore.createQuery(Image.class)
					.field("_id").equal(id);
			UpdateOperations<Image> ops = datastore.createUpdateOperations(
					Image.class).set("imageData", imageBytes)
					.set("imageMimeType", mimeType)
					.set("thumbnailData", thumbnailBytes)
					.set("thumbnailMimeType", MIME_TYPE_JPEG);
			datastore.update(updateQuery, ops);
		}
		return Response.ok().entity(responseMap).build();
	}
	
	/**
	 * Deletes the image from the database
	 */
	@Override
	public Response deleteImage(String id) throws IOException {
		Datastore datastore = MongoManager.getInstance().getDatastore();
		Query<Image> deleteQuery = datastore.createQuery(Image.class)
				.field("_id").equal(id);
		Image deletedImage = datastore.findAndDelete(deleteQuery);
		if (deletedImage == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		} else {
			return Response.ok().build();
		}
	}
	
	/**
	 * Gets the metadata for all of the images.
	 */
	@Override
	public Response getImagesMetadata() throws IOException {
		Datastore datastore = MongoManager.getInstance().getDatastore();
		Query<Image> query = datastore.createQuery(Image.class);
		final List<Image> images = query.asList();
		LOG.debug("Number of images: " + images.size());
		return Response.ok().entity(images).build();
	}
	
	/**
	 * Gets the metadata for the image with the given id
	 */
	@Override
	public Response getImageMetadata(String id) throws IOException {
		Datastore datastore = MongoManager.getInstance().getDatastore();
		List<Image> images = datastore.createQuery(Image.class).field("id").equal(id).asList();
		if (images.size() == 1) {
			Image image = images.get(0);
			return Response.ok().entity(image).build();
		} else if (images.size() == 0) {
			return Response.status(Response.Status.NOT_FOUND).build();
		} else {
			LOG.error("Error: Duplicate images found with id: " + id);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Updates the metadata for the image with the given id.
	 */
	@Override
	public Response updateImageMetadata(String id, Image imageMetadata) 
			throws IOException {
		Datastore datastore = MongoManager.getInstance().getDatastore();
		Query<Image> updateQuery = datastore.createQuery(Image.class)
				.field("_id").equal(id);
		UpdateOperations<Image> ops = datastore.createUpdateOperations(Image.class);
		//Morphia won't allow you to set a field to null on an update.  Argh!
		//So, remove any fields where the value is null.
		String title = imageMetadata.getTitle();
		if (title == null) {
			ops.unset("title");
		} else {
			ops.set("title", title);
		}
		//Year, month, and day must all be null or all be non-null.
		//If mixed nulls and non-nulls, an exception will be thrown when performing the
		//update operation.
		Integer capturedYear = imageMetadata.getCapturedYear();
		Integer capturedMonth = imageMetadata.getCapturedMonth();
		Integer capturedDay = imageMetadata.getCapturedDay();
		if (capturedYear == null && capturedMonth == null && capturedDay == null) {
			ops.unset("capturedYear");
			ops.unset("capturedMonth");
			ops.unset("capturedDay");
		} else {
			ops.set("capturedYear", capturedYear);
			ops.set("capturedMonth", capturedMonth);
			ops.set("capturedDay", capturedDay);
		}
		String location = imageMetadata.getLocation();
		if (location == null) {
			ops.unset("location");
		} else {
			ops.set("location", location);
		}
		String notes = imageMetadata.getNotes();
		if (notes == null) {
			ops.unset("notes");
		} else {
			ops.set("notes", notes);
		}
		datastore.update(updateQuery, ops);
		return Response.ok().build();
	}
	
}
