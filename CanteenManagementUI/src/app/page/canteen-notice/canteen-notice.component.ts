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
  selector: 'app-canteen-notice',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './canteen-notice.component.html',
  styleUrl: './canteen-notice.component.scss'
})
export class CanteenNoticeComponent implements OnInit {

  currentPage: any = 0;
  pageSize: any = 10;
  noticeList: any = [];
  editCanteenNoticeForm: FormGroup;

  displayedColumns: string[] = ['sno', 'notice', 'edit'];
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

      this.editCanteenNoticeForm = _formBuilder.group({
      notice: ['', Validators.required],
      canteenNoticeId: ['', Validators.required],
      isActive: [false, Validators.required]
    });

  }

  ngOnInit(): void {
    this.getGridData()
  }

  getGridData() {
    debugger
    this._canteenService.getCanteenNotice().subscribe({next:(response) => {
      this.dataSource = response.data.notice;
      this.noticeList = response.data.notice;
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    });

  }

  updateNotice() {
    if (this.editCanteenNoticeForm.invalid) {
      this._coreService.openSnackBar('Please enter mandatory fields.', 'Ok');
      return;
    }
    const payload = this.editCanteenNoticeForm.value;
    this.editCanteenNoticeForm.disable();

    this._canteenService.updateNotice(payload).subscribe((data) => {
      this._coreService.openSnackBar(data.message, 'Ok');
      this.modalService.dismissAll();
      this.editCanteenNoticeForm.enable();
      this.editCanteenNoticeForm.reset();
      this.getGridData();
    })

  }
  toggleIsActive() {
  const current = this.editCanteenNoticeForm.get('isActive')?.value;
  this.editCanteenNoticeForm.patchValue({ isActive: !current });
}

  openEditCanteenNoticeTemplate(element: any, content: TemplateRef<any>) {

    this.editCanteenNoticeForm = this._formBuilder.group({
      notice: [element.notice, Validators.required],
      canteenNoticeId: [element.canteenNoticeId, Validators.required],
      isActive: [element.isActive, Validators.required]
    });
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }

}
