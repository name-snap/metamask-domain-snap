import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, spinner, copyable, panel, text } from '@metamask/snaps-ui';

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

export const onRpcRequest: OnRpcRequestHandler = ({
  origin,
  request,
}: {
  origin: string;
  request: string;
}) => {
  console.log(request);
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
