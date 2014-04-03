bring_it_on
===========

If your workflow starts with executing a lot of scripts present in different different directories and watch thenm(logs) in different tabs, then this tool can help you to save your time and reduce the pain of going in different directories. This shows all your logs at one place with the script name which you specify in the config file.

##Example :-

  Lets say you have to run two scripts to start two services present in different locations and then check the logs of both
  
  Then your config file will look like this
  
  ```json
  
  [
    {
      "dir":"/Users/ajitsingh/location1/", 
  	  "command":"sh script1.sh", 
  		"kill": "sh stop_script1.sh", 
  		"log":"/Users/ajitsingh/location1/script1.log",
  		"alias" : "script1"
    },
    {
      "dir":"/Users/ajitsingh/location2/", 
  		"command":"sh script2.sh", 
  		"kill": "sh stop_script2.sh", 
  		"log":"/Users/ajitsingh/location1/script2.log",
  		"alias" : "script2"
    }
  ]
  
  ```
  After your config is done then run

  ```node
  node brint_it_on.js config.json  (to start all service)
  
  node brint_it_on.js config.json script1  (to start only script1) => alias is like a key for your script
  
  node brint_it_on.js config.json -script1  (to exclude script1)
  ```

  
  To make it simpler create an alias in your ~/.zshrc or ~/.bashrc
  
  ```bash
  alias brint_it_on='node path/to/bring_it_on.js  path/to/config.json'
  ```
  
  

Setup
-----
```
install node
install npm

npm install tail
npm install colors

```
