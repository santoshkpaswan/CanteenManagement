export enum OrderPaymentType {
  Cash = 0,
  Card = 1,
  UPI = 2
}

export enum OrderPaymentStatus {
  Pending = 0,
  Paid = 1,
  //Failed = 2,
  //Refunded = 3,
   //Cancelled = 4
}

export enum OrderStatus {
  OrderPlace = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}
