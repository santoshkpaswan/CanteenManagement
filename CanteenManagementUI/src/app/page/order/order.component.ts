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

@Component({
  selector: 'app-order',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})

export class OrderComponent implements OnInit {
  addCanteenOrderForm: FormGroup;
  editCanteenOrderForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  orderList: any = [];
  dayName: any =[];


  displayedColumns: string[] = ['sno', 'ordernumber', 'dayId','username','usertype','totalamount','paymenttype','paymentstatus','status','remark', 'edit', 'delete'];
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
    //   this.addCanteenOrderForm = _formBuilder.group({
    //   //orderNumber: [''],
    //   dayId: ['', Validators.required],
    //   rgenId: [0],
    //   userName: ['', Validators.required],
    //   userId: [''],
    //   userType: ['', Validators.required],
    //   totalAmount: ['', Validators.required],
    //   paymentType: ['', Validators.required],
    //   paymentStatus: ['', Validators.required],
    //   status: ['', Validators.required],
    //   remark: ['', Validators.required]
    // });

    this.addCanteenOrderForm = this._formBuilder.group({
  // orderNumber: [''],  // optional
  dayId: [0, Validators.required],          // number
  rgenId: [0],                              // number, default 0
  userName: ['', Validators.required],      // string
  userId: [''],                             // string (if not used, keep empty)
  userType: ['', Validators.required],      // string (or number if backend expects int)
  totalAmount: [0, Validators.required],    // number
  paymentType: [0, Validators.required],    // number
  paymentStatus: [0, Validators.required],  // number
  status: [0, Validators.required],         // number
  remark: ['', Validators.required]         // string
});


    this.editCanteenOrderForm = _formBuilder.group({
      orderNumber: [''],
      dayId: ['', Validators.required],
      rgenId: ['', Validators.required],
      userName:['',Validators.required],
      userId: ['', Validators.required],
      userType: ['', Validators.required],
      totalAmount:['', Validators.required],
      paymentType:['', Validators.required],
      paymentStatus:['', Validators.required],
      status:['', Validators.required],
      remark:['', Validators.required],
      orderId: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    debugger
    this.getGridData();
    this.getDayNameData();
  }

   getGridData() {
    this._canteenService.getOrder().subscribe((response) => {
      this.dataSource = response.data;
      this.orderList = response.data;
      debugger
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getDayNameData() {
    debugger
    this._canteenService.getFoodDays().subscribe((response) => {
      this.dayName = response.data;
       debugger
    });
  }

  // addNewCanteenOrder() {
  //   debugger
  //   if (this.addCanteenOrderForm.invalid) {
  //     this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
  //     return;
  //   }
  //   this.addCanteenOrderForm.disable();

  //   this._canteenService.addOrder(this.addCanteenOrderForm.value).subscribe((data) => {
  //     this._coreService.openSnackBar(data.message, 'Ok');
  //     this.modalService.dismissAll();
  //     this.addCanteenOrderForm.enable();
  //     this.addCanteenOrderForm.reset();
  //     this.getGridData();
  //     debugger
  //   })

  // }

  addNewCanteenOrder() {
  debugger;
  if (this.addCanteenOrderForm.invalid) {
    this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
    return;
  }

  this.addCanteenOrderForm.disable();

  // wrap the form data as API expects
  const payload = {

      ...this.addCanteenOrderForm.value,
      rgenId: this.addCanteenOrderForm.value.rgenId || 0, // fix int issue
      dayId: Number(this.addCanteenOrderForm.value.dayId),
      paymentType: Number(this.addCanteenOrderForm.value.paymentType),
      paymentStatus: Number(this.addCanteenOrderForm.value.paymentStatus),
      status: Number(this.addCanteenOrderForm.value.status),
      totalAmount: Number(this.addCanteenOrderForm.value.totalAmount)

  };

  this._canteenService.addOrder(payload).subscribe((data) => {
    this._coreService.openSnackBar(data.message, 'Ok');
    this.modalService.dismissAll();
    this.addCanteenOrderForm.enable();
    this.addCanteenOrderForm.reset();
    this.getGridData();
    debugger;
  });
}


  updateOrder() {
    if (this.editCanteenOrderForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.editCanteenOrderForm.disable();

    this._canteenService.updateOrder(this.editCanteenOrderForm.value).subscribe((data) => {
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
            //this.editCanteenItemPriceForm.enable();
            //this.editCanteenItemPriceForm.reset();
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
      orderNumber: [element.orderNumber],
      dayId: [element.dayId, Validators.required],
      rgenId:[element.rgenId,Validators.required],
      userName: [element.userName, Validators.required],
      userId: [element.userId, Validators.required],
      userType:[element.userType,Validators.required],
      totalAmount:[element.totalAmount,Validators.required],
      paymentType:[element.paymentType,Validators.required],
      paymentStatus:[element.paymentStatus,Validators.required],
      status:[element.status,Validators.required],
      remark:[element.remark,Validators.required],
      orderId: [element.orderId, Validators.required],
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
   pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
