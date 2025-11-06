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
import { OrderPaymentType, OrderPaymentStatus, OrderStatus } from 'src/app/shared/enums/enums.ts';


@Component({
  selector: 'app-order',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})

export class OrderHistoryComponent implements OnInit {
  addCanteenOrderForm: FormGroup;
  editCanteenOrderForm: FormGroup;
  savePaymentTransactionCanteenOrderForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  orderList: any = [];
  dayName: any = [];
  statusFilter: string = '';
  selectedOrderDetails: any[] = [];
  selectedOrder: any;
  //qrImageUrl: string =  'assets/images/CanteenPaymentGooglePayQR.jpg';
  qrImageUrl: string = 'assets/images/CanteenPaymentPaytmQR.jpg';

  displayedColumns: string[] = ['sno', 'ordernumber','orderTime', 'oderDate', 'totalamount', 'status', 'paymenttype', 'paymentstatus', 'transtionId', 'delete'];
  // expose enums for HTML template
  paymentType = OrderPaymentType;
  paymentStatus = OrderPaymentStatus;
  orderStatus = OrderStatus;

  @Input("enableBulkAction") enableBulkAction: boolean = false;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('canteenOrderDetails', { static: true }) canteenOrderDetails!: TemplateRef<any>;


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
    this.addCanteenOrderForm = _formBuilder.group({
      dayId: [0, Validators.required],
      rgenId: [rgenId, Validators.required],
      userName: ['', Validators.required],
      userId: [userId, Validators.required],
      userType: [userType, Validators.required],
      totalAmount: [0, Validators.required],
      paymentType: [0, Validators.required],
      paymentStatus: [0, Validators.required],
      status: [0, Validators.required],
      remark: ['', Validators.required]
    });

    this.editCanteenOrderForm = _formBuilder.group({
      orderNumber: [''],
      dayId: ['', Validators.required],
      rgenId: [rgenId, Validators.required],
      userName: ['', Validators.required],
      userId: [userId, Validators.required],
      userType: [userType, Validators.required],
      totalAmount: ['', Validators.required],
      paymentType: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      status: ['', Validators.required],
      remark: ['', Validators.required],
      orderId: ['', Validators.required]
    });

