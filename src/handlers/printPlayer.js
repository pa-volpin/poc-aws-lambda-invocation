import { config } from 'dotenv';
import axiosInstance from '../utils/api';

config();

const printPlayer = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const url = 'https://0ba1-2804-14d-a483-8c5b-2483-e30b-5f31-a24e.ngrok.io';
  const api = axiosInstance({ url });

  await api.post('/', { message: `[printPlayer] LOG 1 - START FOR ${event.player}` }).then(() => null).catch((e) => null);

  const delay = 2000; // ms
  const dataManipulation = new Promise((resolve) => {
    setTimeout(async () => {
      await api.post('/', { message: `[printPlayer] LOG 2 - AFTER ${delay} MS FOR ${event.player}` }).then(() => null).catch((e) => null);
      resolve(true)
    }, delay);
  });

  await dataManipulation.then(async () => {
    await api.post('/', { message: `[printPlayer] LOG 3 - END FOR ${event.player}` }).then(() => null).catch((e) => null);
  })
  return true;
}

export const handler = printPlayer;