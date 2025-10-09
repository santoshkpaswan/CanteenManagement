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
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './food-day.component.html',
  styleUrl: './food-day.component.scss'
})
export class FoodDayComponent implements OnInit {
  addCanteenDayForm: FormGroup;
  editCanteenDayForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  daysList: any = [];

  displayedColumns: string[] = ['sno', 'dayname', 'dayno', 'edit', 'delete'];
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
    this.addCanteenDayForm = _formBuilder.group({
      daysName: ['', Validators.required],
      dayNo: ['', Validators.required]
    });

    this.editCanteenDayForm = _formBuilder.group({
      daysName: ['', Validators.required],
      dayNo: ['', Validators.required],
      dayId: ['', Validators.required]
    });
  }



  ngOnInit(): void {
    debugger
    this.getGridData();
  }

  getGridData() {
    this._canteenService.getFoodDays().subscribe((response) => {
      this.dataSource = response.data;
      this.daysList = response.data;
      this.dataSource = new MatTableDataSource<any>(response.data);
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
      if (data.success) {
        this.modalService.dismissAll();
        this.addCanteenDayForm.reset();
        this.getGridData();
      }
      this.addCanteenDayForm.enable();

    })

  }

  updateDayName() {
    if (this.editCanteenDayForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    this.editCanteenDayForm.disable();

    this._canteenService.updateFoodDay(this.editCanteenDayForm.value).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.editCanteenDayForm.enable();
      this.editCanteenDayForm.reset();
      this.getGridData();
    })

  }

  deleteCanteenDay(element: any) {
    this._confirmation.confirm('Are you sure?', 'Do you really want to delete this food day?')
      .then((confirmed) => {
        if (confirmed) {
          this._canteenService.deleteFoodDay(element.dayId).subscribe((data) => {
            this._coreService.openSnackBar(data.message, 'Ok');
            this.modalService.dismissAll();
            this.editCanteenDayForm.enable();
            this.editCanteenDayForm.reset();
            this.getGridData();
          })
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
    debugger
    this.editCanteenDayForm = this._formBuilder.group({
      daysName: [element.daysName, Validators.required],
      dayNo: [element.dayNo, Validators.required],
      dayId: [element.dayId, Validators.required],
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  ChangeEvent(event: any) {
    debugger
    this._coreService.openSnackBar("You have selected : " + event.value, 'Ok');
  }


}
