let axios=require('axios'),cheerio=require('cheerio');
let currentAxios;

let createAxios=async function ({baseUrl,captchaUrl,sessionIdName,resultUrl}){
	let hereAxios=axios.create({
		baseURL: baseUrl,
		withCredentials: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	let a=await hereAxios.get(captchaUrl,{
		responseType: 'arraybuffer'
	});
	let cookie=a.headers['set-cookie'];
	let captchaRawData=new Buffer(a.data,'binary');
	let captchaData=captchaRawData.toString('base64');
	document.getElementById('captcha-show').setAttribute('src','data:image/jpeg;base64,'+captchaData);
	currentAxios=hereAxios;
	return hereAxios;
};

let getValueWithKey=function (objarr,key){
	for(var i in objarr){
		if(objarr.hasOwnProperty(i) && objarr[i].key==key){
			return objarr[i].value;
		}
	}
	return "";
}

let saveToLocalStorage=function (data){
	let time=new Date().getTime().toString();
	let dataInJson=JSON.stringify(data);
	window.localStorage.setItem('data_'+time,dataInJson);
	return 'data_'+time;
}

let getCSV=function (data){
	let processData={};
	for(var i in dataGlobal){
		if(dataGlobal.hasOwnProperty(i)){
			let thisSet=dataGlobal[i];
			for(var j in thisSet){
				if(thisSet.hasOwnProperty(j) && !processData.hasOwnProperty(thisSet[j].key)){
					processData[thisSet[j].key]=[];
				}
			}
		}
	}
	for(var i in dataGlobal){
		if(dataGlobal.hasOwnProperty(i)){
			let thisSet=dataGlobal[i];
			for(var j in processData){
				if(processData.hasOwnProperty(j)){
					processData[j].push(getValueWithKey(thisSet,j));
				}
			}
		}
	}

	let csv="",loopn=999999999999,processed=false;
	let thisline=[];
	for(var j in processData){
		if(processData.hasOwnProperty(j)){
			processed=true;
			if(processData[j].length<loopn){
				loopn=processData[j].length;
			}
			thisline.push('"'+j+'"');
		}
	}
	if(!processed){
		loopn=-1;
	}
	csv+=thisline.join(',')+"\r\n";

	for(let i=0;i<loopn;i++){
		let thisline=[];
		for(var j in processData){
			if(processData.hasOwnProperty(j)){
				thisline.push('"'+processData[j][i]+'"');
			}
		}
		csv+=thisline.join(',')+"\r\n";
	}
	
	return csv;
};

let requestInformation=async function ({zkzh,sfzh,password,yzm}){
	try{
		let params=new URLSearchParams();
		params.append('ZKZH',zkzh);
		params.append('SFZH',sfzh);
		params.append('PASSWORD',password);
		params.append('yzm',yzm);

		let data=await currentAxios.post(resultUrl,params.toString());

		let warningInfo=data.data.match(new RegExp('alert\\(\'(.+)\'\\);'));
		if(warningInfo){
			document.getElementById('warning').innerText=warningInfo[1];
			await createAxios(loadConfig());
		}else{
			let $=cheerio.load(data.data);
			let datas=[];
			$('.block').each(function (){
				datas.push({
					key: $(this).children('.blo_top').text().trim(),
					value: $(this).children('.blo_bottom').children('span').text().trim()
				});
			});
			dataGlobal.push(datas);
			displayData(datas);
			document.getElementById('warning').innerText="";
		}
	}catch(e){
		console.error(e);
		document.getElementById('warning').innerText=e;
	}
	document.getElementById('captcha-input').value="";
	document.getElementById('captcha-input').removeAttribute('disabled');
};

module.exports={
	getCSV: getCSV,
	getValueWithKey: getValueWithKey,
	createAxios: createAxios,
	saveToLocalStorage: saveToLocalStorage,
	requestInformation: requestInformation
};