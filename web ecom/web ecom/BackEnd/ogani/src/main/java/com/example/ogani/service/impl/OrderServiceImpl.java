package com.example.ogani.service.impl;

import java.util.List;

import com.example.ogani.entity.Product;
import com.example.ogani.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.ogani.entity.Order;
import com.example.ogani.entity.OrderDetail;
import com.example.ogani.entity.User;
import com.example.ogani.exception.NotFoundException;
import com.example.ogani.model.request.CreateOrderDetailRequest;
import com.example.ogani.model.request.CreateOrderRequest;
import com.example.ogani.repository.OrderDetailRepository;
import com.example.ogani.repository.OrderRepository;
import com.example.ogani.repository.UserRepository;
import com.example.ogani.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void placeOrder(CreateOrderRequest request) {
        // TODO Auto-generated method stub
        Order order = new Order();
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("Not Found User With Username:" + request.getUsername()));
        order.setFirstname(request.getFirstname());
        order.setLastname(request.getLastname());
        order.setCountry(request.getCountry());
        order.setAddress(request.getAddress());
        order.setTown(request.getTown());
        order.setState(request.getState());
        order.setPostCode(request.getPostCode());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setNote(request.getNote());   
        orderRepository.save(order);
        long totalPrice = 0;
        for(CreateOrderDetailRequest rq: request.getOrderDetails()){
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setName(rq.getName());
            orderDetail.setPrice(rq.getPrice());
            orderDetail.setQuantity(rq.getQuantity());
            orderDetail.setSubTotal(rq.getPrice()* rq.getQuantity());
            orderDetail.setOrder(order);
            totalPrice += orderDetail.getSubTotal();
            orderDetailRepository.save(orderDetail);
            Product product = productRepository.findById(rq.getProductId())
                    .orElseThrow(() -> new NotFoundException("Not Found Product With ID:" + rq.getProductId()));
            int currentQuantity = product.getQuantity();
            int currentSold = product.getSold();
            if (currentQuantity >= rq.getQuantity()) {
                int newQuantity = currentQuantity - rq.getQuantity();
                int newSold = currentSold + rq.getQuantity();

                product.setQuantity(newQuantity);
                product.setSold(newSold);
                productRepository.save(product);
            } else {
                throw new NotFoundException("Not enough quantity for product with ID:" + rq.getProductId());
            }
        }
        order.setTotalPrice(totalPrice);
        order.setUser(user);
        orderRepository.save(order);
    }

    @Override
    public List<Order> getList() {
        return orderRepository.findAll(Sort.by("id").descending());
    }

    @Override
    public List<Order> getOrderByUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not Found User With Username:" + username));

        List<Order> orders = orderRepository.getOrderByUser(user.getId());
        return orders;  
    }

    @Override
    public Order updateOrder(long id, int newStatus) {
        // TODO Auto-generated method stub
        Order order = orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Not Found Category With Id: " + id));
        order.setStatus(newStatus);
        orderRepository.save(order);
        return order;
    }

}
