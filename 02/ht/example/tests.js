/* добавить тесты */
describe("getCounter", function() {
    it("initialization", function() {
        assert.equal(getCounter(5).counter,5);
        assert.equal(getCounter().counter,0);
    });

    it("add", function() {
        let c=getCounter(4);
        c.add(60);
        assert.equal(c.counter,64);
        c=getCounter();
        c.add(-5);
        assert.equal(c.counter,-5);
    });
    it("reset", function() {
        let c=getCounter(4);
        c.add(60).reset();
        assert.equal(c.counter,0);
        c=getCounter();
        c.reset();
        assert.equal(c.counter,0);
    });
    it("combination", function() {
        let c=getCounter(4);
        c.add(60).reset().add(7).add(-6);
        assert.equal(c.counter,1);
        c=getCounter().add(-4).add(6).reset().add(100);
        assert.equal(c.counter,100);
        c = getCounter(5);
        c.add(4).add(3).reset().add(8);
        assert.equal(c.counter,8);
    });
});

describe("F", function() {
    it("with new", function() {
        try{
            let a=new F();
        }catch(e){
            assert.equal(e.message,"Can't use F with new");
        }
    });

    it("without new", function() {
        try{
            let a=F();
            assert.isOk(a,"Can use F without new");
        }catch(e){
        }
    });

});
describe("curry", function() {
    function sum2(x, y) {
        return x + y;
    }
    function sum4(a, b, c, d) {
        return a + b + c + d;
    }
    it("sum2", function() {
        assert.equal(curry(sum2)(1)(2),3);
    });
    it("sum4", function() {
        assert.equal(curry(sum4)(1)(2)(3)(4),10);
    });
});

describe("myCall", function() {
    function sum() {
        return this.x + this.y;
    }
    function sum2(x,y) {
        return x + y;
    }
    it("sum", function() {
        assert.equal(sum.myCall({x:1,y:2}),3);

    });
    it("sum2", function() {
        assert.equal(sum2.myCall({},1,2),3);
    });
});

describe("drawInteractiveCalendar", function() {

    it("nextMonth", function() {
        let html1 = drawInteractiveCalendar(2018, 11, document.getElementById("calendar"));
        let html2 = drawInteractiveCalendar(2018, 12, document.getElementById("calendar"));
        assert.isOk(html1.innerHTML.indexOf("30") > 0);
        assert.isOk(html1.innerHTML.indexOf("31") < 0);
        assert.isOk(html2.innerHTML.indexOf("30") > 0);
        assert.isOk(html2.innerHTML.indexOf("31") > 0);

    });
    it("previousMonth", function() {
        let html1 = drawInteractiveCalendar(2018, 11, document.getElementById("calendar"));
        let html2 = drawInteractiveCalendar(2018, 10, document.getElementById("calendar"));
        assert.isOk(html1.innerHTML.indexOf("30") > 0);
        assert.isOk(html1.innerHTML.indexOf("31") < 0);
        assert.isOk(html2.innerHTML.indexOf("30") > 0);
        assert.isOk(html2.innerHTML.indexOf("31") > 0);

    });

});


describe("throttle", function() {
   let result=0;
    function func(a) {
        result += a;
    }
    it("первый вызов срабатывает тут же", function() {
        throttle(func,1000)(1);
        assert.equal(result, 1);
    });
    it(" срабатывание  1000 мс", function() {
        throttle(func,1000)(2);
        assert.equal(result, 3);
        throttle(func,1000)(3);
        assert.equal(result, 6);

    });
});