    this.savePaymentTransactionCanteenOrderForm = _formBuilder.group({
      transtionId: ['', Validators.required],
      transtionDate: ['', Validators.required],
      orderId: [0, Validators.required]

    })

  }

  ngOnInit(): void {
    this.getGridData();
    this.getDayNameData();
  }
  getGridData() {
    this._canteenService.getOrder().subscribe((response) => {
      this.orderList = response.data;
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const filters = JSON.parse(filter);
        const statusMatch = filters.status ? data.status === +filters.status : true;
        return statusMatch;
      };
    });
  }

  getDayNameData() {
    this._canteenService.getFoodDays().subscribe((response) => {
      this.dayName = response.data;
    });
  }

  addNewCanteenOrder() {

    if (this.addCanteenOrderForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    // Ensure user info is latest from localStorage
    const currentUser = this._authService.getUser();
    const addpayload: any = {
      dayId: Number(this.addCanteenOrderForm.value.dayId),
      rgenId: currentUser ? currentUser.account_id : this.addCanteenOrderForm.value.rgenId,
      userId: currentUser ? currentUser.user_name : this.addCanteenOrderForm.value.userId,
      userType: currentUser ? currentUser.usertype : this.addCanteenOrderForm.value.userType,
      userName: this.addCanteenOrderForm.value.userName,
      totalAmount: this.addCanteenOrderForm.value.totalAmount,
      paymentType: Number(this.addCanteenOrderForm.value.paymentType),
      paymentStatus: Number(this.addCanteenOrderForm.value.paymentStatus),
      status: Number(this.addCanteenOrderForm.value.status),
      remark: this.addCanteenOrderForm.value.remark
    }
    this.addCanteenOrderForm.disable();
    //this._canteenService.addOrder(this.addCanteenOrderForm.value).subscribe((data) => {
    this._canteenService.addOrder(addpayload).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.addCanteenOrderForm.enable();
      this.addCanteenOrderForm.reset();
      this.getGridData();

    })

  }
  updateOrder() {
    if (this.editCanteenOrderForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    const currentUser = this._authService.getUser();
    const updatepayload: any = {
      orderId: this.editCanteenOrderForm.value.orderId,
      orderNumber: this.editCanteenOrderForm.value.orderNumber,
      dayId: Number(this.editCanteenOrderForm.value.dayId),
      rgenId: currentUser ? currentUser.account_id : this.editCanteenOrderForm.value.rgenId,
      userId: currentUser ? currentUser.user_name : this.editCanteenOrderForm.value.userId,
      userType: currentUser ? currentUser.usertype : this.editCanteenOrderForm.value.userType,
      userName: this.editCanteenOrderForm.value.userName,
      totalAmount: Number(this.editCanteenOrderForm.value.totalAmount),
      paymentType: Number(this.editCanteenOrderForm.value.paymentType),
      paymentStatus: Number(this.editCanteenOrderForm.value.paymentStatus),
      status: Number(this.editCanteenOrderForm.value.status),
      remark: this.editCanteenOrderForm.value.remark
    };
    this.editCanteenOrderForm.disable();
    ///this._canteenService.updateOrder(this.editCanteenOrderForm.value).subscribe((data) => {
    this._canteenService.updateOrder(updatepayload).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.editCanteenOrderForm.enable();
      this.editCanteenOrderForm.reset();
      this.getGridData();

    })

  }
  saveTransaction() {

    if (this.savePaymentTransactionCanteenOrderForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.savePaymentTransactionCanteenOrderForm.disable();

    this._canteenService.paymentTranstion(this.savePaymentTransactionCanteenOrderForm.value).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      if (data.success) {
        this.modalService.dismissAll();
        this.savePaymentTransactionCanteenOrderForm.reset();
        this.getGridData();
      }
      this.savePaymentTransactionCanteenOrderForm.enable();
    })

  }

  isCancelButtonDisable(element: any): boolean {
    const orderStatus = this.getOrderStatusLabel(element.status)?.label?.toLowerCase();
    const paymentStatus = this.getPaymentStatusLabel(element.paymentStatus)?.label?.toLowerCase();

    // Disable button if order is completed OR cancelled OR payment is paid
    return ((orderStatus === 'completed') && paymentStatus === 'paid');
  }

  deleteCanteenOrder(element: any) {
    this._confirmation.confirm('Are you sure?', 'Do you really want to delete this order?')
      .then((confirmed) => {
        if (confirmed) {
          this._canteenService.deleteOrder(element.orderNumber).subscribe((data) => {
            this._coreService.openSnackBar(data.message, 'Ok');
            this.modalService.dismissAll();
            this.editCanteenOrderForm.enable();
            this.editCanteenOrderForm.reset();
            this.getGridData();
          })
        }
      });
  }
  // Get OrderDetails View
  getOrderDetailsById(orderId: number) {
    ;
    this._canteenService.getOrderItemDetails(orderId).subscribe({
      next: (res: any) => {
        ;
        this.selectedOrderDetails = res?.data || [];
        console.log('Order details:', this.selectedOrderDetails);
        this.modalService.open(this.canteenOrderDetails, { size: 'mb', backdrop: 'static' });
      },
      error: (err) => {
        console.error(err);
        this._coreService.openSnackBar('Failed to load order details.', 'Ok');
      }
    });
  }

  // Getter for Grand Total
  get grandTotal(): number {
    return this.selectedOrderDetails?.reduce((sum, x) => sum + (x.totalAmount || 0), 0) || 0;
  }

  openAddCanteenOrderTemplate(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  openEditCanteenOrderTemplate(element: any, content: TemplateRef<any>) {

    this.editCanteenOrderForm = this._formBuilder.group({
      orderNumber: [element.orderNumber],
      dayId: [element.dayId, Validators.required],
      rgenId: [element.rgenId, Validators.required],
      userName: [element.userName, Validators.required],
      userId: [element.userId, Validators.required],
      userType: [element.userType, Validators.required],
      totalAmount: [element.totalAmount, Validators.required],
      paymentType: [element.paymentType, Validators.required],
      paymentStatus: [element.paymentStatus, Validators.required],
      status: [element.status, Validators.required],
      remark: [element.remark, Validators.required],
      orderId: [element.orderId, Validators.required],
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // Keep only the string keys (Cash, Card, UPI)
  paymentTypesArray = Object.keys(OrderPaymentType).filter(key => isNaN(Number(key))).map(key => ({ paymenttypelabel: key, value: OrderPaymentType[key as keyof typeof OrderPaymentType] }));

  paymentStatusArray = Object.keys(OrderPaymentStatus).filter(key => isNaN(Number(key))).map(key => ({ paymentstatuslabel: key, value: OrderPaymentStatus[key as keyof typeof OrderPaymentStatus] }));

  statusArray = Object.keys(OrderStatus).filter(key => isNaN(Number(key))).map(key => ({ statuslabel: key, value: OrderStatus[key as keyof typeof OrderStatus] }));

  // Helper functions for table display
  getPaymentTypeLabel(value: number): string {
    return this.paymentTypesArray.find(x => x.value === value)?.paymenttypelabel || '';
  }
  getPaymentStatusLabel(value: number): { label: string, cssClass: string } {

    const label = this.paymentStatusArray.find(x => x.value === value)?.paymentstatuslabel || '';
    const lower = label.toLowerCase();

    let cssClass = '';
    if (['paid', 'successful', 'completed'].includes(lower)) {
      cssClass = 'status-green';
    } else if (['pending', 'in progress'].includes(lower)) {
      cssClass = 'status-yellow';
    } else if (['failed', 'denied', 'unpaid'].includes(lower)) {
      cssClass = 'status-red';
    } else if (['refunded', 'canceled', 'voided'].includes(lower)) {
      cssClass = 'status-gray';
    }
    else if (['cancelled', 'denied'].includes(lower)) {
      cssClass = 'status-dark';
    }
    return { label, cssClass };
  }

  getOrderStatusLabel(value: number): { label: string, cssClass: string } {
    const label = this.statusArray.find(x => x.value === value)?.statuslabel || '';
    const lower = label.toLowerCase();

    let cssClass = '';
    if (['orderplace'].includes(lower)) {
      cssClass = 'status-yellow';   // Order Placed
    }
    else if (['inprogress', 'in progress'].includes(lower)) {
      cssClass = 'status-orange';   // In Progress
    }
    else if (['completed'].includes(lower)) {
      cssClass = 'status-green';    // Completed
    }
    else if (['cancelled', 'canceled'].includes(lower)) {
      cssClass = 'status-red';      // Cancelled
    }
    return { label, cssClass };
  }
  orderSearchFilter() {

    const filterObj = {
      status: this.statusFilter.trim().toLowerCase(),
    };

    this.dataSource.filter = JSON.stringify(filterObj);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  resetOrderSearchFilter() {
    this.statusFilter = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // paymentQR mode
  isPaymentAllowed(element: any): boolean {

    const orderStatus = this.getOrderStatusLabel(element.status).label.toLowerCase();
    const paymentTypeValue = element.paymentType;
    const paymentStatus = this.getPaymentStatusLabel(element.paymentStatus).label.toLowerCase();
    return ((orderStatus === 'orderplace' || orderStatus === 'inprogress') && paymentTypeValue === 2 && paymentStatus === 'pending');
  }

  // paymentQR mode Pop page open
  openPaymentModal(element: any, content: TemplateRef<any>) {
    this.selectedOrder = element;

    // if (element.qrImageName) {
    //   this.qrImageUrl = `assets/qr/${element.qrImageName}`;
    // } else {
    //   this.qrImageUrl = 'assets/images/CanteenPaymentQR.jpg';
    // }
    this.qrImageUrl;
    this.savePaymentTransactionCanteenOrderForm = this._formBuilder.group({
      transtionId: ['', Validators.required],
      transtionDate: ['', Validators.required],
      orderId: [element.orderId]
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

}
