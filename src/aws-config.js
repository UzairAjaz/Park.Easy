import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      region: "us-east-1", 
      userPoolId: "us-east-1_3RyPdJEgB", 
      userPoolClientId: "5svbunu8t783el1pce7id6ebbn", 
      loginWith: {
        username: true,
        email: true, 
      },
    },
  },
});


