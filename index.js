import { BarcodeFormat, BrowserMultiFormatReader } from '@zxing/library';
import Listeners from './listeners.js';

export const scan = async ({
  facingMode = 'environment'
} = {}) => {
  let
    reader = new BrowserMultiFormatReader,
    { resolve, reject, promise } = Promise.withResolvers(),
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } }),
    dialog = document.createElement('dialog'),
    video = dialog.appendChild(document.createElement('video')),
    button = dialog.appendChild(Object.assign(
      document.createElement('button'),
      { textContent: 'CLOSE' }
    )),
    listeners = new Listeners([
      ['loadedmetadata', async function detect() {
        try {
          const result = await reader.decodeFromVideoElement(video);
          resolve({
            format: BarcodeFormat[result.format],
            text: result.text,
            bytes: result.rawBytes,
          });
        }
        catch (error) {
          reject(error);
        }
      }],
      ['stalled', reject],
      ['error', reject],
      ['pause', reject]
    ]).add(video, { once: true }),
    done = result => {
      try { reader.stopAsyncDecode() }
      catch (_) {}
      listeners.remove(video);
      video.remove();
      dialog.close();
      for (const track of stream.getTracks()) track.stop();
      return result;
    }
  ;

  dialog.id = 'qrcode-dialog';
  dialog.style.cssText = 'padding:0;border-radius:16px';
  video.style.cssText = `margin:0;width:100%;object-fit:contain`;
  button.style.cssText = 'margin:0;width:100%;min-height:32px;border:0';
  button.addEventListener('click', () => resolve(null), { once: true });

  document.body.appendChild(dialog).showModal();

  video.srcObject = stream;

  return promise.then(done, failure => done(Promise.reject(failure)));
};
