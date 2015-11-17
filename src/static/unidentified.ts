import {Observable, Subscriber} from '@reactivex/rxjs/dist/cjs/Rx';
import {Observer} from '@reactivex/rxjs/dist/cjs/Observer';
import {EventEmitter} from 'events';
import {subscribe} from '../subscribers';

describe('Static Unidentified Operators', () => {
	it('create', (done) => {
		// Custom한 Observable(관찰할 수 있는 것, 관심사)를 만든다
		// 가장 중요할 듯. Rx 외부의 기능을 Rx로 끌어올 수 있는 기능인듯 싶다
		var source:Observable<number> = Observable.create((subscriber:Subscriber<number>) => {
			// observer.next({value}); 보내줄 값을 입력
			// observer.complete(); 관심사를 마친다
			setTimeout(() => {
				subscriber.next(42);
				setTimeout(() => {
					subscriber.next(43);
					setTimeout(() => {
						subscriber.next(44);
						subscriber.complete();
					}, 3000);
				}, 3000);
			}, 3000);
			return () => console.log('Complete source!!!');
		});

		subscribe(done, source);
	});

	it('never', (done) => {
		// 아무것도 하지 않고 대기하게 만든다
		// TODO 어떻게 풀어야 할지 방법을 알아야 한다
		//subscribe(done,
		//	Observable.never()
		//);
		done();
	});

	it('throw', (done) => {
		// throw() 를 사용하는 지점이 애매...
		//subscribe(done,
		//	Observable.throw(new Error('error message!'))
		//		.catch((error:Error, source, caught) => {
		//			console.log(error, source, caught);
		//			return Observable.of(99);
		//		})
		//		.finally(()=>console.log('Finally'))
		//);
		done();
	});
});