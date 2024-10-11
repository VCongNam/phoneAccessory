

  function encoder64(value) {
    const encoder = new TextEncoder('utf-8');
    const encodedValue = encoder.encode(value);
    return btoa(String.fromCharCode(...encodedValue));
  }

  function decoder64(value) {
    try {
      const decoder = new TextDecoder('utf-8');
      const decodedValue = decoder.decode(atob(value));
      return decodedValue;
    } catch (error) {
      console.error('Failed to decode string:', error);
      return null;
    }
  }
  
  export { encoder64, decoder64 };
