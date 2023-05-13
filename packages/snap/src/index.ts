import { Json, OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, spinner, copyable, panel, text } from '@metamask/snaps-ui';
import { EVERYNAME_API_KEY } from './config';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */

const handleReverseResolutionApiRequest = async (
  address: string,
  network: string,
) => {
  const apiKey = EVERYNAME_API_KEY;
  network = 'eth';
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'api-key': apiKey,
    },
  };

  try {
    const response = await fetch(
      `https://api.everyname.xyz/reverse?address=${address}&network=${network}`,
      requestOptions,
    );
    const data = await response.json();
    console.log(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(error);
    return { error: `ERROR OCCURRED ${error}` };
  }
};

const handleForwardResolutionApiRequest = async (domain: string) => {
  const apiKey = EVERYNAME_API_KEY;

  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'api-key': apiKey,
    },
  };

  try {
    const response = await fetch(
      `https://api.everyname.xyz/forward?domain=${domain}`,
      requestOptions,
    );
    const data = await response.json();
    console.log(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(error);
    return { error: `ERROR OCCURRED ${error}` };
  }
};

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    case 'address':
      const res = await handleReverseResolutionApiRequest(
        request.params,
        'eth',
      );
      console.log(res, 'öööööööööööö');

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text(
              `Your address is ${JSON.stringify(res.domain)} AND  ${request.params
              }`,
            ),
          ]),
        },
      });
    case 'domain':
      const everynameResult = handleForwardResolutionApiRequest(request.params);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text(`Your domain is ${request.params}`),
            text(
              `Which resolves to the hex address ${JSON.stringify(
                everynameResult,
              )}`,
            ),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
