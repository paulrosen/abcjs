var parseCommon = require('../../../src/parse/common');

describe('Parse Common', function () {

  describe('clone', function () {
    it('clones object (first level only)', function () {
      var source = {
        a: 1,
        b: "2",
        c: true,
        d: {
          a: {}
        },
        e: []
      };

      var cloned = parseCommon.clone(source);
      expect(cloned).to.not.be(source);
      expect(cloned).to.eql(source);

      expect(cloned.d).to.be(source.d);
      expect(cloned.e).to.be(source.e);

    });
  });

  describe('cloneHashOfHash', function () {
    it('clones only object (first and second level only)', function () {
      var source = {
        d: {
          a: {}
        }
      };

      var cloned = parseCommon.cloneHashOfHash(source);
      expect(cloned).to.not.be(source);
      expect(cloned).to.eql(source);

      expect(cloned.d).to.not.be(source.d);
      expect(cloned.d).to.eql(source.d);
      expect(cloned.d.a).to.be(source.d.a);
    });
  });

  describe('cloneArray', function () {
    it('clones array (first level only)', function () {
      var source = [[ 1 ], 2, 3];

      var cloned = parseCommon.cloneArray(source);
      expect(source).to.not.be(cloned);
      expect(source).not.eql(cloned);
    });
  });


});
