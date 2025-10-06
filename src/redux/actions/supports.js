import { apiName } from "../../config/apiName";
import {
  CORP_ADMIN_DETAIL,
  GET_FAQ_BY_SUBTOPIC_ID,
  GET_HELP_TOPICS,
  GET_SUBTOPIC_BY_HELPTOPIC_ID,
  GET_YOUR_TICKETS,
  RAISE_COMPLAINTS,
  REOPEN_YOUR_TICKET,
  SUPPORT_FILE_UPLOAD,
  VENDOR_DETAIL,
} from "../../config/urls";
import { apiGet, apiPost } from "../../utils/utils";

export const getHelpTopics = () => {
  return new Promise((resolve, reject) => {
    apiGet(GET_HELP_TOPICS)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSubtopicByHelpTopicId = (helpTopicId) => {
  return new Promise((resolve, reject) => {
    apiGet(`${GET_SUBTOPIC_BY_HELPTOPIC_ID}${helpTopicId}${apiName.helpid}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getFAQBySubtopicID = (subTopicId) => {
  return new Promise((resolve, reject) => {
    apiGet(`${GET_FAQ_BY_SUBTOPIC_ID}${subTopicId}${apiName.subtopic}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const raiseComplaint = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(RAISE_COMPLAINTS, data, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const reopenTicket = (data) => {
  return new Promise((resolve, reject) => {
    apiPost(REOPEN_YOUR_TICKET, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getYourTickets = (data) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_YOUR_TICKETS, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const supportFileUpload = (data, header = {}, requestType) => {
  return new Promise((resolve, reject) => {
    apiPost(SUPPORT_FILE_UPLOAD, data, header, requestType)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getVendorDetail = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(`${VENDOR_DETAIL}/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getCorpAdminDetail = (id) => {
  return new Promise((resolve, reject) => {
    apiGet(`${CORP_ADMIN_DETAIL}/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
