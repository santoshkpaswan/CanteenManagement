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
  //orderNumber: string = '';
  filteredItems: any[] = [];
  selectedPaymentType: number | null = null;
  noticeList: any = [];
  isNoticeActive: boolean = false;
  placeOrderIsActiveList: boolean = false;



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
      //orderNumber: [''],
      dayId: [0,],
      rgenId: [rgenId],
      userName: [''],
      userMobileNo: [''],
      enrollNo: [''],
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
    this.getCanteenNoticeGridData();
    this.getLoginUserNameGridData();
    // Generate order number
  }

  getGridData() {
    this._canteenService.getOrderItem().subscribe((response) => {
      this.dataSource = response.data;
      this.itemList = response.data;
      if (response.data && response.data.length > 0) {
      this.placeOrderIsActiveList = response.data[0].placeOrderIsActive;
    }
      //this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getCanteenNoticeGridData() {
    this._canteenService.getCanteenNotice().subscribe({
      next: (response) => {
        if (response && response.data && response.data.length > 0) {
          const noticeData = response.data[0];
          this.noticeList = noticeData.notice;
          this.isNoticeActive = noticeData.isActive === true; // ensure boolean
        } else {
          this.noticeList = '';
          this.isNoticeActive = false;
        }
      }

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
    item.count = (item.count || 0) + 1;
    if (!this.filteredItems.some(x => x.foodMenuItemId === item.foodMenuItemId)) {
      this.filteredItems.push(item);
    }
    this.calculateGrandTotal();
  }

  removeItem(item: OrderItem) {
    if (item.count > 0) {
      item.count--;
    }
    this.calculateGrandTotal();
    // If count reaches 0, remove it from the filtered list
    if (item.count === 0) { this.filteredItems = this.filteredItems.filter((x) => x.foodMenuItemId !== item.foodMenuItemId); }
  }

  calculateGrandTotal() {
    this.grandTotal = this.filteredItems.reduce((sum: any, x: any) => sum + x.count * x.itemPrice, 0);
  }

  orderPlace() {
    // Validate closetime orderPlace Disable
    //   if (!this.isOrderingAllowed()) {
    //   this._coreService.openSnackBar('Ordering time is over!', 'Ok');
    //   return;
    // }
    // Validate payment selection
    if (!this.selectedPaymentType) {
      this._coreService.openSnackBar('Please select a payment type.', 'Ok');
      return;
    }

    // Check if the form is valid
    if (this.addpayNow.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }

    // Get current user info
    const currentUser = this._authService.getUser();
    const dayId = this.itemList?.length ? this.itemList[0].dayId : null;
    const userName = this.response.Name;
    const userMobileNumber = this.response.MobileNo;
    const userEnrollNumber = this.response.enroll_no;
    // Prepare the payload
    const orderData: any = {
      dayId: dayId,
      rgenId: currentUser?.account_id || this.addpayNow.value.rgenId,
      userId: currentUser?.user_name || this.addpayNow.value.userId,
      userType: currentUser?.usertype || this.addpayNow.value.userType,
      userName: userName,
      userMobileNo: userMobileNumber,
      enrollNo: userEnrollNumber,
      totalAmount: this.grandTotal,//Number(this.addpayNow.value.totalAmount),
      //paymentType: Number(this.addpayNow.value.paymentType),
      paymentType: Number(this.selectedPaymentType),
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
        this.filteredItems = [];  // empties the table
        this.grandTotal = 0;      // resets the total amount
        this.getGridData();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this._coreService.openSnackBar('Something went wrong. Please try again!', 'Ok');
        this.addpayNow.enable();
      }
    });
  }

  isOrderingAllowed(): boolean {
    return this.placeOrderIsActiveList;
  }

  isItemOrderingAllowed(item: any): boolean {
    if (!item.closeTime) return true;  // If item has no closeTime → allow
    const now = new Date();
    const parts = item.closeTime.split(':');
    const itemCloseTime = new Date();
    itemCloseTime.setHours(+parts[0], +parts[1], +parts[2] || 0, 0);
    return now <= itemCloseTime;
  }

}
