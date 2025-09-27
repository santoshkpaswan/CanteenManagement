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
        public  bool? IsActive { get; set; }
    }
    public class FoodDayUpdateModelView
    {
        public int DayId { get; set; }
        public string DaysName { get; set; }
        public int DayNo { get; set; }

    }

    public class FoodDayGetModelView :DayWiseFoodMenuItemModel
    {
         public string? ItemName { get; set; }
        public string? DaysName { get; set; }
         

    }
    #endregion

    #region FoodMenuItemModel

    public class FoodMenuItemGetModelView :FoodMenuItemPriceModel
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

    }
    #endregion

    #region FoodMenuItemPrice
    public class FoodMenuItemPriceSaveModelView
    {
        public int FoodMenuItemId { get; set; }
        public int AcademicSessionId { get; set; }
        public string AcademicSession{ get; set; }
        public decimal ItemPrice { get; set; }
        public string ItemPriceDescriptin { get; set; }

    }
    public class FoodMenuItemPriceUpdateModelView
    {
        public int FoodMenuItemPriceId { get; set; }
        public int FoodMenuItemId { get; set; }
        public int AcademicSessionId { get; set; }
        public decimal ItemPrice { get; set; }
        public string ItemPriceDescriptin { get; set; }

    }
    #endregion

    #region DayWiseFoodMenuItem
    public class DayWiseFoodMenuItemSaveModelView
    {
        public int FoodMenuItemId { get; set; }
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
    public class OrderSaveModelView
    {
        //public string OrderNumber { get; set; }
        public int DayId { get; set; }
        public int RgenId { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string UserType { get; set; }
        public decimal TotalAmount { get; set; }
        public int PaymentType { get; set; }
        public int PaymentStatus { get; set; }
        public int Status { get; set; }
        public string Remark { get; set; }
    }
    public class OrderUpdateModelView
    {
        public int OrderId { get; set; }
        //public string OrderNumber { get; set; }
        public int DayId { get; set; }
        public int RgenId { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string UserType { get; set; }
        public decimal TotalAmount { get; set; }
        public int PaymentType { get; set; }
        public int PaymentStatus { get; set; }
        public int Status { get; set; }
        public string Remark { get; set; }
    }

    #endregion

    #region Order Item
    public class OrderItemSaveModelView
    {
        public int ItemNo { get; set; }
        public int FoodMenuItemId { get; set; }
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
    }
    public class OrderItemUpdateModelView
    {
        public int OrderItemId { get; set; }
        public int ItemNo { get; set; }
        public int FoodMenuItemId { get; set; }
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
    }
    #endregion
}
