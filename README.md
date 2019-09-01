# TronBatchTransfer
It get balance of wallets in a list then transfer all available amounts to another wallet.

To make it work you will have to create an .env file at the root of the project and put all your wallets address there.

You can put as much wallets you want.

It should have the same number of wallet than private key.

After WALLETS= you put the wallets addresse you want to send from all separated by space.

After PKS= you put the private keys associated to the wallets you added all separated by space too.

After SENDTO= you put the wallet address where you want to send to.

After SENDTOPK= you put the private key of the wallet you want to send to.


.env file should look like that :

 NODE_ENV=development

 WALLETS=walletAddress1 walletAddress2 walletAddress3
 
 PKS=walletPrivateKey1 walletPrivateKey2 walletPrivateKey3
   
 SENDTO=targetWalletAddress

 SENDTOPK=targetWalletPrivateKey
