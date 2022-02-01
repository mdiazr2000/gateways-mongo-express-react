import  axios  from "axios";

const buildRequestConfig = (accessToken) => ({
  headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
  }
});


const GetRequest = (url, accessToken = '') => {
  return axios.get(url, buildRequestConfig(accessToken))
      .catch(error => {
          const status = error.response.status;
          let objResponse = {}
          if (status == 401) {
              objResponse =  {
                  data: {
                      error : error.response.data.message
                  },
                  status: error.response.status
              };
          } else if (status == 422) {
              objResponse =   {
                  data: {
                      error : error.response.data.message
                  },
                  status: status
              };
          }
          return objResponse;
      });;
};

const PostWithoutTokenRequest = (url, data) => {
  return axios.post(url, data)
      .catch(error => {
        const status = error.response.status;
        let objResponse = {}
        if (status == 422) {
            objResponse =  {
                data: {
                    error : error.response.data.message
                },
                status: error.response.status
            };
        } else if (status == 401) {
            objResponse =   {
                data: {
                    error : error.response.data.message
                },
                status: status
            };
        }
        return objResponse;
      });
}

const PostRequest = (url, data, accessToken = '') => {
    return axios.post(url, data, buildRequestConfig(accessToken))
        .catch(error => {
            const status = error.response.status;
            let objResponse = {}
            if (status == 401) {
                objResponse =  {
                    data: {
                        error : error.response.data.message
                    },
                    status: error.response.status
                };
            } else if (status == 400) {
                let errorList = error.response.data.errors.map(item => item.error);
                objResponse =   {
                    data: {
                        error : errorList
                    },
                    status: status
                };
            } else {
                objResponse =   {
                    data: {
                        error : error.response.data.errors
                    },
                    status: status
                };
            }
            return objResponse;
        });
}

const PostUploadRequest = (url, data, accessToken = '') => {
  return axios.post(url, data,
      {
          headers: {
              "Content-type": "multipart/form-data",
              "Authorization": `Bearer ${accessToken}`,
          }
      })
      .catch(error => {
          const status = error.response.status;
          let objResponse = {}
          if (status == 401) {
              objResponse =  {
                  data: {
                      error : error.response.data.message
                  },
                  status: error.response.status
              };
          } else if (status == 422) {
              objResponse =   {
                  data: {
                      error : error.response.data.message
                  },
                  status: status
              };
          }
          return objResponse;
      });
}


const PatchRequest = (url, data, accessToken = '') => {
  return axios.patch(url, data,  buildRequestConfig(accessToken))
      .catch(error => {
          const status = error.response.status;
          let objResponse = {}
          if (status == 401) {
              objResponse =  {
                  data: {
                      error : error.response.data.message
                  },
                  status: error.response.status
              };
          } else if (status == 422) {
              objResponse =   {
                  data: {
                      error : error.response.data.message
                  },
                  status: status
              };
          }
          return objResponse;
      });
}

const DeleteRequest = (url, data = {}, accessToken = '') => {
  return axios({
    method: 'DELETE',
    url,
    headers: buildRequestConfig(accessToken).headers,
    data
  }).catch(error => {
      const status = error.response.status;
      let objResponse = {}
      if (status == 401) {
          objResponse =  {
              data: {
                  error : error.response.data.message
              },
              status: error.response.status
          };
      } else if (status == 422) {
          objResponse =   {
              data: {
                  error : error.response.data.message
              },
              status: status
          };
      }
      return objResponse;
  });
}

const PutRequest = (url, data, accessToken = '') => {
  return axios.put(url, data, buildRequestConfig(accessToken))
      .catch(error => {
          const status = error.response.status;
          let objResponse = {}
          if (status == 401) {
              objResponse =  {
                  data: {
                      error : error.response.data.message
                  },
                  status: error.response.status
              };
          } else if (status == 422) {
              objResponse =   {
                  data: {
                      error : error.response.data.message
                  },
                  status: status
              };
          }
          return objResponse;
      });
};

export {GetRequest, PostRequest, PatchRequest, PutRequest, DeleteRequest, PostWithoutTokenRequest, PostUploadRequest};
