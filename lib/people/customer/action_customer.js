import { ACTIONS as ACTIONS_COMMON } from '../common/action_common.js';

import { ACTIONS as ACTIONS_CUSTOMER_GOTO_EXIT } from './action_customer_goto_exit.js';

import { ACTIONS as ACTIONS_CUSTOMER_SHOPPER_IDLE } from './action_customer_shopper_idle.js';
import { ACTIONS as ACTIONS_CUSTOMER_SHOPPER_WONDER } from './action_customer_shopper_wonder.js';
import { ACTIONS as ACTIONS_CUSTOMER_SHOPPER_FIND_IOI } from './action_customer_shopper_find_itemofinterest.js';
import { ACTIONS as ACTIONS_CUSTOMER_SHOPPER_BUY_IOI } from './action_customer_shopper_buy_itemofinterest.js';

import { ACTIONS as ACTIONS_CUSTOMER_DONATION_GOTO_DROPLOCATION } from './action_customer_donation_goto_droplocation.js';

const ACTIONS_CUSTOMER = Object.assign({}, ACTIONS_CUSTOMER_GOTO_EXIT ); 
const ACTIONS_SHOPPER = Object.assign({}, ACTIONS_CUSTOMER_SHOPPER_IDLE, ACTIONS_CUSTOMER_SHOPPER_WONDER, 
    ACTIONS_CUSTOMER_SHOPPER_FIND_IOI, ACTIONS_CUSTOMER_SHOPPER_BUY_IOI ); 
const ACTIONS_DONATOR = Object.assign({}, ACTIONS_CUSTOMER_DONATION_GOTO_DROPLOCATION ); 


const ACTIONS = Object.assign({}, ACTIONS_COMMON, ACTIONS_CUSTOMER, ACTIONS_SHOPPER, ACTIONS_DONATOR );

ACTIONS.default = {
    init: function (mdc, md, people, scene, person) {
    },
    noPath: function (mdc, md, people, scene, person, opt) {}
};


export { ACTIONS };
