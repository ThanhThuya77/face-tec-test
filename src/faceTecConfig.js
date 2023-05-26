export const FaceTecConfig = (function () {
  // -------------------------------------
  // REQUIRED
  // Available at https://dev.facetec.com/#/account
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const DeviceKeyIdentifier = 'dwvfj7Ug6BmUNc2AESwmMfwrIlv7431D';

  // -------------------------------------
  // REQUIRED
  // The URL to call to process FaceTec SDK Sessions.
  // In Production, you likely will handle network requests elsewhere and without the use of this variable.
  // See https://dev.facetec.com/#/security-best-practices for more information.
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const BaseURL = 'https://api.facetec.com/api/v3.1/biometrics';

  // -------------------------------------
  // REQUIRED
  // The FaceMap Encryption Key you define for your application.
  // Please see https://dev.facetec.com/#/licensing-and-encryption-keys for more information.
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const PublicFaceScanEncryptionKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
    'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
    'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
    'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
    'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
    'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
    '8QIDAQAB\n' +
    '-----END PUBLIC KEY-----';

  return {
    DeviceKeyIdentifier,
    BaseURL,
    PublicFaceScanEncryptionKey,
  };
})();
