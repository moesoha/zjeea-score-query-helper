var win=nw.Window.get();
let logic=require('./logic');

const fs=require('fs');

let saveCSVData=function (path,data){
	logic.saveToLocalStorage(data);

	if(path && path!=""){
		try{
			fs.writeFileSync(path,logic.getCSV(data));
			alert('保存成功！');
		}catch(e){
			console.error(e);
			document.getElementById('warning').innerText=e;
		}
	}
};

let saveJSONData=function (path,data){
	logic.saveToLocalStorage(data);

	if(path && path!=""){
		try{
			fs.writeFileSync(path,JSON.stringify(data));
			alert('保存成功！');
		}catch(e){
			console.error(e);
			document.getElementById('warning').innerText=e;
		}
	}
};

let showJSONData=function (){
	logic.saveToLocalStorage(data);
	nw.Window.open('popup.html?'+time,{
		focus: true
	},function (newWin){
		newWin.on('loaded',function (){
			newWin.window.document.getElementById('json').innerText=dataInJson;
		});
	});
};

let cookieRemove=function (opt){
	return new Promise(function (resolve){
		win.cookies.remove(opt,resolve);
	});
};

let clearAllTargetCookie=function (){
	return new Promise(async function (resolve){
		win.cookies.getAll({
			url: baseUrl
		},async function(data){
			for(var i in data){
				if(data.hasOwnProperty(i)){
					await cookieRemove({
						url: baseUrl,
						name: data[i].name
					});
				}
			}
			resolve();
		});
	});
};

module.exports={
	saveCSVData: saveCSVData,
	saveJSONData: saveJSONData
};
