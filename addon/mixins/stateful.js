import { assert }  from '@ember/debug';
import Mixin       from '@ember/object/mixin';
import EError      from '@ember/error';


export default Mixin.create({
  init: function() {
    this._super();

    let { rootState, initialState } = this.getProperties('rootState', 'initialState');

    if (!rootState) {
        throw new EError('No rootState defined on ' + String(this) + '.');
    }

    if (!initialState) {
      throw new EError('No initialState defined on ' + String(this) + '.');
    }

    const rootStateNames = Object.keys(rootState);

    rootStateNames.forEach(function(stateName) {
        rootState[stateName].stateName = stateName;
    });

    this.transitionTo(initialState);
  },

  transitionTo: function(name) {

    let currentState = this.get('currentState');
    let rootState = this.get('rootState');
    let newState;

    this.set('targetState', newState);

    if (currentState) {
        assert(`You must provide enter function for ${name} state`, currentState.exit);
        currentState.exit(this);
    }

    this.set('previousState', currentState);

    newState = rootState[name];
    assert(`State ${name} is not exist`, !!newState);
    assert(`You must provide enter function for ${name} state`, newState.enter);
    this.set('currentStateName', name);;
    this.set('currentState', newState);
    newState.enter(this);

  }

});
