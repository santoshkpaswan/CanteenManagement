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
  selector: 'app-admin-order',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.scss'
})
export class AdminOrderComponent {
  addCanteenOrderForm: FormGroup;
  editCanteenOrderForm: FormGroup;
  editCanteenOrderStatusForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  orderList: any = [];
  dayName: any = [];
  selectedOrder: any;
  statusFilter: string = '';
  orderDateFilter: string = '';





  displayedColumns: string[] = ['checkbox', 'sno', 'ordernumber', 'username', 'usertype', 'orderdate', 'totalamount', 'status', 'paymenttype', 'paymentstatus'];
  // expose enums for HTML template
  paymentType = OrderPaymentType;
  paymentStatus = OrderPaymentStatus;
  orderStatus = OrderStatus;

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
    this.addCanteenOrderForm = _formBuilder.group({
      //   //orderNumber: [''],
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
      //orderNumber: [''],
      dayId: ['', Validators.required],
      rgenId: [rgenId, Validators.required],
      //userName: ['', Validators.required],
      //userId: [userId, Validators.required],
      ///userType: [userType, Validators.required],
      //totalAmount: ['', Validators.required],
      //paymentType: ['', Validators.required],
      //paymentStatus: ['', Validators.required],
      status: ['', Validators.required],
      remark: ['', Validators.required],
      orderId: ['', Validators.required]
    });

