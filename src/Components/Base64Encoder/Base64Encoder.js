function base64Encoder(value) {
    const encoder = new TextEncoder('utf-8');
    const encodedValue = encoder.encode(value);
    return btoa(String.fromCharCode(...encodedValue));
  }

  export default base64Encoder;