var should = require('should');
var osmread = require('../lib/main');

describe('pbf read', function(){
    
    describe('when parser for test.pbf exists', function(){
        var parser;
        
        before(function(done){
            osmread.parsePbf({
                filePath: 'test/test.pbf',
                callback: function(err, p){
                    if(err){
                        should.fail();
                        return done();
                    }

                    parser = p;

                    return done();
                }
            });
        });

        after(function(done){
            parser.close(function(err){
                if(err){
                    should.fail();
                    return done();
                }

                return done();
            });
        });

        it('has one OSMHeader', function(){
            var blocks = parser.findFileBlocksByBlobType('OSMHeader');

            blocks.length.should.be.equal(1);
        });

        describe('and first OSMHeader exists', function(){
            var osmHeaderBlock, osmHeader;

            before(function(done){
                osmHeaderBlock = parser.findFileBlocksByBlobType('OSMHeader')[0];
                parser.readBlock(osmHeaderBlock, function(err, block){
                    if(err){
                        should.fail();

                        return done();
                    }

                    osmHeader = block;

                    return done();
                });
            });

            it('then writingprogram is "0.40.1"', function(){
                osmHeader.writingprogram.should.be.equal('0.40.1');
            });
        });

    });

});
