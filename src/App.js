import React from 'react';
import 'bulma/css/bulma.min.css';

function App() {
  return (
    <section className="hero is-warning is-fullheight is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title is-1">Potong Link</h1>
          <div className="columns is-gapless field has-addons ">
            <div className="column is-two-fifths control">
              <input
                className="input"
                type="text"
                placeholder="https://put-the-link-here.com"
              />
              <p
                className="help is-danger"
                style={{ position: 'absolute' }}
              />
              <p
                className="help is-success"
                style={{ position: 'absolute' }}
              />
            </div>
            <div className="column control">
              <button
                type="button"
                className="button is-warning is-rounded is-inverted"
              >
                Shorten!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
