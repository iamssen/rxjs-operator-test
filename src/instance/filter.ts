import {Observable} from '@reactivex/rxjs/dist/cjs/Rx';
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';

describe('Filtering Operators', () => {
	it('distinctUntilChanged', (done) => {
		// 변화가 없는 값 (이전 값 = 현재 값) 을 배제한다
		subscribe(done,
			Observable.of(1, 1, 2, 2, 2, 3, 4, 4, 5)
				// {x:1}, {x:1} 과 같은 것들을 위해서 마련된 compare function 인듯
				// .distinctUntilChanged((x, y) => x === y)
				.distinctUntilChanged()
		);
	});

	it('filter', (done) => {
		// 값을 필터링 한다
		subscribe(done,
			Observable.of(2, 30, 22, 5, 60, 1)
				// 10 미만의 경우 배제한다
				.filter((x:number)=>x > 10)
		);
	});

	it('skip', (done) => {
		// 앞에서 특정 갯수를 잘라낸다
		subscribe(done,
			Observable.of(1, 2, 3, 4, 5)
				.skip(2)
		);
		// → 3, 4, 5
	});

	it('skip2', (done) => {
		// skip()과 take()를 같이 쓰면
		// substring(start, count) 같은 효과를 가질 수 있다
		subscribe(done,
			Observable.interval(1000)
				.skip(2)
				.take(5)
		);
	});

	it('skipUntil', (done) => {
		// 앞에서 특정 시간 이전 것들을 잘라낸다
		subscribe(done,
			Observable.timer(0, 1000)
				.skipUntil(Observable.timer(5000))
				.take(5)
		);
	});

	it('takeUntil', (done) => {
		// 특정 시간 까지만 가져온다 (take를 시간 기준으로 사용)
		subscribe(done,
			Observable.timer(0, 1000)
				.takeUntil(Observable.timer(5000))
		);
	});

	it('takeUntil2', (done) => {
		// skipUntil() 과 takeUntil()을 같이 쓰면
		// ----------------------------
		// ----skipUntil
		// --------------------takeUntil
		// ----================--------
		// 위처럼 시간의 이내의 부분만 잘라낼 수 있다
		subscribe(done,
			Observable.timer(0, 1000)
				.skipUntil(Observable.timer(5000))
				.takeUntil(Observable.timer(10000))
		);
	});
});