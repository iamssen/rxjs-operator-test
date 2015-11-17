import {Observable} from "@reactivex/rxjs/dist/cjs/Rx";

export function subscribe(next:()=>void, observable:Observable<any>) {
	let start:number = new Date().getTime();
	let prev:number = start;

	observable.subscribe(
		x => {
			let current:number = new Date().getTime();
			let classNames:RegExpExecArray = /function\s+([^\s(]+)\s*\(/.exec(x.constructor.toString());

			console.log('Next %s ← %s at %d:%d',
				x,
				(classNames && classNames.length > 1) ? classNames[1] : '',
				current - prev,
				current - start
			);
			prev = current;
		},
		error => {
			let current:number = new Date().getTime();
			console.log('Error %s ← %d:%d',
				error,
				current - prev,
				current - start
			);
			prev = current;
		},
		() => {
			next();
		}
	)
}