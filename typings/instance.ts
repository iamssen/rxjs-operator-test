import {Observable, Subject, Scheduler} from '@reactivex/rxjs/dist/cjs/Rx';
import {GroupedObservable} from "@reactivex/rxjs/dist/cjs/operators/groupBy-support";
import {Operator} from "@reactivex/rxjs/dist/cjs/Operator";

//=============================================
// Combining Operators
//=============================================
// Observable.sample
// TODO 용도에 대해서 고민해보기
export function sample():Observable<any> {
	let observable1:Observable<number> = Observable.interval(100);
	let observable2:Observable<string> = Observable.interval(200).map<string>((i:number) => String.fromCharCode('A'.charCodeAt(0) + i));

	// http://rxmarbles.com/#sample
	//
	// -1--------2-----------3---4----
	// ---A----B------C---D--------E--
	// ===============================
	// ---1-----------2------------4--
	//
	// 첫 번째 흐름을 두 번째 흐름을 통해 샘플링 한다
	// 1. 위에 보이는 것 처럼 1 → A = 1, 2 → C = 2, 4 → E = 4 처럼 첫 번째 흐름 뒤에 오는 두 번째 흐름을 기준으로 샘플링한다
	// 2. 3 → 4 → E 처럼 3 바로 뒤에 오는 두 번째 흐름이 없는 경우 무시한다

	// (notifier: Observable<any>) => Observable<T>;
	return observable1.sample(observable2)
		.take(10);
}

// Observable.startWith
export function startWith():Observable<any> {
	let observable1:Observable<string> = Observable.interval(200).take(3).map<string>((i:number) => String.fromCharCode('A'.charCodeAt(0) + i));

	// http://rxmarbles.com/#startWith
	//
	// ---A----B------C---D--------E--
	// startWith(1)
	// ===============================
	// 1--A----B------C---D--------E--
	//
	// 시작점을 특정 값으로 넣는다
	// 흐름의 시작점을 교체한다고 볼 수 있을 듯 싶다
	// TweenLite.to({alpha:1}) 이전에 alpha = 0 으로 초기화 하는 개념과 유사할듯

	return observable1.startWith('1');
}

// Observable.withLatestFrom
// TODO 용도에 대해서 생각해보기
export function withLatestFrom():Observable<any> {
	let observable1:Observable<number> = Observable.interval(100);
	let observable2:Observable<string> = Observable.interval(200).map<string>((i:number) => String.fromCharCode('A'.charCodeAt(0) + i));

	// http://rxmarbles.com/#sample
	//
	// -1--------2-----------3---4----
	// ---A----B------C---D--------E--
	// ===============================
	// ----------2-----------3---4----
	// ----------B-----------D---D----
	//
	// 첫 번째 흐름을 두 번째 흐름을 통해 샘플링 한다
	// 1. 위에 보이는 것 처럼 1 → A = 1, 2 → C = 2, 4 → E = 4 처럼 첫 번째 흐름 뒤에 오는 두 번째 흐름을 기준으로 샘플링한다
	// 2. 3 → 4 → E 처럼 3 바로 뒤에 오는 두 번째 흐름이 없는 경우 무시한다

	return observable1.withLatestFrom(observable2)
		.take(10);
}

//=============================================
// Transforming Operators
//=============================================
// Observable.delay
export function delay():Observable<any> {
	// 특정 시간만큼 결과가 나오는 것을 지연시킨다 (ms)
	return Observable.range(0, 5)
		.delay(1000);
}

// Observable.debounce
interface DebounceItem {
	value:number;
	time:number;
}

export function debounce():Observable<any> {
	var times:DebounceItem[] = [
		{value: 1, time: 100},
		{value: 22, time: 160},
		{value: 2, time: 200},
		{value: 32, time: 360},
		{value: 3, time: 400},
		{value: 4, time: 800},
		{value: 5, time: 1600}
	];

	// debounceTime과 동일 (단지 debounce 시에 딜레이 시킬 시간을 변경 시킬 수 있는건가?)
	return Observable.from(times)
		.flatMap((item:DebounceItem)=>Observable.of(item.value).delay(item.time))
		.debounce((x) =>  Observable.timer(50));
}

