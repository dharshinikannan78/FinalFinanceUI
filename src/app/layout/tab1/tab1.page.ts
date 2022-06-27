import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(private apiService: ApiService,
    private modal: ModalController,
    private router: Router,
    private userService: UserService,
    public notificationService: NotificationService,
    private fb: FormBuilder) {
    this.generateProductForm();
    this.getDetails();
  }

  currentUser: string = localStorage.getItem('userName');
  productId: any = localStorage.getItem('productId');

  productDetailsForm: FormGroup;
  isShowError: boolean = false;
  ischecproductName: boolean = true;
  productDetails: any;
  segment: any;

  ngOnInit(): void {
    this.segment = 'Chit';
  }

  generateProductForm = () => {
    this.productDetailsForm = this.fb.group({
      productName: ['', Validators.required],
      productType: ['', Validators.required],
      productTenure: ['', Validators.required],
      noOfCustomers: ['', Validators.required],
      productDescription: ['', Validators.required],
      price: ['', Validators.required],
      createdBy: [this.currentUser],
      dateOfCreated: [moment().format()],
      startDate: [moment().format()]
    });
  }


  addProductDetails() {
    this.apiService.insertProduct(this.productDetailsForm.value).subscribe((data: any) => {
      this.productDetailsForm.reset();
      this.modal.dismiss().then(() => {
        window.location.reload()
      });
      this.getDetails();
    });
    this.notificationService.success('Product Details Saved Successfully');
  }

  getDetails() {
    this.apiService.getProductDetails().subscribe((data: any) => {
      this.productDetails = data;
    });
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }
  checkProduct() {
    this.isShowError = false
    this.ischecproductName = true;
    if (this.f.productName.invalid) {
      return;
    } else {
      this.apiService.existProductName(this.f.productName.value).subscribe(data => {
        if (data['message'] == 'You Can Enter') {
          this.ischecproductName = false
        } else {
          this.ischecproductName = true;
          this.isShowError = true
        }
      })
    }
  }

  get f() { return this.productDetailsForm.controls; }

  convert(data: any): string {
    return moment(data).format('D-MMM-YYYY');
  }

  onClose() {
    this.modal.dismiss();
  }

  thisFormValid() {
    if (this.productDetailsForm.valid) {
      return true
    } else {
      return false
    }
  }

  getAllCustomerDetails(data: any) {
    // this.userService.setProductId(data);
    console.log(this.userService, ' this.userService')
    this.userService.Product = data
    console.log(this.userService.Product, ' this.userService.Product')
    this.apiService.CustomerForProductDetails(data).subscribe(data => {
      console.log(data, 'hello');
      this.router.navigate(['tabs/tab2'])
        .then(() => {
          window.location.reload()
        });
    });
  }

  getFliterCustomer(data: any) {

  }
}