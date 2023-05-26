import React, { useState, useEffect } from 'react';
import { FaceTecSDK } from '../../components/core-sdk/FaceTecSDK.js/FaceTecSDK';
import { FaceTecConfig } from '../../faceTecConfig';
import { LivenessCheckProcessor } from '../../components/processors/LivenessCheckProcessor';
import Loading from '../../components/loading/index';

const FaceTec = () => {
  const [displayStatusInit, setDisplayStatusInit] = useState('Initializing...');
  const [isInitializedFaceTec, setIsInitializedFaceTec] = useState(false);
  const [isStartLiveness, setIsStartLiveness] = useState(false);
  const [livenessStatus, setLivenessStatus] = useState('');
  let latestProcessor;

  useEffect(() => {
    // Set a the directory path for other FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory('../core-sdk/FaceTecSDK.js/resources');

    // Set the directory path for required FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory('../core-sdk/FaceTec_images');

    // Initialize FaceTec Browser SDK and configure the UI features.
    FaceTecSDK.initializeInDevelopmentMode(
      FaceTecConfig.DeviceKeyIdentifier,
      FaceTecConfig.PublicFaceScanEncryptionKey,
      function (initializedSuccessfully) {
        console.log('window.onload 1 call FaceTecSDK');
        if (initializedSuccessfully) {
          // SampleAppUtilities.enableAllButtons();
          setIsInitializedFaceTec(true);
          console.log('window.onload 2 call FaceTecSDK');
        }
        setDisplayStatusInit(
          FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(FaceTecSDK.getStatus()),
        );
        // SampleAppUtilities.displayStatus(FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(FaceTecSDK.getStatus()));
        console.log(
          'window.onload 3 call FaceTecSDK ---- UI',
          FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(FaceTecSDK.getStatus()),
        );
      },
    );

    // SampleAppUtilities.formatUIForDevice();
    console.log('window.onload 4 call FaceTecSDK');
  }, []);

  const capture = () => {
    // SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
    console.log('0');
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    getSessionToken(function (sessionToken) {
      latestProcessor = new LivenessCheckProcessor(sessionToken, onComplete);
      setIsStartLiveness(true);
    });
  };

  // Get the Session Token from the server
  function getSessionToken(sessionTokenCallback) {
    var XHR = new XMLHttpRequest();
    XHR.open('GET', FaceTecConfig.BaseURL + '/session-token');
    XHR.setRequestHeader('X-Device-Key', FaceTecConfig.DeviceKeyIdentifier);
    XHR.setRequestHeader(
      'X-User-Agent',
      '',
      // faceTecSDK.current.createFaceTecAPIUserAgentString("")
    );
    XHR.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        var sessionToken = '';
        try {
          // Attempt to get the sessionToken from the response object.
          sessionToken = JSON.parse(this.responseText).sessionToken;
          // Something went wrong in parsing the response. Return an error.
          if (typeof sessionToken !== 'string') {
            onServerSessionTokenError();
            return;
          }
        } catch {
          // Something went wrong in parsing the response. Return an error.
          onServerSessionTokenError();
          return;
        }
        console.log('1');
        sessionTokenCallback(sessionToken);
      }
    };

    XHR.onerror = function () {
      onServerSessionTokenError();
    };
    XHR.send();
  }

  function onServerSessionTokenError() {
    console.log('SampleAppUtilities.handleErrorGettingServerSessionToken()');
  }

  // Show the final result and transition back into the main interface.
  function onComplete() {
    // SampleAppUtilities.showMainUI();
    console.log('SampleAppUtilities.showMainUI()');
    if (!latestProcessor.isSuccess()) {
      // Reset the enrollment identifier.
      //   latestEnrollmentIdentifier = "";

      // Show early exit message to screen.  If this occurs, please check logs.
      //   SampleAppUtilities.displayStatus("Session exited early, see logs for more details.");
      setLivenessStatus('Session exited early, see logs for more details.');
      return;
    }
    setLivenessStatus('Success');
    window.location.replace("/next-step")
    // Show successful message to screen
    // SampleAppUtilities.displayStatus("Success");
  }

  return (
    <div className="face-tec">
      {!isInitializedFaceTec ? <Loading /> : null}
      <div>
        {/* <p>livenessStatus: {livenessStatus}</p> */}
        <h2>Selfie check</h2>
        <p>
          To make things easier and more secure, we just need to quickly check your face using your
          phone camera.
        </p>
        <div style={{ marginTop: '20px' }}>
          <p>1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>

      <button className="btn" onClick={() => capture()}>
        Let's do it
      </button>
    </div>
  );
};

export default FaceTec;
