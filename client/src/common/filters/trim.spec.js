describe( 'Filters', function() {
  describe( 'trim', function() {
    beforeEach(module('webapp.filters'));

    it('should trim when input is too long', inject(function(trimFilter) {
      var tooLong = 'fooooooooooooooo';
      expect(trimFilter(tooLong, 5)).toBe("foooo...");
    }));

    it('should not trim when length < input.length', inject( function(trimFilter) {
      var tooShort = 'foo';
      expect(trimFilter(tooShort, 10)).toBe(tooShort);
    }));

    it('should use a custom optional suffix', inject( function(trimFilter) {
      var tooLong = 'fooooooooooooooo';
      expect(trimFilter(tooLong, 10, '---')).toBe("fooooooooo---");
      tooLong = 'fooooooooooooooo';
      expect(trimFilter(tooLong, 10)).toBe("fooooooooo...");
    }));
  });
});
