import { PieceAuth, Property } from '@activepieces/pieces-framework';
import {
  AuthenticationType,
  httpClient,
  HttpMethod,
} from '@activepieces/pieces-common';

export type OracleFusionAuth = {
  baseUrl: string;
  username: string;
  password: string;
};

export const oracleFusionAuth = PieceAuth.CustomAuth({
  description: `
    Authenticate with your Oracle Fusion Cloud ERP account. You will need:
    1.  **Server URL**: The base URL of your Oracle Cloud service (e.g., \`https://servername.fa.us2.oraclecloud.com\`).
    2.  **Username**: An Oracle Cloud service user with permissions to access the required resources.
    3.  **Password**: The password for the specified user.
    `,
  required: true,
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Server URL',
      description:
        'The base URL of your Oracle Cloud service (e.g., `https://servername.fa.us2.oraclecloud.com`)',
      required: true,
    }),
    username: Property.ShortText({
      displayName: 'Username',
      required: true,
    }),
    password: Property.ShortText({
      displayName: 'Password',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      const url = `${auth.baseUrl.replace(
        /\/$/,
        ''
      )}/fscmRestApi/resources/latest/invoices/describe`;

      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url,
        authentication: {
          type: AuthenticationType.BASIC,
          username: auth.username,
          password: auth.password,
        },
      });
      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        error:
          'Authentication failed. Please check your Server URL, Username, and Password.',
      };
    }
  },
});
