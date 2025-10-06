import * as welcome from "./welcome";
import * as auth from "./auth";
import * as profileData from "./profileData";
import * as ride from "./ride";
import * as compliance from "./compliance";
import * as ratingAndReview from "./ratingAndReview";
import * as driverStatics from "./driverStatics";
import * as toolTaxAndParking from "./toolTaxAndParking";
import * as supports from "./supports";
import * as training from "./training";
import * as fuelTracking from "./fuelTracking";
import * as driverAppSettings from "./driverAppSettings";
import * as modulePermission from "./modulePermission";
import * as closeDrawer from "./closeDrawer";

export default {
  ...auth,
  ...welcome,
  ...profileData,
  ...ride,
  ...compliance,
  ...ratingAndReview,
  ...driverStatics,
  ...toolTaxAndParking,
  ...supports,
  ...training,
  ...fuelTracking,
  ...driverAppSettings,
  ...modulePermission,
  ...closeDrawer,
};
