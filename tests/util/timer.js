"use strict"

function sleep(ms){
    var waitTill = new Date(new Date().getTime() + ms);
    while(waitTill > new Date()){};
}

module.exports = {sleep:sleep};  

step("step1", async function() {
	throw 'Unimplemented Step';
});