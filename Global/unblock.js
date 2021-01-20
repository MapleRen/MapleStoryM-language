/*
冒险岛M过锁区(国际/日服通用)
若未拔卡成功进过游戏的，请保证以下步骤
1、卸载游戏
2、拔卡、挂梯子进入游戏
3、能够成功登陆或进入游戏更新界面

保证第3步能成功后才能使用免拔卡的方法

QuantumultX

[rewrite_local]
^https://m-api.nexon.com/sdk/enterToy.nx url script-response-body https://raw.githubusercontent.com/MapleRen/MapleStoryM-language/master/Global/QuantumultX/msmUnBlock.js
[mitm]
hostname = m-api.nexon.com

*/
let isQuantumultX=undefined===this.$task?false:true;let isSurge=undefined===this.$httpClient?false:true;var $task=isQuantumultX?this.$task:{};var $httpClient=isSurge?this.$httpClient:{};var $prefs=isQuantumultX?this.$prefs:{};var $persistentStore=isSurge?this.$persistentStore:{};var $notify=isQuantumultX?this.$notify:{};var $notification=isSurge?this.$notification:{};if(isQuantumultX){var errorInfo={error:''};$httpClient={get:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})},post:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}url.method='POST';$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})}}}if(isSurge){$task={fetch:url=>{return new Promise((resolve,reject)=>{if(url.method=='POST'){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}})}}}if(isQuantumultX){$persistentStore={read:key=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)}}}if(isSurge){$prefs={valueForKey:key=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)}}}if(isQuantumultX){$notification={post:(title,subTitle,detail)=>{$notify(title,subTitle,detail)}}}if(isSurge){$notify=function(title,subTitle,detail){$notification.post(title,subTitle,detail)}}

const url = $request.url;
const limitpath = "https://m-api.nexon.com/sdk/enterToy.nx";
let body = $response.body;
let obj = JSON.parse(body);
if(url == limitpath){
	obj['errorCode']=0;
	if(obj.result.service.title.indexOf("Global")> -1){
		
		$notify("冒险岛M", "", "国际服锁区解除完成");
	}
	else if(obj.result.service.title.indexOf("Japan")>-1){
		$notify("冒险岛M", "", "日服锁区解除完成");
	}else{
		$notify("未知的N社游戏", "", "锁区解除完成");
	}
	//console.log(body)
}
body = JSON.stringify(obj)
$done({body:body});
