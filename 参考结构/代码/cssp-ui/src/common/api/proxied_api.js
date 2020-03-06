/**
 * @file 代理过的API请求
 */

import { createThrottleProxy } from 'src/utils/proxy';

import { getAssetLogCnt as _getAssetLogCnt } from './home_page';

const ASSET_LOAD_THROTTLE = 10000;

export let getAssetLogCnt = createThrottleProxy(_getAssetLogCnt, ASSET_LOAD_THROTTLE);