using RDIASCanteenAPI.Data;
using RDIASCanteenAPI.Models.CanteenModel;

namespace RDIASCanteenAPI.Interface.CanteenInterface
{
    public interface MasterDayInterface
    {
        #region Master Day
        List<MasterDaysModel> GetAllMasterDays();
        Task<FoodDaySaveModelView> SaveMasterDay(FoodDaySaveModelView foodDaySaveModel);
        Task<FoodDayUpdateModelView> UpdateMasterDay(FoodDayUpdateModelView foodDayUpdateModel);
        Task DeleteMasterDay(int dayId);
        #endregion

        #region Food Memu Item
        Task<List<FoodMenuItemModel>> GetFoodMenuItem();
        Task<int> SaveFoodMenuItem(FoodMenuItemModelView menuItemModelView);
        Task<FoodMenuItemUpdateModelView> UpdateFoodMenuItem(FoodMenuItemUpdateModelView menuItemUpdateModelView);
        Task DeleteFoodMenuItem(int FoodMenuItemId);
        #endregion

        #region Food Menu Item Price
        Task<List<FoodMenuItemGetModelView>> GetFoodMenuItemPrice();
        Task<FoodMenuItemPriceSaveModelView> SaveFoodMenuItemPrice(FoodMenuItemPriceSaveModelView menuItemPriceSaveModelView);
        Task<FoodMenuItemPriceUpdateModelView> UpdateFoodMenuItemPrice(FoodMenuItemPriceUpdateModelView menuItemPriceUpdateModelView);
        Task DeleteFoodMenuItemPrice(int FoodMenuItemPriceId);
        #endregion

        #region Day Wise Food Menu Item
        Task<List<FoodDayGetModelView>> GetDayWiseFoodMenuItem();
        Task<DayWiseFoodMenuItemSaveModelView> SaveDayWiseFoodMenuItem(DayWiseFoodMenuItemSaveModelView dayWiseFoodMenuItemSaveModelView);
        Task<DayWiseFoodMenuItemUpdateModelView> UpdateDayWiseFoodMenuItem(DayWiseFoodMenuItemUpdateModelView wiseFoodMenuItemUpdateModelView);
        Task DeleteDayWiseFoodMenuItem(int DayWiseFoodMenuItemId);
        #endregion

        #region Order
        Task<List<OrderListGetModelView>> GetOrder();
        Task<OrderSaveModelView> SaveOrder(OrderSaveModelView orderSaveModelView);
        Task<OrderUpdateModelView> UpdateOrder(OrderUpdateModelView orderUpdateModelView);
        Task DeleteOrder(string OrderNumber);
        #endregion

        #region order Item
        Task<List<OrderItemModel>> GetOrderItem();
        Task<OrderItemSaveModelView> SaveOrderItem(OrderItemSaveModelView itemSaveModelView);
        Task<OrderItemUpdateModelView> UpdateOrderItem(OrderItemUpdateModelView orderItemUpdateModel);
        Task DeleteOrderItem(int OrderItemId);
        #endregion
    }
}