    this.editCanteenOrderStatusForm = _formBuilder.group({
      paymentType: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      status: ['', Validators.required],
      remark: ['', Validators.required],
      orderId: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.getGridData();
    this.getDayNameData();
  }

  getGridData() {
    this._canteenService.getOrder().subscribe((response) => {
      debugger
      //this.dataSource = response.data;
      this.orderList = response.data;
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Set filter predicate once
      //this.dataSource.filterPredicate = (data: any, filter: string) =>
      /// data.orderNumber?.toString().toLowerCase().includes(filter);


      this.dataSource.filterPredicate = (data: any, filter: string) => {
        debugger
        const filters = JSON.parse(filter);
        //const statusMatch = filters.status ? this.getOrderStatusLabel(data.status).toLowerCase().includes(filters.status) : true;
        const statusMatch = filters.status ? data.status === +filters.status : true;
        const dateMatch = filters.orderDate ? new Date(data.orderDate).toDateString() === new Date(filters.orderDate).toDateString() : true;
        //const dateMatch = filters.orderDate   ? new Date(data.orderDate).toISOString().split('T')[0] === filters.orderDate  : true;
        //const dbDate = data.orderDate.split(' ')[0];         // "2025-10-08"
        //const filterDate = filters.orderDate.split('T')[0]; // "2025-10-08"
        //const dateMatch = filters.orderDate ? dbDate === filterDate : true;

        return statusMatch && dateMatch;
      };


    });
  }

  getDayNameData() {
    debugger
    this._canteenService.getFoodDays().subscribe((response) => {
      this.dayName = response.data;
      debugger
    });
  }

  addNewCanteenOrder() {
    debugger
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
    this._canteenService.addOrder(addpayload).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.addCanteenOrderForm.enable();
      this.addCanteenOrderForm.reset();
      this.getGridData();
      debugger
    })

  }
  updateOrder() {
    if (this.editCanteenOrderForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    const currentUser = this._authService.getUser();

    // Prepare payload explicitly with numeric fields
    const updatepayload: any = {
      orderId: this.editCanteenOrderForm.value.orderId,
      //orderNumber: this.editCanteenOrderForm.value.orderNumber,
      dayId: Number(this.editCanteenOrderForm.value.dayId),
      rgenId: currentUser ? currentUser.account_id : this.editCanteenOrderForm.value.rgenId,
      userId: currentUser ? currentUser.user_name : this.editCanteenOrderForm.value.userId,
      //userType: currentUser ? currentUser.usertype : this.editCanteenOrderForm.value.userType,
      //userName: this.editCanteenOrderForm.value.userName,
      //totalAmount: Number(this.editCanteenOrderForm.value.totalAmount),
      //paymentType: Number(this.editCanteenOrderForm.value.paymentType),
      //paymentStatus: Number(this.editCanteenOrderForm.value.paymentStatus),
      status: Number(this.editCanteenOrderForm.value.status),
      remark: this.editCanteenOrderForm.value.remark
    };

    this.editCanteenOrderForm.disable();
    this._canteenService.updateOrder(updatepayload).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.editCanteenOrderForm.enable();
      this.editCanteenOrderForm.reset();
      this.getGridData();
      debugger
    })

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

  openAddCanteenOrderTemplate(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  openEditCanteenOrderTemplate(element: any, content: TemplateRef<any>) {
    debugger
    this.editCanteenOrderForm = this._formBuilder.group({
      //orderNumber: [element.orderNumber],
      dayId: [element.dayId, Validators.required],
      rgenId: [element.rgenId, Validators.required],
      //userName: [element.userName, Validators.required],
      userId: [element.userId, Validators.required],
      //userType: [element.userType, Validators.required],
      //totalAmount: [element.totalAmount, Validators.required],
      //paymentType: [element.paymentType, Validators.required],
      //paymentStatus: [element.paymentStatus, Validators.required],
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

    return { label, cssClass };
  }
  getOrderStatusLabel(value: number): string {
    return this.statusArray.find(x => x.value === value)?.statuslabel || '';
  }


  /** Handle Checkbox Selection */
  onCheckboxChange(element: any, event: any) {
    debugger
    if (event.target.checked) {
      this.selectedOrder = element;
      // uncheck all others
      this.dataSource.data.forEach((row: any) => {
        if (row.orderId !== element.orderId) row.checked = false;
      });
    } else {
      this.selectedOrder = null;
    }
  }

  /** Open Order Status Modal */
  openEditCanteenOrderStatusTemplate(element: any, content: TemplateRef<any>) {
    debugger
    if (!element) {
      this._coreService.openSnackBar('Please select an order first.', 'Ok');
      return;
    }

    this.editCanteenOrderStatusForm = this._formBuilder.group({
      paymentType: [element.paymentType, Validators.required],
      paymentStatus: [element.paymentStatus, Validators.required],
      status: [element.status, Validators.required],
      remark: [element.remark, Validators.required],
      orderId: [element.orderId, Validators.required],
    });

    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  /** Update Order Status*/
  updateOrderStatus() {
    debugger
    if (this.editCanteenOrderStatusForm.invalid) {
      this._coreService.openSnackBar('Please fill all required fields.', 'Ok');
      return;
    }
    const currentUser = this._authService.getUser();
    const { orderId, paymentType, paymentStatus, status, remark } = this.editCanteenOrderStatusForm.value;

    const updateStatusPayload = {
      orderId,
      rgenId: Number(currentUser?.account_id || 0),
      paymentType: Number(paymentType),
      paymentStatus: Number(paymentStatus),
      status: Number(status),
      remark
    };

    this.editCanteenOrderStatusForm.disable();

    this._canteenService.updateOrderStatus(updateStatusPayload).subscribe({
      next: (data) => {
        this._coreService.openSnackBar(data.message, 'Ok');
        this.modalService.dismissAll();
        this.editCanteenOrderStatusForm.enable();
        this.getGridData();
      },
      error: () => {
        this._coreService.openSnackBar('Error updating order.', 'Ok');
        this.editCanteenOrderStatusForm.enable();
      }
    });
  }


  deleteSelectedOrder() {
    debugger
    if (!this.selectedOrder) {
      this._coreService.openSnackBar('Please select an order to cancel.', 'Ok');
      return;
    }

    this._confirmation.confirm('Are you sure?', `Do you really want to delete order ${this.selectedOrder.orderNumber}?`
    ).then((confirmed) => {
      if (confirmed) {
        this._canteenService.deleteOrder(this.selectedOrder.orderNumber).subscribe({
          next: (data: any) => {
            this._coreService.openSnackBar(data.message, 'Ok');
            this.selectedOrder = null;        // Clear selection
            this.getGridData();               // Refresh table
          },
          error: (err) => {
            console.error('Delete order error:', err);
            this._coreService.openSnackBar('Error deleting order.', 'Ok');
          }
        });
      }
    });
  }
  orderSearchFilter() {
    debugger
    const filterObj = {
      status: this.statusFilter.trim().toLowerCase(),
      orderDate: this.orderDateFilter
    };

    this.dataSource.filter = JSON.stringify(filterObj);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetOrderSearchFilter() {
    this.statusFilter = '';
    this.orderDateFilter = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




}
