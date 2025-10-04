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
import { environment } from 'src/environments/environment';


export interface OrderItem {
  itemName: string;
  itemPrice: number;
  count: number;
  imageUrl?: string;
  itemPriceDescriptin?: string;
}

@Component({
  selector: 'app-order-item',
  standalone: true,
  providers: [],
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule, MatSelectModule, MatGridListModule, MatCardModule, ReactiveFormsModule, MatExpansionModule, MatDialogModule, MatIconModule, MatExpansionModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss'
})


export class OrderItemComponent implements OnInit {
  currentPage: number = 0;
  pageSize: number = 10;
  itemList: OrderItem[] = [];
  grandTotal: number = 0;
  orderNumber: string = '';

  imageUrl: any = environment.imageUrl;


  displayedColumns: string[] = ['sno', 'itemno', 'imageurl', 'itemname', 'itemprice', 'itempricedescriptin'];
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
  }



  ngOnInit(): void {
    debugger
    this.getGridData();
    // Generate order number
    this.orderNumber = this.generateOrderNumber();
  }

  getGridData() {
    this._canteenService.getOrderItem().subscribe((response) => {
      this.dataSource = response.data;
      this.itemList = response.data;
      debugger
      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    });
  }



  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addItem(item: OrderItem) {
    item.count = (item.count || 0) + 1;
    this.calculateGrandTotal();
  }

  removeItem(item: OrderItem) {
    if (item.count > 0) {
      item.count--;
      this.calculateGrandTotal();
    }
  }

  calculateGrandTotal() {
    this.grandTotal = this.filteredItems.reduce((sum, x) => sum + x.count * x.itemPrice, 0);
  }
  // Getter to avoid parser errors in template
  get filteredItems(): OrderItem[] {
    return this.itemList.filter(x => x.count > 0);
  }
  generateOrderNumber(): string {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Get order counts from localStorage
    const orderCounts = JSON.parse(localStorage.getItem('orderCounts') || '{}');

    // Get today's count or 0 if new day
    let todayCount = orderCounts[todayStr] || 0;

    // Increment for new order
    todayCount += 1;

    // Save updated count
    orderCounts[todayStr] = todayCount;
    localStorage.setItem('orderCounts', JSON.stringify(orderCounts));

    // Format: RDIAS00001 (5-digit sequence)
    return `RDIAS${todayCount.toString().padStart(5, '0')}`;
  }


  // Mock payment process
  payNow() {
    if (this.filteredItems.length === 0) {
      alert('Add items to cart before payment.');
      return;
    }
  }
}
