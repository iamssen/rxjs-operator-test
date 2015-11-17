import {Observable} from '@reactivex/rxjs/dist/cjs/Rx';
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';
let RSVP = require('rsvp');

describe('Static Creators', () => {
	it('defer', (done) => {
		// Observable factory function을 통해서
		// Observable instance를 Lazy Loading 하는 기능인듯
		subscribe(done,
			Observable.defer<number>(() => Observable.interval(100).take(4))
		);
	});

	it('empty', (done) => {
		// 단순히 빈 Observable instance를 만든다
		subscribe(done,
			Observable.empty<number>()
		);
	});

	it('from', (done) => {
		// Iterable 즉, Collection 형식의 인자면 뭐든 되는듯
		subscribe(done,
			Observable.from<number>([1, 2, 3])
		);
		// new Set(['a', 'b']) → a, b
		// new Map()
		// 'string' → s, t, r, i, n, g
	});

	it('fromArray', (done) => {
		subscribe(done,
			Observable.fromArray<number>([1, 2, 3])
		);
	});

	it('fromEvent', (done) => {
		// Event 발생시에 작동을 하게 되는 녀석...
		// 가장 중요할듯...
		// TODO fromEvent().loadData() 처럼 fromEvent() 이후 할 작업들을 어떻게 연동시킬지가 중요

		// var input = $('#input')
		// Observable.fromEvent(input, 'click', ...);
		// input.trigger('click')

		let eventEmitter:EventEmitter = new EventEmitter;
		setTimeout(()=>eventEmitter.emit('helloEvent'), 1000);
		setTimeout(()=>eventEmitter.emit('helloEvent'), 2000);

		subscribe(done,
			Observable.fromEvent(eventEmitter, 'helloEvent', () => ['event', 'dispatched!']).take(2)
		);
	});

	it('fromEventPattern', (done) => {
		// 기본 fromEvent() 와 같지만
		// 수동으로 event listener 등록을 할 수 있다는 점이 다르다

		let eventEmitter:EventEmitter = new EventEmitter;
		setTimeout(()=>eventEmitter.emit('helloEvent'), 1000);
		setTimeout(()=>eventEmitter.emit('helloEvent'), 2000);

		subscribe(done,
			Observable.fromEventPattern(
				(eventListener) => {
					console.log('add listener');
					eventEmitter.addListener('helloEvent', eventListener)
				},
				(eventListener) => {
					console.log('remove listener');
					eventEmitter.removeListener('helloEvent', eventListener)
				},
				() => ['event', 'dispatched!']
			).take(2)
		);
	});

	it('fromPromise', (done) => {
		// Promise를 사용한 비동기 결과물을 사용
		// Data Loading 처리 같은걸 할 때 도움이 될듯

		subscribe(done,
			Observable.fromPromise(new RSVP.Promise((resolve, reject) => {
				setTimeout(()=>resolve(42), 1000);
			}))
		);
	});

	it('interval', (done) => {
		// interval 기간마다 1이 증가한 값을 만든다.
		// @return Observable<number>
		subscribe(done,
			Observable.interval(1000) // 1000ms 마다 실행된다.
				.take(4) // 4개로 실행 제한 (0~3) → 없으면 무제한으로 실행된다
		);
		/*
		 아래와 같이 실행되지만 interval(기간)에 따라 실행되는 속도가 다르다 (item 당 1000ms로 실행됨)
		 Next 0
		 Next 1
		 Next 2
		 Next 3
		 */
	});

	it('of', (done) => {
		// from() 과 비슷하게 값으로 Observable을 만들어내는 방법 중 하나. 가장 간단한듯...
		subscribe(done,
			Observable.of<number>(1, 2, 3, 4)
		);
	});

	it('range', (done) => {
		// 간단하게 숫자 값들을 만들어내는 기능
		// (start: number, count: number, scheduler?: Scheduler) => Observable<number>
		subscribe(done,
			Observable.range(10, 6)
		);
	});

	it('timer', (done) => {
		// timer(10000) 과 같이 첫 번째 인자만 던지면 10000ms 이후에 0을 던지면서 끝난다 (timeout 기능이라고 생각할 수 있다)
		// timer(10000, 10000) 과 같이 두 번째도 던지면, interval 처럼 무한 반복하게 되는데, 다음 실행을 위한 시간이 된다
		// (첫 실행 시간, 이후 실행 시간)
		subscribe(done,
			Observable.timer(1000, 10).take(10)
		);
	});
});
