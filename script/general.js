let logic=require('./logic');
let op=require('./webpage');

let loadConfig=function (){
	baseUrl=document.getElementById('conf-baseUrl').value;
	sessionIdName=document.getElementById('conf-sessionIdName').value;
	captchaUrl=document.getElementById('conf-captchaUrl').value;
	resultUrl=document.getElementById('conf-resultUrl').value;
	return {
		baseUrl: baseUrl,
		captchaUrl: captchaUrl,
		sessionIdName: sessionIdName,
		resultUrl: resultUrl
	};
}

let displayData=function (data){
	let simpleHtml='<div>';
	for(var i in data){
		if(data.hasOwnProperty(i)){
			simpleHtml+="<p>";
			simpleHtml+="<b>";
			simpleHtml+=data[i].key;
			simpleHtml+="</b>";
			simpleHtml+=": ";
			simpleHtml+="<span>";
			simpleHtml+=data[i].value;
			simpleHtml+="</span>";
			simpleHtml+="</p>";
		}
	}
	simpleHtml+="</div>";

	document.getElementById('display').innerHTML=simpleHtml;
};

let requestHandler=function (){
	let info={
		zkzh: document.getElementById('zkzh').value,
		sfzh: document.getElementById('sfzh').value,
		password: document.getElementById('password').value,
		yzm: document.getElementById('captcha-input').value
	};
	logic.requestInformation(info);
};

document.getElementById('start').onclick=function(){
	document.getElementById('display').innerHTML="";
	document.getElementById('warning').innerHTML="";
	document.getElementById('captcha-input').value="";
	document.getElementById('captcha-input').removeAttribute('disabled');
	document.getElementById('sfzh').value="";
	document.getElementById('zkzh').value="";
	document.getElementById('password').value="";
	document.getElementById('sfzh').removeAttribute('disabled');
	document.getElementById('password').removeAttribute('disabled');
	document.getElementById('zkzh').removeAttribute('disabled');
	logic.createAxios(loadConfig());
};

document.getElementById('save-json').onclick=function(){
	op.saveJSONData(document.getElementById('csv-data-path').value,globalData);
};

document.getElementById('save-csv').onclick=function(){
	op.saveCSVData(document.getElementById('json-data-path').value,globalData);
};

document.getElementById('captcha-show').onclick=function(){
	logic.createAxios(loadConfig());
};

document.getElementById('captcha-input').onkeyup=function (e){
	if(document.getElementById('captcha-input').value.length>=4 || e.key==="Enter"){
		document.getElementById('captcha-input').setAttribute('disabled',true);
		document.getElementById('sfzh').setAttribute('disabled',true);
		document.getElementById('password').setAttribute('disabled',true);
		document.getElementById('zkzh').setAttribute('disabled',true);
		requestHandler();
	}
};