using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RDIASCanteenAPI.Data;
using RDIASCanteenAPI.Interface.CanteenInterface;
using RDIASCanteenAPI.Models.CanteenModel;

namespace RDIASCanteenAPI.BuilderModel.CanteenBuilder
{
    public class MasterDayBuilder : MasterDayInterface
    {
        private readonly AppDbContext _context;
        public MasterDayBuilder(AppDbContext context)
        {
            _context = context;
        }
        #region master food day
        public List<MasterDaysModel> GetAllMasterDays()
        {
            return _context.masterDaysModels.Where(x => x.IsActive == true).OrderByDescending(x => x.DayId).ToList();
        }
        public async Task <FoodDaySaveModelView> SaveMasterDay(FoodDaySaveModelView foodDaySaveModel)
        {
                if (string.IsNullOrWhiteSpace(foodDaySaveModel.DaysName) || foodDaySaveModel.DaysName.Trim().ToLower() == "string" || foodDaySaveModel.DaysName.Trim().ToLower() == "null")
                {
                    throw new ArgumentException("Day Name is required.", nameof(foodDaySaveModel.DaysName));
                }
                // check for Duplicate record
                bool exists = await _context.masterDaysModels.AnyAsync(x => x.DaysName.ToLower() == foodDaySaveModel.DaysName.ToLower() && x.IsActive == true);
                if (exists)
                {
                    throw new Exception("record already exists.");
                }

                MasterDaysModel obj = new MasterDaysModel
                {
                    DaysName = foodDaySaveModel.DaysName,
                    DayNo = foodDaySaveModel.DayNo,
                    IsActive = true,
                    CreatedBy = 0,
                    CreatedDate = DateTime.Now,
                };
                _context.masterDaysModels.Add(obj);
                await _context.SaveChangesAsync();
                return foodDaySaveModel;

        }
        public async Task<FoodDayUpdateModelView> UpdateMasterDay(FoodDayUpdateModelView foodDayUpdateModel)
        {
            if (string.IsNullOrWhiteSpace(foodDayUpdateModel.DaysName) || foodDayUpdateModel.DaysName.Trim().ToLower() == "string" || foodDayUpdateModel.DaysName.Trim().ToLower() == "null")
            {
                throw new ArgumentException("Day Name is required.", nameof(foodDayUpdateModel.DaysName));
            }
            // check for Duplicate record
            bool exists = await _context.masterDaysModels.AnyAsync(x => x.DaysName.ToLower() == foodDayUpdateModel.DaysName.ToLower() && x.IsActive);
            if (exists)
            {
                throw new Exception("Record already exists.");
            }
            // UPDATE only
            var existing = await _context.masterDaysModels.FirstOrDefaultAsync(x => x.DayId == foodDayUpdateModel.DayId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.DaysName = foodDayUpdateModel.DaysName;
            existing.DayNo = foodDayUpdateModel.DayNo;
            existing.IsActive = foodDayUpdateModel.IsActive;
            existing.ModifiedDate = DateTime.Now;  // optional
            existing.ModifiedBy = foodDayUpdateModel.ModifiedBy; // optional if you track users
            await _context.SaveChangesAsync();
           return foodDayUpdateModel;     
        }
        public async Task DeleteMasterDay(int dayId)
        {
            var existing = await _context.masterDaysModels.FirstOrDefaultAsync(x => x.DayId == dayId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            // _context.tblMasterDayss.Remove(existing);
            existing.IsActive = false;
            existing.ModifiedBy = 0;
            existing.ModifiedDate = DateTime.Now;
           await _context.SaveChangesAsync();
        }
        #endregion

        #region Food Menu Item
        public async Task<List<FoodMenuItemModel>> GetFoodMenuItem()
        {
            return await _context.foodMenuItemModels.Where(x => x.IsActive == true).OrderByDescending(x => x.FoodMenuItemId).ToListAsync();
        }
        public async Task<int> SaveFoodMenuItem(FoodMenuItemModelView menuItemModelView, IFormFile itemImageFile)
        {
            int FoodMenuItemId = 0;
            try
            {
                string FilePath = "";
                // Validate Item Name
                if (string.IsNullOrWhiteSpace(menuItemModelView.ItemName) || menuItemModelView.ItemName.Trim().ToLower() == "string" || menuItemModelView.ItemName.Trim().ToLower() == "null")
                    throw new ArgumentException("Item Name is required.", nameof(menuItemModelView.ItemName));

                if (itemImageFile != null && itemImageFile.Length > 0)
                {
                    // Use Directory.GetCurrentDirectory() + folder name (no wwwroot needed)
                    var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Images", "FoodUploads", "FoodItems");
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    // Generate unique file name
                    var fileName = Guid.NewGuid() + Path.GetExtension(itemImageFile.FileName);
                    var filePath = Path.Combine(folderPath, fileName);

                    // Save file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await itemImageFile.CopyToAsync(stream);
                    }

                    // Save relative path (no wwwroot)
                    FilePath = Path.Combine("FoodUploads", "FoodItems", fileName).Replace("\\", "/");
                }

                //model.CreatedDate = DateTime.Now;
                FoodMenuItemModel obj = new FoodMenuItemModel();
                obj.ItemName = menuItemModelView.ItemName;
                obj.ItemURL = FilePath;
                obj.ItemDescriptin = menuItemModelView.ItemDescriptin;
                obj.IsActive = true;
                obj.CreatedBy = 0;
                obj.CreatedDate = DateTime.Now;

                _context.foodMenuItemModels.Add(obj);
                await _context.SaveChangesAsync();
                FoodMenuItemId = obj.FoodMenuItemId;
            }
            catch (Exception ex)
            {

            }
            return FoodMenuItemId;
        }
        public async Task<FoodMenuItemUpdateModelView> UpdateFoodMenuItem(FoodMenuItemUpdateModelView menuItemUpdateModelView, IFormFile itemImageFile)
        {
            try
            {
                 
                // Validate Item Name
                if (string.IsNullOrWhiteSpace(menuItemUpdateModelView.ItemName) || menuItemUpdateModelView.ItemName.Trim().ToLower() == "string" || menuItemUpdateModelView.ItemName.Trim().ToLower() == "null")
                    throw new ArgumentException("Item Name is required.", nameof(menuItemUpdateModelView.ItemName));

                var objexisting = await _context.foodMenuItemModels.FirstOrDefaultAsync(x => x.FoodMenuItemId == menuItemUpdateModelView.FoodMenuItemId);
                if (objexisting == null)
                {
                    throw new Exception("Record not found.");
                }
                string filePath = objexisting.ItemURL; // Keep existing file path unless new file is uploaded

                // Handle file upload if new file is provided
                if (itemImageFile != null && itemImageFile.Length > 0)
                {
                    var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Images", "FoodUploads", "FoodItems");
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    // Generate unique file name
                    var fileName = Guid.NewGuid() + Path.GetExtension(itemImageFile.FileName);
                    var fullFilePath = Path.Combine(folderPath, fileName);

                    // Save new file
                    using (var stream = new FileStream(fullFilePath, FileMode.Create))
                    {
                        await itemImageFile.CopyToAsync(stream);
                    }

                    filePath = Path.Combine("FoodUploads", "FoodItems", fileName).Replace("\\", "/");

                    // Optional: Delete old file if it exists
                    if (!string.IsNullOrEmpty(objexisting.ItemURL))
                    {
                        var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", objexisting.ItemURL);
                        if (File.Exists(oldFilePath))
                        {
                            File.Delete(oldFilePath);
                        }
                    }
                }

                // Update only the properties that should change
                objexisting.ItemName = menuItemUpdateModelView.ItemName;
                objexisting.ItemDescriptin = menuItemUpdateModelView.ItemDescriptin;
                objexisting.ItemURL = filePath;
                objexisting.IsActive = true;
                objexisting.ModifiedDate = DateTime.Now;
                objexisting.ModifiedBy = 0; // Replace with actual user ID if available

                // Use Update instead of Add for existing entities
                _context.foodMenuItemModels.Update(objexisting);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {

            }
            return menuItemUpdateModelView;
        }
        public async Task DeleteFoodMenuItem(int FoodMenuItemId)
        {
            var existingObj = await _context.foodMenuItemModels.FirstOrDefaultAsync(x => x.FoodMenuItemId == FoodMenuItemId && x.IsActive == true);
            if(existingObj == null)
            {
                throw new Exception("Record not found.");
            }
            existingObj.IsActive = false;
            existingObj.ModifiedBy = 0 ;
            existingObj.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

        }
        #endregion

        #region Food Menu Item Price

        public async Task<List<FoodMenuItemPriceModel>> GetFoodMenuItemPrice()
        {
            return await _context.foodMenuItemPriceModels.Where(x => x.IsActive == true).OrderByDescending(x =>x.FoodMenuItemPriceId).ToListAsync();
        }
        public async Task<FoodMenuItemPriceSaveModelView> SaveFoodMenuItemPrice(FoodMenuItemPriceSaveModelView menuItemPriceSaveModelView)
        {
            if (menuItemPriceSaveModelView.FoodMenuItemId <= 0)
            {
                throw new ArgumentException("Food Menu Item is required.", nameof(menuItemPriceSaveModelView.FoodMenuItemId));
            }
            // check for Duplicate record
            bool exists = await _context.foodMenuItemPriceModels.AnyAsync(x => x.FoodMenuItemId == menuItemPriceSaveModelView.FoodMenuItemId && x.IsActive == true);
            if (exists)
            {
                throw new Exception("Food Menu Item already exists.");
            }

            FoodMenuItemPriceModel obj = new FoodMenuItemPriceModel
            {
                FoodMenuItemId = menuItemPriceSaveModelView.FoodMenuItemId,
                AcademicSessionId = menuItemPriceSaveModelView.AcademicSessionId,
                ItemPrice = menuItemPriceSaveModelView.ItemPrice,
                ItemPriceDescriptin = menuItemPriceSaveModelView.ItemPriceDescriptin,
                IsActive = true,
                CreatedBy = 0,
                CreatedDate = DateTime.Now,
            };
            _context.foodMenuItemPriceModels.Add(obj);
            await _context.SaveChangesAsync();
            return menuItemPriceSaveModelView;

        }
        public async Task<FoodMenuItemPriceUpdateModelView> UpdateFoodMenuItemPrice(FoodMenuItemPriceUpdateModelView menuItemPriceUpdateModelView)
        {
            if (menuItemPriceUpdateModelView.FoodMenuItemId <=0)
            {
                throw new ArgumentException("Food Menu Item is required.", nameof(menuItemPriceUpdateModelView.FoodMenuItemId));
            }
            // check for Duplicate record
            //bool exists = await _context.foodMenuItemPriceModels.AnyAsync(x => x.FoodMenuItemId == model.FoodMenuItemId && x.IsActive == true);
            //if (exists)
            //{
                //throw new Exception("Food Menu Item already exists.");
            //}
            // UPDATE only
            var existing = await _context.foodMenuItemPriceModels.FirstOrDefaultAsync(x => x.FoodMenuItemPriceId == menuItemPriceUpdateModelView.FoodMenuItemPriceId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.FoodMenuItemId = menuItemPriceUpdateModelView.FoodMenuItemId;
            existing.AcademicSessionId = menuItemPriceUpdateModelView.AcademicSessionId;
            existing.ItemPrice = menuItemPriceUpdateModelView.ItemPrice;
            existing.ItemPriceDescriptin = menuItemPriceUpdateModelView.ItemPriceDescriptin;
            existing.IsActive = true;
            existing.ModifiedDate = DateTime.Now;  // optional
            existing.ModifiedBy = 0; // optional if you track users
            await _context.SaveChangesAsync();
            return menuItemPriceUpdateModelView;
        }
        public async Task DeleteFoodMenuItemPrice(int FoodMenuItemPriceId)
        {
            var existingObj = await _context.foodMenuItemPriceModels.FirstOrDefaultAsync(x => x.FoodMenuItemPriceId == FoodMenuItemPriceId && x.IsActive == true);
            if (existingObj == null)
            {
                throw new Exception("Record not found.");
            }
            existingObj.IsActive = false;
            existingObj.ModifiedBy = 0;
            existingObj.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

        }
        #endregion

        #region Day Wise Food Menu Item
        public async Task<List<DayWiseFoodMenuItemModel>> GetDayWiseFoodMenuItem()
        {
            return await _context.dayWiseFoodMenuItemModels.Where(x => x.IsActive == true).OrderByDescending(x => x.DayWiseFoodMenuItemId).ToListAsync();
        }
        public async Task<DayWiseFoodMenuItemSaveModelView> SaveDayWiseFoodMenuItem(DayWiseFoodMenuItemSaveModelView dayWiseFoodMenuItemSaveModelView)
        {
            if (dayWiseFoodMenuItemSaveModelView.FoodMenuItemId <= 0)
            {
                throw new ArgumentException("Food Menu Item is required.", nameof(dayWiseFoodMenuItemSaveModelView.FoodMenuItemId));
            }
            // check for Duplicate record
            bool exists = await _context.dayWiseFoodMenuItemModels.AnyAsync(x => x.FoodMenuItemId == dayWiseFoodMenuItemSaveModelView.FoodMenuItemId && x.DayId == dayWiseFoodMenuItemSaveModelView.DayId && x.IsActive == true);
            if (exists)
            {
                throw new Exception("Food Menu Item And Food Day already exists.");
            }

            DayWiseFoodMenuItemModel obj = new DayWiseFoodMenuItemModel
            {
                FoodMenuItemId = dayWiseFoodMenuItemSaveModelView.FoodMenuItemId,
                DayId = dayWiseFoodMenuItemSaveModelView.DayId,
                Time = dayWiseFoodMenuItemSaveModelView.Time,
                IsActive = true,
                CreatedBy = 0,
                CreatedDate = DateTime.Now,
            };
            _context.dayWiseFoodMenuItemModels.Add(obj);
            await _context.SaveChangesAsync();
            return dayWiseFoodMenuItemSaveModelView;

        }
        public async Task<DayWiseFoodMenuItemUpdateModelView> UpdateDayWiseFoodMenuItem(DayWiseFoodMenuItemUpdateModelView wiseFoodMenuItemUpdateModelView)
        {
            if (wiseFoodMenuItemUpdateModelView.FoodMenuItemId <= 0 && wiseFoodMenuItemUpdateModelView.DayId <= 0)
            {
                throw new ArgumentException("Food Menu Item And Day is required.");
            }
            // UPDATE only
            var existing = await _context.dayWiseFoodMenuItemModels.FirstOrDefaultAsync(x => x.DayWiseFoodMenuItemId == wiseFoodMenuItemUpdateModelView.DayWiseFoodMenuItemId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.DayId = wiseFoodMenuItemUpdateModelView.DayId;
            existing.FoodMenuItemId = wiseFoodMenuItemUpdateModelView.FoodMenuItemId;
            existing.Time = wiseFoodMenuItemUpdateModelView.Time;
            existing.IsActive = true;
            existing.ModifiedDate = DateTime.Now;  // optional
            existing.ModifiedBy = 0; // optional if you track users
            await _context.SaveChangesAsync();
            return wiseFoodMenuItemUpdateModelView;
        }
        public async Task DeleteDayWiseFoodMenuItem(int DayWiseFoodMenuItemId)
        {
            var existing = await _context.dayWiseFoodMenuItemModels.FirstOrDefaultAsync(x => x.DayWiseFoodMenuItemId == DayWiseFoodMenuItemId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.IsActive = false;
            existing.ModifiedBy = 0;
            existing.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
        }
        #endregion

        #region Order
        public async Task<List<OrderModel>> GetOrder()
        {
            return await _context.orderModels.Where(x => x.IsActive == true).OrderByDescending(x => x.OrderId).ToListAsync();
        }
        public async Task<OrderSaveModelView> SaveOrder(OrderSaveModelView orderSaveModelView)
        {
            if (orderSaveModelView.DayId <= 0)
            {
                throw new ArgumentException("Day is required.", nameof(orderSaveModelView.DayId));
            }
            if (orderSaveModelView.TotalAmount <= 0)
            {
                throw new ArgumentException("Total Amount must be greater than 0.", nameof(orderSaveModelView.TotalAmount));
            }
            if (string.IsNullOrWhiteSpace(orderSaveModelView.UserName))
            {
                throw new ArgumentException("User Name is required.", nameof(orderSaveModelView.UserName));
            }
            if (string.IsNullOrWhiteSpace(orderSaveModelView.UserType))
            {
                throw new ArgumentException("User Type is required.", nameof(orderSaveModelView.UserType));
            }

            // check for Duplicate record
            //bool exists = await _context.orderModels.AnyAsync(x => x.OrderNumber == orderSaveModelView.OrderNumber && x.IsActive == true);
            //if (exists)
            //{
            //    throw new Exception("Order Number already exists.");
            //}

            OrderModel obj = new OrderModel
            {
                //OrderNumber = orderSaveModelView.OrderNumber,
                DayId = orderSaveModelView.DayId,
                RgenId = orderSaveModelView.RgenId,
                UserName = orderSaveModelView.UserName,
                UserId = orderSaveModelView.UserId,
                UserType = orderSaveModelView.UserType,
                TotalAmount = orderSaveModelView.TotalAmount,
                PaymentType = orderSaveModelView.PaymentType,
                PaymentStatus = orderSaveModelView.PaymentStatus,
                Status = orderSaveModelView.Status,
                Remark = orderSaveModelView.Remark,
                IsActive = true,
                CreatedBy = 0,
                CreatedDate = DateTime.Now,
            };
            _context.orderModels.Add(obj);
            await _context.SaveChangesAsync();

            //  Generate unique OrderNumber using OrderId
            obj.OrderNumber = $"ORD-{DateTime.Now:yyyyMMdd}-{obj.OrderId:D4}";
            // update and save again
            await _context.SaveChangesAsync();

            //orderSaveModelView.OrderNumber = obj.OrderNumber;

            return orderSaveModelView;



        }
        public async Task<OrderUpdateModelView> UpdateOrder(OrderUpdateModelView orderUpdateModelView)
        {
            if (orderUpdateModelView.DayId <= 0 )
            {
                throw new ArgumentException("Food Day is required.");
            }
            // UPDATE only
            var existing = await _context.orderModels.FirstOrDefaultAsync(x => x.OrderId == orderUpdateModelView.OrderId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.DayId = orderUpdateModelView.DayId;
            existing.RgenId = orderUpdateModelView.RgenId;
            existing.UserName = orderUpdateModelView.UserName;
            existing.UserId = orderUpdateModelView.UserId;
            existing.UserType = orderUpdateModelView.UserType;
            existing.TotalAmount = orderUpdateModelView.TotalAmount;
            existing.PaymentType = orderUpdateModelView.PaymentType;
            existing.PaymentStatus = orderUpdateModelView.PaymentStatus;
            existing.Status = orderUpdateModelView.Status;
            existing.Remark = orderUpdateModelView.Remark;
            existing.IsActive = true;
            existing.ModifiedDate = DateTime.Now;  // optional
            existing.ModifiedBy = 0; // optional if you track users
            await _context.SaveChangesAsync();
            return orderUpdateModelView;
        }
        public async Task DeleteOrder(string OrderNumber)
        {
            var existing = await _context.orderModels.FirstOrDefaultAsync(x => x.OrderNumber == OrderNumber && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.IsActive = false;
            existing.ModifiedBy = 0;
            existing.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
        }
        #endregion

        #region Order Item
        public async Task<List<OrderItemModel>> GetOrderItem()
        {
            return await _context.orderItemModels.Where(x => x.IsActive == true).OrderByDescending(x => x.OrderId).ToListAsync();
        }
        public async Task<OrderItemSaveModelView> SaveOrderItem(OrderItemSaveModelView itemSaveModelView)
        {
            if (itemSaveModelView.FoodMenuItemId <= 0)
            {
                throw new ArgumentException("Food Item is required.", nameof(itemSaveModelView.FoodMenuItemId));
            }
            if (itemSaveModelView.OrderId <= 0)
            {
                throw new ArgumentException("Order is required.", nameof(itemSaveModelView.OrderId));
            }
            if (itemSaveModelView.TotalAmount <=0)
            {
                throw new ArgumentException("Total Amount is required.", nameof(itemSaveModelView.TotalAmount));
            }
            
            OrderItemModel obj = new OrderItemModel
            {
                ItemNo = itemSaveModelView.ItemNo,
                FoodMenuItemId = itemSaveModelView.FoodMenuItemId,
                OrderId = itemSaveModelView.OrderId,
                TotalAmount = itemSaveModelView.TotalAmount,
                IsActive = true,
                CreatedBy = 0,
                CreatedDate = DateTime.Now,
            };
            _context.orderItemModels.Add(obj);
            await _context.SaveChangesAsync();
            return itemSaveModelView;
        }
        public async Task<OrderItemUpdateModelView> UpdateOrderItem(OrderItemUpdateModelView orderItemUpdateModel)
        {
            if (orderItemUpdateModel.FoodMenuItemId <= 0)
            {
                throw new ArgumentException("Food Item is required.", nameof(orderItemUpdateModel.FoodMenuItemId));
            }
            if(orderItemUpdateModel.OrderId <=0)
            {
                throw new ArgumentException("Order is required.", nameof(orderItemUpdateModel.OrderId));
            }
            if(orderItemUpdateModel.TotalAmount <=0)
            {
                throw new ArgumentException("Total Amount is required.", nameof(orderItemUpdateModel.TotalAmount));
            }
            // UPDATE only
            var existing = await _context.orderItemModels.FirstOrDefaultAsync(x => x.OrderItemId == orderItemUpdateModel.OrderItemId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.ItemNo = orderItemUpdateModel.ItemNo;
            existing.FoodMenuItemId = orderItemUpdateModel.FoodMenuItemId;
            existing.OrderId = orderItemUpdateModel.OrderId;
            existing.TotalAmount = orderItemUpdateModel.TotalAmount;
            existing.IsActive = true;
            existing.ModifiedDate = DateTime.Now;  // optional
            existing.ModifiedBy = 0; // optional if you track users
            await _context.SaveChangesAsync();
            return orderItemUpdateModel;
        }
        public async Task DeleteOrderItem(int OrderItemId)
        {
            var existing = await _context.orderItemModels.FirstOrDefaultAsync(x => x.OrderItemId == OrderItemId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.IsActive = false;
            existing.ModifiedBy = 0;
            existing.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
        }
        #endregion
    }
}
