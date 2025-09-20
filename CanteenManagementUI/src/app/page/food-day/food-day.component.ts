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
  selector: 'app-food-day',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule,MatPaginatorModule, MatTooltipModule],
  templateUrl: './food-day.component.html',
  styleUrl: './food-day.component.scss'
})
export class FoodDayComponent implements OnInit {
  addCanteenDayForm: FormGroup;
  editCanteenDayForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
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
    this.addCanteenDayForm = _formBuilder.group({
      daysName: ['', Validators.required],
      dayNo: ['', Validators.required]
    });

    this.editCanteenDayForm = _formBuilder.group({
      canteenDayId: [null, Validators.required],
      dayName: ['', Validators.required],
      dayNumber: ['', Validators.required]
    });
  }
  displayedColumns: string[] = ['sno', 'dayname', 'dayno', 'edit', 'delete'];
 @Input("enableBulkAction") enableBulkAction: boolean = false;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort,{ static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  

  ngOnInit(): void {
    this. getGridData();
  }

  getGridData() {
    this._canteenService.getFoodDays().subscribe((response) => {
      this.dataSource = response.data
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addNewCanteenDay() {
    if (this.addCanteenDayForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.addCanteenDayForm.disable();

    this._canteenService.addFoodDay(this.addCanteenDayForm.value).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.addCanteenDayForm.enable();
      this.addCanteenDayForm.reset();
      this.getGridData();
    })

  }

  updateDayName() {
    if (this.editCanteenDayForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.editCanteenDayForm.disable();

  }

  deleteCanteenDay(element: any) {
    this._confirmation.confirm('Are you sure?', 'Do you really want to delete this food day?')
      .then((confirmed) => {
        if (confirmed) {

        }
      });
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }


  openAddCanteenDayTemplate(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  openEditCanteenDayTemplate(element: any, content: TemplateRef<any>) {
    this.editCanteenDayForm = this._formBuilder.group({
      categoryId: [element.category_id, Validators.required],
      categoryName: [element.category_name, Validators.required],
      categoryAlias: [element.category_alias],
      categoryDescription: [element.category_description]
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }


}