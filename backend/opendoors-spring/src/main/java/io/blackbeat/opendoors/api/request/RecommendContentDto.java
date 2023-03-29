package io.blackbeat.opendoors.api.request;

import lombok.Data;

@Data
public class RecommendContentDto {
    private String username;
    private String spotName;
    private double spotLat;
    private double spotLng;
}
