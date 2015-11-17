import {Observable} from '@reactivex/rxjs/dist/cjs/Rx';
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';

describe('Combining Operators', () => {
	it('sample', (done) => {
		// TODO 용도에 대해서 고민해보기
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
		subscribe(done,
			observable1.sample(observable2)
				.take(10)
		);
	});

	it('startWith', (done) => {
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

		subscribe(done,
			observable1.startWith('1')
		);
	});

	it('withLatestFrom', (done) => {
		// TODO 용도에 대해서 고민해보기
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

		subscribe(done,
			observable1.withLatestFrom(observable2)
				.take(10)
		);
	});

	//it('', (done) => {
	//
	//});
	//
	//it('', (done) => {
	//
	//});
});