/*
https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-acquire-token?tabs=react

The following code handles a login request and
listens to a response to update the active account.
Access token is accquired using the active account.


Issue: How to call handleRedirectResponse when page is reloaded?
*/


import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { AuthenticationResult, AccountInfo} from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from '../auth/authConfig';


const { instance, inProgress} = useMsal();
let activeAccount: AccountInfo | null;

if (instance) {
    activeAccount = instance.getActiveAccount();
}

//Handle login request 
export const handleLoginRedirect = () => {
    console.log("Trying to login");
    instance.loginRedirect(loginRequest).catch((error) => {
        console.error("Login Redirect Error:", error);
    });
};


//Get response after user logs in (set the active account)
export const handleRedirectResponse = async () => {
    const response = await instance.handleRedirectPromise();
    if (response) {
        activeAccount = response.account;
        console.log("Active Account Set:", activeAccount);
    }
};

//Get access token from active account
export const getTokenSilently = async (): Promise<string | null> => {
    if (!activeAccount) {
        console.error("No active account found. User needs to log in.");
        return null;
    }
    try {
        const tokenResponse: AuthenticationResult = await instance.acquireTokenSilent({
            ...loginRequest,
            account: activeAccount,
        });
        console.log("Access Token:", tokenResponse.accessToken);
        return tokenResponse.accessToken;
    } catch (error) {
        console.error("Silent token access failed:", error);
        throw error;
    }
};

//Login logic
export const handleLogin = async () => {
    try {
      handleLoginRedirect();
      //await handleRedirectResponse();
      console.log("User logged in and response handled");
    } catch (error) {
      console.error("Error in login flow:", error);
    }
  };







