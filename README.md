# Project Dashboard

## Configuration

Provide AWS credentials and the name of your S3 bucket that contains project data.

```
AWS_ACCESS_KEY=xxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxx
S3_BUCKET_NAME=xxxxxxxxx
```

Set a secret string for your cookies

`COOKIE_SECRET=xxxxxxxxxxxxxx`

To enable Azure AD sign-in, set the following environment variables:
 
`AZURE_IDENTITY_METADATA=https://login.microsoftonline.com/YOUR_TENANT_NAME_OR_ID/.well-known/openid-configuration`

`AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx`

`AZURE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx=`

`AZURE_RETURN_URL=https://xxxxxxxxxxx.com/auth/openid/return`

To learn more about the above values, click [here](https://azure.microsoft.com/en-us/documentation/articles/active-directory-b2c-reference-oidc/#get-a-token).
Additional Azure AD settings can be found in [configAzureAD.js](app/configAzureAD.js)
