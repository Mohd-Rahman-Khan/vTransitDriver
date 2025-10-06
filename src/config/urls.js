// Prod  ===>
//export const API_BASE_URL = "https://api.etravelmate.com";

export const API_BASE_URL = "http://10.6.1.77:9000";

export const getApiUrl = (endpoint) => API_BASE_URL + endpoint;
// *************** Auth Apis *****************
export const LOGIN = getApiUrl("/userauth/authenticateUser");
export const OTP = getApiUrl("/userauth/verifyLoginOtp");
export const GET_DRIVER_DATA_By_Id = getApiUrl("/user-reg/driver-reg/");
export const UPDATE_DRIVER_DATA = getApiUrl("/user-reg/driver-reg");
export const VERIFY_DRIVER_DATA = getApiUrl("/user-reg/driver-change");
export const DOWNLOAD_DOC = getApiUrl("/user-reg/download-file");
export const DELETE_DRIVER_ACCOUNT = getApiUrl(
  "/user-reg/driver-reg/deactivatedriver/"
);
export const VERIFY_EMAIL_ADDRESS = getApiUrl(
  "/usernotify/email/sendmailForMobile/"
);
export const VERIFY_MOBILE_NUMBER = getApiUrl(
  "/usernotify/notification/singleSmsSent/"
);
export const GET_CHANGE_REQUEST = getApiUrl("/user-reg/driver-change/");
export const LOGOUT = getApiUrl("/userauth/logOut/");
export const CHECK_DEVICE = getApiUrl("/usernotify/notify/findByMobileNo");
export const VERIFY_ACCOUNT = getApiUrl("/userauth/user-account");
export const SAVE_DEVICE_DETAIL = getApiUrl(
  "/user-reg/employee-reg/saveLoginDetails"
);

// *************** Driver Ride Apis *****************
export const DRIVER_NEXT_RIDE = getApiUrl(
  "/user-reg/trip-driver/driver-trip-assign/pending"
);
export const DRIVER_SCHEDULED_RIDE = getApiUrl(
  "/user-reg/trip-driver/driver-trips/scheduled"
);
export const DRIVER_SELF_CONSENT = getApiUrl(
  "/user-reg/trip-driver/save-driverself-content"
);
export const UPDATE_DRIVER_TRIP_STATUS = getApiUrl(
  "/user-reg/trip-driver/update-driver-trips-status"
);
export const DRIVER_ONGOING_RIDE = getApiUrl(
  "/user-reg/trip-driver/driver-trips/ongoing"
);
export const DRIVER_COMPLETE_RIDE = getApiUrl(
  "/user-reg/trip-driver/update-deboard-stop-status"
);
export const UPDATE_ONBOOARD_STATUS = getApiUrl(
  "/user-reg/trip-driver/update-onboardstatus"
);
export const UPDATE_ARRIVED_STATUS = getApiUrl(
  "/user-reg/trip-driver/update-arrived-stop-status"
);

export const NEAR_TO_STOP_POINT_API = getApiUrl(
  "/user-reg/trip-driver/approaching-stop-notification"
);
export const EMPLOYEE_RATING = getApiUrl(
  "/user-reg/trip-driver/employee-rating"
);
export const GET_PAST_RIDE = getApiUrl(
  "/user-reg/trip-driver/driver-trips/completed"
);
export const DOC_URL = getApiUrl("/user-reg/download-file/img-file?fileurl=");
export const GET_RIDE_BY_ID = getApiUrl("/user-reg/trip-driver/trip");
export const SAVE_SNAPSHOT = getApiUrl(
  "/user-reg/trip-route/save-file-passenger/"
);
export const SUBMIT_SNAPSHOT = getApiUrl(
  "/user-reg/trip-driver/update-snapshot/"
);
export const MARK_EMP_AS_ABSENT = getApiUrl(
  "/user-reg/trip-route/update-passenger-status"
);
export const CALLING_API = getApiUrl("/api/dashboard/ivr/ivrPrmConnectInitate");
export const ADD_DIRECTION = getApiUrl("/api/dashboard/rtd/addTripDirection");
export const UPDATE_DYNAMIC_ETA = getApiUrl(
  "/user-reg/trip-driver/update-stop-dynamic-eta"
);
export const STOPPAGE_HISTORY = getApiUrl(
  "/user-reg/trip-driver/stoppage-history"
);
export const SAVE_TRIP_LAT_LONG = getApiUrl(
  "/user-reg/trip-route/saveTripLatLongData"
);
export const GET_CONSENT_LIST = getApiUrl(
  "/user-reg/trip-driver/get-all-driver-consent"
);

// *************** Sos Apis *****************
export const SOS_SETTING = getApiUrl("/user-reg/sos-setting/getall");
export const SEND_SOS = getApiUrl(
  "/user-reg/trip-route/update-sso-details-driver"
);

// *************** Vehicle Details Apis *****************
export const GET_DRIVER_VEHICLE_NUMBER = getApiUrl(
  "/user-reg/vehicle-driver-mapping"
);
export const GET_VEHICLE_DEETAIL = getApiUrl("/user-reg/vehicle-reg/");

// *************** Privacy Policy Apis *****************
export const TERMS_OF_USE = "https://etravelmate.com/disclaimer/";
export const PRIVACY_POLICY = "https://etravelmate.com/privacy-policy/";

