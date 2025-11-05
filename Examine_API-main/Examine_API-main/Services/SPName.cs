

namespace TodoApi2
{
  public class SPName
  {
    //Menu
    public readonly static string prc_sp_query_DailyReservation3 = "[dbo].[prc_sp_query_DailyReservation3]";      //查詢


    public readonly static string prc_sp_query_ReservationForAestheticMedicine = "[dbo].[prc_sp_query_ReservationForAestheticMedicine]";      //查詢


    //問卷登錄
    public readonly static string prc_sp_query_QuestionLogin = "[dbo].[prc_sp_query_QuestionLogin2]";      //查詢


    //掃描更新
    public readonly static string prc_sp_Update_PreCheck = "[dbo].[prc_sp_Update_PreCheck]";      //掃描更新

    //無紙化查詢
    public readonly static string prc_sp_query_Nopaper = "[dbo].[prc_sp_query_Nopaper]";      //查詢
    public readonly static string prc_sp_Update_Nopaper = "[dbo].[prc_sp_Update_Nopaper]";      //更新

    //會議室預約
    public readonly static string prc_sp_query_RoomBooking = "[dbo].[prc_sp_query_RoomBooking]";      //更新
    public readonly static string prc_sp_Update_RoomBooking = "[dbo].[prc_sp_Update_RoomBooking]";      //更新

    //可預約時段查詢
    public readonly static string prc_sp_query_WeeklyReservationSummation = "[dbo].[prc_sp_query_WeeklyReservationSummation]";      //查詢


    /// <summary>
    /// Medirep自動夾圖
    /// </summary>
    //
    public readonly static string prc_sp_query_custome = "[dbo].[prc_sp_query_custome]";      //查詢
    public readonly static string prc_sp_Update_queryCustome_pic = "[dbo].[prc_sp_Update_queryCustome_pic]";      //更新該人的圖片檔
    public readonly static string prc_sp_query_customeByID = "[dbo].[prc_sp_query_customeByID]";      //查詢該人的圖片string
    public readonly static string prc_sp_query_categories = "[dbo].[prc_sp_query_categories]";      //查詢檢驗項目代碼名稱
    public readonly static string prc_sp_query_gauge_data = "[dbo].[prc_sp_query_gauge_data]";      //查詢有做的檢驗項目

    public readonly static string prc_sp_query_lab_data = "[dbo].[prc_sp_query_lab_data]";      //查詢有做的檢驗項目
    public readonly static string prc_sp_query_full_data = "[dbo].[prc_sp_query_full_data]";      //查詢有做的檢驗項目

    public readonly static string prc_sp_query_custome_Admin = "[dbo].[prc_sp_query_custome_Admin]";      //查詢清單
    public readonly static string prc_sp_query_select_date = "[dbo].[prc_sp_query_select_date]";      //查詢清單(日期查詢)
    public readonly static string prc_sp_query_purchase = "[dbo].[prc_sp_query_purchase]";   //請購未轉採購
    public readonly static string sp_StomachCheck = "[dbo].[sp_StomachCheck]"; //項目查詢
    public readonly static string prc_sp_query_ProjectChanges = "[dbo].[prc_sp_query_ProjectChanges]"; //項目新刪查詢
    public readonly static string sp_Dr_GeneralComments = "[dbo].[sp_Dr_GeneralComments]"; //醫師問診查詢


    //專案查詢與勞檢套表更新66
    public readonly static string prc_sp_query_CheckProject = "[dbo].[prc_sp_query_CheckProject]";      //查詢
    public readonly static string prc_sp_query_CheckProject_Live = "[dbo].[prc_sp_query_CheckProject_Live]";      //查詢
    public readonly static string prc_sp_Update_ProjectScheme66 = "[dbo].[prc_sp_Update_ProjectScheme66]";//更新


    //勞檢表基礎個人資料
    public readonly static string prc_sp_query_LabourChecklist = "[dbo].[prc_sp_query_LabourChecklist]";//查詢


