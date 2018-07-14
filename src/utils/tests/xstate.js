/* eslint-disable func-names, prefer-arrow-callback */
import { isString, isArray } from '../type';

export const transition = (machine, fromState, eventTypes, reduxState) => eventTypes.split(/,\s?/).reduce((state, eventType) => {
  if (isString(state) && state[0] === '{') {
    /* eslint-disable-next-line */
      state = JSON.parse(state);
  }
  // console.log('>>>>transitioning=>', eventType, state);
  return machine.transition(state, eventType, reduxState);
}, fromState);

export const assertTransition = (machine, eventTypes, fromState, toState, redux = {}) => {
  // console.log('>>>>asserting eventTypes: fromState -> toState =>', eventTypes, fromState, toState);
  it(`should go from ${fromState} to ${JSON.stringify(toState)} on ${eventTypes}${redux === {} ? '' : ` when redux state is ${JSON.stringify(redux)}`}`, function () {
    // console.log('>>>>calling multi transition=>', eventTypes, fromState);
    const resultState = transition(machine, fromState, eventTypes, redux);
    // console.log('>>>>state result from multi transition=>', resultState);
    if (toState === undefined) {
      /** @note undefined means that the state didn't transition */
      expect(resultState.actions).toEqual([]);
      expect(resultState.history).toBeUndefined();
    } else if (isString(toState)) {
      expect(resultState.toString()).toEqual(toState);
    } else {
      expect(resultState.toString()).toEqual(toState.value);
      expect(resultState.actions).toEqual(toState.actions || []);
    }
  });
};

export const assertTransitions = (machine, scenarios) => {
  Object.keys(scenarios).forEach((fromState) => {
    Object.keys(scenarios[fromState]).forEach((eventTypes) => {
      if (isArray(scenarios[fromState][eventTypes])) {
        scenarios[fromState][eventTypes].forEach(({ toState, redux }) => {
          assertTransition(machine, eventTypes, fromState, toState, redux);
        });
      } else {
        assertTransition(machine, eventTypes, fromState, scenarios[fromState][eventTypes]);
      }
    });
  });
};

export default {
  assertTransitions,
  transition
};

