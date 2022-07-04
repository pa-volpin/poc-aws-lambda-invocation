import connectToDatabase from "../utils/db";
import { config } from 'dotenv';
import * as dbOperations from '../utils/dbOperations'
import AWS from 'aws-sdk';
import { map as asyncMap } from "p-iteration";
import axiosInstance from '../utils/api';

config();

const loopPlayers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const players = ['PLAYER 1', 'PLAYER 2', 'PLAYER 3'];

  const url = 'https://0ba1-2804-14d-a483-8c5b-2483-e30b-5f31-a24e.ngrok.io';
  const api = axiosInstance({ url });

  await api.post('/', { message: '[loopPlayers] LOG START - GET ALL PLAYERS AND INVOKE FOR EACH ONE' }).then(() => null).catch((e) => null);

  await asyncMap(players, async player => {
    const lambda = new AWS.Lambda({ region: process.env.REGION });

    const params = {
      FunctionName: process.env.LAMBDA_INVOKE,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ player }),
    };

    await api.post('/', { message: `[loopPlayers] LOG 1 - BEFORE INVOKE LAMBDA printPlayer FOR ${player}` }).then(() => null).catch((e) => null);
    lambda.invoke(params).promise();
    // await api.post('/', { message: `[loopPlayers] LOG 2 - AFTER INVOKE LAMBDA printPlayer FOR ${player}` }).then(() => null).catch((e) => null);
  });
}

export const handler = loopPlayers;