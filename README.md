### Note
This project still under development.

# TronBatchTransfer
This utility gets the balance of multiple wallets and then offers to transfer all available amounts to another wallet.

## Configuration

You will have to create an .env file at the root of the project and put all your wallet addresses there.

You can have as many wallets you want.

It should have as many private keys as there are wallets.

#### Options :
```
WALLETS= the wallet addresses you want to SEND from, all space-separated.

PKS= the private keys associated to the wallets you added, all space-separated too, in the same order.

SENDTO= the wallet address you want to RECEIVE the funds.

SENDTOPK= the private key of the wallet you want to RECEIVE the funds.
```

Your .env file should look like :

```
 NODE_ENV=development

 WALLETS=walletAddress1 walletAddress2 walletAddress3
 
 PKS=walletPrivateKey1 walletPrivateKey2 walletPrivateKey3
   
 SENDTO=targetWalletAddress

 SENDTOPK=targetWalletPrivateKey
```

After you've created the .env file at the root of the project, you should be good to go

## Installation

You will only need to do this once.

1. Open a command prompt
2. Navigate to the project folder
3. Type `npm install` and press enter
4. Configure the .env file

## Usage

Run the application in the command prompt using
```
node index.js
````

You should see :
```
> Retreiving wallets data
> ... % completed
```

Once the wallets data is retrieved, it will ask you if you are sure you want to transfer all available TRX to the target wallet.

Type yes and the utility will start transfering all funds to the target wallet.

![alt text](https://github.com/Th4Sing3/TronBatchTransfer/blob/master/res.PNG?raw=true)

If you found this app usefull you can pay me a beer here

TRON wallet : THXp6NSTbqDBt6p1CpcFc38zLJN9BTdDDd
