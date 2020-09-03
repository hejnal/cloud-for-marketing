// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Tentacles API handler to load CSV to Google Sheet through
 *     Sheets API.
 */

'use strict';
const {
  api: {Spreadsheets: {Spreadsheets, ParseDataRequest}},
  utils: {getProperValue, splitArray},
  StorageUtils,
} = require('nodejs-common');

const MAXIMUM_REQUESTS_LENGTH = 10000000;  // Maximum requests size of this API.
const NUMBER_OF_THREADS = 9;  // Maximum number of concurrent requests.
const DEFAULT_DELIMITER = ',';
/**
 * Default kind of data that will be pasted.
 * see:
 * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#PasteType
 */
const DEFAULT_PASTE_TYPE = 'PASTE_NORMAL';

/** API name in the incoming file name. */
exports.name = 'ADS';

/** Data for this API will be transferred through GCS by default. */
exports.defaultOnGcs = true;

/**
 * 'sheetHeader' is the fixed head row(s) in the Sheet. 'requestLength' is the
 *  byte size of each request.
 *
 * @typedef{{
 *   spreadsheetId:string,
 *   sheetName:string,
 *   sheetHeader:(string|undefined),
 *   requestLength:(number|undefined),
 *   pasteData:!ParseDataRequest,
 * }}
 */
let SetupAdsCampaignsConfig;

exports.SetupAdsCampaignsConfig = SetupAdsCampaignsConfig;

/**
 * Set the rows and columns for the target Sheet based on given data.
 * @param {!Spreadsheets} spreadsheets Sheets API invoker.
 * @param {string} sheetName Name of the sheet will be loaded data.
 * @param {string} data CSV data.
 * @param {!ParseDataRequest} pasteDataRequest Definition of PasteDataRequest
 *     for Sheets API batchUpdate operation.
 * @return {!Promise<number>} The row index for next round of load.
 * @private
 */
const setDimensions = (spreadsheets, sheetName, data, pasteDataRequest) => {
  const rows = data.split('\n');
  const targetRows = pasteDataRequest.coordinate.rowIndex + rows.length +
      (data.endsWith('\n') ? -1 : 0);
  const targetColumns = rows[0].split(pasteDataRequest.delimiter).length;
  return spreadsheets.reshape(sheetName, targetRows, targetColumns);
};

/**
 * Loads the data from CSV to the given Sheet. Google Sheets API has a limit for
 * request size (10MB) and number of concurrent requests.
 * To achieve the best performance, the whole CSV data will be divided into
 * rounds and each round contain several batches. Each batch is a request with a
 * piece of data to be loaded in to the target Sheet. Any round will wait until
 * its batcher are all fulfilled before it goes for the next round.
 * @param {!Spreadsheets} spreadsheets Sheets API v4 stub class.
 * @param {string} sheetName Name of the sheet will be loaded data.
 * @param {!ParseDataRequest} pasteDataRequest PasteDataRequest for Sheets API
 *     batchUpdate operation.
 * @param {string} data CSV data.
 * @param {number} messageMaxSize Maximum requests size of a request to Sheets
 *     API.
 * @return {!Promise<boolean>} Whether operation is succeeded.
 * @private
 */
const setupAdsCampaigns =
    (spreadsheets, sheetName, pasteDataRequest, data, messageMaxSize) => {
      
      console.log("setupAdsCampaigns has been called.")
      console.log(`received the following data: spreadsheets = ${spreadsheets}, sheetName = ${sheetName}, pasteDataRequest = ${pasteDataRequest}, data=${data}, messageMaxSize=${messageMaxSize}`)
    };

/**
 * Sends the data from a CSV file or a Pub/sub message to Google Sheet.
 * @param {string} message Message data from Pubsub. It could be the
 *     information of the file to be sent out, or a piece of data that need to
 *     be send out (used for test).
 * @param {string} messageId Pub/sub message ID for log.
 * @param {!SetupAdsCampaignsConfig} config SetupAdsCampaignsConfig Json object.
 * @return {!Promise<boolean>} Whether data have been sent out without any
 *     errors.
 */
exports.sendData = (message, messageId, config) => {
  let data;
  try {
    data = JSON.parse(message);
  } catch (error) {
    console.log(`This is not a JSON string. Sheets load's data not on GCS.`);
    data = message;
  }
  
  console.log("Send Data has been called.");
  console.log(`message: = ${message}, messageId: = ${messageId}, config = ${config}`)
};
