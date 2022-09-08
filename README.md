
NOTES

functions: 
- getTokens - read-only 
- hasToken - read-only
- spendToken - write - requires user sig
- transferToken - write - requires user sig
- awardToken - write - requires user wallet addr only
- register - write - verifies & takes in user pub key to store in back end

getTokens
----
requires user wallet addr
requests to REST api 
returns list of ERC20 and ERC721 (relevant ones only) 

hasToken
----
just a filter on getTokens really

transferToken 
----
calls a function on a smart contract 
accesses user wallet sig 
sends a token(s) to a specified address  

spendToken 
----
essentially same as transferToken 

awardToken
---- 
requires user wallet address 
sends request to REST api 
action happens on backend

register
----
accesses user wallet sig 
requires a sign to prove it's you 
sends request to ? 


REST API 
---
register 
getTokens
awardToken 

ON-CHAIN CODE
----
transferToken
spendToken


REST: 
- centralized server 
- security: timestamp in request, consider jwt too 
- standard APIs, pluggable security & backend? 

ON-CHAIN: 
- ? 

UNITY: 
- ? 
- ? 


TASKS: 
- create a token 
- create an NFT 
- use case: getTokens 
- use case: hasToken (in game) 
- use case: awardToken (in game) 
- use case: spendToken (in game) 
