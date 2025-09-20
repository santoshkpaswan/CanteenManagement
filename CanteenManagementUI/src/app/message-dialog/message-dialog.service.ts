import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MessageDialogComponent } from './message-dialog.component';
@Injectable()
export class MessageDialogService {

    constructor(private modalService: NgbModal) { }
  
    public message( 
      title: string,
      message: string,
      btnCancelText: string = 'Cancel',
      dialogSize: 'sm'|'lg' = 'sm'){
      const modalRef = this.modalService.open(MessageDialogComponent, { size: 'lg',backdrop: 'static' });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.btnCancelText = btnCancelText;
  
      // return modalRef.result;
    }
  
  }