    //CheckProjectScheme
    public readonly static string prc_sp_query_CheckProjectScheme = "[dbo].[prc_sp_query_CheckProjectScheme]";//查詢
                                                                                                              //CheckItem
    public readonly static string prc_sp_query_CheckItem = "[dbo].[prc_sp_query_CheckItem]";//查詢

    //PersonItem
    public readonly static string prc_sp_query_CheckProjectPersonItem = "[dbo].[prc_sp_query_CheckProjectPersonItem]";//查詢

    //NameList
    public readonly static string prc_sp_query_PersonCustomer = "[dbo].[prc_sp_query_PersonCustomer]";//查詢


    //NameList

    public readonly static string prc_sp_query_MedicalRecords = "[dbo].[prc_sp_query_MedicalRecords2]";//查詢


    //ERP總務單據
    public readonly static string prc_sp_query_repair = "[dbo].[prc_sp_query_repair]";//請修單查詢

    public readonly static string prc_sp_query_repairorder = "[dbo].[prc_sp_query_repairorder]";//維修單查詢


    public readonly static string prc_sp_Quotation = "[dbo].[prc_sp_Quotation]";//報價單查詢

    public readonly static string prc_sp_query_Pickinglist = "[dbo].[prc_sp_query_Pickinglist]";//領料單查詢

    public readonly static string sp_query_Pickinglist = "[dbo].[sp_query_Pickinglist]";//領料單查詢

    public readonly static string prc_sp_query_Receivingnote = "[dbo].[prc_sp_query_Receivingnote]";//收貨單查詢
    public readonly static string prc_sp_query_Source = "[dbo].[prc_sp_query_Source]";//請購未轉採購查詢

    //HR相關
    public readonly static string sp_Attendance_mr = "[dbo].[sp_Attendance_mr]";//考勤月報表查詢

    //登入相關
    public readonly static string prc_gb_sso_logintest = "[dbo].[prc_gb_sso_logintest]";//後台登入

    //登入相關
    public readonly static string sp_LoginCheck = "[dbo].[sp_LoginCheck]";//後台登入

    public readonly static string sp_LoginReport = "[dbo].[sp_LoginReport]";//數值對照後台登入
    //病歷查詢
    public readonly static string prc_sp_query_MedicalRecords3 = "[dbo].[prc_sp_query_MedicalRecords3]";//病歷
    //健檢師專案查詢
    public readonly static string prc_sp_query_consultdate = "[dbo].[prc_sp_query_consultdate]";//專案查詢
    //勾選紀錄
    public readonly static string prc_sp_query_MedCheck = "[dbo].[prc_sp_query_MedCheck]";//勾選紀錄
                                                                                          //腸胃鏡室查詢
    public readonly static string prc_sp_query_ogd_sum = "[dbo].[prc_sp_query_ogd_sum]";//腸胃鏡室查詢
    public readonly static string prc_sp_query_Purchase = "[dbo].[prc_sp_query_Purchase]";//新ERP請購未轉採購
    //問卷報表產出
    public readonly static string prc_sp_query_QuestionReportPivot = "[dbo].[prc_sp_query_QuestionReportPivot]";//問卷報表

    public readonly static string prc_sp_query_Receipt_time = "[dbo].[prc_sp_query_Receipt_time]";//收貨單簽核時間   

    public readonly static string prc_gb_wh_stock_query_sch_group = "[dbo].[prc_gb_wh_stock_query_sch_group]";//庫存報表查詢

    public readonly static string prc_sp_query_AnnualReport = "[dbo].[prc_sp_query_AnnualReport]";//健檢資料比對表

    public readonly static string prc_sp_query_Payable = "[dbo].[prc_sp_query_Payable]";//應付憑單查詢

    public readonly static string sp_Checklogin = "[dbo].[sp_Checklogin]";//採購權限登入

    public readonly static string sp_Customer_Complaint = "[dbo].[sp_Customer_Complaint]";//客訴表單查詢
        






    }
}