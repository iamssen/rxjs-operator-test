import {Observable} from '@reactivex/rxjs/dist/cjs/Rx';
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';

describe('Transforming Operators', () => {
	it('delay', (done) => {
		// 특정 시간만큼 결과가 나오는 것을 지연시킨다 (ms)
		subscribe(done,
			Observable.range(0, 5)
				.delay(1000)
		);
	});

	it('debounce', (done) => {
		interface DebounceItem {
			value:number;
			time:number;
		}

		let times:DebounceItem[] = [
			{value: 1, time: 100},
			{value: 22, time: 160},
			{value: 2, time: 200},
			{value: 32, time: 360},
			{value: 3, time: 400},
			{value: 4, time: 800},
			{value: 5, time: 1600}
		];

		// debounceTime과 동일 (단지 debounce 시에 딜레이 시킬 시간을 변경 시킬 수 있는건가?)
		subscribe(done,
			Observable.from(times)
				.flatMap((item:DebounceItem)=>Observable.of(item.value).delay(item.time))
				.debounce((x) =>  Observable.timer(50))
		);
	});

	it('debounceTime', (done) => {
		interface DebounceItem {
			value:number;
			time:number;
		}

		let times:DebounceItem[] = [
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
		subscribe(done,
			Observable.from(times)
				.flatMap((item:DebounceItem)=>Observable.of(item.value).delay(item.time))
				.debounceTime(50)
		);
	});

	it('map', (done) => {
		// Javascript의 forEach()와 비슷
		// map: <R>(project: (x: T, ix?: number) => R, thisArg?: any) => Observable<R>
		// T를 받아들여서 R로 전환하는 식이다
		subscribe(done,
			Observable.interval(100)
				.map((x, index) => x * 10)
				.take(10)
		);
	});

	it('mapTo', (done) => {
		// ?????
		// 뭐지 이게? 걍 하드코딩 식으로 특정 값으로 바꿔버린다
		// mapTo: <R>(value: R) => Observable<R>
		subscribe(done,
			Observable.interval(100)
				.mapTo('a')
				.take(10)
		);
	});

	it('scan', (done) => {
		// Waterfall 형태
		// map 처럼 항목을 forEach 시키지만,
		// 더해서 마지막으로 계산된 결과를 던져주기 때문에 항목들과 결과들을 지속적으로 이어서 계산할 수 있다
		subscribe(done,
			Observable.fromArray([1, 2, 3, 4, 5])
				.scan<number>((acc:number, x:number) => acc + x)
		);
	});

	//it('', (done) => {
	//
	//});
});