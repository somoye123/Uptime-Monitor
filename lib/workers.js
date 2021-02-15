/*
 * Worker-related tasks
 *
 */

// Dependencies
import path from 'path';
import fs from 'fs';
import _data from './data';
import https from 'https';
import http from 'http';
import helpers from './helpers';
import url from 'url';

// Instantiate the worker module object
const workers = {};
