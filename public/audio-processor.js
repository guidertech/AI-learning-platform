class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, _outputs, _parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      const pcmData = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        // Convert Float32 (between -1.0 and 1.0) to Int16
        pcmData[i] = Math.max(-1, Math.min(1, channelData[i])) * 32767;
      }
      
      // Transfer the buffer to the main thread
      // We must create a copy since the underlying memory might be reused
      const bufferCopy = new Int16Array(pcmData).buffer;
      this.port.postMessage(bufferCopy, [bufferCopy]);
    }
    return true; // Keep the processor alive
  }
}

registerProcessor('pcm-processor', PCMProcessor);
