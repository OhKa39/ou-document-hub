import { setAuthCookies } from '@/actions/setAuthCookies';

let isRefreshing = false;
let refreshSubscribers: any = [];

const ClientFetch = async (url: string, options: RequestInit = {}) => {
  const globalState = JSON.parse(localStorage.getItem('UserStore')!);

  // console.log(globalState)

  // Attach access token to headers if available
  if (globalState?.state?.refreshToken)
    options.headers = {
      ...options.headers!,
      Authorization: `Bearer ${globalState?.state?.accessToken}`,
    };

  try {
    let response = await fetch(url, options);

    console.log(response);

    // If access token is expired, handle refresh logic
    if (response.status === 401 && globalState?.state.refreshToken) {
      // Token expired, try to refresh the token
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken(globalState?.state.refreshToken).then((data) => data.json());
          if (newToken.statusCode === 200) {
            localStorage.setItem(
              'UserStore',
              JSON.stringify({
                ...globalState,
                state: {
                  ...globalState?.state,
                  accessToken: newToken.data?.accessToken,
                  refreshToken: newToken.data?.refreshToken,
                },
              })
            );
            if (newToken.data?.refreshToken !== globalState?.state.refreshToken) await setAuthCookies(newToken);
          }
          // console.log(newToken.data?.accessToken)

          // // Notify all subscribers that the token has been refreshed
          onRefreshed(newToken.data?.accessToken);
          options.headers = {
            ...options.headers!,
            Authorization: `Bearer ${newToken.data?.accessToken}`,
          };
          return fetch(url, options);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      // console.log('test1')

      // Wait for the token to be refreshed
      return new Promise<Response>((resolve, reject) => {
        subscribeTokenRefresh((newToken: string | undefined) => {
          // console.log('test')
          // Retry the original request with the new token
          options.headers = {
            ...options.headers!,
            Authorization: `Bearer ${newToken}`,
          };
          resolve(fetch(url, options));
        });
      });
    }
    // console.log(response)

    return response; // Return the response
  } catch (error) {
    console.error('Fetch error:');
    throw error;
  }
};

// Helper to subscribe to token refresh events
const subscribeTokenRefresh = (callback: any) => {
  refreshSubscribers.push(callback);
};

// Helper to notify all subscribers once the token is refreshed
const onRefreshed = (newToken: string | undefined) => {
  refreshSubscribers.forEach((callback: any) => callback(newToken));
  refreshSubscribers = []; // Clear subscribers
};

// Simulate token refresh function (you'd call your refresh API here)
const refreshAccessToken = async (refreshToken: string) => {
  return fetch('/api/v1/auth/renew-session', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
};

export default ClientFetch;
