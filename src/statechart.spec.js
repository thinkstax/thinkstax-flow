/* eslint-disable func-names, prefer-arrow-callback */
import machine from './index';
import { actionTypes } from '../actions';
import { INIT, FETCH_CHANNELS, FLOW_DONE } from './actionMap';
import { assertTransitions } from '../../utils/test/xstate';
import {
  USERFLOW_START,
  USERFLOW_INIT,
  USERFLOW_TO_CHANNEL,
  USERFLOW_ABBREV,
  USERFLOW_NORMAL,
  USERFLOW_STEP_QUESTION,
  USERFLOW_STEP_SELECT_CHANNEL,
  USERFLOW_STEP_CHANNEL,
  USERFLOW_STEP_IN,
  USERFLOW_STEP_IDLE,
  USERFLOW_STEP_DONE,
  USERFLOW_IDLE,
  USERFLOW_CHANNELS_FETCHING
} from '../constants/uiStates';

const TOCH_FLOW_INIT_STATE = `${USERFLOW_TO_CHANNEL}.${USERFLOW_STEP_CHANNEL}`;
const TOCH_FLOW_CH_STEP = `${USERFLOW_TO_CHANNEL}.${USERFLOW_STEP_CHANNEL}`;
const TOCH_FLOW_DONE_STEP = `${USERFLOW_TO_CHANNEL}.${USERFLOW_STEP_DONE}`;

const NORM_FLOW_Q_STEP_IN = `${USERFLOW_NORMAL}.${USERFLOW_STEP_QUESTION}.${USERFLOW_STEP_IN}`;
const NORM_FLOW_Q_STEP_IN_CH_FETCH = `${NORM_FLOW_Q_STEP_IN}.${USERFLOW_CHANNELS_FETCHING}`;
const NORM_FLOW_INIT_STATE = `${NORM_FLOW_Q_STEP_IN}.${USERFLOW_STEP_IDLE}`;
const NORM_FLOW_SELECT_CH_STEP = `${USERFLOW_NORMAL}.${USERFLOW_STEP_SELECT_CHANNEL}`;
const NORM_FLOW_CH_STEP = `${USERFLOW_NORMAL}.${USERFLOW_STEP_CHANNEL}`;
const NORM_FLOW_DONE_STEP = `${USERFLOW_NORMAL}.${USERFLOW_STEP_DONE}`;

const ABBR_FLOW_INIT_STATE = `${USERFLOW_ABBREV}.${USERFLOW_STEP_QUESTION}.${USERFLOW_STEP_IN}.${USERFLOW_STEP_IDLE}`;

