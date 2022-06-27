import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  _data;
  productCustomerList: any;
  paymentForm: FormGroup;
  productId: any = localStorage.getItem('productId');
  customerId: any = localStorage.getItem('customerId');
  PaymentId: any = localStorage.getItem('productCustomerId');
  currentUser: string = localStorage.getItem('userName');




  constructor(
    private router: Router,
    private fb: FormBuilder,
    public notificationService: NotificationService,
    private userService: UserService,
    private apiService: ApiService,
    private toast: NotificationService,
    public alertController: AlertController,
    private modal: ModalController,

  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.getCustomerDetails();
    this.generatePaymentForm();
    this.customerList();
  }
  ngOnInit(): void {
  }

  addCustomerToProduct() {
    this.userService.getProductId();
    this.router.navigate(['tabs/tab3']);
  }

  getCustomerDetails() {
    let pid = this.userService.getProductId();
    console.log(pid, 'pid')
    this.apiService.CustomerForProductDetails(this.productId).subscribe(data => {
      this._data = data;
      console.log(data, 'Geetha');

    });
  }

  getHistory(data: any) {
    this.userService.PaymentId = data
    this.router.navigate(['tabs/tab4']);
    console.log("geeths")
  }

  customerList() {
    let pId = this.productId
    // let pId = this.userService.getProductId();
    this.apiService.ProductCustomer(pId).subscribe((data: any) => {
      console.groupCollapsed(data, 'hello')
      this.productCustomerList = data
    });
  }

  generatePaymentForm = () => {
    this.paymentForm = this.fb.group({
      productCustomerId: [this.PaymentId],
      paymentType: ['', Validators.required],
      paymentDate: [moment().format()],
      paidAmount: ['', Validators.required],
      collectedBy: [this.currentUser],
    });
  }

  payFormValue() {
    this.apiService.paymentDetails(this.paymentForm.value).subscribe(data => {
      console.log(data, 'helo')
      this.notificationService.success('Paid successfully')
      this.router.navigate(['tabs/tab1']);
    });
    this.modal.dismiss();
    this.paymentForm.reset();
  }

  onClose() {
    this.modal.dismiss();
  }

  thisFormValid() {
    if (this.paymentForm.valid) {
      return true
    } else {
      return false
    }
  }

}