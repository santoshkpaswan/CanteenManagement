import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.scss'
})
export class MessageDialogComponent implements OnInit {

  @Input() title!: string;
  @Input() message!: string;
  @Input() btnCancelText!: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