export function debounceTime():Observable<any> {
	var times:DebounceItem[] = [
		{value: 1, time: 100},
		{value: 22, time: 160},
		{value: 2, time: 200},
		{value: 32, time: 360},
		{value: 3, time: 400},
		{value: 4, time: 800},
		{value: 5, time: 1600}
	];

	// 1. delay 처럼 모든 시간을 민다
	// 2. due 보다 적은 간격으로 배치된 것들은 제외한다
	return Observable.from(times)
		.flatMap((item:DebounceItem)=>Observable.of(item.value).delay(item.time))
		.debounceTime(50);
}

// Observable.map
export function map():Observable<any> {
	// Javascript의 forEach()와 비슷
	// map: <R>(project: (x: T, ix?: number) => R, thisArg?: any) => Observable<R>
	// T를 받아들여서 R로 전환하는 식이다
	return Observable.interval(100)
		.map((x, index) => x * 10)
		.take(10);
}

// Observable.mapTo
export function mapTo():Observable<any> {
	// ?????
	// 뭐지 이게? 걍 하드코딩 식으로 특정 값으로 바꿔버린다
	// mapTo: <R>(value: R) => Observable<R>
	return Observable.interval(100)
		.mapTo('a')
		.take(10);
}

// Observable.scan = Observable.reduce
export function scan():Observable<any> {
	// Waterfall 형태
	// map 처럼 항목을 forEach 시키지만,
	// 더해서 마지막으로 계산된 결과를 던져주기 때문에 항목들과 결과들을 지속적으로 이어서 계산할 수 있다
	return Observable.fromArray([1, 2, 3, 4, 5])
		.scan<number>((acc:number, x:number) => acc + x);
}


//=============================================
// Filtering Operators
//=============================================
// Observable.distinctUntilChanged
export function distinctUntilChanged():Observable<any> {
	// 변화가 없는 값 (이전 값 = 현재 값) 을 배제한다
	return Observable.of(1, 1, 2, 2, 2, 3, 4, 4, 5)
		// {x:1}, {x:1} 과 같은 것들을 위해서 마련된 compare function 인듯
		// .distinctUntilChanged((x, y) => x === y)
		.distinctUntilChanged();
}

// Observable.filter
export function filter():Observable<any> {
	// 값을 필터링 한다
	return Observable.of(2, 30, 22, 5, 60, 1)
		// 10 미만의 경우 배제한다
		.filter((x:number)=>x > 10);
}

// Observable.skip
export function skip():Observable<any> {
	// 앞에서 특정 갯수를 잘라낸다
	return Observable.of(1, 2, 3, 4, 5)
		.skip(2);
	// → 3, 4, 5
}

export function skip2():Observable<any> {
	// skip()과 take()를 같이 쓰면
	// substring(start, count) 같은 효과를 가질 수 있다
	return Observable.interval(1000)
		.skip(2)
		.take(5);
}

// Observable.skipUntil
export function skipUntil():Observable<any> {
	// 앞에서 특정 시간 이전 것들을 잘라낸다
	return Observable.timer(0, 1000)
		.skipUntil(Observable.timer(5000))
		.take(5);
}

// Observable.takeUntil
export function takeUntil():Observable<any> {
	// 특정 시간 까지만 가져온다 (take를 시간 기준으로 사용)
	return Observable.timer(0, 1000)
		.takeUntil(Observable.timer(5000));
}

export function takeUntil2():Observable<any> {
	// skipUntil() 과 takeUntil()을 같이 쓰면
	// ----------------------------
	// ----skipUntil
	// --------------------takeUntil
	// ----================--------
	// 위처럼 시간의 이내의 부분만 잘라낼 수 있다
	return Observable.timer(0, 1000)
		.skipUntil(Observable.timer(5000))
		.takeUntil(Observable.timer(10000));
}

//=============================================
// Mathematical Operators
//=============================================
// Observable.count
export function count():Observable<any> {
	return Observable.of(1, 2, 3, 4, 5, 6, 7)
		.count();
}

