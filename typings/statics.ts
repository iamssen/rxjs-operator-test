import {Observable} from '@reactivex/rxjs/dist/cjs/Rx';
import {EventEmitter} from 'events';
var RSVP = require('rsvp');

// TODO Scheduler? 에 대한 정확한 정체 파악을 못했다

//=============================================
// Combining Operators
//=============================================
// Observable.combineLatest
export function combineLatest():Observable<any> {
	let source1:Observable<number> = Observable.interval(100);
	let source2:Observable<string> = Observable.interval(200).map<string>((i:number) => String.fromCharCode('A'.charCodeAt(0) + i));

	// http://rxmarbles.com/#combineLatest
	//
	// -1--------2-----------3---4----
	// ---A----B------C---D--------E--
	// ===============================
	// ---1----1-2----2---2--3---4-4--
	// ---A----B-B----C---D--D---D-E--
	//
	// 위와 같이 진행을 합친다.
	// 1. 흐름 상에서 마지막 값들을 합친다 (1A와 같이)
	// 2. 값의 변경이 일어날 때 마다 합친 값을 도출한다
	// 3. A가 시작되기 이전에 1과 합칠게 없기 때문에 무시된다 (값이 모두 있을때부터 시작)

	// (...sources: Observable[], combineFunction: (...values) => combineValue)
	return Observable.combineLatest<string>(source1, source2, (v1:number, v2:string) => v1 + v2)
		.take(10);
}

// Observable.concat
export function concat():Observable<any> {
	let source1:Observable<number> = Observable.interval(100).take(4);
	let source2:Observable<string> = Observable.interval(200).take(3).map<string>((i:number) => String.fromCharCode('A'.charCodeAt(0) + i));
	let source3:Observable<number> = Observable.interval(10).take(4);

	// http://rxmarbles.com/#concat
	//
	// -1--------2-----------3---4----
	// ---A----B------C---D--------E--
	// ===============================
	// -1--------2-----------3---4-------A----B------C---D--------E--
	//
	// 단순히 진행들을 직렬로 합친다

	return Observable.concat<any>(source1, source2, source3)
		.take(10);
}

// Observable.merge
export function merge():Observable<any> {
	let source1:Observable<number> = Observable.interval(100);
	let source2:Observable<string> = Observable.interval(200).map<string>((i:number) => String.fromCharCode('A'.charCodeAt(0) + i));

	// http://rxmarbles.com/#merge
	//
	// -1--------2-----------3---4----
	// ---A----B------C---D--------E--
	// ===============================
	// -1-A----B-2----C---D--3---4-E--
	//
	// 단순히 흐름을 합친다

	// (...sources: Observable[], combineFunction: (...values) => combineValue)
	return Observable.merge<any>(source1, source2)
		.take(10);
}

// Observable.zip
export function zip():Observable<any> {
	let source1:Observable<number> = Observable.interval(100);
	let source2:Observable<string> = Observable.interval(200).map<string>((i:number) => String.fromCharCode('A'.charCodeAt(0) + i));

	// http://rxmarbles.com/#zip
	//
	// -1--------2-----------3---4----
	// ---A----B------C---D--------E--
	// ===============================
	// ---1------2-----------3---4----
	// ---A------B-----------C---D----
	//
	// 두 흐름을 순서대로 합친다
	// 1. 1 → A 나 B → 2 에서 볼 수 있듯이 두 흐름을 순서대로 합친다
	// 2. 순서 상에서 더 뒤늦게 등장하는 흐름에 등장한다

	return Observable.zip<string>(source1, source2, (v1:number, v2:string) => v1 + v2)
		.take(10);
}

//Observable.forkJoin
export function forkJoin():Observable<any> {
	// 흐름들의 최종 결과를 합치는 기능인듯 싶다
	return Observable.forkJoin(
		Observable.interval(100).take(6) // 0 → 5 까지 진행되기 때문에 5 가 된다
		, Observable.range(0, 10) // 0 → 9 까지 진행되기 때문에 9 가 된다
		, Observable.fromArray([1, 2, 3]) // length가 3이기 때문에 3이 된다
		, (v1:number, v2:number, v3:number) => v1 + v2 + v3 // 값들을 어떻게 합칠지 결과 처리
	);
}

//=============================================
// Creators
//=============================================
// Observable.defer
export function defer():Observable<any> {
	// Observable factory function을 통해서
	// Observable instance를 Lazy Loading 하는 기능인듯
	return Observable.defer<number>(() => Observable.interval(100).take(4));
}

// Observable.empty
export function empty():Observable<any> {
	// 단순히 빈 Observable instance를 만든다
	return Observable.empty<number>();
}

