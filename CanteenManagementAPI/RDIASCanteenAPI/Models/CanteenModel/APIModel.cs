using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RDIASCanteenAPI.Data;

namespace RDIASCanteenAPI.Models.CanteenModel
{
    public class APIModel
    {
    }
    #region master Day Food
    public class FoodDaySaveModelView
    {
        public string DaysName { get; set; }
        public int DayNo { get; set; }
        public bool? IsActive { get; set; }
    }
    public class FoodDayUpdateModelView
    {
        public int DayId { get; set; }
        public string DaysName { get; set; }
        public int DayNo { get; set; }

    }

    public class FoodDayGetModelView : tblDayWiseFoodMenuItem
    {
        public string? ItemName { get; set; }
        public string? DaysName { get; set; }


    }

    // public class FoodDayGroupedModelView
    // {
    //     public int DayId { get; set; }
    //     public string? DaysName { get; set; }
    //     public List<FoodDayItemModel> Items { get; set; } = new();
    // }

    // public class FoodDayItemModel
    // {
    //     public int DayWiseFoodMenuItemId { get; set; }
    //     public int FoodMenuItemId { get; set; }
    //     public string? ItemName { get; set; }
    //     public int? Time { get; set; }
    // }

    #endregion

    #region FoodMenuItemModel

    public class FoodMenuItemGetModelView : tblFoodMenuItemPrice
    {
        public string? ItemName { get; set; }
        // public string? AcademicSession { get; set; }
    }
    public class FoodMenuItemModelView
    {
        public string ItemName { get; set; }
        public string ItemDescriptin { get; set; }
        public IFormFile? itemImageFile { get; set; }
        public string? ImageUrl { get; set; }

    }
    public class FoodMenuItemUpdateModelView
    {
        public int FoodMenuItemId { get; set; }
        public string ItemName { get; set; }
        public string ItemDescriptin { get; set; }
        public IFormFile? itemImageFile { get; set; }
        public string? ImageUrl { get; set; }

    }
    #endregion

    #region FoodMenuItemPrice
    public class FoodMenuItemPriceSaveModelView
    {
        public int FoodMenuItemId { get; set; }
        public int AcademicSessionId { get; set; }
        public string SessionName { get; set; }
        public decimal ItemPrice { get; set; }
        public string ItemPriceDescriptin { get; set; }

    }
    public class FoodMenuItemPriceUpdateModelView
    {
        public int FoodMenuItemPriceId { get; set; }
        public int FoodMenuItemId { get; set; }
        public int AcademicSessionId { get; set; }
        public string SessionName { get; set; }
        public decimal ItemPrice { get; set; }
        public string ItemPriceDescriptin { get; set; }

    }
    #endregion

    #region DayWiseFoodMenuItem
    public class DayWiseFoodMenuItemSaveModelView
    {
        //public int FoodMenuItemId { get; set; }
        public List<int> FoodMenuItemId { get; set; }
        public int DayId { get; set; }
        public int Time { get; set; }
    }
    public class DayWiseFoodMenuItemUpdateModelView
    {
        public int DayWiseFoodMenuItemId { get; set; }
        public int FoodMenuItemId { get; set; }
        public int DayId { get; set; }
        public int Time { get; set; }

    }
    #endregion

    #region Order

    public class OrderListGetModelView : tblOrder
    {
        public string? DaysName { get; set; }
        public string OrderDate { get; set; }
    }

    public class OrderSaveModelView
    {
        public string? OrderNumber { get; set; }
        public int? DayId { get; set; }
        public int? RgenId { get; set; }
        public string? UserName { get; set; }
        public string? UserId { get; set; }
        public string? UserType { get; set; }
        public decimal? TotalAmount { get; set; }
        public OrderPaymentType? PaymentType { get; set; }
        public OrderPaymentStatus? PaymentStatus { get; set; }
        public List<OrderItemSaveModelView>? OrderItems { get; set; }
        public OrderStatus? Status { get; set; }
        public string? Remark { get; set; }
        public string? UserMobileNo { get; set; }
        public string? EnrollNo { get; set; }
    }
    public class OrderUpdateModelView
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; }
        public int DayId { get; set; }
        public int RgenId { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string UserType { get; set; }
        public decimal TotalAmount { get; set; }
        //public int PaymentType { get; set; }
        public OrderPaymentType PaymentType { get; set; }
        //public int PaymentStatus { get; set; }
        public OrderPaymentStatus PaymentStatus { get; set; }
        public OrderStatus Status { get; set; }
        public string Remark { get; set; }
    }

    public class OrderStatusUpdateModelView
    {
        public int OrderId { get; set; }
        public int RgenId { get; set; }
        public OrderPaymentType PaymentType { get; set; }
        public OrderPaymentStatus PaymentStatus { get; set; }
        public OrderStatus Status { get; set; }
        public string Remark { get; set; }
    }
    public enum OrderPaymentType
    {
        Cash = 0,
        Card = 1,
        UPI = 2
    }
    public enum OrderPaymentStatus
    {
        Pending = 0,         /// Pending / In Progress (Yellow / Orange)
        Paid = 1,           /// Paid / Successful / Completed  (Green)
        //Failed = 2,        /// Failed / Denied / Unpaid  (Red)
        //Refunded = 3,      /// Refunded / Canceled / Voided  (Gray)
        //Cancelled = 4    /// 
    }

    public enum OrderStatus
    {
        OrderPlace = 0,
        InProgress = 1,
        Completed = 2,
        Cancelled = 3
    }

    #endregion

    #region Order Item

    public class OrderItemListGetModelView
    {
        public int FoodMenuItemId { get; set; }
        public int DayId { get; set; }
        public string? ItemName { get; set; }
        public string? ImageUrl { get; set; }

        public decimal ItemPrice { get; set; }
        public string ItemPriceDescriptin { get; set; }

    }
    public class OrderItemSaveModelView
    {
        public int OrderItemId { get; set; }
        public int ItemNo { get; set; }
        public int FoodMenuItemId { get; set; }
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
    }


    public class OrderDetailsViewModel
    {
        public int OrderItemId { get; set; }
        public int ItemNo { get; set; }
        public int FoodMenuItemId { get; set; }
        public string ItemName { get; set; }
        public decimal TotalAmount { get; set; }
        public int OrderId { get; set; }
    }
    #endregion

    #region  Order Notification
    public class OrderNotification
    {
        public int? OrderId { get; set; }
        public int? RgenId { get; set; }
        public int? Status { get; set; }
        
    }

    #endregion

    #region  User Login Username and Password
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class UserModel
    {
        public int response_id { get; set; }
        public int account_id { get; set; }
        public int account_type { get; set; }
        public string account_type_name { get; set; }
        public string response { get; set; }
    }
    #endregion
}