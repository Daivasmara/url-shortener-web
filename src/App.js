import React, { useState, useEffect } from 'react';
import Joi from '@hapi/joi';
import 'bulma/css/bulma.min.css';

const {
  REACT_APP_API_ENDPOINT,
  REACT_APP_REDIRECTOR_ENDPOINT,
  REACT_APP_API_HOST,
  REACT_APP_API_KEY,
} = process.env;

function App() {
  const [link, setLink] = useState('');
  const [shortenedHash, setShortenedHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
  }, [link]);

  useEffect(() => {
    setErrorMessage('');
    setLink('');
  }, [shortenedHash]);

  const schema = Joi.object({
    link: Joi.string().uri().required(),
  });

  const handlePostReq = async (reqBody) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${REACT_APP_API_ENDPOINT}/v1/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Host: REACT_APP_API_HOST,
          apikey: REACT_APP_API_KEY,
        },
        body: JSON.stringify(reqBody),
      });

      const { message } = await response.json();

      if (response.status !== 201) {
        throw new Error(message);
      }

      setIsLoading(false);
      setShortenedHash(message.hash);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message);
    }
  };

  const handleShorten = async () => {
    try {
      const reqBody = await schema.validateAsync({ link });
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

  const shortenedLink = `${REACT_APP_REDIRECTOR_ENDPOINT}/${shortenedHash}`;
  return (
    <section className="hero is-warning is-fullheight is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title is-1">Potong Link</h1>
          <div className="columns is-gapless field has-addons ">
            <div className="column is-two-fifths control">
              <input
                className={`input ${(errorMessage && 'is-danger') || ''}`}
                type="text"
                placeholder="https://put-the-link-here.com"
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
                Shorten!
              </button>
            </div>
          </div>
          <div className={`modal ${(shortenedHash && 'is-active') || ''}`}>
            <div className="modal-background" />
            <div className="modal-content">
              <div className="notification is-warning has-text-centered">
                <a
                  className="is-size-1 has-text-weight-bold"
                  href={shortenedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortenedLink}
                </a>
              </div>
            </div>
            <button
              className="modal-close is-large"
              type="button"
              aria-label="close"
              onClick={() => setShortenedHash('')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
