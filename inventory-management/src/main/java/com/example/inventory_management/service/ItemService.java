package com.example.inventory_management.service;

import com.example.inventory_management.model.Item;
import com.example.inventory_management.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;

    /**
     * Create a new item.
     * @param item The item to be created.
     * @return The created item.
     * @throws IllegalArgumentException if item fields are invalid.
     */
    public Item createItem(Item item) {
        validateItem(item); // Validate item fields
        return itemRepository.save(item);
    }

    /**
     * Retrieve all items.
     * @return A list of items.
     */
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    /**
     * Retrieve an item by its ID.
     * @param id The id of the item.
     * @return The item if found.
     * @throws RuntimeException if the item is not found.
     */
    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    /**
     * Update an existing item.
     * @param id The id of the item to update.
     * @param item The item data to update.
     * @return The updated item.
     * @throws RuntimeException if the item is not found.
     */
    public Item updateItem(Long id, Item item) {
        validateItem(item); // Validate item fields
        Item existingItem = getItemById(id);
        existingItem.setName(item.getName());
        existingItem.setDescription(item.getDescription());
        existingItem.setQuantity(item.getQuantity());
        existingItem.setPrice(item.getPrice());
        return itemRepository.save(existingItem);
    }

    /**
     * Delete an item by its ID.
     * @param id The id of the item to delete.
     */
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    /**
     * Validate item fields.
     * @param item The item to validate.
     * @throws IllegalArgumentException if any field is invalid.
     */
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
}