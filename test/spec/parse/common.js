var parseCommon = require('../../../parse/abc_common');

describe('Parse Common', function () {

  describe('clone', function () {
    it('clones object', function () {
      var source = {
        a: 1,
        b: "2",
        c: true,
        d: {},
        e: []
      };

      var cloned = parseCommon.clone(source);
      expect(cloned).not.to.be(source);
      expect(cloned).to.eql(source);

    });
  });

});
