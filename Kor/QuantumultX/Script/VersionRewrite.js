//  https://github.com/sazs34/TaskConfig
let isQuantumultX=$task!=undefined;let isSurge=$httpClient!=undefined;var $task=isQuantumultX?$task:{};var $httpClient=isSurge?$httpClient:{};var $prefs=isQuantumultX?$prefs:{};var $persistentStore=isSurge?$persistentStore:{};var $notify=isQuantumultX?$notify:{};var $notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:''};$httpClient={get:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})},post:(url,cb)=>{var urlObj;if(typeof(url)=='string'){urlObj={url:url}}else{urlObj=url}url.method='POST';$task.fetch(urlObj).then(response=>{cb(undefined,response,response.body)},reason=>{errorInfo.error=reason.error;cb(errorInfo,response,'')})}}}if(isSurge){$task={fetch:url=>{return new Promise((resolve,reject)=>{if(url.method=='POST'){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error})}else{resolve(null,{error:error})}})}})}}}if(isQuantumultX){$persistentStore={read:key=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)}}}if(isSurge){$prefs={valueForKey:key=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)}}}if(isQuantumultX){$notification={post:(title,subTitle,detail)=>{$notify(title,subTitle,detail)}}}if(isSurge){$notify=function(title,subTitle,detail){$notification.post(title,subTitle,detail)}}
var body = $response.body;
var list = body.split('\n');
var fileList = ['data.bin.lan.kor.tbl', 'data.language_kor.unity3d', 'data.table.unity3d']
var isMarketVersions = $request.url.indexOf('MarketVersion') > -1;

if (isMarketVersions) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf('\/AppStore\/') > -1) {
            list[i] = list[i].replace('/" Server', '_1/" Server')
        }
    }
} else {
    for (let i = 0; i < list.length; i++) {
        var flag = fileList.filter(function (item) { return list[i].indexOf(item) > -1; }).length > 0;
        if (flag) {
            list[i] = list[i].replace(/Version="[0-9.]*?"/i, 'Version="99"')
        }
    }
}

var xmlData = list.join('\n')
console.log(xmlData);
$done(xmlData)