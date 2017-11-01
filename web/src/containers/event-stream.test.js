/* global beforeEach describe it */

import _ from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon';
import EventStream from './event-stream';

describe('EventStream', () => {
  let eventStream;

  beforeEach(() => {
    eventStream = new EventStream();
  });

  describe('#constructor()', () => {
    it('initializes state', () => {
      expect(eventStream.state.isStreamActive).to.be.true;
      expect(eventStream.state.filterValue).to.equal('');
      expect(eventStream.state.events).to.be.an.instanceof(Array);
      expect(eventStream.state.events).to.have.lengthOf(0);
    });
  });

  describe('#activateSocket()', () => {
    let socket;

    beforeEach(() => {
      socket = sinon.mock({ on: () => {} });
      sinon.stub(eventStream, 'openSocket').returns(socket.object);
    });

    it('stores events in descending order', () => {
      const events = [{ uuid: 'newest' }];

      const expectedState = {
        error: null,
        events: [
          { uuid: 'newest' },
          { uuid: 'oldest' }
        ]
      };

      eventStream.state.events = [{ uuid: 'oldest' }];
      sinon.mock(eventStream).expects('setState').withArgs(expectedState).once();
      socket.expects('on').withArgs('events', sinon.match.func).callsArgWith(1, events).once();
      socket.expects('on').twice();
      eventStream.activateSocket();
    });

    it('handles connection errors', () => {
      const expectedState = { error: 'Server unavailable' };
      sinon.mock(eventStream).expects('setState').withArgs(expectedState).once();
      socket.expects('on').withArgs('connect_error', sinon.match.func).callsArg(1).once();
      socket.expects('on').twice();
      eventStream.activateSocket();
    });

    it('handles server errors', () => {
      const expectedState = { error: 'Server error' };
      sinon.mock(eventStream).expects('setState').withArgs(expectedState).once();
      socket.expects('on').withArgs('error', sinon.match.func).callsArg(1).once();
      socket.expects('on').twice();
      eventStream.activateSocket();
    });
  });

  describe('#filteredEvents()', () => {
    beforeEach(() => {
      eventStream.state.events = [
        { uuid: 'a', type: 'JSON', message: 'foo' },
        { uuid: 'b', type: 'JSON', message: 'bar' },
        { uuid: 'c', type: 'XML', message: 'node' }
      ];
    });

    it('filters by type, case insensitive', () => {
      eventStream.state.filterValue = 'Js';
      const filteredEvents = eventStream.filteredEvents();
      expect(filteredEvents).to.have.lengthOf(2);
      expect(filteredEvents[0].message).to.equal('foo');
      expect(filteredEvents[1].message).to.equal('bar');
    });

    it('filters by message, case insensitive', () => {
      eventStream.state.filterValue = 'mL';
      const filteredEvents = eventStream.filteredEvents();
      expect(filteredEvents).to.have.lengthOf(1);
      expect(filteredEvents[0].type).to.eql('XML');
    });

    it('caps at 100 events', () => {
      _.times(300, (n) => {
        const id = `id-${n}`;
        eventStream.state.events.push({ uuid: `id-${id}`, type: 'T', message: 'm' });
      });
      expect(eventStream.filteredEvents()).to.have.lengthOf(100);
    });
  });
});
