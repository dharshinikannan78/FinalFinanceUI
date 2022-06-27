import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  customerId: any = localStorage.getItem('customerId');
  _data: any;
  constructor(
    private apiService: ApiService,
    private router: Router,


  ) {
    this.getProductHistory();
  }
  ngOnInit() {
  }
  getProductHistory() {
    this.apiService.productForCustomerDetails(this.customerId).subscribe(data => {
      this._data = data;
      console.log(data, 'data')

    })
  }

}