export function count2():Observable<any> {
	// filter function 을 동반하면 filtering 된 아이템들의 갯수만을 센다
	return Observable.of(2, 30, 22, 5, 60, 1)
		.count((x:number)=>x > 10);
}

// Observable.reduce = Observable.scan
export function reduce():Observable<any> {
	// ??? scan() 하고 똑같다?
	// reduce: <R>(project: (acc: R, x: T) => R, seed?: R) => Observable<R>
	// scan: <R>(project: (acc: R, x: T) => R, acc?: R) => Observable<R>
	return Observable.fromArray([1, 2, 3, 4, 5])
		.reduce<number>((acc:number, x:number) => acc + x);
}

//=============================================
// Boolean Operators
//=============================================


//=============================================
// Combine Operators
//=============================================
// Observable.combineAll
// Observable.combineLatest
// Observable.concat
// Observable.concatAll
// Observable.concatMap
// Observable.concatMapTo
// Observable.merge
// Observable.mergeAll
// Observable.zip
// Observable.zipAll


// Observable.catch
// Observable.finally

//=============================================
//
//=============================================
// Observable.buffer
// http://reactivex.io/documentation/operators/buffer.html
export function buffer():Observable<any> {
	// 특정 시간 단위로 값들을 묶어서 []로 만든다
	return Observable.interval(100)
		.buffer(Observable.interval(300))
		.take(5);
	/*
	 Next 0,1 ← Array at 306:306
	 Next 2,3,4 ← Array at 304:610
	 Next 5,6,7 ← Array at 302:912
	 Next 8,9,10 ← Array at 300:1212
	 Next 11,12,13 ← Array at 305:1517
	 */
}

// Observable.bufferCount
export function bufferCount():Observable<any> {
	// 항목들을 갯수별로 묶는다
	return Observable.range(1, 6)
		.bufferCount(3, 3);
	/*
	 .bufferCount(3, 3)
	 Next 1,2,3 ← Array at 5:5
	 Next 4,5,6 ← Array at 0:5

	 .bufferCount(3, 2)
	 Next 1,2,3 ← Array at 4:4
	 Next 3,4,5 ← Array at 1:5
	 Next 5,6 ← Array at 0:5

	 .bufferCount(3, 4)
	 Next 1,2,3 ← Array at 4:4
	 Next 5,6 ← Array at 1:5
	 */
}

// Observable.bufferTime
export function bufferTime():Observable<any> {
	// buffer(Observable.interval(500)) → bufferTime(500)
	// 축약 버전인듯
	return Observable.interval(100)
		.bufferTime(500)
		.take(3);
}

// Observable.bufferToggle
// TODO 뭔지 잘 모르겠다. 정확한 작동법을 찾을 수가 없음
//export function bufferToggle():Observable<any> {
//	return Observable.interval(100)
//		.bufferToggle(Observable.interval(10));
//}

// Observable.bufferWhen
export function bufferWhen():Observable<any> {
	return Observable.interval(100)
		.bufferWhen(() => Observable.interval(500))
		//.filter((x:number[])=>x.length > 0)
		.take(10);

	/*
	 .filter() 없이 사용하면 아래와 같이 공백 배열이 발생한다
	 Next 0,1,2,3 ← Array at 508:508
	 Next 4,5,6,7,8 ← Array at 506:1014
	 Next  ← Array at 0:1014
	 Next 9,10,11,12,13 ← Array at 501:1515
	 Next  ← Array at 0:1515
	 Next  ← Array at 0:1515
	 Next  ← Array at 1:1516
	 Next 14,15,16,17,18 ← Array at 504:2020
	 Next  ← Array at 1:2021
	 Next  ← Array at 0:2021
	 */
}

// Observable.defaultIfEmpty
export function defaultIfEmpty():Observable<any> {
	// 값이 empty 일 경우, 기본 값을 넣어준다
	// if (!value) value = 'value is empty' 와 비슷할듯
	return Observable.empty().defaultIfEmpty('value is empty');
}

