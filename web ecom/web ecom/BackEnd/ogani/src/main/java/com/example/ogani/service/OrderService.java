package com.example.ogani.service;

import java.util.List;

import com.example.ogani.entity.Order;
import com.example.ogani.model.request.CreateOrderRequest;

public interface OrderService {
    
    void placeOrder(CreateOrderRequest request);

    Order updateOrder(long id, int newStatus);

    List<Order> getList();
    
    List<Order> getOrderByUser(String username);
}