// *************** Support *****************
export const GET_HELP_TOPICS = getApiUrl(
  "/user-reg/helpmaster/getAll?page=0&size=100&topicName=null&type=DRIVER"
);
export const GET_SUBTOPIC_BY_HELPTOPIC_ID = getApiUrl(
  "/user-reg/subtopiccontroller/"
);
export const GET_FAQ_BY_SUBTOPIC_ID = getApiUrl("/user-reg/faqcontroller/");
export const RAISE_COMPLAINTS = getApiUrl(
  "/user-reg/ticket/save-ticket-driver"
);
export const REOPEN_YOUR_TICKET = getApiUrl("/user-reg/ticket/reopen-ticket");
export const SUPPORT_FILE_UPLOAD = getApiUrl("/user-reg/ticket/save-file");
export const GET_YOUR_TICKETS = getApiUrl(
  "/user-reg/ticket/getTicketByDriverId"
);
export const VENDOR_DETAIL = getApiUrl("/user-reg/vendor-reg");
export const CORP_ADMIN_DETAIL = getApiUrl("/user-reg/corporate-reg");

// *************** Compliance *****************
export const GET_ALL_COMPLIOANCE = getApiUrl(
  "/user-reg/compliance-topic/getAllByCorporateIdForMobileApp/DRIVER"
);
export const GET_VEHICLE_COMPLIOANCE = getApiUrl(
  "/user-reg/compliance-topic/getAllByCorporateIdForMobileApp/VEHICLE"
);
export const CREATE_DRIVER_COMPLIANCE = getApiUrl(
  "/user-reg/compliance-topic/save-compliance-topic-request"
);
export const CREATE_VEHICLE_COMPLIANCE = getApiUrl(
  "/user-reg/compliance-topic/save-compliance-topic-vehicle-request"
);
export const UPLOAD_COMPLIANCE_FILE = getApiUrl(
  "/user-reg/compliance/save-file"
);

// *************** Notifications *****************
export const GET_NOTIFICATION = getApiUrl(
  "/usernotify/notify/getAllNotification/"
);

// *************** Rating And Overview *****************
export const GET_RATING_OVERVIEW = getApiUrl(
  "/user-reg/trip-driver/driver-feedback/"
);

// *************** States Apis *****************
export const STATIC_DATA_API = getApiUrl(
  "/user-reg/trip-driver/get-driver-statistics"
);

// *************** Toll Tax And Parking *****************
export const ADD_TOLLTAX_AND_PARKING = getApiUrl(
  "/user-reg/trip-route/saveTolltax"
);
export const GET_TOLLTAX_AND_PARKING = getApiUrl(
  "/user-reg/trip-route/getDriverToll"
);
export const SAVE_TOLLTAX_PARKING_FILE = getApiUrl(
  "/user-reg/trip-route/save-Trip-TollParking"
);

// *************** Training *****************
export const TRAINING_VIDEOS_DRIVER = getApiUrl(
  "/user-reg//trainingVideos/getModulesWiseListByStakeHolder/DRIVER/MOBILE"
);
export const USER_GUIDE_DRIVER = getApiUrl(
  "/user-reg/userGuide/getModulesWiseListByStakeHolder/DRIVER/MOBILE"
);

// *************** Fuel Tracking *****************
export const Add_FUEL = getApiUrl(
  "/user-reg/fuelTracking/saveFuelTrackingRequest"
);
export const GET_FUEL_LIST = getApiUrl(
  "/user-reg/fuelTracking/getAllByDriverId"
);
export const SAVE_FUEL_FILE = getApiUrl("/user-reg/fuelTracking/save-file");

// *************** App Settings *****************
export const DRIVER_APP_SETTING = getApiUrl(
  "/user-reg/driver-setting/get-driverSetting-by-corpoarteId"
);
export const MODULE_PERMISSION = getApiUrl(
  "/user-reg/user-permission/get-all-user-permission-by-corpId"
);

// *************** App Theme *****************
export const THEME_COLOR = getApiUrl("/user-reg/tenant-reg/");

// *************** Driver Attendence *****************
export const DRIVER_ATTENDENCE = getApiUrl(
  "/user-reg/driver-reg/save-driver-attendance"
);
export const GET_DRIVER_ATTENDENCE = getApiUrl(
  "/user-reg/driver-reg/get-driver-attendance"
);

export const ASSOCIATE_CORPORATE_AND_VENDOR = getApiUrl(
  "/user-reg/associateDriver/getAssociationDetailsByDriverId"
);

export const FILTER_RIDE_API = getApiUrl(
  "/user-reg/trip-route/getAllTripsByCorporateAndVendor"
);

export const FILTERED_RIDE = getApiUrl(
  "/user-reg/trip-driver/get-driver-ride-api"
);

// export const OVER_SPEEDING = getApiUrl("/user-reg/public/speed-limit-crossed");

export const OVER_SPEEDING = getApiUrl(
  "/user-reg/trip-driver/speed-limit-crossed"
);

export const CHANGE_CORPORATE = getApiUrl(
  "/user-reg/driver-reg/changeCorporate"
);

export const ADD_POLYLINE_DATA = getApiUrl(
  "/user-reg/trip-route/saveDriverTripPolyline?"
);

export const UPDATE_ACTUAL_DISTANCE = getApiUrl(
  "/user-reg/trip-driver/update-trip-distance?"
);

export const ROUTING_RULE = getApiUrl(
  "/user-reg/routing-rule/get-by-corporate-id"
);

export const TRAVEL_TIME_VOILATION = getApiUrl(
  "/user-reg/trip-driver/driver-travel-time-violation"
);
