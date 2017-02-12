package org.elsewhen.photogallery;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.Encoded;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.elsewhen.photogallery.domain.Image;

@Path("/")
public interface RestApi {
	
	/**
	 * Gets an image
	 */
	@Path("images/{id}")
	@GET
	public Response getImage(@PathParam("id") String id) 
			throws IOException;
	
	/** 
	 * Uploads an image
	 */
	@Path("images")
	@POST
	@Produces(APPLICATION_JSON)
	public Response uploadImage(@Context HttpServletRequest request) throws IOException;
	
	
	/**
	 * Replaces an image.
	 *
	 * @param key
	 * the S3 key
	 */
	@Path("images/{id}")
	@PUT
	@Produces(APPLICATION_JSON)
	public Response replaceImage(@PathParam("id") String id, 
			@Context HttpServletRequest request) throws IOException;
	
	/**
	 * Deletes an image along with associated thumbnail and metadata.
	 *
	 * @param key
	 * the S3 key
	 */
	@Path("images/{id}")
	@DELETE
	@Produces(APPLICATION_JSON)
	public Response deleteImage(@PathParam("id") String id) throws IOException;
	
	@Path("thumbnails/{id}")
	@GET
	public Response getThumbnail(@PathParam("id") String id) throws IOException;
	
	/**
	 * Gets the metadata for all the images
	 */
	@Path("images-metadata")
	@GET
	@Produces(APPLICATION_JSON)
	public Response getImagesMetadata() throws IOException;
	
	/**
	 * Gets the metadata for a particular image
	 */
	@Path("images-metadata/{id}")
	@GET
	@Produces(APPLICATION_JSON)
	public Response getImageMetadata(@PathParam("id") String id) throws IOException;
	
	/**
	 * Adds or updates the metadata for a particular image
	 */
	@Path("images-metadata/{id}")
	@PUT
	@Consumes(APPLICATION_JSON)
	public Response updateImageMetadata(@PathParam("id") String id, 
			Image imageMetadata) throws IOException;
	
}
