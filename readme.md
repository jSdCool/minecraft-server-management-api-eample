# Minecraft Server Management API example
----
In snapshot 25W35A mojang added the Minecraft server management API to minecraft
This repo aims to take that new system for a test drive and show off its functionality 

## How to use
1. setup a minecraft java server in any version >= 25W35A. Make sure that `management-server-enabled` is set to true is server.properties
2. open `index.html`
3. if the server is on another computer and you have configured the host to allow external computer access then change the ip and port
4. click connect  
You will then see a table containing all the commands supported by this server.  
You can see a description of what each command does as well as what parameters it may expect. Any parameters in red are required 
Clicking on any of the command names will pre-fill the auto method box at the bottom  
At the bottom of the page you will see a few boxes the top long one allows you to manually craft a json payload to send off, 
the bottom ones craft the final json for you.   
The box labeled method contains the command you wish to run  
The Parameters box is where you will enter any required parameters.  
Any parameter types that are not integer, boolean, or string will need to be in json format  
Any datatypes surrounded by [ ] are expected to be an array of the type
To find how these structure are put together consult with `discover.json`
5. Press the corresponding send button and what the server responds with will be added to the page below


### Example manual payload
Lists all banned Ips  
`{"id":0, "method":"minecraft:ip_bans"}`  
Set the server render distance to 25  
`{"id":0, "method":"minecraft:serversettings/view_distance/set", "params":[25]}`
Kick the player named jeff  
`{"id":0, "method": "minecraft:players/kick", "params":[[{"name":"jeff"}]]}`

### Example auto payload
List all banned Ips  
method: `minecraft:ip_bans`  
Set the server render distance to 25  
method: `minecraft:serversettings/view_distance/set` Parameters: `25`  
Kick the player named jeff  
method: `minecraft:players/kick` Parameters: `[{"name":"jeff"}]`
