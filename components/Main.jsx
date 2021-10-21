import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const unirest = require('unirest');

function MainComponent(props) {
  const [domain, setDomain] = useState('itsdev.id');
  const [targetDomain, setTargetDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const [responseKey, setResponseKey] = useState(null);
  const [responseValidate, setResponseValidate] = useState(null);
  const [errorResponse, setErrorResponse] = useState(null);

  const [currentKey, setCurrentKey] = useState(null);

  const [progressSpinner, setProgressSpinner] = useState(false);

  const handleInputDomain = (e) => {
    const val = e.target.value;
    const filterVal = val.replace(/[@!_^`'&\/\\#,+()$~%.'":*?<>{}]/g, "").trim();
    setDomain(filterVal);
  }
  const handleInputTargetDomain = (e) => {
    const val = e.target.value;
    const filterVal = val.replace(/[@!_^`'&\/\\#,+()$~%'":*?<>{}]/g, "").trim();
    setTargetDomain(filterVal);
  }
  const handleInputSubdomain = (e) => {
    const val = e.target.value;
    const filterVal = val.replace(/[@!_^`'&\/\\#,+()$~%.'":*?<>{}]/g, "").trim();
    setSubdomain(filterVal);
  }

  const postGenerateKey = (e) => {
    e.preventDefault();
    setProgressSpinner(true);
    const BASE_URL = window.location.origin;
    const data = `sub=${subdomain}&targetDomain=${targetDomain}&domain=${domain}`;
    return unirest.get(`${BASE_URL}/api/generate-key?${data}`)
      .type('json')
      .then((res) => {
        console.info('res,', res);
        const body = res.body;
        if (res.statusCode === 200 && res.body) {
          setErrorResponse(null);
          setResponseKey(body.data);
          setCurrentKey(body.data.id);
        } else {
          setErrorResponse(body);
        }
      }).catch((err) => {
        setErrorResponse({
          message: err.message
        });
      }).finally(() => {
        setProgressSpinner(false);
      })
  }

  const postValidateKey = (e) => {
    e.preventDefault();
    setProgressSpinner(true);
    const BASE_URL = window.location.origin;
    const data = `id=${currentKey}`;
    return unirest.get(`${BASE_URL}/api/validate-key?${data}`)
      .type('json')
      .then((res) => {
        console.info('res,', res);
        if (res.statusCode === 200 && res.body) {
          setErrorResponse(null);
          setResponseValidate(res.body);
        } else {
          setErrorResponse(res.body);
        }
      }).catch((err) => {
        setErrorResponse({
          message: err.message
        });
      }).finally(() => {
        setProgressSpinner(false);
      });
  }

  useEffect(function() {
    // eslint-disable-next-line no-undef
    new Typed('.typed', {
      strings: ["myname", "bayu", "nugraha"],
      typeSpeed: 150,
      showCursor: false,
      loop: true
    });
  }, []);

  const buttonClass = currentKey ? 'bg-green-600 border-green-600 hover:bg-green-800' : 'bg-blue-600 border-blue-600 hover:bg-blue-800';

  return (
    <>
      <header className="text-center mt-10">
        <Link href={{pathname: ''}}>
          <a><h1 className="text-4xl font-bold ">itsdev.id</h1></a>
        </Link>
        <h2 className="font-semibold mt-2">A free subdomain as an identity for web developers.</h2>
        <div className="mt-8">
          <h3 className="inline font-bold">
            <span className="typed"></span>.itsdev.id
          </h3>
        </div>
      </header>

      <main className="mt-10">
        <p className="mb-5">
          <strong>itsdev.id</strong> provides a free subdomain as an identity for web developers for your personal website. You can have your own subdomain like <code className="bg-black py-1 px-1 text-white rounded text-sm">foo.itsdev.id</code> or <code className="bg-black py-1 px-1 text-white rounded text-sm">bar.itsdev.id</code> to use on your static site.
        </p>
        <p className="mt-5 mb-8">
          Do you need your own subdomain for your personal and project sites? Let&apos;s try!
        </p>

        {(!errorResponse && !responseValidate) && responseKey && (
          <div id="alertInfo" className="block d-none text-sm text-left text-gray-600 bg-gray-500 bg-opacity-10 border border-gray-400 items-center p-4 rounded-sm mb-5" role="alert" style={{wordWrap: 'break-word'}}>
            Please add this meta tag in your <strong> index</strong> file to your <strong>{responseKey.targetDomain}</strong> domain.<br/><br/>
            Content:<br/><strong><i id="metaValidation">{responseKey.content}</i></strong>
          </div>
        )}

        {!errorResponse && responseValidate && (
          <div id="alertResponse" className="border-l-4 bg-green-100 border-green-500 text-green-700 p-4 mb-1" role="alert">
            <p className="font-bold"> Success </p>
            <p>
              {responseValidate.message}, your domain: <strong><a className="border-b border-black" target="_blank" href={`https://${responseValidate.data.resultDomain}`} rel="noreferrer"> {responseValidate.data.resultDomain} </a></strong>
            </p>
          </div>
        )}

        {errorResponse && (
          <div id="alertResponse" className="border-l-4 bg-red-100 border-red-500 text-red-700 p-4 mb-1" role="alert">
            <p className="font-bold"> Failed! </p>
            <p> {errorResponse.message} </p>
          </div>
        )}

        <div className="container items-center">
          <form className="flex flex-col w-full p-5 px-6 pt-2 mx-auto mb-4 transition duration-500 ease-in-out transform bg-white border rounded-lg" id="submit" data-action="generate">
            <div className="relative pt-3">
              <label htmlFor="sub" className="text-base leading-7 text-blueGray-500">Name</label>
              <input value={subdomain} onChange={handleInputSubdomain} type="text" id="subdomain" name="sub" minLength="3" maxLength="20" autoComplete="off" placeholder="Subdomain name" className="w-full px-4 py-2 mt-2 mr-4 text-base text-black transition duration-500 ease-in-out transform rounded-lg bg-gray-100 focus:border-blueGray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-5" />
            </div>
            <div className="relative pt-3">
              <label htmlFor="targetDomain" className="text-base leading-7 text-blueGray-500">Target</label>
              <input value={targetDomain} onChange={handleInputTargetDomain} type="text" id="targetDomain" name="targetDomain" minLength="2" maxLength="50" autoComplete="off" placeholder="Target domain" className="w-full px-4 py-2 mt-2 mr-4 text-base text-black transition duration-500 ease-in-out transform rounded-lg bg-gray-100 focus:border-blueGray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-2" />
            </div>
            <div className="relative pt-3">
              <label htmlFor="domain" className="text-base leading-7 text-blueGray-500">Domain</label>
              <select value={domain} onChange={handleInputDomain} id="selectedDomain" name="domain" className="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform rounded-lg bg-gray-100 focus:border-blueGray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-2">
              { props.domains && props.domains.length > 0 && props.domains.map((d) => {
                return (<option key={d}>{d}</option>)
              })}
              </select>
            </div>
            <div className="relative pt-5">
              <label className="block text-center">
                <strong>{subdomain ? subdomain : '*'}.{domain}</strong> <i className="fas fa-arrow-right"></i> <i>{targetDomain}</i>
              </label>
            </div>
            <div className="flex items-center w-full pt-5 mb-4">
              <button onClick={ currentKey ? postValidateKey : postGenerateKey } className={`w-full py-3 text-base text-white transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none ${buttonClass}`}>
                { currentKey ? 'Verify' : 'Create' } { progressSpinner && <i className="fas fa-spinner fa-spin"></i> }
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="mt-10 mb-20 text-sm">
        <p>
          Made with ♥ from <a className="border-b border-black" href="https://bayun.id" target="_blank" rel="noreferrer">BayuN</a>
          &bull; <a className="border-b border-black" href="https://github.com/bayungrh">GitHub</a>
        </p>
      </footer>
    </>
  )
}

export default MainComponent;
