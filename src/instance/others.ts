import {Observable, Scheduler, ConnectableObservable} from '@reactivex/rxjs/dist/cjs/Rx';
import {GroupedObservable} from "@reactivex/rxjs/dist/cjs/operators/groupBy-support";
import {Observer} from "@reactivex/rxjs/dist/cjs/Observer";
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';

describe('Work', () => {
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

	it('buffer', (done) => {
		// http://reactivex.io/documentation/operators/buffer.html
		// 특정 시간 단위로 값들을 묶어서 []로 만든다
		subscribe(done,
			Observable.interval(100)
				.buffer(Observable.interval(300))
				.take(5)
		);
		/*
		 Next 0,1 ← Array at 306:306
		 Next 2,3,4 ← Array at 304:610
		 Next 5,6,7 ← Array at 302:912
		 Next 8,9,10 ← Array at 300:1212
		 Next 11,12,13 ← Array at 305:1517
		 */
	});

	it('bufferCount', (done) => {
		// 항목들을 갯수별로 묶는다
		subscribe(done,
			Observable.range(1, 6)
				.bufferCount(3, 3)
		);
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
	});

	it('bufferTime', (done) => {
		// buffer(Observable.interval(500)) → bufferTime(500)
		// 축약 버전인듯
		subscribe(done,
			Observable.interval(100)
				.bufferTime(500)
				.take(3)
		);
	});

	//it('bufferToggle', (done) => {
	//	// TODO 뭔지 잘 모르겠다. 정확한 작동법을 찾을 수가 없음
	//	//	return Observable.interval(100)
	//	//		.bufferToggle(Observable.interval(10));
	//});

	it('bufferWhen', (done) => {
		subscribe(done,
			Observable.interval(100)
				.bufferWhen(() => Observable.interval(500))
				//.filter((x:number[])=>x.length > 0)
				.take(10)
		);

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
	});

	it('defaultIfEmpty', (done) => {
		// 값이 empty 일 경우, 기본 값을 넣어준다
		// if (!value) value = 'value is empty' 와 비슷할듯
		subscribe(done,
			Observable.empty().defaultIfEmpty('value is empty')
		);
	});

	it('do', (done) => {
		// subscribe 내부의 function 같이 특정한 액션을 넣는다
		// 음... Angular2에서 Http.get().do().subscribe() 같은 행동을 취할 수 있겠다...
		// extension 과 같은걸 만들때 꽤 도움이 될듯...
		//
		// 혹은 렌더링을 한다거나
		// http.get().do(기초 렌더링).buffer().do(합계 렌더링) 과 같이 계산 중간 렌더링, 합계 처리 렌더링 같은걸 할 수 있을듯...
		subscribe(done,
			Observable.of(1, 2, 3, 4, 5)
				.do(
					x => console.log('Do Next:', x),
					error => console.log('Do Error:', error),
					() => console.log('Do Complete')
				)
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
	});

	it('expand', (done) => {
		// 숫자를 수식을 통해 반복 증가 시킨다
		// of(1, 2, 3)을 해도 1을 인수로 계속 돈다
		// scan(), reduce() 와 유사한듯 하면서 좀 다르다 (일단 대상이 숫자 하나 라는게 다른듯)
		subscribe(done,
			Observable.of(1)
				.expand((x:number, index) => Observable.of(x * 10))
				.take(10)
		);
	});

	// Observable.mergeMap
	// Observable.mergeMapTo

	it('groupBy', (done) => {
		interface GroupByItem {
			keyCode:number;
		}

		let codes:GroupByItem[] = [
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

		subscribe(done,
			Observable.from(codes)
				.groupBy((x:GroupByItem) => x.keyCode.toString())
				.do((x:GroupedObservable<GroupByItem>) => {
					x.count().subscribe((x:number) => {
						console.log('Count: %d', x);
					})
				})
				.map((x:GroupedObservable<GroupByItem>) => x.key)
		);
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
	});

	// Observable.lift
	// TODO 뭔지 모르겠다
	// Observable.materialize
	// TODO Notification???

	//it('multicast', (done) => {
	// TODO 뭔가 형태가 다른것 같다? 이후에 파악
	//	return Observable.range(0, 3)
	//		.multicast(() => new Subject);
	//});

	//it('observeOn', (done) => {
	//
	//});

	// Observable.partition
	it('partition', (done) => {
		// 필터링 조건에 맞춰서 데이터들을 둘로 쪼갠다
		// (x) => boolean 인 것을 보니, 둘로 밖에는 못 쪼개는듯
		let end:number = 0;
		let [odds, evens]:Observable<number>[] = Observable
			.range(0, 10).partition(x => x % 2 === 0);

		evens.subscribe(
			x => console.log('Evens: %s', x),
			e => console.log('Error: %s', e),
			() => {
				console.log('Evens End');
				if (++end >= 2) done();
			}
		);

		odds.subscribe(
			x => console.log('Odds: %s', x),
			e => console.log('Error: %s', e),
			() => {
				console.log('Odds End');
				if (++end >= 2) done();
			}
		);
	});

	// Observable.publish
	it('publish', (done) => {
		let end:number = 0;
		let source:Observable<number> = Observable.interval(1000)
			.take(3)
			.do(x=>console.log('Side Effect'));

		// TODO 왜인지 작동을 안한다...
		//let publish:ConnectableObservable<number> = source.publish();
		let publish:Observable<number> = source;

		publish.subscribe(
			x => console.log('Next: A %s', x),
			e => console.log('Error: A %s', e),
			() => {
				console.log('Complete: A');
				if (++end >= 2) done();
			}
		);
		publish.subscribe(
			x => console.log('Next: B %s', x),
			e => console.log('Error: B %s', e),
			() => {
				console.log('Complete: B');
				if (++end >= 2) done();
			}
		);
	});

	// Observable.publishBehavior
	// 기능을 알 수가 없다
	//it('publishBehavior', (done) => {
	//	let source:Observable<number> = Observable.interval(1000)
	//		.take(3)
	//		.do(x=>console.log('Side Effect'));
	//
	//	let publish:Observable<number> = source.publishBehavior();
	//});
	// Observable.publishReplay

	// Observable.repeat
	it('repeat', (done)=> {
		// 반복하게 한다
		// 서로 다른 값이 반복되는 것은 아니다
		subscribe(done,
			Observable.of(1, 2, 3).repeat(3)
		);
		/*
		 Next 1 ← Number at 1:1
		 Next 2 ← Number at 0:1
		 Next 3 ← Number at 0:1
		 Next 1 ← Number at 0:1
		 Next 2 ← Number at 0:1
		 Next 3 ← Number at 0:1
		 Next 1 ← Number at 1:2
		 Next 2 ← Number at 0:2
		 Next 3 ← Number at 0:2
		 */
	});

	// Observable.retry
	it('retry', (done) => {
		// TODO retry의 명확한 의미를 잘 모르겠다
		let count:number = 0;
		let source:Observable<number> = Observable.of(1, 2, 3);

		source.do(
			(x:number) => {
				if (++count > 2) {
					Observable.throw(new Error('Throw ' + x))
				}
			}
		).retry(3);

		source.subscribe(
			x => console.log('Next: %s', x),
			e => console.log('Error: %s', e),
			() => console.log('Completed')
		);
	});

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
});