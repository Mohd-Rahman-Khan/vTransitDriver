import axios from "axios";
import React, { useRef } from "react";
import { DOWNLOAD_DOC } from "../config/urls";
import { apiPost } from "./utils";
class getDocUrl {
  static async docURL(data) {
    let blob = await apiPost(
      DOWNLOAD_DOC,
      { fileurl: data?.photo },
      { responseType: "blob" }
    );

    const reader = new FileReader();
    await reader.readAsDataURL(blob);
    let yoi = await new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
    return yoi;
  }
}

export default getDocUrl;
