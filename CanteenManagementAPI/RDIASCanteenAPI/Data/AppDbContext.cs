using Microsoft.EntityFrameworkCore;
using RDIASCanteenAPI.Models.CanteenModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RDIASCanteenAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<MasterDaysModel> masterDaysModels { get; set; }
        public DbSet<FoodMenuItemModel> foodMenuItemModels { get; set; }
        public DbSet<FoodMenuItemPriceModel> foodMenuItemPriceModels { get; set; }
        public DbSet<DayWiseFoodMenuItemModel> dayWiseFoodMenuItemModels { get; set; }
        public DbSet<OrderModel> orderModels { get; set; }
        public DbSet<OrderItemModel> orderItemModels { get; set; }
    }

    #region tblMasterDays

    [Table("tblMasterDays")] // Maps to your SQL table
    public class MasterDaysModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DayId { get; set; }

        [Required]
        [MaxLength(100)]
        public string DaysName { get; set; }
        public int? DayNo { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    #endregion

    #region tblFoodMenuItems
    [Table("tblFoodMenuItem")] // Maps to your SQL table
    public class FoodMenuItemModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FoodMenuItemId { get; set; }
        [Required]
        public string ItemName { get; set; }
        public string ItemURL { get; set; }
        public string ItemDescriptin { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    #endregion

    #region tblFoodMenuItemsPrice
    [Table("tblFoodMenuItemPrice")] // Maps to your SQL table
    public class FoodMenuItemPriceModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FoodMenuItemPriceId { get; set; }
        [Required]
        public int FoodMenuItemId { get; set; }
        public int AcademicSessionId { get; set; }
        public string AcademicSession{ get; set; }
        public decimal ItemPrice { get; set; }
        public string ItemPriceDescriptin { get; set; } 
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    #endregion

    #region tblDayWiseFoodMenuItem
    [Table("tblDayWiseFoodMenuItem")] // Maps to your SQL table
    public class DayWiseFoodMenuItemModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DayWiseFoodMenuItemId { get; set; }
        [Required]
        public int FoodMenuItemId { get; set; }
        public int DayId { get; set; } 
        public int Time { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    #endregion

    #region tblOrder
    [Table("tblOrder")] // Maps to your SQL table
    public class OrderModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }
        public string? OrderNumber { get; set; }
        public int DayId { get; set; }
        public int RgenId { get; set; }
        public string UserName { get; set; }
        public string UserId {  get; set; }
        public string UserType {  get; set; }   
        public decimal TotalAmount { get; set; }
        public int PaymentType {  get; set; }    
        public int PaymentStatus {  get; set; }
        public string Remark { get; set; }
        public int Status { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    #endregion

    #region Order Item
    [Table("tblOrderItem")] // Maps to your SQL table
    public class OrderItemModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderItemId { get; set; }
        public int ItemNo { get; set; }
        public int FoodMenuItemId { get; set; }
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    #endregion


}
