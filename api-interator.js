let connected = false;
let webSocket;

const DISCOVER_ID = -352465185;
let usedIds = 0

//{"id":-8976,"method":"rpc.discover"}

function connectToApi(){
    if(connected){
        throw Error("Already connected to web socket");
    }else{
        let ip = document.querySelector('.connect-ip').value;
        let port = document.querySelector('.connect-port').value;
        webSocket = new WebSocket("ws://"+ip+":"+port);

        webSocket.onopen = function(){
            connected = true;
            console.log("Connected!");
            document.querySelector('#connect-info').hidden = true;
            document.querySelector('#management-area').hidden = false;
            webSocket.send(JSON.stringify({
                id: DISCOVER_ID,
                method: "rpc.discover"
            }))
        }

        webSocket.onclose = function(){
            connected = false;
            console.log("Connection closed!");
            document.querySelector('#connect-info').hidden = false;
            document.querySelector('#management-area').hidden = true;
        }

        webSocket.onmessage = function(e){
            let message = JSON.parse(e.data);
            console.log("Received message from web socket: ",message);
            let messageResult = message.result
            let messageId = message.id;
            let messageMethod = message.method;
            if(messageId !== undefined && isKnownMessageId(messageId)){
                //if it is a known message ID then process it by ID
                if(messageId === DISCOVER_ID){
                    handleMethodDescription(messageResult)
                    return;
                }
            }else if (messageId !== undefined ){
              console.log("Received message from web socket: ",messageResult);
              if(messageResult === undefined){
                  let merr = message.error;
                  let errorMsg = merr.message;
                  let errData = merr.data;
                  document.querySelector('#response').innerHTML += messageId + ")  " +"<span class='red'>"+errorMsg+": "+errData+"</span><br><br>";
              }else {
                  document.querySelector('#response').innerHTML += messageId + ")  " + JSON.stringify(messageResult) + "<br><br>";
              }
            } else{
                //we have no other option, process it by method
                if(messageMethod.startsWith("notification")){
                    handleNotification(messageMethod,message.params);
                }
            }
        }

        webSocket.onerror = function(e){
            console.log("Received error from web socket: "+e.data);
        }
    }
}

function sendPayload(){
    let stringPayload = document.getElementById('payload').value;
    try{
        let payloadJson = JSON.parse(stringPayload);
        webSocket.send(JSON.stringify(payloadJson));
    } catch(err){
        console.log(err);
    }
}
//{"players":[], "message": ""}
function sendAutoPayload(){
    let stringMethod = document.getElementById('payload_method').value;
    let stringParameters = document.getElementById('payload_params').value;
    let payloadJson;
    if(stringParameters !== ""){
        payloadJson = {
            method: stringMethod,
            params: [JSON.parse(stringParameters)],
            id: usedIds++
        };
    }else{
        payloadJson = {
            method: stringMethod,
            id: usedIds++
        }
    }

    console.log(JSON.stringify(payloadJson));
    webSocket.send(JSON.stringify(payloadJson));
}

function isKnownMessageId(messageId){
    if(messageId === DISCOVER_ID){
        return true;
    }

    return false;
}

