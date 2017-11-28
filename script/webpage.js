let saveAs=require('filesaver.js-npm');
let logic=require('./logic');

let saveCSVData=function (path,data){
	logic.saveToLocalStorage(data);
	
	if(path && path!="" && data){
		try{
			var blob=new Blob([text],{
				type: "text/csv;charset=utf-8"
			});
			saveAs(blob,path);
			return true;
		}catch(e){
			console.error(e);
			return e;
		}
	}else{
		console.error("Parameters missing!");
		return "缺少参数!";
	}
};

let saveJSONData=function (path,data){
	logic.saveToLocalStorage(data);

	if(path && path!="" && data){
		try{
			var blob=new Blob([JSON.stringify(data)],{
				type: "application/json;charset=utf-8"
			});
			saveAs(blob,path);
			return true;
		}catch(e){
			console.error(e);
			return e;
		}
	}else{
		console.error("Parameters missing!");
		return "缺少参数!";
	}
};

module.exports={
	saveCSVData: saveCSVData,
	saveJSONData: saveJSONData
};
