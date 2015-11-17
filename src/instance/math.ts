import {Observable} from '@reactivex/rxjs/dist/cjs/Rx';
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';

describe('Mathematical Operators', () => {
	it('count', (done) => {
		subscribe(done,
			Observable.of(1, 2, 3, 4, 5, 6, 7)
				.count()
		);
	});

	it('count2', (done) => {
		// filter function 을 동반하면 filtering 된 아이템들의 갯수만을 센다
		subscribe(done,
			Observable.of(2, 30, 22, 5, 60, 1)
				.count((x:number)=>x > 10)
		);
	});

	it('reduce', (done) => {
		// ??? scan() 하고 똑같다?
		// reduce: <R>(project: (acc: R, x: T) => R, seed?: R) => Observable<R>
		// scan: <R>(project: (acc: R, x: T) => R, acc?: R) => Observable<R>
		subscribe(done,
			Observable.fromArray([1, 2, 3, 4, 5])
				.reduce<number>((acc:number, x:number) => acc + x)
		);
	});
});