// Observable.from
export function from():Observable<any> {
	// Iterable 즉, Collection 형식의 인자면 뭐든 되는듯
	return Observable.from<number>([1, 2, 3]);
	// new Set(['a', 'b']) → a, b
	// new Map()
	// 'string' → s, t, r, i, n, g
}

// Observable.fromArray
export function fromArray():Observable<any> {
	return Observable.fromArray<number>([1, 2, 3]);
}

// Observable.fromEvent
export function fromEvent():Observable<any> {
	// Event 발생시에 작동을 하게 되는 녀석...
	// 가장 중요할듯...
	// TODO fromEvent().loadData() 처럼 fromEvent() 이후 할 작업들을 어떻게 연동시킬지가 중요

	// var input = $('#input')
	// Observable.fromEvent(input, 'click', ...);
	// input.trigger('click')

	var eventEmitter:EventEmitter = new EventEmitter;
	setTimeout(()=>eventEmitter.emit('helloEvent'), 1000);
	setTimeout(()=>eventEmitter.emit('helloEvent'), 2000);

	return Observable.fromEvent(eventEmitter, 'helloEvent', () => ['event', 'dispatched!']).take(2);
}

// Observable.fromEventPattern
export function fromEventPattern():Observable<any> {
	// 기본 fromEvent() 와 같지만
	// 수동으로 event listener 등록을 할 수 있다는 점이 다르다

	var eventEmitter:EventEmitter = new EventEmitter;
	setTimeout(()=>eventEmitter.emit('helloEvent'), 1000);
	setTimeout(()=>eventEmitter.emit('helloEvent'), 2000);

	return Observable.fromEventPattern(
		(eventListener) => {
			console.log('add listener');
			eventEmitter.addListener('helloEvent', eventListener)
		},
		(eventListener) => {
			console.log('remove listener');
			eventEmitter.removeListener('helloEvent', eventListener)
		},
		() => ['event', 'dispatched!']
	).take(2);
}

// Observable.fromPromise
export function fromPromise():Observable<any> {
	// Promise를 사용한 비동기 결과물을 사용
	// Data Loading 처리 같은걸 할 때 도움이 될듯

	return Observable.fromPromise(new RSVP.Promise((resolve, reject) => {
		setTimeout(()=>resolve(42), 1000);
	}));
}

// Observable.interval
export function interval():Observable<any> {
	// interval 기간마다 1이 증가한 값을 만든다.
	// @return Observable<number>
	return Observable.interval(1000) // 1000ms 마다 실행된다.
		.take(4); // 4개로 실행 제한 (0~3) → 없으면 무제한으로 실행된다
	/*
	 아래와 같이 실행되지만 interval(기간)에 따라 실행되는 속도가 다르다 (item 당 1000ms로 실행됨)
	 Next 0
	 Next 1
	 Next 2
	 Next 3
	 */
}

// Observable.of
export function of():Observable<any> {
	// from() 과 비슷하게 값으로 Observable을 만들어내는 방법 중 하나. 가장 간단한듯...
	return Observable.of<number>(1, 2, 3, 4);
}

// Observable.range
export function range():Observable<any> {
	// 간단하게 숫자 값들을 만들어내는 기능
	// (start: number, count: number, scheduler?: Scheduler) => Observable<number>
	return Observable.range(10, 6);
}

// Observable.timer
export function timer():Observable<any> {
	// timer(10000) 과 같이 첫 번째 인자만 던지면 10000ms 이후에 0을 던지면서 끝난다 (timeout 기능이라고 생각할 수 있다)
	// timer(10000, 10000) 과 같이 두 번째도 던지면, interval 처럼 무한 반복하게 되는데, 다음 실행을 위한 시간이 된다
	// (첫 실행 시간, 이후 실행 시간)
	return Observable.timer(10000, 10).take(10);
}

//=============================================
// Unidentified
//=============================================
// Observable.create
// 뭔지 모르겠다
//export function create():Observable<any> {
//	return Observable.create((observer:Observable<any>) => {
//		observer.startWith(1);
//	});
//}

// Observable.never
function never():Observable<any> {
	// 아무것도 하지 않고 대기하게 만든다
	// TODO 어떻게 풀어야 할지 방법을 알아야 한다
	return Observable.never();
}

// Observable.throw
function _throw():Observable<any> {
	// throw() 를 사용하는 지점이 애매...
	return Observable.throw(new Error('error message!'))
		.catch((error:Error, source, caught) => {
			console.log(error, source, caught);
			return Observable.of(99);
		})
		.finally(()=>console.log('Finally'));
}



