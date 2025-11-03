using Microsoft.EntityFrameworkCore;
using RDIASCanteenAPI.Models.CanteenModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RDIASCanteenAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<tblMasterDays> masterDaysModels { get; set; }
        public DbSet<tblFoodMenuItem> foodMenuItemModels { get; set; }
        public DbSet<tblFoodMenuItemPrice> foodMenuItemPriceModels { get; set; }
        public DbSet<tblDayWiseFoodMenuItem> dayWiseFoodMenuItemModels { get; set; }
        public DbSet<tblOrder> orderModels { get; set; }
        public DbSet<tblOrderItem> orderItemModels { get; set; }
        public DbSet<tblUsers> users { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<tblOrderItem>()
                .HasOne(b => b.Order) // A Book has one Author
                .WithMany(a => a.OrderItems) // An Author has many Books
                .HasForeignKey(b => b.OrderId); // The foreign key in Book is AuthorId
        }
    }

    #region tblMasterDays

    [Table("tblMasterDays")] // Maps to your SQL table
    public class tblMasterDays
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
    public class tblFoodMenuItem
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
    public class tblFoodMenuItemPrice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FoodMenuItemPriceId { get; set; }
        [Required]
        public int FoodMenuItemId { get; set; }
        public int AcademicSessionId { get; set; }
        public string AcademicSession { get; set; }
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
    public class tblDayWiseFoodMenuItem
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
    public class tblOrder
    {
        public tblOrder()
        {
            this.OrderItems = new List<tblOrderItem>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? OrderId { get; set; }
        public string? OrderNumber { get; set; }
        public int? DayId { get; set; }
        public int? RgenId { get; set; }
        public string? UserName { get; set; }
        public string? UserId { get; set; }
        public string? UserType { get; set; }
        public decimal? TotalAmount { get; set; }
        public OrderPaymentType? PaymentType { get; set; }
        public OrderPaymentStatus? PaymentStatus { get; set; }
        public string? Remark { get; set; }
        public OrderStatus? Status { get; set; }
        public List<tblOrderItem>? OrderItems { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? UserMobileNo { get; set; }
        public string? transtionId {  get; set; }
        public DateTime? transtionDate {  get; set; }
    }
    #endregion

    #region Order Item
    [Table("tblOrderItem")] // Maps to your SQL table
    public class tblOrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderItemId { get; set; }
        public int ItemNo { get; set; }
        public int FoodMenuItemId { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }
        public tblOrder Order { get; set; }
        public decimal TotalAmount { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
    #endregion

    #region User Login
    [Table("tblUsers")]  // Maps to Your SQL Table
    public class tblUsers
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UsersId { get; set; }
        public string UsersName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string QRCode_file { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
    #endregion
}

