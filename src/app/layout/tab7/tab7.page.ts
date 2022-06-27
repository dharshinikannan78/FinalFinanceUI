import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from '../../services/notification.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
})
export class Tab7Page implements OnInit {

  
  constructor(public notificationService: NotificationService,
    private router: Router,
    private apiService: ApiService) {
    this.getDetails();
    this.customerList()
    this.getCustomerDetail();
    this.paymentDetails();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
  }

  _payload: any
  from: string = moment().format();
  to: string = moment().format();
  convertedFrom: any
  convertedTo: any
  currentdateFrom = moment().format('MMMM Do YYYY');
  currentdateTo = moment().format('MMMM Do YYYY');
  customerDetailsList: any;
  productDetails: any;
  customerData: any;
  allPaymentDetails: any;

  convert(data: any): string {
    return moment(data).format('D-MMM-YYYY');
  }

  customerList() {
    this.apiService.getProductCustomer().subscribe((data: any) => {
      this.customerDetailsList = data
    });
  }

  getDetails() {
    this.apiService.getProductDetails().subscribe((data: any) => {
      this.productDetails = data;
    });
  }

  getCustomerDetail = () => {
    this.apiService.getCustomerDetails().subscribe(data => {
      this.customerData = data;
    });
  }

  paymentDetails() {
    let payload = {
      'fromDate': new Date(this.from),
      'toDate': new Date(this.to),
    }
    let test = this.apiService.filterItem(payload)
    test.subscribe(data => {
      this.allPaymentDetails = data;
    });
  }

}
