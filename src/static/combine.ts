import {Observable} from '@reactivex/rxjs/dist/cjs/Rx';
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';

describe('Static', () => {
	describe('Combining Operators', () => {
		it('combineLatest', (done) => {
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
			subscribe(done,
				Observable.combineLatest<string>(
					source1,
					source2,
					(v1:number, v2:string) => v1 + v2
					)
					.take(10)
			);
		});

		it('concat', (done) => {
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

			subscribe(done,
				Observable.concat<any>(source1, source2, source3)
					.take(10)
			);
		});

		it('merge', (done) => {
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
			subscribe(done,
				Observable.merge<any>(source1, source2)
					.take(10)
			);
		});

		it('zip', (done) => {
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

			subscribe(done,
				Observable.zip<string>(source1, source2, (v1:number, v2:string) => v1 + v2)
					.take(10)
			);
		});

		it('forkJoin', (done)=> {
			// 흐름들의 최종 결과를 합치는 기능인듯 싶다
			subscribe(done,
				Observable.forkJoin(
					Observable.interval(100).take(6) // 0 → 5 까지 진행되기 때문에 5 가 된다
					, Observable.range(0, 10) // 0 → 9 까지 진행되기 때문에 9 가 된다
					, Observable.fromArray([1, 2, 3]) // length가 3이기 때문에 3이 된다
					, (v1:number, v2:number, v3:number) => v1 + v2 + v3 // 값들을 어떻게 합칠지 결과 처리
				)
			);
		});
	});
});