const targetFlowConditions = [
  /** If premium, hotwiring and target channel exist with name and workgroup but the available is undefine,  goto channel flow */
  {
    toState: TOCH_FLOW_INIT_STATE,
    redux: {
      config: {
        targetChannel: { name: 'scheduling', workgroup: 'CG_WG' },
        featureSwitch: { enableHotwiring: true }
      },
      productData: { isPremium: true }
    }
  },
  /** If premium, hotwiring and target channel exist with name and workgroup and available is true,  goto channel flow */
  {
    toState: TOCH_FLOW_INIT_STATE,
    redux: {
      config: {
        targetChannel: { name: 'scheduling', workgroup: 'CG_WG', available: true },
        featureSwitch: { enableHotwiring: true }
      },
      productData: { isPremium: true }
    }
  },
  /** If premium, hotwiring and target channel exist with name and workgroup and available is false,  goto channel flow */
  {
    toState: TOCH_FLOW_INIT_STATE,
    redux: {
      config: {
        targetChannel: { name: 'scheduling', workgroup: 'CG_WG', available: false },
        featureSwitch: { enableHotwiring: true }
      },
      productData: { isPremium: true }
    }
  },
  /** If premium, hotwiring, and no target channel, goto abbreviated flow */
  {
    toState: ABBR_FLOW_INIT_STATE,
    redux: {
      config: {
        featureSwitch: { enableHotwiring: true }
      },
      productData: { isPremium: true }
    }
  },
  /** If NOT premium, hotwiring and target channel exist with name and workgroup and available is false,  goto normal flow */
  // @note commented out for now. Forcing it to be target channel event when not available.
  {
    toState: TOCH_FLOW_INIT_STATE,
    redux: {
      config: {
        targetChannel: { name: 'scheduling', workgroup: 'CG_WG', available: false },
        featureSwitch: { enableHotwiring: true }
      }
    },
    productData: { isPremium: false }
  },
  /** If NOT premium, hotwiring, and no target channel, goto abbreviated flow */
  {
    toState: NORM_FLOW_INIT_STATE,
    redux: {
      config: {
        featureSwitch: { enableHotwiring: true }
      }
    }
  },
  /** If NOT premium, NO hotwiring and target channel exist with name and workgroup and available is false,  goto normal flow */
  {
    toState: NORM_FLOW_INIT_STATE
  },
  /** If NOT premium, NO hotwiring, and no target channel, goto abbreviated flow */
  {
    toState: NORM_FLOW_INIT_STATE
  }
];
describe('machine', function () {
  describe('root statechart', function () {
    const scenarios = {
      [USERFLOW_START]: {
        [actionTypes.START]: {
          value: USERFLOW_INIT,
          actions: [INIT]
        },
        [actionTypes.STEP_NEXT]: undefined,
        [actionTypes.STEP_PREV]: undefined
      },
      [USERFLOW_INIT]: {
        [actionTypes.READY]: targetFlowConditions,
        /** If there is no transitions for the given action, don't transition */
        [actionTypes.STEP_NEXT]: undefined,
        [actionTypes.STEP_PREV]: undefined
      },
      [USERFLOW_IDLE]: {
        [actionTypes.START]: targetFlowConditions,
        /** If there is no transitions for the given action, don't transition */
        [actionTypes.STEP_NEXT]: undefined,
        [actionTypes.STEP_PREV]: undefined
      },
      [USERFLOW_TO_CHANNEL]: {
        [actionTypes.DONE]: USERFLOW_IDLE
      },
      [USERFLOW_ABBREV]: {
        [actionTypes.DONE]: USERFLOW_IDLE
      },
      [USERFLOW_NORMAL]: {
        [actionTypes.DONE]: USERFLOW_IDLE
      }
    };
    assertTransitions(machine, scenarios);
  });
  describe('to channel flow statechart', function () {
    const scenarios = {
      [TOCH_FLOW_CH_STEP]: {
        [actionTypes.STOP]: {
          value: TOCH_FLOW_DONE_STEP,
          actions: [FLOW_DONE]
        }
      }
    };
    assertTransitions(machine, scenarios);
  });
  describe('normal flow statechart', function () {
    const scenarios = {
      [NORM_FLOW_INIT_STATE]: {
        [actionTypes.STEP_NEXT]: [
          /** If the customer question is invalid */
          {
            toState: NORM_FLOW_INIT_STATE,
            redux: { customerQuestion: '' }
          },
          /** if the customer question is valdi */
          {
            toState: {
              value: NORM_FLOW_Q_STEP_IN_CH_FETCH,
              actions: [FETCH_CHANNELS]
            },
            redux: { customerQuestion: 'k1' }
          }
        ]
      },
      [NORM_FLOW_Q_STEP_IN_CH_FETCH]: {
        [actionTypes.AUDIT_SUPPORT_UPDATE]: NORM_FLOW_INIT_STATE,
        [actionTypes.CHANNELS_FETCH_SUCCEEDED]: NORM_FLOW_SELECT_CH_STEP,
        [actionTypes.CHANNELS_FETCH_FAILED]: NORM_FLOW_SELECT_CH_STEP
      },
      [NORM_FLOW_SELECT_CH_STEP]: {
        [actionTypes.STEP_PREV]: NORM_FLOW_INIT_STATE,
        [actionTypes.STOP]: {
          value: NORM_FLOW_DONE_STEP,
          actions: [FLOW_DONE]
        },
        [actionTypes.CHANNELS_SELECT]: NORM_FLOW_CH_STEP
      },
      [NORM_FLOW_CH_STEP]: {
        [actionTypes.STEP_PREV]: NORM_FLOW_SELECT_CH_STEP,
        [actionTypes.STOP]: {
          value: NORM_FLOW_DONE_STEP,
          actions: [FLOW_DONE]
        }
      }
    };
    assertTransitions(machine, scenarios);
  });
  /** @todo need to add test for abbreviated flow. Should be similar to normal flow */
});

