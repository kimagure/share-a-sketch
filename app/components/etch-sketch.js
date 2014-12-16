import Ember from 'ember';

var keyCodes = {
  h: 104,
  j: 106,
  k: 107,
  l: 108,
  w: 119,
  a: 97,
  s: 115,
  d: 100,
  question: 63,
  q: 113
};

export default Ember.Component.extend({
  trail: [],
  interval: 10,
  cursorPosX: 0,
  cursorPosY: 0,
  displayHelp: false,
  trailViewModel: Ember.computed(
    'trail',
    function () {
      var trail = this.get('trail');
      var interval = this.get('interval');
      return trail.map(function (a) {
        var split = a.split(',');
        return {
          x: split[0],
          y: split[1],
          interval: interval
        };
      });
    }
  ),
  isValid: Ember.computed(
    'trail',
    function () {
      return this.get('trail').length > 0;
    }
  ),
  didInsertElement: function () {
    var ctx = this;
    window.onkeypress = function (e) {
      if (e.which === keyCodes.question && e.shiftKey) {
        ctx.showHelp();
      }
      if (e.which === keyCodes.q && ctx.displayHelp) {
        ctx.hideHelp();
      }
      switch (e.which) {
        case keyCodes.h:
        case keyCodes.a:
          ctx.send('shiftLeft');
          break;
        case keyCodes.j:
        case keyCodes.s:
          ctx.send('shiftDown');
          break;
        case keyCodes.l:
        case keyCodes.d:
          ctx.send('shiftRight');
          break;
        case keyCodes.k:
        case keyCodes.w:
          ctx.send('shiftUp');
          break;
      }
    };
  },
  moveCursor: function (key, newValue) {
    var x = this.get('cursorPosX');
    var y = this.get('cursorPosY');
    var print = x + ',' + y;
    var trail = this.get('trail');
    if (trail.indexOf(print) === -1) {
      this.set('trail', [print].concat(trail));
    }
    this.set(key, newValue);
  },
  actions: {
    save: function () {
      if (this.get('isValid')) {
        console.log('save this stuff');
      } else {
        this.set('errorMessage', 'You can\'t save an empty sketch');
      }
    },
    shiftLeft: function () {
      var interval = this.get('interval');
      var x = this.get('cursorPosX');
      if (x > 0) {
        this.moveCursor('cursorPosX', x - interval);
      }
    },
    shiftUp: function () {
      var interval = this.get('interval');
      var y = this.get('cursorPosY');
      if (y > 0) {
        this.moveCursor('cursorPosY', y - interval);
      }
    },
    shiftDown: function () {
      var interval = this.get('interval');
      var y = this.get('cursorPosY');
      if (y < 600 - interval) {
        this.moveCursor('cursorPosY', y + interval);
      }
    },
    shiftRight: function () {
      var interval = this.get('interval');
      var x = this.get('cursorPosX');
      if (x < 800 - interval) {
        this.moveCursor('cursorPosX', x + interval);
      }
    }
  }
});