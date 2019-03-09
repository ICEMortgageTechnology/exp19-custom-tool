# Task 6: Invoking REST APIs via Token Exchange
This task details the process by which your Custom Tool can invoke Ellie Mae's REST APIs as detailed on the [Developer Connect](https://developer.elliemae.com/) portal. To invoke these APIs, you must first obtain an *access token*, which must be passed with each API call. Obtaining a token in your Custom Tool requires you to implement a process called *token exchange*, which is a multi-step interaction between your Tool, the LO Connect application, the Ellie Mae Identity Service and a *token exchange service* that you must create.

This task is considered *advanced* as it requires knowledge of building and deploying Web APIs using Microsoft .NET. Although .NET is used in this demo, you can implement the token exchange service in any language that support creation of web services/APIs.

If you would like to view a completed version of the Token Exchange Service project, you can find it in GitHub in the [exp19-token-exchange](https://www.github.com/EllieMae/exp19-token-exchange) repository. Feel free to use this code as a starting point for your own projects.

## Prerequisites
This task assumes you have already completed Task #5 as it will leverage those files. In addition, the following tools are required:

* Knowledge of .NET MVC application/API development
* Microsoft Visual Studio 2017
* [Postman](https://www.getpostman.com/)
* A valid OAuth Client ID and Client Secret for the Ellie Mae REST API. You can obtain OAuth credentials thru the [Developer Connect](https://developer.elliemae.com/) portal if you have an authorized Encompass account.

# The Token Exchange Flow
Before beginning the task below, you should understand how token exchange works and when/why it's needed. Token exchange allows your Custom Tool to obtain an access token that allows it to call Ellie Mae's REST APIs on behalf of the user logged into LO Connect (i.e. using their identity). Because the user is already logged into LO Connect, your custom tool will not need to authenticate the user; instead, you will leverage the trust between the Custom Tool and the host application to obtain a token with the proper access.

The Token Exchange flow follows a "three-legged" OAuth model, i.e. your Custom Tool will first obtain an *auth code* from LO Connect and will then exchange that auth code for an *access token*. The actual exchange must be peformed *in secret*, meaning that the request to exchange the auth code for the access token must not be performed within the browser. This requires that you create a thin service that will perform the exchange, called the *token exchange service*. In order to complete the exchange, the service must have a valid OAuth Client ID & Secret issued by the EM Developer Connect portal.

The overall flow looks as follows:

```
                  1. Auth Code                                                   4. Token
|-------------|      Request     |-------------|  3. Auth Code  |-------------|     Exchange    |--------------|
|             | <--------------- |             | -------------> |    Token    | --------------> |   Ellie Mae  |
| LO Connect  |                  | Custom Tool |                |   Exchange  |                 |   Identity   |
|             | ---------------> |             | <------------- |   Service   | <-------------- |   Service    |
|-------------|   2. Auth Code   |-------------|  6. Access     |-------------|   5. Access     |--------------| 
                                        |            Token                           Token
                                        |
                                        |
                                        |            |-------------|
                                        |            |  Ellie Mae  |
                                        |----------> |  REST API   |
                                         7. Access   |             |
                                            Token    |-------------|

``` 
The flow starts with **(1)** the Custom Tool's JavaScript requesting an Auth Code from LO Connect using the `Auth.getAuthCode()` function. In response **(2)**, the host application returns a new auth code tied to the logged in user's identity.

The Custom Tool code takes the auth code and **(3)** transmits it to the developer's Token Exchange Service (TES). The TES then **(4)** forwards the token, along with the developer's OAuth Client ID & Secret to Ellie Mae's Identity Service's `/oauth/v1/token` endpoint. Upon verifying the developer's OAuth credentials, the EMIdS **(5)** returns a new access token to the TES.

The TES **(6)** returns the access token back to the Custom Tool, which can now **(7)** invoke the Ellie Mae REST API by passing this token as part of the `Authorization` header.

# Instructions
Follow the steps below to complete this task. The files in this folder provide a set of completed reference code for you if you get stuck or just want to skip to the solution.

1. Launch Visual Studio 2017 and open the `File > New > Project` menu item.

2. From the `New Project` screen, select the `ASP.NET Web Application (.NET Framework)` option. Give your project the name `TokenExchange`, provide a location for this app and select `OK`.

3. In the `New ASP.NET Web Application` window, select `Web API` and click `OK`. A new project should be created with the skeleton of a Web API project.

4. Within the newly created project, we can delete a number of files and folders that will not be needed for this web service. Delete the following items:
    * The `Areas` folder
    * The `Content` folder
    * The `fonts` folder
    * The `Scripts` folder
    * The `Views` folder
    * The `BundleConfig.cs` and `RouteConfig.cs` files from within the `App_Start` folder
    * The `ApplicationInsights.config` and `favicon.ico` files at the root of the Project folder
    * The `HomeController.cs` and `ValuesController.cs` files from within the `Controllers` folder (note: do not delete the `Controllers` folder even though it will be empty for now)

    The files and folders above are generally used by Web Applications that present a user interface. Our service will have no UI and thus does not require those files.

5. Open the `Global.asax` file and replace the `Application_Start()` function with the following:

    ```csharp
    protected void Application_Start()
    {
        System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
        GlobalConfiguration.Configure(WebApiConfig.Register);
        FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
    }
    ```

    The code above disables all outbound security protocols except for TLS 1.2, which is required by the Ellie Mae Identity Service (EMIdS). Additionally, it removes references to some of the unneeded classes we deleted in the prior step.

6. We're now ready to create our token exchange endpoint, which we'll start by creating a *model* class that represents the input to the API. The input for this API is a single value: the *auth code* to be exchanged. To create the model class, right click on the `Models` folder and select `Add > Class...`. Enter `TokenRequest.cs` as the name and click `Add`.

7. Within your new `TokenRequest.cs` file, replace the class definition with the following:

    ```csharp
    public class TokenRequest
    {
        public string AuthCode { get; set; }
    }   
    ```

    The class provides only a single property, `AuthCode`, that will be used to pass the auth code to the API.

8. Next, we need to create our Token Exchange *controller*, where we'll implement the API that actual logic to exchange the auth code for an access token by invoking the EMIdS API. Right-click the `Controllers` folder and select `Add > Controller...`. In the pop-up window, select `Web API 2 Controller - Empty` and click `Add`. Enter `TokenController` as the controller's name and click `Add` again. The empty controller class should be created in your project.

9. In your new `TokenController.cs` file, replace the entire file contents with the following:

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Configuration;
    using System.Net.Http;
    using System.Web.Http;
    using Newtonsoft.Json.Linq;
    using TokenExchange.Models;

    namespace TokenExchange.Controllers
    {
        public class TokenController : ApiController
        {
            // POST api/token
            public async Task<IHttpActionResult> Post(TokenRequest request)
            {
            }
        }
    }
    ```

    The code above creates the entry point for the Token Controller's POST method, which is the HTTP method we'll be using for our example. Note that the input parameter of the API is the `TokenRequest` object we defined in the prior steps. At this point, however, the function does nothing, so the we'll fill in the functionality in the next steps.

10. The role of our Token Exchange Service (TES) is to take the auth code from the API request and pass it, along with your OAuth Client ID and Secret, to the EMIdS `token` API. We'll use the `web.config` file to house the OAuth credentials so we can pull them into the code at runtime. To that end, open the `web.config` file and add the following entries to the `<appSettings>` section of the file:

    ```xml
    <add key="oauth.clientid" value="your_oauth_clientid_here" />
    <add key="oauth.clientsecret" value="your_oauth_secret_here" />
    <add key="oauth.host" value="https://api.elliemae.com"/>
    ```

    Replace the values `your_oauth_clientid_here` and `your_oauth_secret_here` with your OAuth credentials. The `oauth.host` key is hard-coded to the Ellie Mae REST API host and should not be changed.

11. Back in our Controller class, we must construct the request payload for the EMIdS token API based on the [spec published in Developer Connect](https://docs.developer.elliemae.com/v2.0/reference#authentication). Add the following code inside the `Post()` function of your controller:

    ```csharp
    // Create the content to send to the Ellie Mae OAuth Token endpoint
    Dictionary<string, string> authValues = new Dictionary<string, string>
    {
        { "grant_type", "authorization_code" },
        { "client_id", ConfigurationManager.AppSettings["oauth.clientid"] },
        { "client_secret", ConfigurationManager.AppSettings["oauth.clientsecret"] },
        { "code", request.AuthCode },
        { "scope", "lp" }
    };

    FormUrlEncodedContent content = new FormUrlEncodedContent(authValues);

    // Invoke the Ellie Mae Identity Token Endpoint
    Uri idpUri = new Uri(ConfigurationManager.AppSettings["oauth.host"]);
    Uri tokenUri = new Uri(idpUri, "oauth2/v1/token");

    using (HttpClient http = new HttpClient())
    using (var authResponse = await http.PostAsync(tokenUri, content))
    {
        if (!authResponse.IsSuccessStatusCode)
            return StatusCode(HttpStatusCode.Forbidden);

        return Ok(await authResponse.Content.ReadAsAsync<JObject>());
    }
    ```

    The code above starts by creating a `Dictionary` that contains the name/value pairs expected by the EMIdS API. Note that the parameters combine the auth code received in the request with the OAuth credentials pulled from the `web.config` file (using the `ConfigurationManager.AppSettings` collection).
    
    Because the API expects the data to be *form-encoded*, we use the `FormUrlEncodedContent` class to wrap our parameters. We then use the `HttpClient` object to POST the request to the EMIdS `oauth2/v1/token` endpoint.

    Assuming the EMIdS returns a successful response (i.e. response code 200), the logic above simply forwards that response back to the TES caller. Thus, the output of the TES service will mirror the response contract of the EMIdS token API:

    ```javascript
    {
        "access_token": "<access_token_value>",
        "token_type": "Bearer"
    }
    ```

12. Run your project in the Visual Studio debugger. Visual Studio will launch IIS Express and assign your project a port number, which will be referenced as `ws_port` for the rest of this document.

14. Using Postman, test your web app to ensure it's running. For this purpose, a pre-created Postman [collection](Token Exchange.postman_collection.json) and [environment](Token Exchange.postman_environment.json) have been created for you. Once you have imported the collection and environment settings, you will follow these steps:
    * Open a Chrome browser window and open the Developer Tools Console.
    * Log into [LO Connect](https://www.encompassloconnect.com) using a non-admin identity. When the Pipeline screen is presented, you should see an entry in the Console that starts with "Angular Session Storage: Bearer *access_token*" where `access_token` is the OAuth access token for your session. You will need this for the next step.
    * In Postman, open the first request of the collection. Copy and paste the `access_token` from the browser's console into the `subject_token` value as part of the request body (this should replace the variable `{{loc_access_token}}`)
    * Now send the first request in the Postman Collection. This call simulates the first step of the Token Exchange flow, where your JS code invoked the Auth.createAuthCode() function (covered below). The result is a new auth code returned in the response body.
    * Quickly copy and paste the `authorization_code` value from the response into the request body of the third request (in place of the text `paste_authcode_here`). You'll also need to modify the URL of this request to match the endpoint/port of your local TES running in the VS debugger. Send the request and you should a result that includes an `access_token`. This means your TES is working as expected.
    * If you TES resturns a 403 response, you should debug into it to verify that the parameters are being correctly passed and that the call to the EMIdS Token endpoint is working as expected.

15. Once your TES service is working, you're ready to perform a token exchange in your JavaScript code. Back in your Custom Tool code (customtool.js), add a new function:

    ```javascript
    // Loads a custom data object into a dynamic table
    async function loadCustomDataObject() {

        // We need to perform a token exchange to generate the
        // access token required to call Dev Connect APIs
        console.log("Creating auth code...");
        let auth = await elli.script.getObject("auth");

        try
        {
            // Generate the auth code
            let authCode = await auth.createAuthCode();
            console.log("Auth code = " + authCode);

            // Exchange for an access token by calling a custom API
            let resp = await $.ajax({
                method: "POST",
                url: "https://<your_tes_host_here>/tokenexchange/api/token",
                data: { authCode: authCode }
            });

            let accessToken = resp.access_token;

        } catch (ex) {
            // Write the exception to the output area
            document.getElementById("cdoJson")
                .innerText = JSON.stringify(ex, null, 3);
        }
    }  
    ```

    In the code above, you begin by fetching the "Auth" scripting object from the LO Connect application. You then invoke the objects `createAuthCode()` function, which returns the auth code for your application (recall the 2nd request from the Postman collection). 

    Next, you will use JQuery's `$.ajax()` call to invoke your TES service. Be sure to replace the `<your_tes_host_here>` token with the hostname/port of your Token Exchange Service. The result of this call should be a value access token, which is stored in a local variable.

16. Next, we will invoke the Encompass REST API to retrieve the value of a custom data object we've previously stored on the server. Paste the following code immediately after the last line of the `try` block above.

    ```javascript
    // Now call the Dev Connect API
    resp = await $.ajax({
        method: "GET",
        url: 'https://api.elliemae.com/encompass/v1/company/customObjects/tool_config.json',
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    // Decode the custom data object
    let customObj = JSON.parse(atob(resp.dataObject));

    // Display the custom data object
    document.getElementById("cdoJson")
        .innerText = JSON.stringify(customObj, null, 3);
    ```

    The code again makes an AJAX call, but this time invokes the Encompass REST API endpoint to retrieve a custom data object (CDO). Note that the access token we retrieved in the token exchange process is passed in the `Authorization` header of the request. Note that this access token can be used to make any number of requests -- you do *not* need to create a new access token for each API request. Instead, you should store the access token in `sessionStorage` and use if for all requests from your Custom Tool.

    Once the CDO is returned by the API, we convert it from Base64 to test and parse it as a JSON document. The JSON is then stringified to display it in the UI. Save your changes.

17. Finally, we'll code our Custom Tool to invoke our new function when the tool loads. Add a call to this new function as the last line of the `window.load` event handler, e.g.

    ```javascript
    // Hook up the initialization function
    window.addEventListener("load", () => {
        elli.script.connect();
        bindToControls();
        displayLoanJSON();
        loadCustomDataObject();
    });
    ```

18. To make the AJAX calls function properly, we must include a reference to the JQuery library in our HTML page. Add the following `<script>` tag into the `<head>` section of your page:

    ```html
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    ```

19. We also need to add a new `<div>` element into which the CDO will be written for display. Add the following HTML code into your page immediately below the Loan JSON `<div>` element:

    ```html
    <div class="layoutItem layoutFill">
        <table class="fieldGroup">
            <tr><td class="groupHeader">Custom Data Object</td></tr>
            <tr>
                <td class="jsonBox"><pre id="cdoJson">Not loaded...</pre></td>
            </tr>
        </table>
    </div>                  
    ```    

19. Test your custom tool. Assuming you have a CDO with the specified name, you should see it appear in the new `<div>` section. If not, add additional console logging to your script to debug.


