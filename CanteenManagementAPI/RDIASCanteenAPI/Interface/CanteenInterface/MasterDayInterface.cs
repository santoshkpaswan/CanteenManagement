using RDIASCanteenAPI.Data;
using RDIASCanteenAPI.Models.CanteenModel;

namespace RDIASCanteenAPI.Interface.CanteenInterface
{
    public interface MasterDayInterface
    {
        #region Master Day
        List<tblMasterDays> GetAllMasterDays();
        Task<FoodDaySaveModelView> SaveMasterDay(FoodDaySaveModelView foodDaySaveModel);
        Task<FoodDayUpdateModelView> UpdateMasterDay(FoodDayUpdateModelView foodDayUpdateModel);
        Task DeleteMasterDay(int dayId);
        #endregion

        #region Food Memu Item
        Task<List<tblFoodMenuItem>> GetFoodMenuItem();
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
        Task<List<OrderListGetModelView>> GetOrder(int rgenId, bool isAdmin, SearchOrderAdmin? modal);
        Task<List<OrderDetailsViewModel>> GetOrderItemDetails(int orderId);
        Task<OrderSaveModelView> SaveOrder(OrderSaveModelView orderSaveModelView);
        Task<OrderUpdateModelView> UpdateOrder(OrderUpdateModelView orderUpdateModelView);
        Task<OrderStatusUpdateModelView> UpdateOrderStatus(OrderStatusUpdateModelView orderStatusUpdateModelView);
        Task DeleteOrder(int[] OrderNumber);
         Task CanceledOrder(string OrderNumber);
        #endregion

        #region order Item
        Task<List<OrderItemListGetModelView>> GetOrderItem();
        Task<OrderItemSaveModelView> SaveOrderItem(OrderItemSaveModelView itemSaveModelView);
        Task<OrderItemSaveModelView> UpdateOrderItem(OrderItemSaveModelView orderItemUpdateModel);
        Task DeleteOrderItem(int OrderItemId);
        #endregion

        #region Order Notification
        Task<List<OrderNotification>> GetOrderNotifications();

        #endregion

        #region admin User Login
        Task<UserModel> GetLogin(string username, string password);

        #endregion

        #region Payment QR Transtion
        Task<PaymentQRTranstion> PaymentQRTranstion(PaymentQRTranstion paymentQRTranstion);
        #endregion

        #region Canteen Notice
        List<tblCanteenNotice> GetAllCanteenNotice();
        Task<CanteenNoticeUpdateModelView> SaveNotice(CanteenNoticeUpdateModelView modelView);

        #endregion
    }
}
