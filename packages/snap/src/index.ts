/* eslint-disable no-case-declarations */
import { Json, OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, spinner, copyable, panel, text } from '@metamask/snaps-ui';
import { EVERYNAME_API_KEY } from './config';
import { init, fetchQuery } from '@airstack/airstack-react';

init('fcdd5ca07bd04f47b4b6ff59b662ca11');

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

const handleChainId = (chainId: number) => {
  switch (chainId) {
    case 1:
    case 10:
      return 'eth';
    case 56:
      return 'bnb';
    case 43114:
      return 'avax';
    default:
      return 'eth';
  }
};

const handleSocials = async (address: string) => {
  const GET_ALL_SOCIALS = `
  query GetAllSocials($address: Address!) {
    Socials(
      input: {filter: {userAssociatedAddresses: {_eq: $address }}, 
      blockchain: ethereum}
    ) {
      Social {
        dappName
        profileName
      }
    }
  }
  `;

  const { data, error } = await fetchQuery(
    GET_ALL_SOCIALS,
    { address },
    { cache: false },
  );

  if (error) {
    return error;
  }

  return data.Socials.Social;
};

const handleReverseResolutionApiRequest = async (
  address: string,
  network: string,
) => {
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
      const [address, chainId] = request.params;
      //const stringChainId = "eth";
      const stringChainId = handleChainId(Number(chainId));
      const res = await handleReverseResolutionApiRequest(
        address,
        stringChainId,
      );

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text(`Your HEX address is **${address}**`),
            text(
              `Which resolves to the domain name **${JSON.stringify(
                res.domain,
              )}**`,
            ),
          ]),
        },
      });
    case 'domain':
      const everynameResult = await handleForwardResolutionApiRequest(
        request.params,
      );
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text(`Your domain name is **${request.params}**`),
            text(
              `Which resolves to the hex address **${JSON.stringify(
                everynameResult.address,
              )}**`,
            ),
          ]),
        },
      });
    case 'socials':
      const result = await handleSocials(request.params);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Your socials:`),
            copyable(JSON.stringify(result)),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
