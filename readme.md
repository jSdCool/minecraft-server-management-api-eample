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
You can see a description of what each command does as well as what parameters it may expect. Any parameters in red are required.  
Clicking on any of the command names will pre-fill the auto method box at the bottom  
At the bottom of the page you will see a few boxes the top long one allows you to manually craft a json payload to send off. 
The bottom one is disabled and can be filled by clicking on any of the commands above, when you do this a list if properties will pop up at the bottom. Not all of what appears is required but some of them are.
The box labeled method contains the command you wish to run
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


### Issue
There currently appears to be a bug with the kick command, the provided documentation suggest that an array is required but then game complains if one is supplied
