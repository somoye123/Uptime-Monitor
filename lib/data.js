/*
 * Crud Library for data manipulation
 *
 */

// Dependencies
import fs from 'fs';
import path from 'path';

// Container for module (to be exported)
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/');

export default lib;
