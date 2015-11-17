import {Observable, Subscription} from '@reactivex/rxjs/dist/cjs/Rx';
var colors = require('colors/safe');

import * as statics from './statics';
import * as instance from './instance';

class Func {
	constructor(public func:()=>Observable<any>) {
	}
}

//var funcs:Func[] = combine(
//	statics,
//	instance
//);

var funcs:Func[] = [
	new Func(instance.observeOn)
];

function combine(...modules:Object[]):Func[] {
	var funcs:Func[] = [];
	modules.forEach((module:Object) => {
		for (var name in module) {
			if (module.hasOwnProperty(name)) {
				funcs.push(new Func(module[name] as ()=>Observable<any>));
			}
		}
	});
	return funcs;
}

function run(funcs:Func[]) {
	var f:number = -1;
	var fmax:number = funcs.length;
	var subscription:Subscription<any>;

	function next() {
		if (subscription) {
			subscription.unsubscribe();
			subscription = null;
		}

		if (++f < fmax) {
			var func:Func = funcs[f];
			var observable:Observable<any> = func.func();
			var start:number = new Date().getTime();
			var prev:number = start;
			console.log('');
			console.log('Start: %s()', colors.green(func.func['name']));
			console.log('-----------------------------');

			subscription = observable.subscribe(
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
				next
			)
		} else {
			process.exit();
		}
	}

	next();
}

run(funcs);