import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as FileSaver from 'file-saver';
import { NotificationService } from 'src/app/services/notification.service';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  currentUser: string = localStorage.getItem('userName');
  productId: any = localStorage.getItem('productId');
  filterArray: any;
  _data: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient,
    private toast: NotificationService,
    public alertController: AlertController,
    private userService: UserService,
  ) {
    this.getCustomerDetail();
  }
  ngOnInit(): void {
  }

  getCustomerDetail = () => {
    this.apiService.FliterCustomerDetails().subscribe(data => {
      this._data = data;
      this.filterArray = this._data;
    });
  }
  yourSearchFunction(event) {
    let val = event.target.value;
    this.filterArray = this._data;
    this.filterArray = this.filterArray.filter((item: any) => {
      return (item.customerName.toLowerCase().indexOf(val.toLowerCase()) > -1);
    });
  }

  getFileDownload(id: any) {
    return this.http.get('https://localhost:44384/api/Fileupload/DownloadFile?id=' + id, { responseType: 'blob' }).subscribe((event) => {
      FileSaver.saveAs(event);

    });
  }
  async presentAlertConfirm(data: any) {

    let payload = {
      'createdBy': this.currentUser,
      'customerId': data,
      // 'productId': this.userService.getProductId(),
      'productId': this.productId
    }

    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      message: "Are you sure want to add customer?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
          }
        },
        {
          text: "Okay",
          handler: () => {
            this.apiService.insertProductCustomer(payload).subscribe((data: any) => {
              console.log(data)
            });
            this.toast.success('Added Successfully');
            // window.location.reload();
            // this.router.navigate(['/tabs/tab2'])
            // .then(() => {
            //   window.location.reload()
            // });
            this.toast.success('Add sucessfully');

          }
        }
      ]
    });
    await alert.present();
  }
  customerHistory(data: any) {
    console.log(data, 'cus')
    this.userService.customer = data;
    this.apiService.productForCustomerDetails(data).subscribe(data => {
      console.log(data, 'data')
      this.router.navigate(['/tabs/tab5'])

    });

  }
}
