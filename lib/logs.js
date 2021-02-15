/*
 * Library for storing and rotating logs
 *
 */

// Dependencies
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Container for module (to be exported)
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '/../.logs/');
