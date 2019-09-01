/*
This program is used to transfer all available TRX from multiple wallets to a main wallet
*/
const readline = require(`readline`);
const TronWeb = require(`tronweb`);
const bs58 = require(`bs58`)
const fullHost = `https://api.trongrid.io`;
const {wallets, privateKeys, sendTo, sendToPk} = require(`./config`);
const myWallets = wallets.split(` `);
const nbWallets = myWallets.length;
const myPks = privateKeys.split(` `);
const verbose = true;
let walletsData = new Array();
let targetData;
let amountAvailInWallets=0;
let nbWalletsNotEmpty = 0;

/* Start the process */
async function Start(){		
	let i = 0;
	
	if(verbose){ 	
		process.stdout.write("\033c")		
		process.stdout.write(`Retreiving wallets data\n`); 
	}
	
	/* get data for for target wallet */
	let tronWeb = new TronWeb({fullHost: fullHost, privateKey: sendToPk});
	let wallet = await tronWeb.trx.getAccount(sendTo);		
	wallet.usableAddress = tronWeb.address.fromPrivateKey(sendToPk);
	wallet.readableAccountName = wallet.account_name ? tronWeb.toAscii(wallet.account_name) : ``; 
	targetData = wallet;
		
	/* get data for each wallet */
	for(i; i < nbWallets; i++){		
		tronWeb = new TronWeb({fullHost: fullHost, privateKey: myPks[i]});
		wallet = await tronWeb.trx.getAccount(myWallets[i]);		
		wallet.usableAddress = tronWeb.address.fromPrivateKey(myPks[i]);
		wallet.readableAccountName = wallet.account_name ? tronWeb.toAscii(wallet.account_name) : ``; 
		walletsData.push(wallet);
		if(verbose) ShowProgress(Math.round(i/nbWallets*100));		
    }
	
	if(verbose) {	
		ShowProgress(Math.round(i/nbWallets*100));	
		ShowCompleteWalletsData();
		ShowTRX();
		ConfirmTransfer();
	}
}

/* Show all wallets data */
function ShowCompleteWalletsData(){	
	let i =0;
	console.log(`\n----------ShowCompleteWalletsData ----------\n`)	
	for(i; i < walletsData.length; i++)	
		console.log(walletsData[i]);			
	console.log(`\n----------End of ShowCompleteWalletsData ----------\n`)
}

/* Show progress of async operations */
function ShowProgress(completion){
	process.stdout.clearLine();	
	process.stdout.cursorTo(0);	
	process.stdout.write(`${completion} % completed`);	
}

/* Show available TRX for each wallets */
function ShowTRX(){
	let i =0;

	console.log(`\n----------TRX in wallets----------\n`)
	for(i; i < nbWallets; i++){
		amountAvailInWallets+=fromSun(walletsData[i].balance);
		nbWalletsNotEmpty += walletsData[i].balance ? 1:0;
		console.log(`Wallet ${i.toString().padEnd("3", " ")}| AccountName : ${walletsData[i].readableAccountName.padEnd(i === nbWallets -1 ?"35":"42", " ")} | ${walletsData[i].usableAddress} | ${fromSun(walletsData[i].balance).toString().padEnd("10", " ")} TRX | Energy : ${walletsData[i].free_net_usage ? 5000-walletsData[i].free_net_usage:"unknown"}/5000`);		
	}

	console.log(`\nTotal available : ${amountAvailInWallets} TRX in ${nbWalletsNotEmpty} wallets out of ${nbWallets}`);
	console.log(`\nTarget wallet contain ${fromSun(targetData.balance)} TRX`)
	console.log(`\n----------End of TRX in wallets----------\n`)
}

/* Convert sun to TRX */
function fromSun(val){
	const sun = 1000000;
	return val !== undefined?val / sun:0;
}

/* confirmation before transfer */
function ConfirmTransfer(){
	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});	

	function waitForUserInput() {
	  rl.question(`You are about to transfer ${amountAvailInWallets} TRX from ${nbWalletsNotEmpty} wallets to ${sendTo}... Are you sure ? (yes/no)`, (answer) => {
		if (answer === "yes"){ Transfer();}
		else if(answer === "no"){ console.log(`Operation canceled. Program will now close...`); process.exit(0);}
		else {console.log(`Unrecognized answer ... please type yes or no`); waitForUserInput();}
	  });
	}
	
	waitForUserInput();
}

/* Transfer all availlable TRX from the wallets list to the target wallet */
async function Transfer(){
	let i = 0;
	for(i; i < nbWallets; i++){
		if(walletsData[i].balance && 5000-walletsData[i].free_net_usage > 500){
			let tronWeb = new TronWeb({fullHost: fullHost, privateKey: myPks[i]});
			const transaction = await tronWeb.transactionBuilder.sendTrx(sendTo, walletsData[i].balance);
			if(verbose){
				console.log(`Transaction : \n`);
				console.log(transaction);
			}
			const signedTrans = await tronWeb.trx.sign(transaction, myPks[i]);
			if(verbose){
				console.log(`\nSigned transaction : \n`);
				console.log(signedTrans);
			}
			const sentTrans = await tronWeb.trx.sendRawTransaction(signedTrans);
			if(verbose){
				console.log(`\nTransaction result : \n`);
				console.log(sentTrans);
			}
		}
	}
	
	if(verbose){
		console.log(`All transfer has been made... Target wallet is now supposed to have ${fromSun(targetData.balance) + amountAvailInWallets}`);
		console.log(`Operation succeed. Program will now close...`);
	}
	
	process.exit(0);
}

Start();
