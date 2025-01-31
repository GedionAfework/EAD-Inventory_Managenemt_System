package com.example.inventory_management.service;

import com.example.inventory_management.model.Item;
import com.example.inventory_management.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;

    public Item createItem(Item item) {
        validateItem(item); // Validate item fields
        return itemRepository.save(item);
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public Item updateItem(Long id, Item item) {
        validateItem(item); // Validate item fields
        Item existingItem = getItemById(id);
        existingItem.setName(item.getName());
        existingItem.setDescription(item.getDescription());
        existingItem.setQuantity(item.getQuantity());
        existingItem.setPrice(item.getPrice());
        return itemRepository.save(existingItem);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    private void validateItem(Item item) {
        if (item.getName() == null || item.getName().isEmpty()) {
            throw new IllegalArgumentException("Item name cannot be null or empty");
        }
        if (item.getDescription() == null || item.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Item description cannot be null or empty");
        }
        if (item.getQuantity() == null || item.getQuantity() < 0) {
            throw new IllegalArgumentException("Item quantity must be a non-negative integer");
        }
        if (item.getPrice() == null || item.getPrice() < 0) {
            throw new IllegalArgumentException("Item price must be a non-negative value");
        }
    }

    public String uploadImage(MultipartFile image) throws IOException {
        String uploadDir = "D://Desktop//inventory-management//src//main//resources//uploads"; // Specify a valid upload directory
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // Create directory if it doesn't exist
        }

        String imageName = System.currentTimeMillis() + "-" + image.getOriginalFilename();
        File imageFile = new File(directory, imageName);
        image.transferTo(imageFile); // Save the image

        return "/uploads/" + imageName; // Return URL for accessing the image
    }
}