// Observable.do
export function _do():Observable<any> {
	// subscribe 내부의 function 같이 특정한 액션을 넣는다
	// 음... Angular2에서 Http.get().do().subscribe() 같은 행동을 취할 수 있겠다...
	// extension 과 같은걸 만들때 꽤 도움이 될듯...
	//
	// 혹은 렌더링을 한다거나
	// http.get().do(기초 렌더링).buffer().do(합계 렌더링) 과 같이 계산 중간 렌더링, 합계 처리 렌더링 같은걸 할 수 있을듯...
	return Observable.of(1, 2, 3, 4, 5)
		.do(
			x => console.log('Do Next:', x),
			error => console.log('Do Error:', error),
			() => console.log('Do Complete')
		);
	/*
	 Do Next: 1
	 Next 1 ← Number at 5:5
	 Do Next: 2
	 Next 2 ← Number at 0:5
	 Do Next: 3
	 Next 3 ← Number at 0:5
	 Do Next: 4
	 Next 4 ← Number at 0:5
	 Do Next: 5
	 Next 5 ← Number at 0:5
	 Do Complete
	 */
}

// Observable.expand
export function expand():Observable<any> {
	// 숫자를 수식을 통해 반복 증가 시킨다
	// of(1, 2, 3)을 해도 1을 인수로 계속 돈다
	// scan(), reduce() 와 유사한듯 하면서 좀 다르다 (일단 대상이 숫자 하나 라는게 다른듯)
	return Observable.of(1)
		.expand((x:number, index) => Observable.of(x * 10))
		.take(10);
}

// Observable.mergeMap
// Observable.mergeMapTo

// Observable.groupBy
interface GroupByItem {
	keyCode:number;
}

export function groupBy():Observable<any> {
	var codes:GroupByItem[] = [
		{keyCode: 38}, // up
		{keyCode: 38}, // up
		{keyCode: 40}, // down
		{keyCode: 40}, // down
		{keyCode: 37}, // left
		{keyCode: 39}, // right
		{keyCode: 37}, // left
		{keyCode: 39}, // right
		{keyCode: 66}, // b
		{keyCode: 65}  // a
	];

	return Observable.from(codes)
		.groupBy((x:GroupByItem) => x.keyCode.toString())
		.do((x:GroupedObservable<GroupByItem>) => {
			x.count().subscribe((x:number) => {
				console.log('Count: %d', x);
			})
		})
		.map((x:GroupedObservable<GroupByItem>) => x.key);
	/*
	 TODO 현재 출력이 분리될 수 밖에 없는데 이걸 38, 2 이런식으로 합칠 수 있는 방법이 없을까?
	 Next 38 ← String at 6:6
	 Next 40 ← String at 1:7
	 Next 37 ← String at 0:7
	 Next 39 ← String at 0:7
	 Next 66 ← String at 0:7
	 Next 65 ← String at 0:7
	 Count: 2
	 Count: 2
	 Count: 2
	 Count: 2
	 Count: 1
	 Count: 1
	 */
}

// Observable.lift
// TODO 뭔지 모르겠다
//class LiftOperator<T, R> implements Operator<T, R> {
//
//}
//
//export function lift():Observable<any> {
//	return Observable.from(1, 2, 3)
//		.lift();
//}

// Observable.materialize
// TODO Notification???
//export function materialize():Observable<any> {
//	return Observable.of(1, 2, 3,)
//	.materialize
//}

// Observable.multicast
// TODO 뭔가 형태가 다른것 같다? 이후에 파악
//export function multicast():Observable<any> {
//	return Observable.range(0, 3)
//		.multicast(() => new Subject);
//}

// Observable.observeOn
// TODO 이게 무슨 기능이지?
export function observeOn():Observable<any> {
	return Observable.range(0, 4, Scheduler.immediate)
		.observeOn(Scheduler.nextTick);
}

// Observable.partition
// Observable.publish
// Observable.publishBehavior
// Observable.publishReplay
// Observable.repeat
// Observable.retry
// Observable.retryWhen
// Observable.sampleTime
// Observable.subscribeOn
// Observable.switch
// Observable.switchMap
// Observable.switchMapTo
// Observable.throttle
// Observable.timeout
// Observable.timeoutWith
// Observable.toArray
// Observable.toPromise
// Observable.window
// Observable.windowCount
// Observable.windowTime
// Observable.windowToggle
// Observable.windowWhen
