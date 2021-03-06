import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";
import { ApolloServerPluginUsageReporting } from "apollo-server-core";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        // Pass the token from the context to each subgraph
        // as a header called `authorization`
        request.http.headers.set('authorization', context.token);
    }
}

const gateway = new ApolloGateway({
    buildService({ name, url }) {
        return new AuthenticatedDataSource({ url });
    }
});

// decode JWT for client segmentation
function decodeJWT(request) {
    
    const token = request.http.headers.get("authorization") || '';

    if (token == '') {
        return "","";
    }
    
    const tokens = token.split(" ");
    if (tokens.length < 2) {
        return "", "";
    }
    // Decode JWT (use verify for real use case: var decoded = jwt.verify(tokens[1], 'secret');)
    var decoded = jwt.decode(tokens[1]);  // <-- does not verify
    //console.log("Segmentation is " + decoded.client_name + " " + decoded.client_version);

    if (('client_name' in decoded) && ('client_version' in decoded)) {
        // set this to the real field values and add type safety
        return decoded.client_name, decoded.client_version;
    }
    return "", ""
}

const server = new ApolloServer({
    gateway,
    context: ({ req }) => {
        // Get the user token from the headers
        const token = req.headers.authorization || '';
        // Add the user ID to the context
        return { token };
    },
    debug: false,
    introspection: false,
    playground: false,
    subscriptions: false,
    plugins: [
        ApolloServerPluginUsageReporting({
            generateClientInfo: ({ request }) => {
                const { clientName, clientVersion } = decodeJWT(request);
                return {
                    clientName,
                    clientVersion
                };
            }
        })
    ],
});

server.listen({ port: PORT }).then(({ url }) => {
    console.log(`Gateway ready at ${url}`);
}); 