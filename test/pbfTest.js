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

        it('has one OSMData', function(){
            var blocks = parser.findFileBlocksByBlobType('OSMData');

            blocks.length.should.be.equal(1);
        });

        describe('and first OSMData exists', function(){
            var osmDataBlock, osmData;

            before(function(done){
                osmDataBlock = parser.findFileBlocksByBlobType('OSMData')[0];
                parser.readBlock(osmDataBlock, function(err, block){
                    if(err){
                        should.fail();

                        return done();
                    }

                    osmData = block;

                    return done();
                });
            });

            it('then first stringtable entry is smsm1', function(){
                osmData.stringtable.getEntry(1).should.be.equal('smsm1');
            });

            it('then granulatiry is 100', function(){
                osmData.granularity.should.be.equal(100);
            });

            it('then two primitivegroups exist', function(){
                osmData.primitivegroup.length.should.be.equal(2);
            });

            it('then second primitivegroup has 0 nodes', function(){
                osmData.primitivegroup[1].nodesView.length.should.be.equal(0);
            });

            describe('and first primitivegroup exists', function(){
                var pg;

                before(function(){
                    pg = osmData.primitivegroup[0];
                });

                it('then pg has 6 nodes', function(){
                    pg.nodesView.length.should.be.equal(6);
                });

                it('then first node has latitude 51.5074089', function(){
                    pg.nodesView.get(0).lat.should.be.equal(51.5074089);
                });

                it('then first node has longitude -0.1080108', function(){
                    pg.nodesView.get(0).lon.should.be.equal(-0.1080108);
                });
            });

        });

    });

});
