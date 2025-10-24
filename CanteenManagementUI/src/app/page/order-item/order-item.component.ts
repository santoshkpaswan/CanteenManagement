import { ChangeDetectorRef, Component, Inject, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoreService } from 'src/app/services/core.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ModalDismissReasons, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CanteenService } from 'src/app/services/canteen/canteen-service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import * as XLSX from 'xlsx';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment';


export interface OrderItem {
  itemName: string;
  itemPrice: number;
  count: number;
  imageUrl?: string;
  itemPriceDescriptin?: string;
  foodMenuItemId?: number;
  dayId?: number;
}

@Component({
  selector: 'app-order-item',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss'
})


export class OrderItemComponent implements OnInit {
  addpayNow: FormGroup;
  currentPage: number = 0;
  pageSize: number = 10;
  itemList: OrderItem[] = [];
  response: any;
  grandTotal: number = 0;
  orderNumber: string = '';
  filteredItems: any[] = [];


  imageUrl: any = environment.imageUrl;


  displayedColumns: string[] = ['sno', 'itemno', 'imageurl', 'itemname', 'itemprice', 'itempricedescriptin'];
  @Input("enableBulkAction") enableBulkAction: boolean = false;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  @Inject(MAT_DIALOG_DATA) public data: any
  private modalService = inject(NgbModal);
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _canteenService: CanteenService,
    private _confirmation: ConfirmationDialogService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _coreService: CoreService) {

    // Get user info from localStorage
    const currentUser = this._authService.getUser();
    const rgenId = currentUser.account_id;   // always a number
    const userId = currentUser.user_name;  // always a string
    const userType = currentUser.usertype;  // always a string
    this.addpayNow = _formBuilder.group({
      orderNumber: [''],
      dayId: [0,],
      rgenId: [rgenId],
      userName: [''],
      userId: [userId],
      userType: [userType],
      totalAmount: [0],
      paymentType: [0],
      paymentStatus: [0],
      status: [0]

    });


  }



  ngOnInit(): void {

    this.getGridData();
    this.getLoginUserNameGridData();
    // Generate order number


  }

  getGridData() {

    this._canteenService.getOrderItem().subscribe((response) => {
      this.dataSource = response.data;
      this.itemList = response.data;
      //this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getLoginUserNameGridData() {

    const currentUser = this._authService.getUser();
    const rgenId = currentUser.account_id;
    this._canteenService.getLoginUserName(rgenId).subscribe((response) => {
      this.response = response;

    });
  }




  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addItem(item: OrderItem) {
    if (this.orderNumber == '') {
      this.orderNumber = this.generateOrderNumber();
    }

    item.count = (item.count || 0) + 1;

    // const index = this.filteredItems.indexOf(item);
    // if (index > -1) {
    //   this.filteredItems.splice(index, 1);
    // }
    if (!this.filteredItems.some(x => x.foodMenuItemId === item.foodMenuItemId)) {
      this.filteredItems.push(item);
    }
    this.calculateGrandTotal();
  }

  removeItem(item: OrderItem) {
    if (item.count > 0) {
      item.count--;
      this.calculateGrandTotal();
    }
  }

  calculateGrandTotal() {
    this.grandTotal = this.filteredItems.reduce((sum: any, x: any) => sum + x.count * x.itemPrice, 0);
  }
  // Getter to avoid parser errors in template
  // get filteredItems(): OrderItem[] {
  //
  //   return this.itemList.filter(x => x.count > 0);
  // }
  generateOrderNumber(): string {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Get order counts from localStorage
    const orderCounts = JSON.parse(localStorage.getItem('orderCounts') || '{}');

    // Get today's count or 0 if new day
    let todayCount = orderCounts[todayStr] || 0;

    // Increment for new order
    todayCount += 1;

    // Save updated count
    orderCounts[todayStr] = todayCount;
    localStorage.setItem('orderCounts', JSON.stringify(orderCounts));

    // Format: RDIAS00001 (5-digit sequence)
    return `RDIAS${todayCount.toString().padStart(5, '0')}`;
  }


  // Mock payment process
  // payNow() {
  //   if (this.filteredItems.length === 0) {
  //     alert('Add items to cart before payment.');
  //     return;
  //   }
  // }

  orderPlace() {
    
    // Check if the form is valid
    if (this.addpayNow.invalid) {

      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }

    // Get current user info
    const currentUser = this._authService.getUser();
    const dayId = this.itemList?.length ? this.itemList[0].dayId : null;
    const userName = this.response.Name;

    // Prepare the payload
    const orderData: any = {
      orderNumber: this.addpayNow.value.orderNumber || this.orderNumber, // auto/given
      dayId: dayId,

      rgenId: currentUser?.account_id || this.addpayNow.value.rgenId,
      userId: currentUser?.user_name || this.addpayNow.value.userId,
      userType: currentUser?.usertype || this.addpayNow.value.userType,
      //userName: this.addpayNow.value.userName,
      userName: userName,
      totalAmount: this.grandTotal,//Number(this.addpayNow.value.totalAmount),
      paymentType: Number(this.addpayNow.value.paymentType),
      paymentStatus: Number(this.addpayNow.value.paymentStatus),
      status: Number(this.addpayNow.value.status),
      createdDate: new Date(),
      orderItems: this.filteredItems.map(item => ({
        itemNo: item.count,
        itemName: item.itemName,
        foodMenuItemId: item.foodMenuItemId,
        totalAmount: item.count * item.itemPrice
      }))
    };

    // Disable the form to prevent double submit
    this.addpayNow.disable();

    // Call API
    this._canteenService.addOrder(orderData).subscribe({
      next: (res: any) => {
        this._coreService.openSnackBar(res.message || 'Order placed successfully!', 'Ok');
        this.modalService.dismissAll();
        this.addpayNow.enable();
        this.addpayNow.reset();

        // CLEAR BILLING SUMMARY
        //this.filteredItems = [];  // empties the table
        //this.grandTotal = 0;      // resets the total amount
        //this.orderNumber = '';    // optional: reset order number
        this.getGridData();
      },
      error: (err) => {
        console.error(err);
        this._coreService.openSnackBar('Something went wrong. Please try again!', 'Ok');
        this.addpayNow.enable();
      }
    });
  }
}
