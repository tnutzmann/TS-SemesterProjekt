# TS-SemesterProjekt
A very basic implementation of **REDIS** in TypeScript, with the **RESP** (**RE**dis **S**erialization **P**rotocol)

## Requirements
the actual requirements may be lower but this is the setup I use
- node v18.15.0
- redis-cli 7.0.11

## Startup
1. Run the Server
``` bash
npm install

# run tests
npm test
# test with coverage
npm test-coverage

# run the server
npm start
```
2. connect to the server
```bash
redis-cli
```

## Usable commands
### PING
Test the connection
```
PING 
# alternative
PING "Some String"
```

### SET
Set a value to a specific Key 
```
SET key value
```

### GET
Get a value for a specific Key
```
GET key
```
