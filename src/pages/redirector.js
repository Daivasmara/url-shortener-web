import React, { Fragment, useState, useEffect } from 'react';
import {
  useParams,
} from 'react-router-dom';
import 'bulma/css/bulma.min.css';

const {
  REACT_APP_API_ENDPOINT,
} = process.env;

function Redirector() {
  const { hash } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [statusCode, setStatusCode] = useState('');

  useEffect(() => {
    async function redirectToLink() {
      try {
        const response = await fetch(`${REACT_APP_API_ENDPOINT}/v1/link/${hash}`);
        const { message } = await response.json();

        if (response.status !== 200) {
          setStatusCode(response.status);
          throw new Error(message);
        }

        window.location.href = message.link;
      } catch (err) {
        setErrorMessage(err.message);
      }
    }

    redirectToLink();
  }, [hash]);

  return (
    <section className="hero is-medium is-warning is-bold is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          {errorMessage ? (
            <Fragment>
              <h1 className="title is-1">
                {statusCode}
              </h1>
              <h2 className="subtitle">
                {errorMessage}
              </h2>
            </Fragment>
          ) : (
            <progress className="progress is-medium is-dark" max="100">100%</progress>
          )}
        </div>
      </div>
    </section>
  );
}

export default Redirector;
