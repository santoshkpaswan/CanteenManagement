import { Component, ChangeDetectorRef, Inject, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CoreService } from 'src/app/services/core.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { OverlayContainer } from '@angular/cdk/overlay';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';




@Component({
  selector: 'app-day-wise-food-menu-item',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, NgMultiSelectDropDownModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './day-wise-food-menu-item.component.html',
  styleUrl: './day-wise-food-menu-item.component.scss'
})
export class DayWiseFoodMenuItemComponent implements OnInit {
  addCanteenDayWiseItemForm: FormGroup;
  editCanteenDayWiseItemForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  dayWiseitemNameList: any = [];
  foodItems: any = [];
  //foodItems: any[] = [];
  dayName: any = [];
  dropdownSettings: any;

  displayedColumns: string[] = ['sno', 'dayname', 'itemname', 'time', 'edit', 'delete'];
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

    this.addCanteenDayWiseItemForm = _formBuilder.group({
      foodMenuItemId: ['', Validators.required],
      dayId: ['', Validators.required],
      time: ['', Validators.required]
    });

    this.editCanteenDayWiseItemForm = _formBuilder.group({
      foodMenuItemId: ['', Validators.required],
      dayId: ['', Validators.required],
      time: ['', Validators.required],
      dayWiseFoodMenuItemId: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'foodMenuItemId',
      textField: 'itemName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll: false
    };

    this.getGridData();
    this.getFoodItemData();
    this.getDayNameData();
  }

  getGridData() {

    this._canteenService.getDayWiseFoodItem().subscribe((response) => {
      this.dataSource = response.data;
      this.dayWiseitemNameList = response.data;
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  getFoodItemData() {
    this._canteenService.getFoodMenuItem().subscribe((response) => {
      this.foodItems = response.data;

    });
  }

  getDayNameData() {

    this._canteenService.getFoodDays().subscribe((response) => {
      this.dayName = response.data;

    });
  }

  addNewCanteenDayWiseItem() {

    if (this.addCanteenDayWiseItemForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.addCanteenDayWiseItemForm.disable();
    const formValue = this.addCanteenDayWiseItemForm.value;
    const payload = {
      ...formValue, foodMenuItemId: formValue.foodMenuItemId.map((item: any) => item.foodMenuItemId)
    };

    this._canteenService.addDayWiseFoodItem(payload).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.addCanteenDayWiseItemForm.enable();
      this.addCanteenDayWiseItemForm.reset();
      this.getGridData();
    })

  }

  updateDayWiseItemName() {

    if (this.editCanteenDayWiseItemForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.editCanteenDayWiseItemForm.disable();

    this._canteenService.updateDayWiseItem(this.editCanteenDayWiseItemForm.value).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.editCanteenDayWiseItemForm.enable();
      this.editCanteenDayWiseItemForm.reset();
      this.getGridData();
    })

  }


  deleteCanteenDayWiseItem(element: any) {
    this._confirmation.confirm('Are you sure?', 'Do you really want to delete this day wise food menu item?')
      .then((confirmed) => {
        if (confirmed) {
          this._canteenService.deleteDayWiseItem(element.dayWiseFoodMenuItemId).subscribe((data) => {
            this._coreService.openSnackBar(data.message, 'Ok');
            this.modalService.dismissAll();
            this.addCanteenDayWiseItemForm.enable();
            this.addCanteenDayWiseItemForm.reset();
            this.getGridData();
          })
        }
      });
  }

  openEditCanteenDayWiseItemTemplate(element: any, content: TemplateRef<any>) {
    this.editCanteenDayWiseItemForm = this._formBuilder.group({
      foodMenuItemId: [element.foodMenuItemId, Validators.required],
      dayId: [element.dayId, Validators.required],
      time: [element.time, Validators.required],
      dayWiseFoodMenuItemId: [element.dayWiseFoodMenuItemId, Validators.required]

    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  openAddCanteenDayWiseItemTemplate(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

}
