import { Json, OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, spinner, copyable, panel, text } from '@metamask/snaps-ui';
import axios from 'axios';

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

const handleEverynameApi = async (
  address: Json[] | Record<string, Json>,
  network: number,
) => {
  const apiUrl = `https://api.everyname.xyz/reverse?address=${address}&network=${network}`;

  axios
    .get(apiUrl, {
      headers: {
        'api-key': `${process.env.EVERYNAME_API_KEY}`,
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.domain) {
        return data.domain;
      }
      return 'no domain associated with name';
    })
    .catch((error) => {
      // Handle any errors
      console.error('Error:', error);
    });
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
      // const res = await handleEverynameApi(request.params, 1);
      // console.log(res, 'wats res')

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text(`Your address is ${request.params}`),
          ]),
        },
      });
    case 'domain':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text(`Your domain is ${request.params}`),
            text(`Which resolves to the hex address ${request.params}`),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
