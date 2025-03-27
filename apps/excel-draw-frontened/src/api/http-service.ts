

import axios, { AxiosError, AxiosInstance } from 'axios';

class HttpService {
  http: AxiosInstance;

  authToken: string | null = null;

  constructor() {
    this.http = axios.create({
      baseURL: `http://localhost:3000/api/v1`,
      timeout: 10000,
    });

    this.interceptRequests();
    this.interceptResponse();
  }

  interceptRequests() {
    /**
     * axios request interceptors for debugging
     * and alter request data
     */
    this.http.interceptors.request.use(
      async reqConfig => {
        if (this.authToken) {
          reqConfig.headers.Authorization = `Bearer ${this.authToken}`;
        }
        // console.log(`[Req] ${reqConfig.url}`, reqConfig);
        return reqConfig;
      },
      error => Promise.reject(error),
    );
  }

  interceptResponse() {
    /**
     * Customize axios success and error
     * data to easily handle them in app
     */
    this.http.interceptors.response.use(
      response => {
        // console.log(`[Res] ${response.config.url}`, response);
        return {...response, message: response.data.message};
      },
      (error: AxiosError) => Promise.reject(this.handleApiError(error)), // TEST: need to revert to reject once api starts working
    );
  }

  // Handling error
  handleApiError(error: any) {
    // console.log('[ReqError]', error);
    try {
      if (error.response) {
        /*
         Able to connect with server, but something
         went wrong and api returned reason for that
       */
        if (error.response.data.StatusCode === 500) {
          return {
            message: 'Server Error',
          };
        }
        return {
          message: error.response.data?.message ?? 'unknown error occurred',
          status: error.response.status,
        };
      }

      // Not able to connect with server
      return {message: error.message};
    } catch {
      // Can't figure out source of error
      return {message: 'unknown error occurred'};
    }
  }

  setToken(token: string | null) {
    this.authToken = token;
  }

  getToken() {
    return this.authToken;
  }
}

const httpService = new HttpService();

const request = httpService.http;

export {httpService, request};
