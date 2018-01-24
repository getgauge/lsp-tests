const rpc = require('vscode-jsonrpc');
var assert = require('assert');
const timer = require('../../util/timer')

function handleNotifcation(res,registeredHandlers){
    var results = []
    for(var i=0;i<registeredHandlers.length;i++){
        if(registeredHandlers[i].unRegister)
            continue
        var expectedDiagnostics = registeredHandlers[i].listener(res,registeredHandlers[i].expectedDiagnostics)
        var result = registeredHandlers[i].verifyIfDone(expectedDiagnostics);
        if(result.done)
        {
            registeredHandlers[i].done()
            registeredHandlers[i].unRegister = true    
        }    
        results.push(result)
    }
    return results;
}

async function OnNotification(notificationType,connection,registeredHandlers,done){
    console.log(notificationType)
    await connection.onNotification(notificationType, (res) => {
        var results = handleNotifcation(res,registeredHandlers)

        if(results!=null && results.length>0 && results[0].errors!=null){
            var errors = [];
            for(var index=0;index<results.length;index++){
                for(var errorIndex=0;errorIndex<results[index].errors.length;errorIndex++){
                    errors.push(results[index].errors[errorIndex])
                }                
            }

            assert.ok(errors.length==0,"diagnostics has errors "+JSON.stringify(errors))
        }
    });
}

async function sendNotification(connection,method,params){
    timer.sleep(10)
    console.log(method)
    return connection.sendNotification(new rpc.NotificationType(method), params);
}

module.exports = {OnNotification:OnNotification,sendNotification:sendNotification}
