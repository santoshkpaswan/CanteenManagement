import { Component, ChangeDetectorRef, Inject, Input, OnInit, TemplateRef, ViewChild, inject  } from '@angular/core';
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
  selector: 'app-food-menu-item-price',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './food-menu-item-price.component.html',
  styleUrl: './food-menu-item-price.component.scss'
})
 
export class FoodMenuItemPriceComponent implements OnInit {
  addCanteenItemPriceForm : FormGroup;
  editCanteenItemPriceForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  itemNameList: any = [];

  displayedColumns: string[] = ['sno', 'itemname', 'academicsession','itemprice','itempriceDescription', 'edit', 'delete'];
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
      this.addCanteenItemPriceForm = _formBuilder.group({
      foodMenuItemId: ['', Validators.required],
      academicSessionId: ['', Validators.required],
      itemPrice:['',Validators.required],
      itemPriceDescriptin:['',Validators.required]
    });

    this.editCanteenItemPriceForm = _formBuilder.group({
      foodMenuItemId: ['', Validators.required],
      academicSessionId: ['', Validators.required],
      itemPrice: ['', Validators.required],
      itemPriceDescriptin: ['', Validators.required],
      foodMenuItemPriceId: ['', Validators.required]
    });
    
 
  }
   ngOnInit(): void {
    debugger
    this.getGridData();
  }

  getGridData() {
    this._canteenService.getFoodItemPrice().subscribe((response) => {
      this.dataSource = response.data;
      this.itemNameList = response.data;
      debugger
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addNewCanteenItemPrice() {
    debugger
    if (this.addCanteenItemPriceForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.addCanteenItemPriceForm.disable();

    this._canteenService.addFoodItemPrice(this.addCanteenItemPriceForm.value).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.addCanteenItemPriceForm.enable();
      this.addCanteenItemPriceForm.reset();
      this.getGridData();
    })

  }

   updateItemPriceName() {
    if (this.editCanteenItemPriceForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.editCanteenItemPriceForm.disable();

    this._canteenService.updateItemPrice(this.editCanteenItemPriceForm.value).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.editCanteenItemPriceForm.enable();
      this.editCanteenItemPriceForm.reset();
      this.getGridData();
    })

  }

     openAddCanteenItemPriceTemplate(content: TemplateRef<any>) {
       this.modalService.open(content, { size: 'md', backdrop: 'static' });
     }
openEditCanteenItemPriceTemplate(element: any, content: TemplateRef<any>) {
    debugger
    this.editCanteenItemPriceForm = this._formBuilder.group({
      foodMenuItemId: [element.foodMenuItemId, Validators.required],
      academicSessionId: [element.academicSessionId, Validators.required],
      itemPrice: [element.itemPrice, Validators.required],
      itemPriceDescriptin: [element.itemPriceDescriptin, Validators.required],
      foodMenuItemPriceId: [element.foodMenuItemPriceId, Validators.required],
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  ChangeEvent(event: any) {
    debugger
    this._coreService.openSnackBar("You have selected : " + event.value, 'Ok');
  }

}
