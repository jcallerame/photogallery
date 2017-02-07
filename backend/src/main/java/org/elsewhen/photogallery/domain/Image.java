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
	private Integer capturedYear;
	private Integer capturedMonth;
	private Integer capturedDay;
	private String location;
	private String notes;
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
	public Integer getCapturedYear() {
		return capturedYear;
	}
	public void setCapturedYear(Integer capturedYear) {
		this.capturedYear = capturedYear;
	}
	public Integer getCapturedMonth() {
		return capturedMonth;
	}
	public void setCapturedMonth(Integer capturedMonth) {
		this.capturedMonth = capturedMonth;
	}
	public Integer getCapturedDay() {
		return capturedDay;
	}
	public void setCapturedDay(Integer capturedDay) {
		this.capturedDay = capturedDay;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
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
