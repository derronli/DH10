# DH10 Submission - DinoMind
DinoMind is your friendly dino companion who will help you journal your day and create to-do items to make sure you slay the next day! 

## Prerequisites
1. node
2. npm
3. expo go on your mobile device
4. cloudflare account with an API token and a known account ID. Check out the workers tab and go to the REST API to see what your account ID is

## Begin Building
First, create a copy of `.env_template` and rename it to `.env`. Fill in the following template with your cloudflare account ID and API token. 
Example: 
```
ACCOUNT_ID="1501840184nkhhu12bh21"
API_TOKEN="IagAKGAkfaK1513g1K13134FKf"
```
Next, cd into the app and install dependencies
```
cd Frontend2.0/my-app
npm install
```
Now you're ready to begin coding!!
```
npx expo start --tunnel
```
Using expo go on your mobile phone, you can scan the QR code created by the above command and test the app!
