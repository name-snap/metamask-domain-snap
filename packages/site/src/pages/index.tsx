import React, { useContext, useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  sendAddress,
  shouldDisplayReconnectButton,
  sendDomain,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [address, setAddress] = useState<string>('');
  const [domain, setDomain] = useState<string>('');

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleReverseInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleForwardInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  const handleSendInputClick = async (reverse: boolean) => {
    try {
      if (reverse) {
        await sendAddress(address);
      } else {
        await sendDomain(domain);
      }
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading style={{ display: 'flex', flexDirection: 'row' }}>
        Welcome to{' '}
        <div style={{ marginLeft: 12, color: '#e43737' }}>name-snap</div>
      </Heading>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Subtitle style={{ marginRight: 10 }}>Powered by</Subtitle>
        <a href="https://www.everyname.xyz/" target="_blank">
          <img
            width="160"
            loading="lazy"
            src="https://uploads-ssl.webflow.com/64204d41a2bd1e495749eb46/6434550aab4f8743745b859c_everyname_docs_logo.svg"
            alt="Everyname's logomark and wordmark"
          />
        </a>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}
      >
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <ReconnectButton
            onClick={handleConnectClick}
            disabled={!state.installedSnap}
          />
        )}
      </div>

      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}

        <Card
          content={{
            title: 'Input your address',
            description:
              'Please enter your hexadecimal address that will reverse resolve for a domain',
            button: (
              <div>
                <input
                  placeholder="Enter hex address.."
                  type="text"
                  value={address}
                  onChange={handleReverseInputChange}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#000000',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '18px',
                    outline: 'none !important',
                    outlineStyle: 'none',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: 'solid #000000 1px',
                    padding: '3px',
                    margin: '15px',
                    width: '80%',
                    paddingBottom: '10px',
                  }}
                />

                <SendHelloButton
                  onClick={() => handleSendInputClick(true)}
                  disabled={!state.installedSnap}
                />
              </div>
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Input your domain name',
            description:
              'Please enter your domain name that will forward resolve for an address',
            button: (
              <div>
                <input
                  placeholder="Enter domain name.."
                  type="text"
                  value={domain}
                  onChange={handleForwardInputChange}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#000000',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '18px',
                    outline: 'none !important',
                    outlineStyle: 'none',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: 'solid #000000 1px',
                    padding: '3px',
                    margin: '15px',
                    width: '80%',
                    paddingBottom: '10px',
                  }}
                />
                <SendHelloButton
                  onClick={() => handleSendInputClick(false)}
                  disabled={!state.installedSnap}
                />
              </div>
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Notice>
          <p>
            Made by{' '}
            <a
              style={{
                color: 'black',
              }}
              href="https://github.com/thomas779"
              target="_blank"
            >
              {' '}
              Thomas
            </a>{' '}
            &{' '}
            <a
              style={{
                color: 'black',
              }}
              href="https://github.com/johannafransn"
              target="_blank"
            >
              Johanna
            </a>{' '}
            @{' '}
            <a
              style={{
                color: 'black',
              }}
              href="https://ethglobal.com/events/lisbon"
              target="_blank"
            >
              ETHGlobal Lisbon 2023
            </a>
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
