export enum OrderPaymentType {
  Cash = 1,
  //Card = 2,
  UPI = 3,
  PayLetter = 4

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
  Accepted = 4,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3

}
