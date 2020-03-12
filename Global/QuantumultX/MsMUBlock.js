/*
冒险岛M过锁区(国际/日服通用)
若未拔卡成功进过游戏的，请保证以下步骤
1、卸载游戏
2、拔卡、挂梯子进入游戏
3、能够成功登陆或进入游戏更新界面

保证第3步能成功后才能使用免拔卡的方法


[rewrite_local]
^https://m-api.nexon.com/sdk/enterToy.nx url script-response-body msmunlock.js

[MITM]
m-api.nexon.com

*/

const url = $request.url;
const limitpath = "https://m-api.nexon.com/sdk/enterToy.nx";
let body = $response.body;
let obj = JSON.parse(body);
if(url == limitpath){
	if(obj.result.service.title.indexOf("Global")> -1){
		obj['errorCode']=0;
		$notify("冒险岛M", "", "国际服锁区解除完成");
	}
	if(obj.result.service.title.indexOf("Japan")>-1){
		obj['errorCode']=0;
		$notify("冒险岛M", "", "日服锁区解除完成");
	}
	//console.log(body)
}
body = JSON.stringify(obj)
$done(body)
