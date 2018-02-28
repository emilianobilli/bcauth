
/**
 * Grupo de elementos HTML
 */
var main_add_account       = "main_add_account";	/* Id del bloque que representa el bloque principal */
var main_account           = "main_account";	    /* Id del bloque que representa agregar una cuenta  */ 
var account_name           = "account_name";
var account_balance        = "account_balance";
var account_address        = "account_address";
var input_private_key      = "input_private_key";
var input_account_name     = "input_account_name";
var input_account_password = "input_account_password";
var btn_add_account		   = "btn_add_account";
var btn_delete_account     = "btn_delete_account";
var btn_sign_on_page	   = "btn_sign_on_page";
var btn_send_on_page	   = "btn_send_on_page";
var btn_sign_text		   = "btn_sign_text";
var btn_send			   = "btn_send";
var text_to_sign		   = "text_to_sign";
var btn_sign_sign_text	   = "btn_sign_sign_text";
var sign_text			   = "sign_text";
var btn_sign_back		   = "btn_sign_back";
var btn_send_back		   = "btn_send_back";
var btn_send_tx		  	   = "btn_send_tx";
var check_advanced_options = "check_advanced_options";
var advanced_options	   = "advanced_options";
var send_amount			   = "send_amount";
var send_to_addr		   = "send_to_addr";
var send				   = "send";
var gas_limit			   = "gas_limit";
var gas_price			   = "gas_price";
var tx_data				   = "tx_data";
var nonce;
var gasLimit			   = "0x5208";

/**
 * getAddrFromPrivateKey(pkey): -> Retorna la direccion a partir de la clave privada
 */
function getAddrFromPrivateKey(pkey)
{
    var privateKey = Lib.buffer(pkey, 'hex');
    var ecparams   = Lib.ecurve.getCurveByName('secp256k1');
    var curvePt    = ecparams.G.multiply(Lib.BigInteger.fromBuffer(privateKey));
    var x = curvePt.affineX.toBuffer(32);
    var y = curvePt.affineY.toBuffer(32);
    var publicKey = Lib.buffer.concat([x, y]);
	
	var w = new Lib.web3;
	return "0x" + w.utils.sha3("0x" + publicKey.toString('hex'), { encoding: 'hex' }).substring(26);
}

function getHashMsg(msg)
{
	var base = "\x19Ethereum Signed Message:\n";
	base  = base + msg.length.toString() + msg;
	var w = new Lib.web3;
	return w.utils.sha3(base).substring(2);
}

function signMsg(msg, pk)
{
	hash = getHashMsg(msg);
	s    = Lib.secp256k1.sign(Lib.buffer(hash,'hex'),Lib.buffer(pk,'hex'));
	if (s.recovery == 0) {
		c = '1b';
	}
	else {
		c = '1c';
	}
	return '0x' + s.signature.toString('hex') + c;
}


function importAccount(na,pk,pw) {
	var name = document.getElementById(na).value;	
	var pkey = document.getElementById(pk).value;
	var pass = document.getElementById(pw).value;
	console.log(pkey);
	console.log(name);
	console.log(pass);
	v = {'name': name,
		 'privateKey': pkey, 
		 'address': getAddrFromPrivateKey(pkey)};
	localStorage.setItem("Account",JSON.stringify(v));
	return JSON.stringify(v);
}


function loadAccount(account)
{
	v = JSON.parse(account);
	document.getElementById(account_name).innerHTML = v.name;
	document.getElementById(account_address).innerHTML = v.address;

	we = new Lib.web3(new Lib.web3.providers.HttpProvider("https://ropsten.infura.io/5xuYYhkXoCzTJ7k23s2B"));
	we.eth.getBalance(v.address, function(error,result){
		console.log(result);
		console.log(error);
		document.getElementById(account_balance).innerHTML = we.utils.fromWei(result);
	});
	we.eth.getTransactionCount(v.address, function(error,result){
		nonce = result;
	});
	
}

function reloadBalance()
{
	address = document.getElementById(account_address).innerHTML;
	we = new Lib.web3(new Lib.web3.providers.HttpProvider("https://ropsten.infura.io/5xuYYhkXoCzTJ7k23s2B"));
	we.eth.getBalance(address, function(error,result){
		console.log(result);
		console.log(error);
		document.getElementById(account_balance).innerHTML = we.utils.fromWei(result);
	});
	we.eth.getTransactionCount(v.address, function(error,result){
		nonce = result;
	});
}

function getpk()
{
	account = localStorage.getItem("Account");
	v = JSON.parse(account);
	return v.privateKey;
}

function display(elm,value)
{
	document.getElementById(elm).style.display = value;
}

function display_advanced_options(value)
{
	if (value == true) {
		display(advanced_options, "block");
	}
	else {
		display(advanced_options, "none");
	}
}


function display_account(value)
{
	if (value == true) {
		display(main_account, "block");
	}
	else {
		display(main_account, "none");
	}
}

function display_import(value)
{
	if (value == true) {
		display(main_add_account, "block");
	}
	else {
		display(main_add_account, "none");
	}
}


function display_sign_text(value)
{
	if (value == true) {
		display(sign_text, "block");
	}
	else {
		display(sign_text, "none");
	}
}

