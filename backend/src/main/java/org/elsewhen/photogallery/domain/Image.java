package org.elsewhen.photogallery.domain;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.bson.types.ObjectId;

@Entity("images")
public class Image {
	@Id
	private String id;
	private String title;
	private Date date;
	private String location;
	@JsonIgnore private byte[] thumbnailData;
	@JsonIgnore private byte[] imageData;
	@JsonIgnore private String imageMimeType;
	@JsonIgnore private String thumbnailMimeType;
	
	public Image() {}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public byte[] getThumbnailData() {
		return thumbnailData;
	}
	public void setThumbnailData(byte[] thumbnailData) {
		this.thumbnailData = thumbnailData;
	}
	public byte[] getImageData() {
		return imageData;
	}
	public void setImageData(byte[] imageData) {
		this.imageData = imageData;
	}
	public String getImageMimeType() {
		return imageMimeType;
	}
	public void setImageMimeType(String imageMimeType) {
		this.imageMimeType = imageMimeType;
	}
	public String getThumbnailMimeType() {
		return thumbnailMimeType;
	}
	public void setThumbnailMimeType(String thumbnailMimeType) {
		this.thumbnailMimeType = thumbnailMimeType;
	}
	
}
