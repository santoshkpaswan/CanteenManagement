﻿using Microsoft.AspNetCore.Mvc;
using RDIASCanteenAPI.Data;
using RDIASCanteenAPI.Interface.CanteenInterface;
using RDIASCanteenAPI.Models.CanteenModel;

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
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPost("SaveFoodDay")]
        public async Task<IActionResult> SaveMasterDay([FromBody] FoodDaySaveModelView foodDaySaveModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var result = await _masterDayInterface.SaveMasterDay(foodDaySaveModel);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPut("UpdateFoodDay")]
        public async Task<IActionResult> UpdateMasterDay([FromBody] FoodDayUpdateModelView foodDayUpdateModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _masterDayInterface.UpdateMasterDay(foodDayUpdateModel);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpDelete("DeleteFoodDay/{dayId}")]
        public async Task<IActionResult> DeleteMasterDay(int dayId)
        {
            try
            {
                await _masterDayInterface.DeleteMasterDay(dayId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
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
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPost("SaveFoodMenuItem")]
        public async Task<IActionResult> SaveFoodMenuItem([FromForm] FoodMenuItemModelView menuItemModelView, IFormFile itemImageFile)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var FoodMenuItemId = await _masterDayInterface.SaveFoodMenuItem(menuItemModelView, itemImageFile);
                return Ok(new { Success = true, Message = "Saved successfully", FoodMenuItemId = FoodMenuItemId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = "An error occurred.", Detail = ex.Message });
            }
        }
        [HttpPost("UpdateFoodMenuItem")]
        public async Task<IActionResult> UpdateFoodMenuItem([FromForm] FoodMenuItemUpdateModelView menuItemUpdateModelView, IFormFile itemImageFile)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _masterDayInterface.UpdateFoodMenuItem(menuItemUpdateModelView, itemImageFile);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpDelete("DeleteFoodMenuItem/{FoodMenuItemId}")]
        public async Task<IActionResult> DeleteFoodMenuItem(int FoodMenuItemId)
        {
            try
            {
                await _masterDayInterface.DeleteFoodMenuItem(FoodMenuItemId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
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
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPost("SaveFoodMenuItemPrice")]
        public async Task<IActionResult> SaveFoodMenuItemPrice([FromBody] FoodMenuItemPriceSaveModelView menuItemPriceSaveModelView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var Objresult = await _masterDayInterface.SaveFoodMenuItemPrice(menuItemPriceSaveModelView);
                return Ok(new { Success = true, Message = "Saved successfully"});
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPut("UpdateFoodMenuItemPrice")]
        public async Task<IActionResult> UpdateFoodMenuItemPrice([FromBody] FoodMenuItemPriceUpdateModelView menuItemPriceUpdateModelView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _masterDayInterface.UpdateFoodMenuItemPrice(menuItemPriceUpdateModelView);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpDelete("DeleteFoodMenuItemPrice/{FoodMenuItemPriceId}")]
        public async Task<IActionResult> DeleteFoodMenuItemPrice(int FoodMenuItemPriceId)
        {
            try
            {
                await _masterDayInterface.DeleteFoodMenuItemPrice(FoodMenuItemPriceId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
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
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPost("SaveDayWiseFoodMenuItem")]
        public async Task<IActionResult> SaveDayWiseFoodMenuItem([FromBody] DayWiseFoodMenuItemSaveModelView dayWiseFoodMenuItemSaveModelView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var Objresult = await _masterDayInterface.SaveDayWiseFoodMenuItem(dayWiseFoodMenuItemSaveModelView);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPut("UpdateDayWiseFoodMenuItem")]
        public async Task<IActionResult> UpdateDayWiseFoodMenuItem([FromBody] DayWiseFoodMenuItemUpdateModelView wiseFoodMenuItemUpdateModelView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _masterDayInterface.UpdateDayWiseFoodMenuItem(wiseFoodMenuItemUpdateModelView);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpDelete("DeleteDayWiseFoodMenuItem/{DayWiseFoodMenuItemId}")]
        public async Task<IActionResult> DeleteDayWiseFoodMenuItem(int DayWiseFoodMenuItemId)
        {
            try
            {
                await _masterDayInterface.DeleteDayWiseFoodMenuItem(DayWiseFoodMenuItemId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        #endregion

        #region Order
        [HttpGet("ListOrder")]
        public async Task<IActionResult> GetOrder()
        {
            try
            {
                var Objlist = await _masterDayInterface.GetOrder();
                return Ok(new { Success = true, Data = Objlist });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPost("SaveOrder")]
        public async Task<IActionResult> SaveOrder([FromBody] OrderSaveModelView orderSaveModelView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var Objresult = await _masterDayInterface.SaveOrder(orderSaveModelView);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }

        [HttpPut("UpdateOrder")]
        public async Task<IActionResult> UpdateOrder([FromBody] OrderUpdateModelView orderUpdateModelView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _masterDayInterface.UpdateOrder(orderUpdateModelView);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpDelete("DeleteOrder/{OrderNumber}")]
        public async Task<IActionResult> DeleteOrder(string OrderNumber)
        {
            try
            {
                await _masterDayInterface.DeleteOrder(OrderNumber);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
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
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
        }
        [HttpPost("SaveOrderItem")]
        public async Task<IActionResult> SaveOrderItem([FromBody] OrderItemSaveModelView itemSaveModelView)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var Objresult = await _masterDayInterface.SaveOrderItem(itemSaveModelView);
                return Ok(new { Success = true, Message = "Saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }

        [HttpPut("UpdateOrderItem")]
        public async Task<IActionResult> UpdateOrderItem([FromBody] OrderItemUpdateModelView orderItemUpdateModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _masterDayInterface.UpdateOrderItem(orderItemUpdateModel);
                return Ok(new { Success = true, Message = "Updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        [HttpDelete("DeleteOrderItem/{OrderItemId}")]
        public async Task<IActionResult> DeleteOrderItem(int OrderItemId)
        {
            try
            {
                await _masterDayInterface.DeleteOrderItem(OrderItemId);
                return Ok(new { Success = true, Message = "Delete successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Detail = ex.Message });
            }
        }
        #endregion

    }
}