function handleMethodDescription(descriptionJson){
    // data type:
    // string string
    // integer int
    // Boolean boolean
    // Array []
    // Object <scheeme name>

    let methods = descriptionJson.methods;
    let commandsTable = document.getElementById('commands-table');
    for(let method in methods){
        if(methods[method].name.startsWith("notification")){
            continue;
        }

        //create the table row and cell elements1
        let tableRow = document.createElement('tr');
        let nameCell = document.createElement('td');
        let descriptionCell = document.createElement('td');
        let paramCell = document.createElement('td');
        //populate the elements
        nameCell.innerHTML = "<button onclick='preFillMethodField(\""+methods[method].name+"\")'>"+methods[method].name+"</button>";
        descriptionCell.innerHTML = methods[method].description;

        //parameter parsing
        let parameters = methods[method].params;
        let paramsString = [];
        parameters.forEach(param => {
            let paramName = param.name;
            let paramSchema = param.schema;
            let paramType = paramSchema.type;
            let required = param.required === true;
            if(paramType === "array"){
                let refRaw = paramSchema.items.$ref;
                let objectName
                if(refRaw === undefined){
                    objectName = paramSchema.items.type;
                }else {
                    let refParts = refRaw.split('/');
                     objectName = refParts[refParts.length - 1]
                }
                if(required){
                    paramsString.push("<span class = \"red\">"+paramName + ":[" + objectName + "]</span>");
                } else {
                    paramsString.push(paramName + ":[" + objectName + "]");
                }
            }else{
                if(paramType === undefined){
                    let refRaw = paramSchema.$ref;
                    if(refRaw === undefined){
                        paramType = paramSchema.items.type;
                    }else {
                        let refParts = refRaw.split('/');
                        paramType = refParts[refParts.length - 1]
                    }
                }
                if(required){
                    paramsString.push("<span class = \"red\">"+paramName + ":" + paramType+"</span>");
                }else {
                    paramsString.push(paramName + ":" + paramType)
                }
            }

        })

        paramCell.innerHTML = paramsString.join(',');

        //add all the elements to the DOM
        tableRow.appendChild(nameCell);
        tableRow.appendChild(descriptionCell);
        tableRow.appendChild(paramCell);
        commandsTable.appendChild(tableRow);
    }
}

function preFillMethodField(methodName){
    document.getElementById("payload_method").value = methodName;
}

function handleNotification(methodName, params){
    let notificationMessage = "Notification: ";
    switch (methodName) {
        case "notification:server/started":
            notificationMessage += "Server started";
            break;
        case "notification:server/stopping":
            notificationMessage += "Server stopping";
            break;
        case "notification:server/saving":
            notificationMessage += "Server save started";
            break;
        case "notification:server/saved":
            notificationMessage += "Server save completed";
            break;
        case "notification:players/joined":

            notificationMessage += params[0].name+" Joined the game";
            break;
        case "notification:players/left":
            notificationMessage += params[0].name+" Left the game";
            break;
        case "notification:operators/added":
            notificationMessage += params[0].player.name+" was added as a server operator level "+params[0].permissionLevel;
            break;
        case "notification:operators/removed":
            notificationMessage += params[0].player.name+" was removed as a server operator, their level was: "+params[0].permissionLevel;
            break;
        case "notification:allowlist/added":
            notificationMessage += "Added "+params[0].name+" to the whitelist"
            break;
        case "notification:allowlist/removed":
            notificationMessage += "Removed "+params[0].name+" from the whitelist"
            break;
        case "notification:ip_bans/added":
            if(params[0].player !== undefined) {
                notificationMessage += "Baned the ip address " + params[0].ip + " of player: " + params[0].player.name + ", for " + params[0].reason + ". Source: " + params[0].source;
            }else{
                notificationMessage += "Baned the ip address " + params[0].ip+", for " + params[0].reason + ". Source: " + params[0].source;
            }
            break;
        case "notification:ip_bans/removed":
            notificationMessage += "Unbanned ip address "+params[0]
            break;
        case "notification:bans/added":
            notificationMessage += "Baned "+ params[0].player.name + ", for " + params[0].reason + ". Source: " + params[0].source;
            break;
        case "notification:bans/removed":
            notificationMessage += "Unbanned "+params[0].name
            break;
        case "notification:gamerules/updated":
            notificationMessage += "Updated gamerule "+params[0].key+" to "+params[0].value;
            break;
        case "notification:server/status":
            notificationMessage += "Server status: "+((params[0].started)?"Online":"Offline")+" version: "+params[0].version.name+" "+params[0].value.name[0].players.length+" players online";
            break;
    }

    showNotification(notificationMessage);
}