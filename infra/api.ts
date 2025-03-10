import { table, secret, openAISecret } from "./storage";
import { userPool, userPoolClient, createAuthorizer } from "./auth";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [table, secret, openAISecret],
      }
    }
  }
});

const authorizer = createAuthorizer(api);

api.route("POST /notes", "packages/functions/src/create.main", { auth: { iam: true } });
api.route("GET /notes/{id}", "packages/functions/src/get.main", { auth: { iam: true } });
api.route("GET /notes", "packages/functions/src/list.main", { auth: { iam: true } });
api.route("PUT /notes/{id}", "packages/functions/src/update.main", { auth: { iam: true } });
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main", { auth: { iam: true } });
api.route("POST /billing", "packages/functions/src/billing.main", { auth: { iam: true } });
api.route("GET /nogginstory", "packages/functions/src/nogginstory.main");
api.route("GET /nogginstoryauth", "packages/functions/src/nogginstory.main", { auth: {
    jwt: {
      authorizer: authorizer.id
    }
  }
});