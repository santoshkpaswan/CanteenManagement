export enum OrderPaymentType {
  Cash = 0,
  Card = 1,
  UPI = 2
}

export enum OrderPaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  //Refunded = 3
}

export enum OrderStatus {
  Created = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}
