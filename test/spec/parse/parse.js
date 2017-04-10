var Parse = require('../../../src/parse/parse');

describe('Parse', function () {

  var parser;
  beforeEach(function () {
    parser = new Parse();
  });

  // http://abcnotation.com/wiki/abc:standard:v2.1

  describe('3. Information fields', function () {
    describe('3.1 Description of information fields', function () {

      describe('3.1.1 X: - reference number', function () {
        it('should set the reference number');
      });

      describe('3.1.2 T: - tune title', function () {
        it('should set the tune title');
      });

      describe('3.1.3 C: - composer', function () {
        it('should set the composer');
      });

      describe('3.1.4 O: - origin', function () {
        it('should set the origin');
      });

      describe('3.1.5 A: - area', function () {
        it('should set the area');
      });

      describe('3.1.6 M: - meter', function () {
        it('should set the meter');
      });

      describe('3.1.7 L: - unit note length', function () {
        it('should set the unit note length');
      });

      describe('3.1.8 Q: - tempo', function () {
        it('should set the tempo');
      });

      describe('3.1.9 P: - parts', function () {
        it('should set the parts');
      });

      describe('3.1.10 Z: - transcription', function () {
        it('should set the transcription');
      });

      describe('3.1.11 N: - notes', function () {
        it('should set the notes');
      });

      describe('3.1.12 G: - group', function () {
        it('should set the group');
      });

      describe('3.1.13 H: - history', function () {
        it('should set the history');
      });

      describe('3.1.14 K: - key', function () {
        it('should set the key');
      });

      describe('3.1.15 R: - rhythm', function () {
        it('should set the rhythm');
      });

      describe('3.1.16 B:, D:, F:, S: - background information', function () {
        it('should set the background information');
      });

      describe('3.1.17 I: - instruction', function () {
        it('should set the instruction');
      });

      describe('3.1.18 Other fields', function () {
        it('should set the other fields');
      });

    });
  });


});
