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
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-food-menu-item',
  standalone: true,
  providers: [],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTooltipModule,
    FormsModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './food-menu-item.component.html',
  styleUrl: './food-menu-item.component.scss'
})
export class FoodMenuItemComponent implements OnInit {
  addCanteenMenuItemForm: FormGroup;
  editCanteenMenuItemForm: FormGroup;
  currentPage: any = 0;
  pageSize: any = 10;
  daysList: any = [];
  selectedFile: any = [];
  isInvalidFileType: any = true;
  borderColorValidationFile: any;
  imageUrl: any = environment.imageUrl;

  displayedColumns: string[] = ['sno', 'itemname', 'itemurl', 'itemDescriptin', 'edit', 'delete'];
  @Input('enableBulkAction') enableBulkAction: boolean = false;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @Inject(MAT_DIALOG_DATA) public data: any;
  private modalService = inject(NgbModal);
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _canteenService: CanteenService,
    private _confirmation: ConfirmationDialogService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _coreService: CoreService
  ) {
    this.addCanteenMenuItemForm = _formBuilder.group({
      itemName: ['', Validators.required],
      itemURL: [''],
      itemDescriptin: ['', Validators.required]
    });

    this.editCanteenMenuItemForm = _formBuilder.group({
      itemName: ['', Validators.required],
      itemURL: [''],
      itemDescriptin: ['', Validators.required],
      foodMenuItemId: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getGridData();
  }

  getGridData() {
    this._canteenService.getFoodMenuItem().subscribe((response) => {
      this.dataSource = response.data;
      this.daysList = response.data;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addNewCanteenMenuItem() {
    if (this.addCanteenMenuItemForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    } else if (this.isInvalidFileType == true) {
      this._coreService.openSnackBar('Please select file.', 'Ok');
      return;
    }
    this.addCanteenMenuItemForm.disable();

    const formData = new FormData();
    formData.append('itemImageFile', this.selectedFile);
    formData.append('ItemName', this.addCanteenMenuItemForm.value.itemName);
    formData.append('ItemDescriptin', this.addCanteenMenuItemForm.value.itemDescriptin);

    this._canteenService.addFoodMenuItem(formData).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.addCanteenMenuItemForm.enable();
      this.addCanteenMenuItemForm.reset();
      this.getGridData();
    });
  }

  updateMenuItemName() {
    debugger
    if (this.editCanteenMenuItemForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
     } else if (this.isInvalidFileType == true) {
       this._coreService.openSnackBar('Please select file.', 'Ok');
       return;
    }
    this.editCanteenMenuItemForm.disable();
    const formData = new FormData();
     formData.append('itemImageFile', this.selectedFile);
     formData.append('ItemName', this.editCanteenMenuItemForm.value.itemName);
     formData.append('ItemDescriptin', this.editCanteenMenuItemForm.value.itemDescriptin);
     formData.append('foodMenuItemId',this.editCanteenMenuItemForm.value.foodMenuItemId);

    this._canteenService.updateFoodMenuItem(formData).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.editCanteenMenuItemForm.enable();
      this.editCanteenMenuItemForm.reset();
      this.getGridData();
      debugger
    });
  }

  deleteCanteenMenuItem(element: any) {
    this._confirmation.confirm('Are you sure?', 'Do you really want to delete this food menu item?').then((confirmed) => {
      if (confirmed) {
        this._canteenService.deleteFoodMenuItem(element.foodMenuItemId).subscribe((data) => {
          this._coreService.openSnackBar(data.message, 'Ok');
          this.modalService.dismissAll();
          this.editCanteenMenuItemForm.enable();
          this.editCanteenMenuItemForm.reset();
          this.getGridData();
        });
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openAddCanteenMenuItemTemplate(content: TemplateRef<any>) {
    this.isInvalidFileType = true;
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  openEditCanteenMenuItemTemplate(element: any, content: TemplateRef<any>) {
    debugger
    this.isInvalidFileType = true;

    this.editCanteenMenuItemForm = this._formBuilder.group({
      itemName: [element.itemName, Validators.required],
      itemURL: [element.itemURL, Validators.required],
      itemDescriptin: [element.itemDescriptin, Validators.required],
      foodMenuItemId: [element.foodMenuItemId, Validators.required]
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

  handleFileInput(event: any) {
    if (event.target.files.length == 0) {
      this.selectedFile = [];
      return;
    }
    this.isInvalidFileType = true;
    this.borderColorValidationFile = '1px solid #ced4da';
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

      if (validImageTypes.includes(fileType)) {
        const fileInput = event.target as HTMLInputElement;
        this.isInvalidFileType = false;

        if (fileInput.files && fileInput.files.length > 0) {
          this.selectedFile = fileInput.files[0];
        } else {
          this.selectedFile = null; // or handle it gracefully
        }
      } else {
        this.selectedFile = [];
        this.isInvalidFileType = true;
        this.borderColorValidationFile = '1px solid red';
      }
    }
  }
}
