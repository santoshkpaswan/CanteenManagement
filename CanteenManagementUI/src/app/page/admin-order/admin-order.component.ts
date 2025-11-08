import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'


@Component({
  selector: 'app-admin-order',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.scss'
})
export class AdminOrderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
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
  userNameFilter: string = '';
  userNameList: any[] = [];
  selectedOrderDetails: any[] = [];

  displayedColumns: string[] = ['checkbox', 'sno', 'ordernumber', 'orderTime', 'username', 'usertype', 'userMobileNo', 'orderdate', 'totalamount', 'status', 'paymenttype', 'paymentstatus', 'transtionId'];
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
      dayId: ['', Validators.required],
      rgenId: [rgenId, Validators.required],
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
    this._canteenService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('♻️ Refreshing grid on new notification...');
        this.getGridData();
      });
    this.getDayNameData();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getGridData() {
    this._canteenService.getOrder().subscribe((response) => {
      //this.dataSource = response.data;
      this.orderList = response.data;
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Set filter predicate once

      // Populate userNameList automatically
      this.userNameList = Array.from(new Set(response.data.map((item: any) => item.userName))).map(userName => ({ userName }));


      this.dataSource.filterPredicate = (data: any, filter: any) => {
        const filters = JSON.parse(filter);
        const statusMatch = filters.status ? data.status === +filters.status : true;
        const dateMatch = filters.orderDate ? new Date(data.orderDate.replaceAll("/", "-").split('-')[2] + "-" + data.orderDate.replaceAll("/", "-").split('-')[1] + "-" + data.orderDate.replaceAll("/", "-").split('-')[0]).toDateString() === new Date(filters.orderDate).toDateString() : true;
        const userNameMatch = filters.userName ? data.userName && data.userName.toLowerCase().includes(filters.userName) : true;

        return statusMatch && dateMatch && userNameMatch;
      };
    });
  }

  parseDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
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

    // Prepare payload explicitly with numeric fields
    const updatepayload: any = {
      orderId: this.editCanteenOrderForm.value.orderId,
      dayId: Number(this.editCanteenOrderForm.value.dayId),
      rgenId: currentUser ? currentUser.account_id : this.editCanteenOrderForm.value.rgenId,
      userId: currentUser ? currentUser.user_name : this.editCanteenOrderForm.value.userId,
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
    this.editCanteenOrderForm = this._formBuilder.group({
      dayId: [element.dayId, Validators.required],
      rgenId: [element.rgenId, Validators.required],
      userId: [element.userId, Validators.required],
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
    }
    else if (['pending', 'in progress'].includes(lower)) {
      cssClass = 'status-yellow';
    }
    else if (['failed', 'denied', 'unpaid'].includes(lower)) {
      cssClass = 'status-red';
    }
    else if (['refunded', 'canceled', 'voided'].includes(lower)) {
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


  /** Handle Checkbox Selection */
  onCheckboxChange(element: any, event: any) {
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

    const filterObj = {
      status: this.statusFilter.trim().toLowerCase(),
      userName: this.userNameFilter.trim().toLowerCase(),
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
    this.userNameFilter = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Get OrderDetails View
  getOrderDetailsById(orderId: number) {
    ;
    this._canteenService.getOrderItemDetails(orderId).subscribe({
      next: (res: any) => {
        ;
        this.selectedOrderDetails = res?.data || [];
        console.log('Order details:', this.selectedOrderDetails);
        this.modalService.open(this.canteenOrderDetails, { size: 'md', backdrop: 'static' });
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

  // Excel Export
  exportToExcel(): void {
  // Use filtered data if available
  const filteredData = this.dataSource.filteredData?.length ? this.dataSource.filteredData : this.orderList;

  // Calculate Grand Total
  const grandTotal = filteredData.reduce((sum: number, item: any) => sum + Number(item.totalAmount || 0), 0);

  // Prepare export data
  const exportData = filteredData.map((item: any, index: number) => ({
    'S.No': index + 1,
    'Order Number': item.orderNumber,
    'Order Time': item.orderTime,
    'User Name': item.userName,
    'User Type': item.userType,
    'Mobile No': item.userMobileNo,
    'Order Date': item.orderDate,
    'Total Amount': Number(item.totalAmount).toFixed(2),
    'Status': this.getOrderStatusLabel(item.status).label,
    'Payment Type': this.getPaymentTypeLabel(item.paymentType),
    'Payment Status': this.getPaymentStatusLabel(item.paymentStatus).label,
    'Transaction ID': item.transtionId
  }));

  // Add blank row and Grand Total row
  exportData.push({});
  exportData.push({'Order Date': 'Grand Total','Total Amount': grandTotal.toFixed(2)});

  // Create worksheet and workbook
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  // Adjust column widths
  const columnWidths = [
    { wch: 6 },  // S.No
    { wch: 20 }, // Order Number
    { wch: 10 }, // Time
    { wch: 20 }, // User Name
    { wch: 15 }, // User Type
    { wch: 15 }, // Mobile No
    { wch: 15 }, // Date
    { wch: 15 }, // Total Amount
    { wch: 15 }, // Status
    { wch: 15 }, // Payment Type
    { wch: 15 }, // Payment Status
    { wch: 25 }  // Transaction ID
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook: XLSX.WorkBook = { Sheets: { 'Orders': worksheet }, SheetNames: ['Orders'] };

  // Export as Excel
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `Orders_Details_${new Date().toISOString().slice(0,10)}.xlsx`);
}


  // PDF Export

  exportToPDF(): void {
    const doc = new jsPDF('l', 'pt', 'a4');
    doc.text('User Order History', 350, 30, { align: 'center' });

    //  Use filtered data if available
    const filteredData = this.dataSource.filteredData?.length ? this.dataSource.filteredData : this.orderList;

    // Calculate Grand Total
    const grandTotal = filteredData.reduce((sum: number, item: any) => sum + Number(item.totalAmount || 0), 0);

    const exportData = filteredData.map((item: any, index: number) => ([
      index + 1,
      item.orderNumber,
      item.orderTime,
      item.userName,
      item.userType,
      item.userMobileNo,
      item.orderDate,
      item.totalAmount,
      //'₹ ' + item.totalAmount,
      //'₹ ' + Number(item.totalAmount).toFixed(2),  // Clean numeric formatting
      this.getOrderStatusLabel(item.status).label,
      this.getPaymentTypeLabel(item.paymentType),
      this.getPaymentStatusLabel(item.paymentStatus).label,
      item.transtionId
    ]));

    // Add a blank row + Grand Total row at the bottom
    exportData.push(['','','','','','','Grand Total', + grandTotal]);


    autoTable(doc, {
      head: [['S.No', 'Order No', 'Time', 'User Name', 'User Type', 'Mobile', 'Date', 'Amount', 'Status', 'Pay Type', 'Pay Status', 'Txn ID']],
      body: exportData,
      startY: 50,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [63, 81, 181] },
      columnStyles: {7: { halign: 'right' }}, // align Amount column to right
      didParseCell: (data) => {
      // Make "Grand Total" row bold
      if (data.row.index === exportData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [255, 255, 200];
      }
    }

    });

    doc.save(`Orders_Details_${new Date().toISOString().slice(0, 10)}.pdf`);
  }


}
