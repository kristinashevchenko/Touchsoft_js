/* Написать тесты на функции spiral и quadraticEquation */
describe("quadraticEquation", function() {
    it("при D=0", function() {
        let b=quadraticEquation(1, 12, 36);
        expect([-6]).to.include.members(b);
        expect(b).to.include.members([-6]);

        b=quadraticEquation(1, 4 ,4);
        expect([-2]).to.include.members(b);
        expect(b).to.include.members([-2]);
    });

    it("при D<0", function() {
        let b=quadraticEquation(1, -8, 72);
        expect([]).to.include.members(b);
        expect(b).to.include.members([]);
    });

    it("при D>0", function() {
        let b=quadraticEquation(1, 5, 4);
        expect([-4,-1]).to.include.members(b);
        expect(b).to.include.members([-4,-1]);

        b=quadraticEquation(1, 10, 9);
        expect([-9,-1]).to.include.members(b);
        expect(b).to.include.members([-9,-1]);

        b=quadraticEquation(1, 6, 1);
        expect([-0.1715728752538097, -5.82842712474619]).to.include.members(b);
        expect(b).to.include.members([-0.1715728752538097, -5.82842712474619]);

        b=quadraticEquation(2, 8, -70);
        expect([4.244997998398398, -8.244997998398398]).to.include.members(b);
        expect(b).to.include.members([4.244997998398398, -8.244997998398398]);
    });

    it("при b=0", function() {
        let b=quadraticEquation(2, 0, 8);
        expect([]).to.include.members(b);
        expect(b).to.include.members([]);

        b=quadraticEquation(2, 0, -8);
        expect([2,-2]).to.include.members(b);
        expect(b).to.include.members([2,-2]);
    });

    it("при c=0", function() {
        let b=quadraticEquation(1, 5, 0);
        expect([0,-5]).to.include.members(b);
        expect(b).to.include.members([]);

        b=quadraticEquation(2, -9, 0);
        expect([0,4.5]).to.include.members(b);
        expect(b).to.include.members([0,4.5]);

        b=quadraticEquation(2, 0, 0);
        expect([0]).to.include.members(b);
        expect(b).to.include.members([0]);
    });

    it("при a=0", function() {
        let b=quadraticEquation(0, 5, 8);
        expect([-8/5]).to.include.members(b);
        expect(b).to.include.members([-8/5]);

        b=quadraticEquation(0, 0, 9);
        expect([]).to.include.members(b);
        expect(b).to.include.members([]);

        b=quadraticEquation(0, 0, 0);
        expect([]).to.include.members(b);
        expect(b).to.include.members([]);

        b=quadraticEquation(0, 8, 0);
        expect([0]).to.include.members(b);
        expect(b).to.include.members([0]);
    });

});


describe("spiral", function() {
    it("m=n", function() {
        let b=String(spiral([[4, 5], [6, 7]]));
        assert.include(b,String([4,5,7,6]));

        b=String(spiral([[4, 5,90], [6, 7,123],[23,11,12]]));
        assert.include(b,String([4,5,90,123,12,11,23,6,7]));

        b=String(spiral([[4]]));
        assert.include(b,String([4]));
    });

    it("m<n", function() {

       let  b=String(spiral([[4, 5,90]]));
        assert.include(b,String([4,5,90]));

       b=String(spiral([
           [1, 2, 3, 4, 5],
           [6, 7, 8, 9, 10],
           [11, 12, 13, 14, 15],
           [16, 17, 18, 19, 20]
       ]));
        assert.include(b,String( [1,2,3,4,5,10,15,20,19,18,17,16,11,6,7,8,9,14,13,12]));

        b=String(spiral([[4, 5,90,10,13,17], [6, 7,123,14,15,16],[23,11,12,18,19,20]]));
        assert.include(b,String([4,5,90,10,13,17,16,20,19,18,12,11,23,6,7,123,14,15]));
    });

    it("m>n", function() {

        let  b=String(spiral([[4, 5,90],[2,3,5],[6,7,8],[9,10,11],[12,13,14]]));
        assert.include(b,String([4,5,90,5,8,11,14,13,12,9,6,2,3,7,10]));

        b=String(spiral([
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
            [21,22,23,24,25],
            [26,27,28,29,30]
        ]));
        assert.include(b,String( [1,2,3,4,5,10,15,20,25,30,29,28,27,26,21,16,11,6,7,8,9,14,19,24,23,22,17,12,13,18]));

        b=String(spiral([[1], [2]]));
        assert.include(b,String([1,2]));
    });



});
