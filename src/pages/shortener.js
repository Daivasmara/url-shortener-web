import React, { useState, useEffect } from 'react';
import Joi from '@hapi/joi';
import urlRegex from 'url-regex';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { REACT_APP_API_ENDPOINT, REACT_APP_API_KEY } = process.env;

function Shortener() {
  const [link, setLink] = useState('');
  const [hash, setHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
  }, [link]);

  useEffect(() => {
    setErrorMessage('');
    setLink('');
    setIsCopied(false);
  }, [hash]);

  const schema = Joi.object({
    link: Joi.string().required(),
  });

  const handlePostReq = async (reqBody) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${REACT_APP_API_ENDPOINT}/v1/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: REACT_APP_API_KEY,
        },
        body: JSON.stringify(reqBody),
      });

      const { message } = await response.json();

      if (response.status !== 201) {
        throw new Error(message);
      }

      setIsLoading(false);
      setHash(message.hash);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  };

  const handleShorten = async () => {
    try {
      const reqBody = await schema.validateAsync({ link });
      if (!urlRegex({ strict: false }).test(link)) {
        throw new Error('"link" must be a valid URL');
      }
      handlePostReq(reqBody);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleKeyDown = (keyCode) => {
    if (!isLoading && keyCode === 13) {
      handleShorten();
    }
  };

  const shortenedLink = `${window.location.hostname}/${hash}`;
  return (
    <section className="hero is-warning is-fullheight is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title is-1" style={{ fontFamily: 'Caveat, sans-serif' }}>Potong Link</h1>
          <div className="columns is-gapless field has-addons ">
            <div className="column is-two-fifths control">
              <input
                className={`input ${(errorMessage && 'is-danger') || ''}`}
                type="text"
                placeholder="https://link.here"
                value={link}
                disabled={isLoading}
                onChange={({ target: { value } }) => setLink(value)}
                onKeyDown={({ keyCode }) => handleKeyDown(keyCode)}
              />
              <p
                className="help is-danger"
                style={{ position: 'absolute' }}
              >
                {errorMessage}
              </p>
            </div>
            <div className="column control">
              <button
                className={`button is-warning is-rounded is-inverted ${(isLoading && 'is-loading') || ''}`}
                type="button"
                onClick={() => handleShorten()}
              >
                Potong!
              </button>
            </div>
          </div>
          <div className={`modal ${(hash && 'is-active') || ''}`}>
            <div className="modal-background" />
            <div className="modal-content">
              <div
                className="notification is-warning has-text-centered"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <CopyToClipboard
                  text={shortenedLink}
                  onCopy={() => setIsCopied(true)}
                >
                  <span
                    className="is-size-2 has-text-weight-bold has"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {shortenedLink}
                  </span>
                </CopyToClipboard>
                <p
                  className={`help ${(isCopied && 'is-success has-text-weight-bold') || ''}`}
                >
                  {isCopied ? 'copied to clipboard!' : 'click the link to copy'}
                </p>
              </div>
            </div>
            <button
              className="modal-close is-large"
              type="button"
              aria-label="close"
              onClick={() => setHash('')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Shortener;
