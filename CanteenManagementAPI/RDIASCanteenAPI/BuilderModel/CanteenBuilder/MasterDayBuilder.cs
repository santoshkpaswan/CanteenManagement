using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RDIASCanteenAPI.Data;
using RDIASCanteenAPI.Interface.CanteenInterface;
using RDIASCanteenAPI.Models.CanteenModel;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        public List<tblMasterDays> GetAllMasterDays()
        {
            return _context.masterDaysModels.Where(x => x.IsActive == true).OrderByDescending(x => x.DayId).ToList();
        }
        public async Task<FoodDaySaveModelView> SaveMasterDay(FoodDaySaveModelView foodDaySaveModel)
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

            tblMasterDays obj = new tblMasterDays
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
            existing.IsActive = true;
            existing.ModifiedDate = DateTime.Now;  // optional
            existing.ModifiedBy = 1; // optional if you track users
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
        public async Task<List<tblFoodMenuItem>> GetFoodMenuItem()
        {
            return await _context.foodMenuItemModels.Where(x => x.IsActive == true).OrderByDescending(x => x.FoodMenuItemId).ToListAsync();
        }
        public async Task<int> SaveFoodMenuItem(FoodMenuItemModelView menuItemModelView)
        {
            int FoodMenuItemId = 0;
            try
            {
                IFormFile itemImageFile = menuItemModelView.itemImageFile;
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
                    var fileName = Guid.NewGuid() + itemImageFile.FileName;
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
                tblFoodMenuItem obj = new tblFoodMenuItem();
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
        public async Task<FoodMenuItemUpdateModelView> UpdateFoodMenuItem(FoodMenuItemUpdateModelView menuItemUpdateModelView)
        {
            try
            {
                IFormFile itemImageFile = menuItemUpdateModelView.itemImageFile;
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
                    var fileName = Guid.NewGuid() + itemImageFile.FileName;
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

        #region Food Menu Item Price

        public async Task<List<FoodMenuItemGetModelView>> GetFoodMenuItemPrice()
        {
            //return await _context.foodMenuItemPriceModels.Where(x => x.IsActive == true).OrderByDescending(x =>x.FoodMenuItemPriceId).ToListAsync();
            var result = await (from fp in _context.foodMenuItemPriceModels
                                join fm in _context.foodMenuItemModels on fp.FoodMenuItemId equals fm.FoodMenuItemId
                                where fp.IsActive && fm.IsActive
                                orderby fp.FoodMenuItemPriceId descending
                                select new FoodMenuItemGetModelView
                                {
                                    FoodMenuItemPriceId = fp.FoodMenuItemPriceId,
                                    AcademicSessionId = fp.AcademicSessionId,
                                    AcademicSession = fp.AcademicSession ?? "",
                                    FoodMenuItemId = fp.FoodMenuItemId,
                                    ItemPrice = fp.ItemPrice,
                                    ItemPriceDescriptin = fp.ItemPriceDescriptin,
                                    ItemName = fm.ItemName,   //getting name from foodmenuitem
                                }).ToListAsync();
            return result;
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

            tblFoodMenuItemPrice obj = new tblFoodMenuItemPrice
            {
                FoodMenuItemId = menuItemPriceSaveModelView.FoodMenuItemId,
                AcademicSessionId = menuItemPriceSaveModelView.AcademicSessionId,
                AcademicSession = menuItemPriceSaveModelView.SessionName,
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
            if (menuItemPriceUpdateModelView.FoodMenuItemId <= 0)
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
            existing.AcademicSession = menuItemPriceUpdateModelView.SessionName;
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
        public async Task<List<FoodDayGetModelView>> GetDayWiseFoodMenuItem()
        {
            //return await _context.dayWiseFoodMenuItemModels.Where(x => x.IsActive == true).OrderByDescending(x => x.DayWiseFoodMenuItemId).ToListAsync();

            var result = await (from d in _context.dayWiseFoodMenuItemModels
                                join f in _context.masterDaysModels on d.DayId equals f.DayId
                                join fm in _context.foodMenuItemModels on d.FoodMenuItemId equals fm.FoodMenuItemId
                                where f.IsActive && d.IsActive && fm.IsActive
                                orderby d.DayWiseFoodMenuItemId descending
                                select new FoodDayGetModelView
                                {
                                    DayWiseFoodMenuItemId = d.DayWiseFoodMenuItemId,
                                    FoodMenuItemId = d.FoodMenuItemId,
                                    ItemName = fm.ItemName,   //getting name from foodmenuitem
                                    DayId = f.DayId,
                                    DaysName = f.DaysName,    // getting name from masterDaysModels
                                    Time = d.Time
                                }).ToListAsync();
            return result;

        }


        public async Task<DayWiseFoodMenuItemSaveModelView> SaveDayWiseFoodMenuItem(DayWiseFoodMenuItemSaveModelView dayWiseFoodMenuItemSaveModelView)
        {
            if (dayWiseFoodMenuItemSaveModelView.FoodMenuItemId == null || !dayWiseFoodMenuItemSaveModelView.FoodMenuItemId.Any())
            {
                throw new ArgumentException("Food Menu Item is required.", nameof(dayWiseFoodMenuItemSaveModelView.FoodMenuItemId));
            }
            foreach (var foodItemId in dayWiseFoodMenuItemSaveModelView.FoodMenuItemId)
            {
                // check for Duplicate record
                //bool exists = await _context.dayWiseFoodMenuItemModels.AnyAsync(x => x.FoodMenuItemId == foodItemId && x.DayId == dayWiseFoodMenuItemSaveModelView.DayId && x.IsActive == true);
                //if (exists)
                //{
                // throw new Exception("Food Menu Item And Food Day already exists.");
                //}

                var obj = new tblDayWiseFoodMenuItem
                {
                    FoodMenuItemId = foodItemId,
                    DayId = dayWiseFoodMenuItemSaveModelView.DayId,
                    Time = dayWiseFoodMenuItemSaveModelView.Time,
                    IsActive = true,
                    CreatedBy = 0,
                    CreatedDate = DateTime.Now,
                };
                _context.dayWiseFoodMenuItemModels.Add(obj);
            }
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
        public async Task<List<OrderListGetModelView>> GetOrder(int rgenId, string userType)
        {
            //return await _context.orderModels.Where(x => x.IsActive == true).OrderByDescending(x => x.OrderId).ToListAsync();
            var query = from o in _context.orderModels
                        join d in _context.masterDaysModels on o.DayId equals d.DayId
                        where o.IsActive == true && d.IsActive == true //&& o.RgenId == rgenId
                                                                       //orderby o.OrderId descending
                        select new
                        {
                            o.OrderId,
                            o.OrderNumber,
                            o.DayId,
                            d.DaysName,
                            o.RgenId,
                            o.UserName,
                            o.UserId,
                            o.UserType,
                            o.TotalAmount,
                            o.PaymentType,
                            o.PaymentStatus,
                            o.Status,
                            o.Remark,
                            o.CreatedDate,
                        };
            // Apply RgenId filter only for non-admin users
            if (!string.Equals(userType, "Canteen", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(o => o.RgenId == rgenId);
            }
            // Order descending
            query = query.OrderByDescending(o => o.OrderId);
            var data = await query.ToListAsync();
            // Convert date format here (in-memory)
            var result = data.Select(o => new OrderListGetModelView
            {
                OrderId = o.OrderId,
                OrderNumber = o.OrderNumber,
                DayId = o.DayId,
                DaysName = o.DaysName,
                RgenId = o.RgenId,
                UserName = o.UserName,
                UserId = o.UserId,
                UserType = o.UserType,
                TotalAmount = o.TotalAmount,
                PaymentType = o.PaymentType,
                PaymentStatus = o.PaymentStatus,
                Status = o.Status,
                Remark = o.Remark,
                // Convert DateTime → formatted string
                OrderDate = o.CreatedDate?.ToString("dd/MM/yyyy")
            }).ToList();
            return result;
        }

        public async Task<List<OrderDetailsViewModel>> GetOrderItemDetails(int orderId)
        {
            var result = await (
                from o in _context.orderModels
                join om in _context.orderItemModels on o.OrderId equals om.OrderId
                join fm in _context.foodMenuItemModels on om.FoodMenuItemId equals fm.FoodMenuItemId
                where o.IsActive == true && om.IsActive == true && fm.IsActive == true && o.OrderId == orderId
                select new OrderDetailsViewModel
                {
                    OrderItemId = om.OrderItemId,
                    ItemNo = om.ItemNo,
                    FoodMenuItemId = om.FoodMenuItemId,
                    ItemName = fm.ItemName,
                    TotalAmount = om.TotalAmount,
                    OrderId = orderId,
                }
            ).ToListAsync();

            return result;
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

            tblOrder obj = new tblOrder
            {
                OrderNumber = orderSaveModelView.OrderNumber,
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
                CreatedBy = orderSaveModelView.RgenId,
                CreatedDate = DateTime.Now,
                OrderItems = orderSaveModelView.OrderItems.Select(s => new tblOrderItem()
                {
                    ItemNo = s.ItemNo,
                    FoodMenuItemId = s.FoodMenuItemId,
                    TotalAmount = s.TotalAmount,
                    IsActive = true,
                    CreatedDate = DateTime.Now,
                    CreatedBy = orderSaveModelView.RgenId ?? 0
                }).ToList()
            };
            _context.orderModels.Add(obj);
            _context.Entry(obj).State = EntityState.Added;
            await _context.SaveChangesAsync();

            //// after saving to get OrderId
            //var today = DateTime.Now.Date;
            //// count existing orders for today
            //int todayCount = await _context.orderModels.CountAsync(o => o.CreatedDate.Date == today);
            //// +1 for new order
            //int sequence = todayCount;
            //// Order number format: RDIAS0001, RDIAS0002, ...
            //obj.OrderNumber = $"RDIAS{sequence:D4}";
            ////obj.OrderNumber = $"ORD-{DateTime.Now:yyyyMMdd}-{obj.OrderId:D4}";
            //// update and save again
            //await _context.SaveChangesAsync();

            ////orderSaveModelView.OrderNumber = obj.OrderNumber;

            return orderSaveModelView;



        }
        public async Task<OrderUpdateModelView> UpdateOrder(OrderUpdateModelView orderUpdateModelView)
        {
            if (orderUpdateModelView.DayId <= 0)
            {
                throw new ArgumentException("Food Day is required.");
            }
            // UPDATE only
            var existing = await _context.orderModels.FirstOrDefaultAsync(x => x.OrderId == orderUpdateModelView.OrderId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.OrderNumber = orderUpdateModelView.OrderNumber;
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

        public async Task<OrderStatusUpdateModelView> UpdateOrderStatus(OrderStatusUpdateModelView orderStatusUpdateModelView)
        {
            if (orderStatusUpdateModelView.OrderId <= 0)
            {
                throw new ArgumentException("Order Id is required.");
            }
            // UPDATE only
            var existing = await _context.orderModels.FirstOrDefaultAsync(x => x.OrderId == orderStatusUpdateModelView.OrderId && x.IsActive == true);
            if (existing == null)
            {
                throw new Exception("Record not found.");
            }
            existing.PaymentType = orderStatusUpdateModelView.PaymentType;
            existing.PaymentStatus = orderStatusUpdateModelView.PaymentStatus;
            existing.Status = orderStatusUpdateModelView.Status;
            existing.Remark = orderStatusUpdateModelView.Remark;
            existing.IsActive = true;
            existing.ModifiedDate = DateTime.Now;  // optional
            existing.ModifiedBy = orderStatusUpdateModelView.RgenId;
            await _context.SaveChangesAsync();
            return orderStatusUpdateModelView;
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
        public async Task<List<OrderItemListGetModelView>> GetOrderItem()
        {
            //return await _context.orderItemModels.Where(x => x.IsActive == true).OrderByDescending(x => x.OrderId).ToListAsync();
            var result = await (from fm in _context.foodMenuItemModels
                                join fp in _context.foodMenuItemPriceModels on fm.FoodMenuItemId equals fp.FoodMenuItemId
                                join dm in _context.dayWiseFoodMenuItemModels on fm.FoodMenuItemId equals dm.FoodMenuItemId
                                where fm.IsActive && fp.IsActive && dm.IsActive
                                orderby fp.FoodMenuItemPriceId descending
                                select new OrderItemListGetModelView
                                {
                                    FoodMenuItemId = fm.FoodMenuItemId,
                                    DayId = dm.DayId,
                                    ImageUrl = fm.ItemURL,
                                    ItemPrice = fp.ItemPrice,
                                    ItemName = fm.ItemName,   //getting name from foodmenuitem
                                    ItemPriceDescriptin = fp.ItemPriceDescriptin,
                                }).ToListAsync();
            return result;
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
            if (itemSaveModelView.TotalAmount <= 0)
            {
                throw new ArgumentException("Total Amount is required.", nameof(itemSaveModelView.TotalAmount));
            }

            tblOrderItem obj = new tblOrderItem
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
        public async Task<OrderItemSaveModelView> UpdateOrderItem(OrderItemSaveModelView orderItemUpdateModel)
        {
            if (orderItemUpdateModel.FoodMenuItemId <= 0)
            {
                throw new ArgumentException("Food Item is required.", nameof(orderItemUpdateModel.FoodMenuItemId));
            }
            if (orderItemUpdateModel.OrderId <= 0)
            {
                throw new ArgumentException("Order is required.", nameof(orderItemUpdateModel.OrderId));
            }
            if (orderItemUpdateModel.TotalAmount <= 0)
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


        #region Order Notification
        public async Task<List<OrderNotification>> GetOrderNotifications()
        {
            var result = await _context.orderModels.Where(x => x.Status == 0 && x.IsActive==true).OrderByDescending(x => x.OrderId)
           .Select(o => new OrderNotification
           {
             OrderId = o.OrderId,
             RgenId = o.RgenId,
             Status = 0,
            
           }).ToListAsync();
            return result;

        }

        #endregion

    }
}
