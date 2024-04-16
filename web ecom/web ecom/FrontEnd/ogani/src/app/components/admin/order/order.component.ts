import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/_service/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  listOrder : any;


  constructor(private orderService: OrderService){

  }

  ngOnInit(): void {
    this.getListOrder();
  }


  getListOrder(){
    this.orderService.getListOrder().subscribe({
      next: res=>{
        this.listOrder = res;
        console.log(this.listOrder);
      },error: err =>{
        console.log(err);
      }
    })
  }

  onStatusChange(id: number, newStatus: number) {
    console.log("id", id);
    console.log("new status", newStatus);
    this.orderService.updateOrder(id, newStatus).subscribe({
      next: res => {
        console.log('Order updated successfully:', res);
        this.getListOrder();
      },error: err => {
        console.log(err);
      }
    })
  }

}
