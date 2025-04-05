export function resolvePromise(prms, promiseState){
    promiseState.promise = prms;
    promiseState.data = null;
    promiseState.error = null;

    if (!prms){
        return;
    }

    function successACB(result){
        if(promiseState.promise===prms){
            promiseState.data=result;
            //promiseState.loading=false;
        }
    }
    
    function failureACB(someError){
        if(promiseState.promise===prms){
            promiseState.error = someError;
        }
    }

    prms.then(successACB, failureACB); // TODO, what's the difference?
    // prms.then(successACB).catch(failureACB);
}