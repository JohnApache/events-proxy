const expect = require("chai").expect;
const EventsProxy = require('./events')
describe('事件代理插件测试', function () {
    it('单事件绑定可以在异步环境触发', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp = 1;
            events.emit('Test1');
        }, 100);
        events.register('Test1', () => {
            expect(tmp).to.be.equal(1);
            done();
        })
        expect(tmp).to.be.equal(0);
    })
    it('单事件可以重复绑定多次，并执行每一次绑定的方法', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp = 1;
            events.emit('Test1');
            done();
        }, 100);
        events.register('Test1', () => {
            expect(tmp).to.be.equal(1);
            tmp++
        })
        events.register('Test1', () => {
            expect(tmp).to.be.equal(2);
            tmp++
        })
        expect(tmp).to.be.equal(0);
    })
    it('合成事件 事件数组 可以绑定', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1');
            setTimeout(() => {
                tmp++
                events.emit('Test2');
                done();
            }, 100)
        }, 100);
        events.register(['Test1', 'Test2'], () => {
            expect(tmp).to.be.equal(2);
        })
        expect(tmp).to.be.equal(0);
    })

    it('相同合成事件 事件数组 可以多次绑定', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1');
            setTimeout(() => {
                tmp++
                events.emit('Test2');
                done();
            }, 100)
        }, 100);
        events.register(['Test1', 'Test2'], () => {
            expect(tmp).to.be.equal(2);
            tmp++;
        })
        events.register(['Test1', 'Test2'], () => {
            expect(tmp).to.be.equal(3);
            tmp++
        })
        expect(tmp).to.be.equal(0);
    })

    it('部分相同合成事件 事件数组 可以多次绑定', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1');
            setTimeout(() => {
                tmp++
                events.emit('Test2');
                setTimeout(() => {
                    tmp++
                    events.emit('Test3');
                    done();
                }, 100)
            }, 100)
        }, 100);
        events.register(['Test1', 'Test2'], () => {
            expect(tmp).to.be.equal(2);
        })
        events.register(['Test1', 'Test2', 'Test3'], () => {
            expect(tmp).to.be.equal(3);
        })
        expect(tmp).to.be.equal(0);
    })
    it('合成事件和单事件相同 可以多次绑定', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1');
            setTimeout(() => {
                tmp++
                events.emit('Test2');
                setTimeout(() => {
                    tmp++
                    events.emit('Test3');
                    done();
                }, 100)
            }, 100)
        }, 100);
        events.register(['Test1', 'Test2'], () => {
            expect(tmp).to.be.equal(2);
        })
        events.register('Test1', () => {
            expect(tmp).to.be.equal(1);
        })
        events.register('Test2', () => {
            expect(tmp).to.be.equal(2);
        })
        events.register('Test3', () => {
            expect(tmp).to.be.equal(3);
        })
        expect(tmp).to.be.equal(0);
    })

    it('对象批量事件绑定和其他单事件相同 可以多次绑定', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1');
            setTimeout(() => {
                tmp++
                events.emit('Test2');
                setTimeout(() => {
                    tmp++
                    events.emit('Test3');
                    done();
                }, 100)
            }, 100)
        }, 100);
        events.register(['Test1', 'Test2'], () => {
            expect(tmp).to.be.equal(2);
        })
        events.register('Test1', () => {
            expect(tmp).to.be.equal(1);
        })
        events.register('Test2', () => {
            expect(tmp).to.be.equal(2);
        })
        events.register('Test3', () => {
            expect(tmp).to.be.equal(3);
        })
        events.register({
            'Test1': () => {
                expect(tmp).to.be.equal(1);
            },
            'Test2': () => {
                expect(tmp).to.be.equal(2);
            },
            'Test3': () => {
                expect(tmp).to.be.equal(3);
            }
        })
        expect(tmp).to.be.equal(0);
    })

    it('单事件绑定传递数据', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1', tmp + 3);
            setTimeout(() => {
                tmp++
                events.emit('Test2', tmp + 4);
                setTimeout(() => {
                    tmp++
                    events.emit('Test3', tmp + 5);
                    done();
                }, 100)
            }, 100)
        }, 100);
        events.register('Test1', (data) => {
            expect(data).to.be.equal(4);
        })
        events.register('Test2', (data) => {
            expect(data).to.be.equal(6);
        })
        events.register('Test3', (data) => {
            expect(data).to.be.equal(8);
        })
        expect(tmp).to.be.equal(0);
    })

    it('合成事件绑定传递数据', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1', tmp + 3);
            setTimeout(() => {
                tmp++
                events.emit('Test2', tmp + 4);
                setTimeout(() => {
                    tmp++
                    events.emit('Test3', tmp + 5);
                    done();
                }, 100)
            }, 100)
        }, 100);
        events.register(['Test1', 'Test2', 'Test3'], (...data) => {
            expect(data).to.be.deep.equal([4, 6, 8]);
        })
        expect(tmp).to.be.equal(0);
    })


    it('对象批量事件绑定传递数据', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1', tmp + 3);
            setTimeout(() => {
                tmp++
                events.emit('Test2', tmp + 4);
                setTimeout(() => {
                    tmp++
                    events.emit('Test3', tmp + 5);
                    done();
                }, 100)
            }, 100)
        }, 100);
        events.register({
            'Test1': (data) => {
                expect(data).to.be.equal(4);
            },
            'Test2': (data) => {
                expect(data).to.be.equal(6);
            },
            'Test3': (data) => {
                expect(data).to.be.equal(8);
            }
        })
        expect(tmp).to.be.equal(0);
    })

    it('混合对象数组单事件绑定传递数据', function (done) {
        const events = new EventsProxy();
        var tmp = 0;
        setTimeout(() => {
            tmp++;
            events.emit('Test1', tmp + 3);
            setTimeout(() => {
                tmp++
                events.emit('Test2', tmp + 4);
                setTimeout(() => {
                    tmp++
                    events.emit('Test3', tmp + 5);
                    done();
                }, 100)
            }, 100)
        }, 100);
        events.register({
            'Test1': (data) => {
                expect(data).to.be.equal(4);
            },
            'Test2': (data) => {
                expect(data).to.be.equal(6);
            },
            'Test3': (data) => {
                expect(data).to.be.equal(8);
            }
        })
        expect(tmp).to.be.equal(0);
    })
})
