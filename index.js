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
    stop = () => {
      try { reader.stopAsyncDecode() }
      catch (_) {}
    },
    listeners = new Listeners([
      ['loadedmetadata', async function detect() {
        try {
          const result = await reader.decodeFromVideoElement(video);
          if (result?.rawBytes) {
            resolve({
              format: BarcodeFormat[result.format],
              text: result.text,
              bytes: result.rawBytes,
            });
          }
          else {
            stop();
            timer = setTimeout(detect, 250);
          }
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
      stop();
      clearTimeout(timer);
      listeners.remove(video);
      video.remove();
      dialog.close();
      return result;
    },
    timer = 0
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
