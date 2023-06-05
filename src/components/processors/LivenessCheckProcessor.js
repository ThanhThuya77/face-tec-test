//
// Welcome to the annotated FaceTec Device SDK core code for performing secure Liveness Checks!
//

import { FaceTecSDK } from 'face-tec-test/FaceTecSDK.js/FaceTecSDK';
import { FaceTecConfig } from '../../faceTecConfig';

//
// This is an example self-contained class to perform Liveness Checks with the FaceTec SDK.
// You may choose to further componentize parts of this in your own Apps based on your specific requirements.
//
export class LivenessCheckProcessor {
  latestNetworkRequest = new XMLHttpRequest();

  latestSessionResult;

  //
  // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
  //
  success;

  onComplete;

  constructor(sessionToken, onComplete) {
    //
    // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
    // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
    //
    this.success = false;
    this.onComplete = onComplete;
    this.latestSessionResult = null;

    //
    // Part 1:  Starting the FaceTec Session
    //
    // Required parameters:
    // - FaceTecFaceScanProcessor:  A class that implements FaceTecFaceScanProcessor, which handles the FaceScan when the User completes a Session.  In this example, "this" implements the class.
    // - sessionToken:  A valid Session Token you just created by calling your API to get a Session Token from the Server SDK.
    //
    console.log('2');
    new FaceTecSDK.FaceTecSession(this, sessionToken);
  }

  //
  // Part 2:  Handling the Result of a FaceScan
  //
  processSessionResultWhileFaceTecSDKWaits(sessionResult, faceScanResultCallback) {
    console.log('3');
    // Save the current sessionResult
    this.latestSessionResult = sessionResult;

    //
    // Part 3:  Handles early exit scenarios where there is no FaceScan to handle -- i.e. User Cancellation, Timeouts, etc.
    //
    if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
      console.log(
        `Session was not completed successfully, cancelling.  Session Status: ${ 
          FaceTecSDK.FaceTecSessionStatus[sessionResult.status]}`,
      );
      this.latestNetworkRequest.abort();
      faceScanResultCallback.cancel();
      return;
    }

    // IMPORTANT:  FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully DOES NOT mean the Liveness Check was Successful.
    // It simply means the User completed the Session and a 3D FaceScan was created.  You still need to perform the Liveness Check on your Servers.

    //
    // Part 4:  Get essential data off the FaceTecSessionResult
    //
    const parameters = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      sessionId: sessionResult.sessionId,
    };

    //
    // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
    //
    this.latestNetworkRequest = new XMLHttpRequest();
    this.latestNetworkRequest.open('POST', `${FaceTecConfig.BaseURL}/liveness-3d`);
    this.latestNetworkRequest.setRequestHeader('Content-Type', 'application/json');

    this.latestNetworkRequest.setRequestHeader('X-Device-Key', FaceTecConfig.DeviceKeyIdentifier);
    this.latestNetworkRequest.setRequestHeader(
      'X-User-Agent',
      FaceTecSDK.createFaceTecAPIUserAgentString(sessionResult.sessionId),
    );

    this.latestNetworkRequest.onreadystatechange = () => {
      //
      // Part 6:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
      // and handle all other responses by cancelling out.
      // You may have different paradigms in your own API and are free to customize based on these.
      //
      console.log('4 -- ', this.latestNetworkRequest.readyState);
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        try {
          const responseJSON = JSON.parse(this.latestNetworkRequest.responseText);
          const scanResultBlob = responseJSON.scanResultBlob;

          // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
          // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
          if (responseJSON.wasProcessed) {
            // Demonstrates dynamically setting the Success Screen Message.
            FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage(
              'Liveness\nConfirmed',
            );

            // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
            // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
            faceScanResultCallback.proceedToNextStep(scanResultBlob);
            console.log('4 -- was processed');
          } else {
            // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
            console.log('Unexpected API response, cancelling out.');
            faceScanResultCallback.cancel();
            console.log('4 -- unexpected API response');
          }
        } catch {
          // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
          console.log('Exception while handling API response, cancelling out.');
          faceScanResultCallback.cancel();
        }
      }
    };

    this.latestNetworkRequest.onerror = () => {
      console.log('error -- unexpected API response');
      // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
      console.log('XHR error, cancelling.');
      faceScanResultCallback.cancel();
    };

    //
    // Part 7:  Demonstrates updating the Progress Bar based on the progress event.
    //
    console.log('5 -- upload onprogress');
    this.latestNetworkRequest.upload.onprogress = (event) => {
      const progress = event.loaded / event.total;
      console.log('5 -- upload % ', progress);
      faceScanResultCallback.uploadProgress(progress);
    };

    //
    // Part 8:  Actually send the request.
    //
    const jsonStringToUpload = JSON.stringify(parameters);
    console.log('6', jsonStringToUpload);
    this.latestNetworkRequest.send(jsonStringToUpload);

    //
    // Part 9:  For better UX, update the User if the upload is taking a while.  You are free to customize and enhance this behavior to your liking.
    //
    setTimeout(() => {
      console.log('7 - setTimeout');
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        console.log('8 - done');
        return;
      }
      faceScanResultCallback.uploadMessageOverride('Still Uploading...');
      console.log('8 - Still Uploading...');
    }, 6000);
  }

  //
  // Part 10:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
  //
  onFaceTecSDKCompletelyDone = () => {
    console.log('9 - onFaceTecSDKCompletelyDone');
    //
    // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after you signal the FaceTec SDK with success() or cancel().
    // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
    //
    this.success = this.latestSessionResult.isCompletelyDone;
    this.onComplete(this.latestSessionResult, null, this.latestNetworkRequest.status);
  };

  //
  // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In your code, you may not even want or need to do this.
  //
  isSuccess = () => {
    return this.success;
  };
}
