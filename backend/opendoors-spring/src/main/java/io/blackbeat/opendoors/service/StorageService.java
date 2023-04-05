package io.blackbeat.opendoors.service;


import io.blackbeat.opendoors.Exception.MyFileNotFoundException;
import io.blackbeat.opendoors.config.FileStorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
@Service
public class StorageService {

    private String uploadPath;

    @Autowired
    public StorageService(FileStorageProperties fileStorageProperties){
        this.uploadPath = fileStorageProperties.getUploadDir();
    }

    private String getRandomStr(){
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();
        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        System.out.println("random : " + generatedString);
        return generatedString;
    }

    public List<String> saveFiles(List<MultipartFile> files, String postName) throws IOException {
//        String randomStr = getRandomStr();
        List<String> fileNames = new ArrayList<>();
        for(MultipartFile file : files) {
            fileNames.add(StringUtils.cleanPath(file.getOriginalFilename()));
        }
        Path uploadPath = Paths.get(this.uploadPath+"/"+postName);
        if(!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("make dir : " + uploadPath.toString());
        }
        for(int i =0; i< files.size(); i++) {
            try (InputStream inputStream = files.get(i).getInputStream()) {
                Path filePath = uploadPath.resolve(fileNames.get(i));
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileNames.get(i), ioe);
            }
        }
        return fileNames;
    }

    public String saveFile(MultipartFile file, String userName) throws IOException {

        String randomStr = getRandomStr();
        String fileName = randomStr + StringUtils.cleanPath(file.getOriginalFilename());

        Path uploadPath = Paths.get(this.uploadPath+"/"+userName);
        if(!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ioe) {
            throw new IOException("Could not save image file: " + fileName, ioe);
        }
    }

    public Resource loadFileAsResource(String id, String fileName) {
        Path uploadPath = Paths.get(this.uploadPath+"/"+id);
        System.out.println(uploadPath);
        try {
            Path filePath = uploadPath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            System.out.println(resource);
            if(resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("File not found " + fileName, ex);
        }
    }
}