function display_send(value)
{
	if (value == true) {
		display(send, "block");
	}
	else {
		display(send, "none");
	}
}

window.onload = function() {
	/*
	 * Boton de borrar cuenta
	 */
	document.getElementById(btn_delete_account).addEventListener("click",function() {
		localStorage.removeItem("Account");
		display_account(false);
		display_import(true);	
	});

	document.getElementById(btn_sign_text).addEventListener("click", function() {
		document.getElementById(text_to_sign).value = "";
		display_account(false);
		display_sign_text(true);

	});
	
	document.getElementById(btn_send).addEventListener("click", function() {
		display_account(false);
		display_send(true);
		ao = document.getElementById(check_advanced_options);
		if (ao.checked) {
			display_advanced_options(true);
		}
		else {
			display_advanced_options(false);
		}
	});
	
	document.getElementById(btn_sign_back).addEventListener("click", function() {
		display_sign_text(false);
		display_account(true);
		reloadBalance();
	});
	
	document.getElementById(btn_send_back).addEventListener("click", function() {
		display_send(false);
		display_account(true);
		reloadBalance();
	});
	
	document.getElementById(check_advanced_options).addEventListener("change", function() {
		if (this.checked) {
			display_advanced_options(true);
		}
		else {
			display_advanced_options(false);
		}
	});
	
	document.getElementById(btn_send_tx).addEventListener("click", function() {
		amount = document.getElementById(send_amount).value;
		dst    = document.getElementById(send_to_addr).value;
		
		if (amount === "" || dst === "" )
			return;
		
		we = new Lib.web3(new Lib.web3.providers.HttpProvider("https://ropsten.infura.io/5xuYYhkXoCzTJ7k23s2B"));
			
		
		advopt = document.getElementById(check_advanced_options);
		if (advopt.checked)
		{
			gasLimit = document.getElementById(gas_limit).value;
			gasPrice = document.getElementById(gas_price).value;
			data     = document.getElementById(tx_data).value;
			if (gasLimit != "" && gasPrice != "")
			{
				tx = {}
				tx['nonce']    = nonce;
				tx['gasLimit'] = we.utils.toHex(parseInt(gasLimit)+1);
				tx['value']	   = we.utils.toHex(we.utils.toWei(amount.toString()));
				tx['to']	   = dst;
				tx['gasPrice'] = we.utils.toHex(gasPrice);
				tx['chainId']  = 3;
				console.log(tx);
				pk = Lib.buffer(getpk(),'hex');
				etx = new ethereumjs.Tx(tx);
				etx.sign(pk);
				stx = etx.serialize();
				console.log(stx);
				we.eth.sendSignedTransaction('0x' + stx.toString('hex'),function(error,hash){
					if (!error)
						console.log(hash);
					else
						console.log(error);
				});
			}
			else 
			{
				console.log("Faltan datos")	
			}	
		}
		else {
			we.eth.estimateGas( {'to': dst}, function(error,gasLimit){
				we.eth.getGasPrice(function(errorGasPrice,gasPrice) { 
					if (!errorGasPrice) {
						tx = {}
						tx['nonce']    = nonce;
						tx['gasLimit'] = we.utils.toHex(gasLimit+1);
						tx['value']	   = we.utils.toHex(we.utils.toWei(amount.toString()));
						tx['to']	   = dst;
						tx['gasPrice'] = we.utils.toHex(gasPrice);
						tx['chainId']  = 3;
						console.log(tx);
						pk = Lib.buffer(getpk(),'hex');
						etx = new ethereumjs.Tx(tx);
						etx.sign(pk);
						stx = etx.serialize();
						console.log(stx);
						we.eth.sendSignedTransaction('0x' + stx.toString('hex'),function(error,hash){
							if (!error)
								console.log(hash);
							else
								console.log(error);
						});
					}
				});			
			
			});
		}
	});
	
	document.getElementById(btn_sign_sign_text).addEventListener("click", function() {
		elm = document.getElementById(text_to_sign);
		console.log(elm.value);
		elm.value = signMsg(elm.value,getpk());
	});

	/*
	 * Boton de importar Cuenta
	 */
	document.getElementById(btn_add_account).addEventListener("click",function() {
		loadAccount(importAccount(input_account_name,input_private_key,input_account_password));
		display_import(false);
		display_account(true);
	});

	document.getElementById(btn_sign_on_page).addEventListener("click",function() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {to_sign: true}, function(response) {
				if (response.word != "") {
					signature_ok = signMsg(response.word,getpk());
					chrome.tabs.sendMessage(tabs[0].id, {to_sign: false,signature:signature_ok}, function(response) {});
				}
			});
		});
	});

	/**
	 * Lo primero que debe hacer es chequear si tiene una cuenta cargada,
	 * en caso de que asi sea, muestra la informacion de la cuenta, en caso contrario
	 * muestras las opciones para importar
	 */
	account = localStorage.getItem("Account");
	if (account)
	{
		loadAccount(account);
		display_import(false);
		display_account(true);
		display_sign_text(false);
		display_send(false);
	}
	else {
		display_import(true);
		display_account(false);
		display_sign_text(false);
		display_send(false);
	}
}
