using Microsoft.AspNetCore.Mvc;
using RDIASCanteenAPI.Data;
using RDIASCanteenAPI.Interface.CanteenInterface;
using RDIASCanteenAPI.Models.CanteenModel;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace RDIASCanteenAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CanteenController : ControllerBase
    {
        private readonly MasterDayInterface _masterDayInterface;

        // Constructor must be public for DI to work
        public CanteenController(MasterDayInterface masterDayInterface)
        {
            _masterDayInterface = masterDayInterface;
        }
        #region master Day Food 
        [HttpGet("ListFoodDay")]
        public IActionResult GetAllMasterDays()
        {
            try
            {
                var list = _masterDayInterface.GetAllMasterDays();
                return Ok(new { Success = true, Data = list });

            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("SaveFoodDay")]
        public async Task<IActionResult> SaveMasterDay([FromBody] FoodDaySaveModelView foodDaySaveModel)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });
            try
            {
                var result = await _masterDayInterface.SaveMasterDay(foodDaySaveModel);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("UpdateFoodDay")]
        public async Task<IActionResult> UpdateMasterDay([FromBody] FoodDayUpdateModelView foodDayUpdateModel)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.UpdateMasterDay(foodDayUpdateModel);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("DeleteFoodDay/{dayId}")]
        public async Task<IActionResult> DeleteMasterDay(int dayId)
        {
            try
            {
                await _masterDayInterface.DeleteMasterDay(dayId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        #endregion

        #region Food Menu Item  
        [HttpGet("ListFoodMenuItem")]
        public async Task<IActionResult> GetFoodMenuItem()
        {
            try
            {
                var list = await _masterDayInterface.GetFoodMenuItem();
                return Ok(new { Success = true, Data = list });

            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("SaveFoodMenuItem")]
        public async Task<IActionResult> SaveFoodMenuItem([FromForm] FoodMenuItemModelView menuItemModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var FoodMenuItemId = await _masterDayInterface.SaveFoodMenuItem(menuItemModelView);
                return Ok(new { Success = true, Message = "Saved successfully", FoodMenuItemId = 0 });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("UpdateFoodMenuItem")]
        public async Task<IActionResult> UpdateFoodMenuItem([FromForm] FoodMenuItemUpdateModelView menuItemUpdateModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.UpdateFoodMenuItem(menuItemUpdateModelView);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("DeleteFoodMenuItem/{FoodMenuItemId}")]
        public async Task<IActionResult> DeleteFoodMenuItem(int FoodMenuItemId)
        {
            try
            {
                await _masterDayInterface.DeleteFoodMenuItem(FoodMenuItemId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        #endregion

        #region Food Menu Item Price

        [HttpGet("ListFoodMenuItemPrice")]
        public async Task<IActionResult> GetFoodMenuItemPrice()
        {
            try
            {
                var Objlist = await _masterDayInterface.GetFoodMenuItemPrice();
                return Ok(new { Success = true, Data = Objlist });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("SaveFoodMenuItemPrice")]
        public async Task<IActionResult> SaveFoodMenuItemPrice([FromBody] FoodMenuItemPriceSaveModelView menuItemPriceSaveModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var Objresult = await _masterDayInterface.SaveFoodMenuItemPrice(menuItemPriceSaveModelView);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("UpdateFoodMenuItemPrice")]
        public async Task<IActionResult> UpdateFoodMenuItemPrice([FromBody] FoodMenuItemPriceUpdateModelView menuItemPriceUpdateModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.UpdateFoodMenuItemPrice(menuItemPriceUpdateModelView);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("DeleteFoodMenuItemPrice/{FoodMenuItemPriceId}")]
        public async Task<IActionResult> DeleteFoodMenuItemPrice(int FoodMenuItemPriceId)
        {
            try
            {
                await _masterDayInterface.DeleteFoodMenuItemPrice(FoodMenuItemPriceId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        #endregion

        #region Day Wise Food Menu Item
        [HttpGet("ListDayWiseFoodMenuItem")]
        public async Task<IActionResult> GetDayWiseFoodMenuItem()
        {
            try
            {
                var Objlist = await _masterDayInterface.GetDayWiseFoodMenuItem();
                return Ok(new { Success = true, Data = Objlist });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("SaveDayWiseFoodMenuItem")]
        public async Task<IActionResult> SaveDayWiseFoodMenuItem([FromBody] DayWiseFoodMenuItemSaveModelView dayWiseFoodMenuItemSaveModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var Objresult = await _masterDayInterface.SaveDayWiseFoodMenuItem(dayWiseFoodMenuItemSaveModelView);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("UpdateDayWiseFoodMenuItem")]
        public async Task<IActionResult> UpdateDayWiseFoodMenuItem([FromBody] DayWiseFoodMenuItemUpdateModelView wiseFoodMenuItemUpdateModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.UpdateDayWiseFoodMenuItem(wiseFoodMenuItemUpdateModelView);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("DeleteDayWiseFoodMenuItem/{DayWiseFoodMenuItemId}")]
        public async Task<IActionResult> DeleteDayWiseFoodMenuItem(int DayWiseFoodMenuItemId)
        {
            try
            {
                await _masterDayInterface.DeleteDayWiseFoodMenuItem(DayWiseFoodMenuItemId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        #endregion

        #region Order
        [HttpGet("ListOrder")]
        public async Task<IActionResult> GetOrder(int rgenId, bool isAdmin)
        {
            try
            {
                var Objlist = await _masterDayInterface.GetOrder(rgenId, isAdmin);
                return Ok(new { Success = true, Data = Objlist });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        [HttpGet("GetOrderItemDetails/{orderId}")]
        public async Task<IActionResult> GetOrderItemDetails(int orderId)
        {
            try
            {
                var Objitemlist = await _masterDayInterface.GetOrderItemDetails(orderId);
                return Ok(new { Success = true, Data = Objitemlist });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("SaveOrder")]
        public async Task<IActionResult> SaveOrder([FromBody] OrderSaveModelView orderSaveModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var Objresult = await _masterDayInterface.SaveOrder(orderSaveModelView);
                return Ok(new { Success = true, Message = $"Saved successfully (Order No: {Objresult.OrderNumber})" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("UpdateOrder")]
        public async Task<IActionResult> UpdateOrder([FromBody] OrderUpdateModelView orderUpdateModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.UpdateOrder(orderUpdateModelView);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("UpdateOrderStatus")]
        public async Task<IActionResult> UpdateOrderStatus([FromBody] OrderStatusUpdateModelView orderStatusUpdateModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.UpdateOrderStatus(orderStatusUpdateModelView);
                return Ok(new { Success = true, Message = "Order Status Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("DeleteOrder/{OrderNumber}")]
        public async Task<IActionResult> DeleteOrder(string OrderNumber)
        {
            try
            {
                await _masterDayInterface.DeleteOrder(OrderNumber);
                return Ok(new { Success = true, Message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        #endregion

        #region Order Item 
        [HttpGet("ListOrderItem")]
        public async Task<IActionResult> GetOrderItem()
        {
            try
            {
                var objList = await _masterDayInterface.GetOrderItem();
                return Ok(new { Success = true, Data = objList });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("SaveOrderItem")]
        public async Task<IActionResult> SaveOrderItem([FromBody] OrderItemSaveModelView itemSaveModelView)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var Objresult = await _masterDayInterface.SaveOrderItem(itemSaveModelView);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("UpdateOrderItem")]
        public async Task<IActionResult> UpdateOrderItem([FromBody] OrderItemSaveModelView orderItemUpdateModel)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.UpdateOrderItem(orderItemUpdateModel);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        [HttpPost("DeleteOrderItem/{OrderItemId}")]
        public async Task<IActionResult> DeleteOrderItem(int OrderItemId)
        {
            try
            {
                await _masterDayInterface.DeleteOrderItem(OrderItemId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }
        #endregion

        #region Order Notification
        [HttpGet("Notifications")]
        public async Task<IActionResult> GetOrderNotifications()
        {
            try
            {
                var Objlist = await _masterDayInterface.GetOrderNotifications();
                return Ok(new { Success = true, Data = Objlist });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        #endregion

        #region  User Login API

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (!ModelState.IsValid)
            {
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });
            }
            UserModel objUser = new UserModel();
            try
            {
                //.Trim().ToLower()
                if (model.Username.Trim().ToLower() == "admin")
                {
                    objUser = await _masterDayInterface.GetLogin(model.Username, model.Password);

                    if (objUser == null)
                    {
                        return Ok(new { Success = false, Message = "Invalid username or password." });
                    }
                    return Ok(new { Success = true, objUser.account_id, objUser.account_type, account_type_name = model.Username });
                }
                else
                {
                    var client = new HttpClient();
                    var request = new HttpRequestMessage(HttpMethod.Post, "http://eshaala.rdias.ac.in:89/API/Account/Autentication?APIKey=651cb656-1fde-478d-badf-33f60553f36e");
                    var content = new StringContent("{\r\n    \"user_name\":\"" + model.Username + "\",\r\n    \"password\":\"" + model.Password + "\"\r\n}", null, "application/json");
                    request.Content = content;
                    var response = await client.SendAsync(request);
                    response.EnsureSuccessStatusCode();

                    string json = await response.Content.ReadAsStringAsync();

                    // Convert to C# object
                    objUser = JsonSerializer.Deserialize<UserModel>(json);fdgs
                    if (objUser.response_id == 1)
                        return Ok(new { Success = true, objUser.account_id, objUser.account_type_name, objUser.account_type });
                    else
                        return Ok(new { Success = false, objUser.account_id, objUser.account_type_name, objUser.account_type, Message = response });


                }
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        #endregion

        #region Payment QR Transtion 
        [HttpPost("PaymentQRTranstion")]
        public async Task<IActionResult> PaymentQRTranstion([FromBody] PaymentQRTranstion paymentQRTranstion)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Message = "Validation failed", Errors = ModelState });

            try
            {
                var result = await _masterDayInterface.PaymentQRTranstion(paymentQRTranstion);
                return Ok(new { Success = true, Message = "Save TranstionId successfully" });
            }
            catch (ArgumentException ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { Success = false, Message = ex.Message });
            }
        }

        #endregion

    }
}

