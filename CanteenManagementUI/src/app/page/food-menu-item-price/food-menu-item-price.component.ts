import { Component, ChangeDetectorRef, Inject, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
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
  addCanteenItemPriceForm: FormGroup;
  editCanteenItemPriceForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  itemNameList: any = [];
  foodItems: any = [];
  academicSessionList: any;
  itemNameFilter: string = '';

  displayedColumns: string[] = ['sno', 'itemname', 'academicsession', 'itemprice', 'itempriceDescription', 'edit', 'delete'];
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
      academicSessionID: ['', Validators.required],
      sessionName: ['', Validators.required],
      itemPrice: ['', Validators.required],
      itemPriceDescriptin: ['', Validators.required]
    });
    this.editCanteenItemPriceForm = _formBuilder.group({
      foodMenuItemId: ['', Validators.required],
      academicSessionID: ['', Validators.required],
      sessionName: ['', Validators.required],
      itemPrice: ['', Validators.required],
      itemPriceDescriptin: ['', Validators.required],
      foodMenuItemPriceId: ['', Validators.required]
    });


  }
  ngOnInit(): void {

    this.getGridData();
    this.getFoodItemData();
    this.getAcademicSessionData();



  }

  getGridData() {
    this._canteenService.getFoodItemPrice().subscribe((response) => {
      this.dataSource = response.data;
      this.itemNameList = response.data;
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Filter predicate for search
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const filters = JSON.parse(filter);
        const itemNameMatch = filters.itemName ? data.itemName.toLowerCase().includes(filters.itemName): true;
        return itemNameMatch;
      };

    });
  }

  getFoodItemData() {
    this._canteenService.getFoodMenuItem().subscribe((response) => {
      this.foodItems = response.data;

    });
  }

  getAcademicSessionData() {

    this._canteenService.getAcademicSession().subscribe((response) => {
      this.academicSessionList = response;

    });
  }

  addNewCanteenItemPrice() {

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

  deleteCanteenItemPrice(element: any) {
    this._confirmation.confirm('Are you sure?', 'Do you really want to delete this food item menu price?')
      .then((confirmed) => {
        if (confirmed) {
          this._canteenService.deleteItemPrice(element.foodMenuItemPriceId).subscribe((data) => {
            this._coreService.openSnackBar(data.message, 'Ok');
            this.modalService.dismissAll();
            this.editCanteenItemPriceForm.enable();
            this.editCanteenItemPriceForm.reset();
            this.getGridData();
          })
        }
      });
  }
  openAddCanteenItemPriceTemplate(content: TemplateRef<any>) {

    this.addCanteenItemPriceForm = this._formBuilder.group({
      foodMenuItemId: ['', Validators.required],
      academicSessionID: [this.academicSessionList.AcademicSessionID, Validators.required],
      sessionName: [this.academicSessionList.SessionName, Validators.required],
      itemPrice: ['', Validators.required],
      itemPriceDescriptin: ['', Validators.required]
    });

    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  openEditCanteenItemPriceTemplate(element: any, content: TemplateRef<any>) {

    this.editCanteenItemPriceForm = this._formBuilder.group({
      foodMenuItemId: [element.foodMenuItemId, Validators.required],
      academicSessionID: [this.academicSessionList.AcademicSessionID, Validators.required],
      sessionName: [this.academicSessionList.SessionName, Validators.required],
      itemPrice: [element.itemPrice, Validators.required],
      itemPriceDescriptin: [element.itemPriceDescriptin, Validators.required],
      foodMenuItemPriceId: [element.foodMenuItemPriceId, Validators.required],
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  ChangeEvent(event: any) {

    this._coreService.openSnackBar("You have selected : " + event.value, 'Ok');
  }
  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }


  /** ------------------- SEARCH FILTER ------------------- */
  priceSearchFilter() {
    const filterObj = {
      itemName: this.itemNameFilter.trim().toLowerCase(),
    };
    this.dataSource.filter = JSON.stringify(filterObj);
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
  resetPriceSearchFilter() {
    this.itemNameFilter = '';
    this.dataSource.filter = JSON.stringify({ itemName: '' });
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

}
