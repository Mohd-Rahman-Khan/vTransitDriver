import validator from "is_js";

const checkEmpty = (val, key) => {
  if (validator.empty(val.trim())) {
    return `Please enter ${key}`;
    // alert(`Please enter ${key}`)
  } else {
    return "";
  }
};

const checkMinLength = (val, minLength, key) => {
  if (val.trim().length < minLength) {
    return `minimum 3 characters required for ${key}`;
    // alert(`minimum 3 characters required for ${key}`)
  } else {
    return "";
  }
};

export default function (data) {
  let error = "";
  const {
    firstName,
    lastName,
    email,
    mobileNo,
    emailMobile,
    password,
    confirmPassword,
    alternateNo,
    emergencyContactNo,
  } = data;

  if (firstName !== undefined) {
    let emptyValidationText = checkEmpty(firstName, "first name");

    if (emptyValidationText !== "") {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(firstName, 3, "first name");

      if (minLengthValidation !== "") {
        return minLengthValidation;
      }
    }
  }

  if (lastName !== undefined) {
    let emptyValidationText = checkEmpty(lastName, "last name");
    if (emptyValidationText !== "") {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(lastName, 3, "Last name");
      if (minLengthValidation !== "") {
        return minLengthValidation;
      }
    }
  }

  if (email !== undefined) {
    let emptyValidationText = checkEmpty(email, "email");
    if (emptyValidationText !== "") {
      return emptyValidationText;
    } else {
      if (!validator.email(email)) {
        return "Please enter valid email";
      }
    }
  }

  if (emailMobile !== undefined) {
    let emptyValidationText = checkEmpty(emailMobile, "Email or mobile");
    if (emptyValidationText !== "") {
      return emptyValidationText;
    }
    if (!/^[0][1-9]$|^[1-9]\d{8,9}$/.test(emailMobile)) {
      if (!validator.email(emailMobile)) {
        return "Please enter valid email or mobile";
      }
    }
  }
  if (mobileNo !== undefined) {
    let emptyValidationText = checkEmpty(mobileNo, "phone number");
    if (emptyValidationText !== "") {
      return emptyValidationText;
    }
    if (!/^[0][1-9]$|^[1-9]\d{8,12}$/.test(mobileNo)) {
      return "Please enter valid mobile number";
    }
  }

  if (alternateNo !== undefined) {
    let emptyValidationText = checkEmpty(
      alternateNo,
      "alternate contact number"
    );
    if (emptyValidationText !== "") {
      return emptyValidationText;
    }
    if (!/^[0][1-9]$|^[1-9]\d{9}$/.test(alternateNo)) {
      return "Please enter valid alternate mobile number";
    }
  }

  if (emergencyContactNo !== undefined) {
    let emptyValidationText = checkEmpty(
      emergencyContactNo,
      "emergency contact number"
    );
    if (emptyValidationText !== "") {
      return emptyValidationText;
    }
    if (!/^[0][1-9]$|^[1-9]\d{9}$/.test(emergencyContactNo)) {
      return "Please enter valid emergency mobile number";
    }
  }

  if (password !== undefined) {
    let emptyValidationText = checkEmpty(password, "password");
    if (emptyValidationText !== "") {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(password, 6, "password");
      if (minLengthValidation !== "") {
        if (confirmPassword != undefined) {
          return "Password requires minimum 6 characters";
        }
        return "Password is incorrect";
      }
    }
  }
  if (confirmPassword !== undefined) {
    let emptyValidationText = checkEmpty(confirmPassword, "confirmPassword");
    if (emptyValidationText !== "") {
      return emptyValidationText;
    }
    if (confirmPassword != password) {
      return "Password and Confirm Password didn't matched";
    }
  }
}
